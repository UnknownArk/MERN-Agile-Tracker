import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import './KanbanBoard.css';
import { IProject, ITask, TaskStatus } from '../types';
import { useAuthStore } from '../store/authStore';
import { TaskModal } from './TaskModal';

interface KanbanBoardProps {
    project: IProject;
}

function KanbanBoard({ project }: KanbanBoardProps) {
    const [tasks, setTasks] = useState<ITask[]>([]);
    const columns: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
    const { token } = useAuthStore();
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);

    // Search, Filter, Status States
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = () => {
        if (!token) return;
        setIsLoading(true);
        setError(null);
        fetch(`${import.meta.env.VITE_API_URL}/api/tasks/project/${project._id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch tasks');
                return res.json();
            })
            .then(data => {
                setTasks(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching tasks:", err);
                setError(err.message);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, [project._id]);

    const handleCreateClick = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleTaskClick = (task: ITask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // Dropped outside the list
        if (!destination) return;

        // Dropped in the same place
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as TaskStatus;
        
        // Optimistically update UI
        setTasks(prevTasks => prevTasks.map(task =>
            task._id === draggableId ? { ...task, status: newStatus } : task
        ));

        // Update Backend
        fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${draggableId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        }).catch(err => console.error("Error moving task:", err));
    };

    const filteredTasksGlobal = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
    });

    if (isLoading) {
        return (
            <div className="kanban-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Loader2 className="spinner" size={40} color="#0052cc" />
                <p style={{ marginTop: '16px', color: '#5e6c84' }}>Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="kanban-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <AlertCircle size={40} color="#de350b" />
                <p style={{ marginTop: '16px', color: '#de350b', fontWeight: 'bold' }}>{error}</p>
                <button onClick={fetchTasks} style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry</button>
            </div>
        );
    }

    return (
        <div className="kanban-container">
            <div className="board-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>{project.name}</h1>
                        <p style={{ color: '#5e6c84', margin: 0, marginTop: '4px' }}>{project.description || 'Manage and track your sprint assignments'}</p>
                    </div>
                    
                    <button 
                        onClick={handleCreateClick} 
                        style={{ padding: '8px 16px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <Plus size={16} /> New Task
                    </button>
                </div>
                
                <div className="board-filters">
                    <div className="search-bar">
                        <Search size={16} color="#5e6c84" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="priority-filter">
                        <Filter size={16} color="#5e6c84" />
                        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="All">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="columns-wrapper">
                    {columns.map((columnName) => {
                        const columnTasks = filteredTasksGlobal.filter(task => task.status === columnName);

                        return (
                            <Droppable droppableId={columnName} key={columnName}>
                                {(provided, snapshot) => (
                                    <div
                                        className={`column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <div className="column-header">
                                            <span className="column-title">{columnName}</span>
                                            <span className="card-count">{columnTasks.length}</span>
                                        </div>

                                        <div className="cards-container">
                                            {columnTasks.map((task, index) => (
                                                <Draggable draggableId={task._id} index={index} key={task._id}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => handleTaskClick(task)}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            <h3 className="card-title">{task.title}</h3>
                                                            {task.description && (
                                                                <p className="card-desc">
                                                                    {task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}
                                                                </p>
                                                            )}
                                                            <div className="card-footer">
                                                                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                                                    {task.priority}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            {isModalOpen && (
                <TaskModal 
                    task={selectedTask}
                    project={project._id}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchTasks}
                />
            )}
        </div>
    );
}

export default KanbanBoard;