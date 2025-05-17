import React, { useState } from 'react'
import AssignmentList from '../../Assignment-master/AssignmentListView/AssignmentList';
import Sidebar from '../../sidebar';

const AssignmentListPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <AssignmentList isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };

export default AssignmentListPage