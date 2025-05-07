import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import AddCategory from '../../CategoryMaster/AddCategory/AddCategory';

const AddCtegoryPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <AddCategory isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };
export default AddCtegoryPage