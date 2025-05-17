import React from 'react';
import NavbarTeacher from '../TeacherNavbar/NavbarTeacher';
import StudentList from '../StudentList/StudentLIst';

const StudentListPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
      <NavbarTeacher />
      <div className='flex-1 p-4 md:p-6 overflow-auto'>
        <StudentList />
      </div>
    </div>
  );
};

export default StudentListPage;