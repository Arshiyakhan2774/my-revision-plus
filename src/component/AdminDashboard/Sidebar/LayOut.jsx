import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar';
import Dashboard from '../Dashboard/Dashboard';


const LayOut = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <Dashboard isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
};

export default LayOut