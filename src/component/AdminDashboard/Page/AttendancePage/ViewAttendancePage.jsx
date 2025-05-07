import React, { useState } from 'react'
import ViewAttendance from '../../AttendanceMaster/ViewAttendance';
import Sidebar from '../../sidebar';

const ViewAttendancePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <ViewAttendance isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };

export default ViewAttendancePage