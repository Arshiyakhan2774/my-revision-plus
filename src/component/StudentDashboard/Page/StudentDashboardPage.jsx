import React from 'react'
import StudentDashboard from '../StudentMainDashboard/StudenTDashboard'
import NavbarTeacher from '../../TeacherDashboard/TeacherNavbar/NavbarTeacher'

const StudentDashboardPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
          <NavbarTeacher />
      <StudentDashboard/>

    </div>
  )
}

export default StudentDashboardPage