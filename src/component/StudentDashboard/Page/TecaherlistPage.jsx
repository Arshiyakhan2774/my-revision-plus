import React from 'react'
import TeacherList from '../TeacherList/TeacherList'
import NavbarTeacher from '../../TeacherDashboard/TeacherNavbar/NavbarTeacher'

const TecaherlistPage = () => {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col  ml-[-14px] mr-[-10px]'>
          <NavbarTeacher/>
    <TeacherList/>
    </div>
  )
}

export default TecaherlistPage