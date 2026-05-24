import {useState, useEffect} from 'react';
import {Folder,Plus} from 'lucide-react';
import './sidebar.css';

function Sidebar({onSelectProject}){
    const [projects,setProjects]= useState([]);

    const fetchProjects=()=>{
        fetch('https://mern-agile-tracker.onrender.com/api/projects')
        .then((response)=> response.json())
        .then((data)=>{
            setProjects(data);
        })
        .catch((error)=> console.log("Error fetching projects: ",error));
    }
    useEffect(()=>{
        fetchProjects();
    },[]);

    const handleCreateProject=()=>{
        const projectName = window.prompt("Enter new project name:");
        if (!projectName) return;

        fetch('https://mern-agile-tracker.onrender.com/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: projectName, description: "A new workspace" })
        })
        .then((response) => response.json())
        .then((newProject) => {
            fetchProjects(); 
            onSelectProject(newProject); 
        })
        .catch((err) => console.error("Error creating project:", err));
    };


    return(
        <div className="sidebar">
            <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Your Projects</span>
                <Plus onClick={handleCreateProject} style={{ cursor: 'pointer', color: '#0052cc' }} size={16} />
            </div>
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