import { useState } from 'react';
import Sidebar from '../../sidebar';
import StudentView from '../../Usermangae/StudentList/StudentView';



const ViewStudentListPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <StudentView isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
};


export default ViewStudentListPage