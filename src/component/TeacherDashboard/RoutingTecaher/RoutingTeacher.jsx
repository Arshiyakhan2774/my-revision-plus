import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../../AdminDashboard/Routing/Loader';
import StudentListPage from '../Pages/StudentListPage';
import OnlineClaasessTeacherSchedule from '../Pages/OnlineClassTeacher/OnlineClaasessTeacherSchedule';
import ViewOnlineClassTeacher from '../Pages/OnlineClassTeacher/ViewOnlineClassTeacher';
import ReportTeacherPage from '../Pages/ReportTeacher/ReportTeacherPage';
import AttendanceTecaherPage from '../Pages/AttendanceTeacherPage/AttendanceTecaherPage';
import AttendanceViewPageTaecher from '../Pages/AttendanceTeacherPage/AttendanceViewPageTaecher';
import DetailAttendancePage from '../Pages/AttendanceTeacherPage/DetailAttendancePage';
import AssignmnetTeacherCreatePage from '../Pages/AssignmentTeacher/AssignmnetTeacherCreatePage';
import AssignmentList from '../../AdminDashboard/Assignment-master/AssignmentListView/AssignmentList';
import AssignmentViewTeacher from '../MainTecherDashboarad/AssignmentViewTeacher';

const TeacherDashboardPage = React.lazy(() => import('../Pages/TeacherDashboardPage'));

const RoutingTeacher = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route 
          path="/teacher-dashboard" 
          element={
            <Suspense fallback={<Loader />}>
              <TeacherDashboardPage />
            </Suspense>
          } 
        />
        
        <Route 
          path="/student_list" 
          element={
            <Suspense fallback={<Loader />}>
              <StudentListPage/>
            </Suspense>
          } 
        />
        
        <Route 
          path="/online-classes" 
          element={
            <Suspense fallback={<Loader />}>
              <OnlineClaasessTeacherSchedule/>
            </Suspense>
          } 
        />
        
        <Route 
          path="/online-classes-view-list" 
          element={
            <Suspense fallback={<Loader />}>
              <ViewOnlineClassTeacher/>
            </Suspense>
          } 
        />
        
        <Route 
          path="/view-report-by-teacher" 
          element={
            <Suspense fallback={<Loader />}>
              <ReportTeacherPage/>
            </Suspense>
          } 
        />
        
        <Route 
          path="/create-Attendance-by-teacher" 
          element={
            <Suspense fallback={<Loader />}>
              <AttendanceTecaherPage/>
            </Suspense>
          } 
        />
        
        <Route 
          path="/attendance-master" 
          element={
            <Suspense fallback={<Loader />}>
              <AttendanceViewPageTaecher/>
            </Suspense>
          } 
        />
         <Route 
          path="/attendance-master/student-details-by-teacher/:id/:id" 
          element={
            <Suspense fallback={<Loader />}>
              <DetailAttendancePage/>
            </Suspense>
          } 
        />
          <Route 
          path="/create-Assignment-by-teacher" 
          element={
            <Suspense fallback={<Loader />}>
              <AssignmnetTeacherCreatePage/>
            </Suspense>
          } 
        />
              <Route 
          path="/view-Assignment-by-teacher" 
          element={
            <Suspense fallback={<Loader />}>
              <AssignmentViewTeacher/>
            </Suspense>
          } 
        />
   
      </Routes>
    </Suspense>
  );
};

export default RoutingTeacher;