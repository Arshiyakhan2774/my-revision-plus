import React from 'react'
import OnlineListTeacher from '../../onlineTeacher/OnlineListTeacher'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'

const ViewOnlineClassTeacher = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
      <NavbarTeacher />
        <OnlineListTeacher/>
    </div>
  )
}

export default ViewOnlineClassTeacher