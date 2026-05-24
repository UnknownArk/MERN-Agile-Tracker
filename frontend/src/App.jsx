import { useState } from 'react';
import Sidebar from "./components/sidebar";
import KanbanBoard from "./components/KanbanBoard";

function App(){
  const [activeProject, setActiveProject] = useState(null);
  return(
    <div style={{display:"flex",height:"100vh",width:"100vw",overflow:"hidden"}}>
      <Sidebar onSelectProject={(project)=> setActiveProject(project)}/>
      {activeProject ? (
        <KanbanBoard project={activeProject} />
      ) : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: '#f4f5f7' }}>
           <img src="https://cdn-icons-png.flaticon.com/512/3256/3256038.png" width="100" style={{ opacity: 0.5, marginBottom: '20px' }} alt="Empty state" />
           <h2 style={{ color: '#5e6c84' }}>Select or create a project to begin</h2>
        </div>
      )}
    </div>
  );
}

export default App;