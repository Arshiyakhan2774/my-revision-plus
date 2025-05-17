import React from 'react'
import RichTextEditor from './component/Reach'
import Routing from './component/AdminDashboard/Routing/Routing'
import RoutingTeacher from './component/TeacherDashboard/RoutingTecaher/RoutingTeacher'
import StudentRouting from './component/StudentDashboard/StudentRouting/StudentRouting'


const App = () => {
  return (
    <div className='bg-gray-100'>
    <Routing/>
    <RoutingTeacher/>
    <StudentRouting/>
   {/* <RichTextEditor/> */}
    </div>
  )
}

export default App