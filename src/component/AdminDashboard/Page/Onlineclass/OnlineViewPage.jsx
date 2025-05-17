import React, { useState } from 'react'
import ViewOnlineClass from '../../Online-classes-schedule/ViewOnlineClass';
import Sidebar from '../../sidebar';

const OnlineViewPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <ViewOnlineClass isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    )
  }

export default OnlineViewPage 