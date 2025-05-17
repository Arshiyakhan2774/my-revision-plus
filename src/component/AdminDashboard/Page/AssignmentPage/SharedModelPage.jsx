import React, { useState } from 'react'
import SharedAssignmentComponent from '../../Assignment-master/AssignmentListView/SharedAssignmentModal';
import Sidebar from '../../sidebar';

const SharedModelPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <SharedAssignmentComponent isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };
export default SharedModelPage