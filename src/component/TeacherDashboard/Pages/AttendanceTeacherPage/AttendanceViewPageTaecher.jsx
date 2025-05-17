import React from 'react'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'
import AttendanceViweByTeacher from '../../AttendanceMaterTeacher/AttendanceViweByTeacher'

const AttendanceViewPageTaecher = () => {
  return (
   
          <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
          <NavbarTeacher/>
        <AttendanceViweByTeacher/>
    </div>
  )
}

export default AttendanceViewPageTaecher