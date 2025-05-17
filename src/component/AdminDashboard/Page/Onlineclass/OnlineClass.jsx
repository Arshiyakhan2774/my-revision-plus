import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import ScheduleOnlineClass from '../../Online-classes-schedule/ScheduleOnlineClass';

const OnlineClass = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <ScheduleOnlineClass isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  )
}

export default OnlineClass