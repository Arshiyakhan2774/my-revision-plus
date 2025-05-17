import React from 'react'
import ReportTeacher from '../../Report/ReportTeacher'
import NavbarTeacher from '../../TeacherNavbar/NavbarTeacher'

const ReportTeacherPage = () => {
  return (

           <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
           <NavbarTeacher />
        <ReportTeacher/>
       
    </div>
  )
}

export default ReportTeacherPage