import React, { useState } from 'react'
import ScheduleView from '../../Schedule-master/ScheduleView';
import Sidebar from '../../sidebar';

const ScheduleViewPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <ScheduleView  isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  )
}

export default ScheduleViewPage