import React from 'react'
import TeacherViewAttendance from '../../AttendanceMaterTeacher/TeacherViewAttendance'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'

const DetailAttendancePage = () => {
  return (
    
          <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
          <NavbarTeacher/>
        <TeacherViewAttendance/>
    </div>
  )
}

export default DetailAttendancePage