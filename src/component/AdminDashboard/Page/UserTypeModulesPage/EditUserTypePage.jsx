import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import EditUserTypeModules from '../../User-Type/EditUserTypeModules';

const EditUserTypePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <EditUserTypeModules  isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    )
}
export default EditUserTypePage