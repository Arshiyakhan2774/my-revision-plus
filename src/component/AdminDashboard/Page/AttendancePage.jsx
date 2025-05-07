import React, { useState } from 'react'

import SubmitAttendance from '../AttendanceMaster/SubmitAttendance';
import Sidebar from '../sidebar';

const AttendancePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return(
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <SubmitAttendance isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };

export default AttendancePage