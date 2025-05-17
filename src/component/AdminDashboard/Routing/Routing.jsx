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
import ReportPage from '../Page/ReportPage.jsx/ReportPage';
import ScheduleCreatePage from '../Page/SchedulePage/ScheduleCreatePage';
import ScheduleViewPage from '../Page/SchedulePage/ScheduleViewPage';
import OnlineClass from '../Page/Onlineclass/OnlineClass';
import OnlineViewPage from '../Page/Onlineclass/OnlineViewPage';
import QuestionCreatePage from '../Page/QuestionCreatepage/QuestionCreatePage';
import CreateQuestionButtonPage from '../Page/QuestionCreatepage/CreateQuestionButtonPage';
import MainQuestionCreatePage from '../Page/QuestionCreatepage/MainQuestionCreatePage';
import ViewQuestionPage from '../Page/QuestionCreatepage/ViewQuestionPage';
import AssignmentListPage from '../Page/AssignmentPage/AssignmentListPage';
import SharedModelPage from '../Page/AssignmentPage/SharedModelPage';
import CreateAssignmentPage from '../Page/AssignmentPage/CreateAssignmentPage';
import CreateAssignmentQuestionLisrt from '../Page/AssignmentPage/CreateAssignmentQuestionLisrt';
import CreateAssignmentQuestionEdit from '../Page/AssignmentPage/CreateAssignmentQuestionEdit';
import SubQuestionEditPage from '../Page/AssignmentPage/SubQuestionEditPage';
import SubChildQuestionPage from '../Page/AssignmentPage/SubChildQuestionPage';



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
        <Route path="/Report-for-admin" element={<ReportPage/>} />
        <Route path="/schedule-submit" element={<ScheduleCreatePage/>} />
        <Route path="/schedule-view" element={<ScheduleViewPage/>} />  
        <Route path="/schedule-Online-classes" element={<OnlineClass/>} /> 
        <Route path="/online-classes-view" element={<OnlineViewPage/>} />
        <Route path="/create-question" element={<QuestionCreatePage/>} /> 
        <Route path="/create-question/:id/:id" element={<CreateQuestionButtonPage/>} />   
        <Route path="/mainquestion/:id" element={<MainQuestionCreatePage/>} />
        <Route path="/questions-view/:id" element={<ViewQuestionPage/>} />
        <Route path="/view-Assignment" element={<AssignmentListPage/>} />
        <Route path="/create-Assignment" element={<CreateAssignmentPage/>} />
        <Route path="/create-Assignment/:id" element={<CreateAssignmentQuestionLisrt/>} />
        <Route path="/main-question-edit/:id" element={<CreateAssignmentQuestionEdit/>} />
        <Route path="/sub-question-edit/:id" element={<SubQuestionEditPage/>} />
        <Route path="/subchild-question-edit/:id" element={<SubChildQuestionPage/>} />
       
           
      </Routes>
    </Suspense>
  );
};

export default Routing;
