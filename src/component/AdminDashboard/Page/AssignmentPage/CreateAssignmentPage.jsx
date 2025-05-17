import React, { useState } from 'react'
import Sidebar from '../../sidebar';
import CreateAssignment from '../../Assignment-master/CreateAssignment/CreateAssignment';
import CreateQuestionNavbar from '../../Quetsion-master/Create-Question/CreateQuestionNavbar';

const CreateAssignmentPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
      <div className="">
        
       <CreateQuestionNavbar/>
        <CreateAssignment isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>
    );
  };


export default CreateAssignmentPage