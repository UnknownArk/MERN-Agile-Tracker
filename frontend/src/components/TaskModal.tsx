import React, { useState, useEffect } from 'react';
import { ITask, TaskStatus, TaskPriority } from '../types';
import { X, Save, Trash } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import './TaskModal.css';

interface TaskModalProps {
    task: ITask | null;
    project: string; // Project ID
    onClose: () => void;
    onSave: () => void; // Trigger a refresh
}

export function TaskModal({ task, project, onClose, onSave }: TaskModalProps) {
    const { token } = useAuthStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('To Do');
    const [priority, setPriority] = useState<TaskPriority>('Medium');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setPriority(task.priority);
        } else {
            setTitle('');
            setDescription('');
            setStatus('To Do');
            setPriority('Medium');
        }
    }, [task]);

    if (!task && title === '' && !isSaving && false) {
        // Just a safe guard, UI visibility is controlled by parent
    }

    const handleSave = async () => {
        if (!title.trim()) return;
        setIsSaving(true);
        try {
            const url = task 
                ? `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`
                : `${import.meta.env.VITE_API_URL}/api/tasks`;
                
            const method = task ? 'PUT' : 'POST';
            
            const payload = task 
                ? { status, priority, title, description } // Update
                : { title, description, status, priority, project }; // Create

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error("Failed to save task", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task ? 'Edit Task' : 'Create Task'}</h2>
                    <button className="icon-btn" onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label>Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. Design homepage hero"
                            autoFocus
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Priority</label>
                            <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Add more details to this task..."
                            rows={5}
                        />
                    </div>
                </div>
                
                <div className="modal-footer">
                    {task && (
                        <button className="btn-danger" onClick={handleDelete}>
                            <Trash size={16} /> Delete
                        </button>
                    )}
                    <div className="footer-right">
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn-primary" onClick={handleSave} disabled={isSaving || !title.trim()}>
                            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
