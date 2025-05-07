import { useState } from 'react';

// import AddMapping from '../../Usermangae/TeacherMap/AddMapping';
import Sidebar from '../../sidebar';
import AddUsers from '../../Usermangae/usersList/AddUsers';


const TeacherMappingPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <AddUsers isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
};


export default TeacherMappingPage