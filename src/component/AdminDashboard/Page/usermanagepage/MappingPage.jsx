import React, { useState } from 'react'
import MappingListView from '../../Usermangae/TeacherMap/MappingListView';
import Sidebar from '../../sidebar';

const MappingPage = () => {
   
        const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      
        return (
          <div className="flex min-h-screen">
            <Sidebar
              isOpen={isSidebarOpen} 
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
            <MappingListView isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
        );
      };

export default MappingPage