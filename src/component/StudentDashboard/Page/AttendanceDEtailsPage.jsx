import React from 'react'
import NavbarTeacher from '../../TeacherDashboard/TeacherNavbar/NavbarTeacher'
import AttendanceDetailForTeacher from '../Attendancestudent/AttendceDetailforTeachetr'

const AttendanceDEtailsPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
         <NavbarTeacher/>
         <AttendanceDetailForTeacher/>
         </div>
  )
}

export default AttendanceDEtailsPage