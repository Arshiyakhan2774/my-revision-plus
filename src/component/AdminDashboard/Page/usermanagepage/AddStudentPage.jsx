import { useState } from 'react';
import Sidebar from '../../sidebar';
import StudentAdd from '../../Usermangae/StudentList/StudentAdd';



const AddStudentPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <StudentAdd isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
};
export default AddStudentPage