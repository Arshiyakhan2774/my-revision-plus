import React from 'react'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'
import TeacherCreateAttendance from '../../AttendanceMaterTeacher/TeacherCreateAttendance'

const AttendanceTecaherPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
        <NavbarTeacher />
        <TeacherCreateAttendance/>
    </div>
  )
}

export default AttendanceTecaherPage