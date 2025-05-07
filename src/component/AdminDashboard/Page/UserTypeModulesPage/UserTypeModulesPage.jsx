import React, { useState } from 'react'
import UserTypeModules from '../../User-Type/UserTypeModules';
import Sidebar from '../../sidebar';

const UserTypeModulesPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <UserTypeModules  isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    )
}
export default UserTypeModulesPage