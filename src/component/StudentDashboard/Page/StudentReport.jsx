import React from 'react'
import NavbarTeacher from '../../TeacherDashboard/TeacherNavbar/NavbarTeacher'
import ReportTeacher from '../../TeacherDashboard/Report/ReportTeacher'

const StudentReport = () => {
  return (
   
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
    <NavbarTeacher />
 <ReportTeacher/></div>
  )
}

export default StudentReport