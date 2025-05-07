import { useState } from 'react';
import UserDataList from '../../Usermangae/usersList/UserDataList';
import Sidebar from '../../sidebar';


const UserListPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      <UserDataList isSidebarClosed={!isSidebarOpen}  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
};

export default UserListPage 