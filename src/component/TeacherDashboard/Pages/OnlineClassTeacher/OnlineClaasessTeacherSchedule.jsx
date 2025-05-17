import React from 'react'
import OnlineTeacherClassesSchedule from '../../onlineTeacher/OnlineTeacherClassesSchedule'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'

const OnlineClaasessTeacherSchedule = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
      <NavbarTeacher />
        <OnlineTeacherClassesSchedule />
    </div>
  )
}

export default OnlineClaasessTeacherSchedule