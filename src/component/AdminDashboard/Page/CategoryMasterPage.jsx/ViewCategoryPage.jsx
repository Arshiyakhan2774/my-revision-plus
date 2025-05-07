import React, { useState } from 'react'

import ViewCategory from '../../CategoryMaster/ViewCategory/VeiwCategory';
import Sidebar from '../../sidebar';

const ViewCategoryPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <ViewCategory isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };


export default ViewCategoryPage