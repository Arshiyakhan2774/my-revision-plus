import React from 'react'
import NavbarTeacher from '../TeacherNavbar/NavbarTeacher'
import AssignmentList from '../../AdminDashboard/Assignment-master/AssignmentListView/AssignmentList'

const AssignmentViewTeacher = () => {
  return (

   <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
   <NavbarTeacher />
        <AssignmentList/>
    </div>
  )
}

export default AssignmentViewTeacher