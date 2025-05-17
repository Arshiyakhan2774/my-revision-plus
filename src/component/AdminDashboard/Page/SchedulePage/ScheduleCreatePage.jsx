import React, { useState } from 'react'
import ScheduleCreate from '../../Schedule-master/ScheduleCreate';
import Sidebar from '../../sidebar';

const ScheduleCreatePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <ScheduleCreate isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    )
}
export default ScheduleCreatePage