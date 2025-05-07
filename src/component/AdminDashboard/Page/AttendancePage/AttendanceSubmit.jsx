import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import SubmitAttendance from '../../AttendanceMaster/SubmitAttendance';

const AttendanceSubmit = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <SubmitAttendance isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };

export default AttendanceSubmit