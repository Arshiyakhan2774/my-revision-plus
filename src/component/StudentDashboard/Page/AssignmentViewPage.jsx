import React from 'react'
import NavbarTeacher from '../../TeacherDashboard/TeacherNavbar/NavbarTeacher'

import SharedAssignmentList from '../AssignmentStudent/SharedAssignmentList'

const AssignmentViewPage = () => {
  return (
   
     <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
     <NavbarTeacher/>
        <SharedAssignmentList/>
    </div>
  )
}

export default AssignmentViewPage