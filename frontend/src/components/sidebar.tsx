import {useState, useEffect} from 'react';
import { Folder, Plus, LogOut } from 'lucide-react';
import './sidebar.css';
import { IProject } from '../types';
import { useAuthStore } from '../store/authStore';

interface SidebarProps {
    onSelectProject: (project: IProject) => void;
}

function Sidebar({onSelectProject}: SidebarProps){
    const [projects,setProjects]= useState<IProject[]>([]);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const { token, logout, user } = useAuthStore();

    const fetchProjects=()=>{
        if (!token) return;
        fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((response)=> response.json())
        .then((data)=>{
            setProjects(data);
        })
        .catch((error)=> console.log("Error fetching projects: ",error));
    }
    useEffect(()=>{
        fetchProjects();
    },[]);

    const handleCreateProject=(e?: React.FormEvent)=>{
        if (e) e.preventDefault();
        if (!newProjectName.trim()) return;

        fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: newProjectName, description: "A new workspace" })
        })
        .then((response) => response.json())
        .then((newProject) => {
            fetchProjects(); 
            onSelectProject(newProject);
            setNewProjectName("");
            setIsCreatingProject(false);
        })
        .catch((err) => console.error("Error creating project:", err));
    };


    return(
        <div className="sidebar">
            <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #dfe1e6' }}>
                <img src="/logo.jpg" alt="SprintForge Logo" style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#172b4d', letterSpacing: '-0.5px' }}>SprintForge</span>
            </div>
            
            <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0052cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#172b4d' }}>{user?.name}</div>
                        <div style={{ fontSize: '12px', color: '#5e6c84' }}>Workspace</div>
                    </div>
                </div>
                <LogOut onClick={logout} style={{ cursor: 'pointer', color: '#5e6c84' }} size={18} />
            </div>

            <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Your Projects</span>
                <Plus onClick={() => setIsCreatingProject(!isCreatingProject)} style={{ cursor: 'pointer', color: '#0052cc' }} size={16} />
            </div>
            
            {isCreatingProject && (
                <form onSubmit={handleCreateProject} style={{ marginBottom: '16px', display: 'flex', gap: '8px', width: '100%' }}>
                    <input 
                        type="text" 
                        placeholder="Project name..." 
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        autoFocus
                        style={{ flex: 1, minWidth: 0, padding: '6px 8px', borderRadius: '4px', border: '1px solid #dfe1e6', fontSize: '14px' }}
                    />
                    <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>Add</button>
                </form>
            )}
            <div className="project-list">
                {projects.map((project)=>{
                    return(
                        <div key={project._id} className="project-item" onClick={() => onSelectProject(project)}>
                            <Folder className="project-icon"/>
                            <span >{project.name}</span>
                        </div>
                    )
                })}
                {projects.length===0 && (
                    <span style={{color:'#888',fontSize: '14px'}}>No projects found. Create a new project to get started!</span>
                )}
            </div>
        </div>
    );

}
export default Sidebar;