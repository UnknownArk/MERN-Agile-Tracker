import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './KanbanBoard.css';

function KanbanBoard({ project }) {
    const [tasks, setTasks] = useState([]);
    const columns = ['To Do', 'In Progress', 'Done'];

    const fetchTasks = () => {
        fetch(`https://mern-agile-tracker.onrender.com/api/tasks/project/${project._id}`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching tasks:", err));
    };

    useEffect(() => {
        fetchTasks();
    }, [project._id]);

    const handleCreateTask = () => {
        const title = window.prompt("Enter task title:");
        if (!title) return;

        fetch('https://mern-agile-tracker.onrender.com/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                priority: 'Medium',
                project: project._id 
            })
        })
        .then(res => res.json())
        .then(() => fetchTasks())
        .catch(err => console.error("Error creating task:", err));
    };

    const handleDragStart = (e, taskId) => {
        // We save the unique ID of the specific card they grabbed into the browser's memory
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e, newStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        setTasks(prevTasks => prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
        ));
        fetch(`https://mern-agile-tracker.onrender.com/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        }).catch(err => console.error("Error moving task:", err));
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
    };

    return (
        <div className="kanban-container">
            <div className="board-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>{project.name}</h1>
                    <p style={{ color: '#5e6c84', margin: 0 }}>Manage and track your sprint assignments</p>
                </div>
                
                <button 
                    onClick={handleCreateTask} 
                    style={{ padding: '8px 16px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                >
                    <Plus size={16} /> New Task
                </button>
            </div>

            <div className="columns-wrapper">
                {columns.map((columnName) => {
                    const filteredTasks = tasks.filter(task => task.status === columnName);

                    return (
                        <div
                            key={columnName}
                            className="column"
                            onDrop={(e) => handleDrop(e, columnName)} 
                            onDragOver={handleDragOver}              
                        >
                            <div className="column-header">
                                <span className="column-title">{columnName}</span>
                                <span className="card-count">{filteredTasks.length}</span>
                            </div>

                            <div className="cards-container">
                                {filteredTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="task-card"
                                        draggable // MAGIC KEYWORD: Tells the browser this HTML element can be picked up!
                                        onDragStart={(e) => handleDragStart(e, task._id)}
                                    >
                                        <h3 className="card-title">{task.title}</h3>
                                        <div className="card-footer">
                                            <span className="priority-badge">{task.priority}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default KanbanBoard;