import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import StudentDetails from '../../AttendanceMaster/StudentDetails';

const DetailsAttendancePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <StudentDetails  isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };

export default DetailsAttendancePage