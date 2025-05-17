import React from 'react'
import AssignmentCreatTeacher from '../../AssignmentTeacher/AssignmentCreatTeacher'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'
import TeacherSharedAssignemnet from '../../../StudentDashboard/AssignmentStudent/TeacherSharedAssignemnet'

const AssignmnetTeacherCreatePage = () => {
  return (
 
          <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
          <NavbarTeacher />
        <TeacherSharedAssignemnet/>
    </div>
  )
}

export default AssignmnetTeacherCreatePage