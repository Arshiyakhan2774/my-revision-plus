import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LayOut from '../Sidebar/LayOut';
import Continue from '../Auth/SignInUp/Continue';
import TeacherMappingPage from '../Page/usermanagepage/TeacherMappingPage';
import UserListPage from '../Page/usermanagepage/UserListPage';
import ViewStudentListPage from '../Page/usermanagepage/ViewStudentListPage';
import AddStudentPage from '../Page/usermanagepage/AddStudentPage';
import MappingPage from '../Page/usermanagepage/MappingPage';
import StudentMapping from '../Page/usermanagepage/StudentMapping';
import AddCtegoryPage from '../Page/CategoryMasterPage.jsx/AddCtegoryPage';
import ViewCategoryPage from '../Page/CategoryMasterPage.jsx/ViewCategoryPage';
import Loader from './Loader';
import AttendanceSubmit from '../Page/AttendancePage/AttendanceSubmit';
import ViewAttendancePage from '../Page/AttendancePage/ViewAttendancePage';
import DetailsAttendancePage from '../Page/AttendancePage/DetailsAttendancePage';
import UserTypeModulesPage from '../Page/UserTypeModulesPage/UserTypeModulesPage';
import EditUserTypePage from '../Page/UserTypeModulesPage/EditUserTypePage';


const Routing = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Continue />} />
        <Route path="/dashboard" element={<LayOut />} />
        <Route path="/add-users" element={<TeacherMappingPage />} />
        <Route path="/users" element={<UserListPage />} />
        <Route path="/student-view-list" element={<ViewStudentListPage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/teacher-mapping" element={<MappingPage />} />
        <Route path="/student-mapping" element={<StudentMapping />} />
        <Route path="/add-category" element={<AddCtegoryPage />} />
        <Route path="/view-category" element={<ViewCategoryPage />} />
        <Route path="/attendance-submit" element={<AttendanceSubmit/>} />   
        <Route path="/attendance-view" element={<ViewAttendancePage/>} /> 
        <Route path="/student-details/:id" element={<DetailsAttendancePage/>} /> 
        <Route path="/user-type" element={<UserTypeModulesPage/>} />
        <Route path="/user-type-edit/:id" element={<EditUserTypePage/>} />
      </Routes>
    </Suspense>
  );
};

export default Routing;
