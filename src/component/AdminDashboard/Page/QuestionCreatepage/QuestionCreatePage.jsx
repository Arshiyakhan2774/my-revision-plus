import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import CreateFilterForm from '../../Quetsion-master/Create-Question/CreateFilterForm';

const QuestionCreatePage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <CreateFilterForm isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    )
  }

export default QuestionCreatePage