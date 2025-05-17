import React, { Suspense } from 'react'
import Loader from '../../AdminDashboard/Routing/Loader'
import { Route, Routes } from 'react-router-dom'
import StudentDashboardPage from '../Page/StudentDashboardPage'
import TecaherlistPage from '../Page/TecaherlistPage'
import OnlineListTeacher from '../../TeacherDashboard/onlineTeacher/OnlineListTeacher'
import OnlineCLassViewPage from '../Page/OnlineCLassViewPage'
import AttedanceViewStudent from '../Page/AttedanceViewStudent'
import AttendanceDEtailsPage from '../Page/AttendanceDEtailsPage'
import AssignmentViewPage from '../Page/AssignmentViewPage'
import StudentReport from '../Page/StudentReport'

const StudentRouting = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
    <Route 
    path="/student-dashboard" 
    element={
      <Suspense fallback={<Loader />}>
        <StudentDashboardPage/>
      </Suspense>
    } 
  />
   <Route 
    path="/teacher-list" 
    element={
      <Suspense fallback={<Loader />}>
        <TecaherlistPage/>
      </Suspense>
    } 
  />
  <Route 
    path="/online-classes-view-student" 
    element={
      <Suspense fallback={<Loader />}>
        <OnlineCLassViewPage/>
      </Suspense>
    } 
  />
   <Route 
    path="/student-details-by-student" 
    element={
      <Suspense fallback={<Loader />}>
        <AttedanceViewStudent/>
      </Suspense>
    } 
  />
  <Route 
    path="/student-details-by-student/:id/:id" 
    element={
      <Suspense fallback={<Loader />}>
        <AttendanceDEtailsPage/>
      </Suspense>
    } 
  />
   <Route 
    path="/shared-assignment-student" 
    element={
      <Suspense fallback={<Loader />}>
        <AssignmentViewPage/>
      </Suspense>
    } 
  />
     <Route 
    path="/student-report" 
    element={
      <Suspense fallback={<Loader />}>
        <StudentReport/>
      </Suspense>
    } 
  />
</Routes>
</Suspense>
  )
}

export default StudentRouting