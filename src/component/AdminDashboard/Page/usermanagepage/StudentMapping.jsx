import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import StudentMappingList from '../../Usermangae/StudentMapping/StudentMappingList';

const StudentMapping = () => {
  
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      
    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <StudentMappingList isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };



export default StudentMapping