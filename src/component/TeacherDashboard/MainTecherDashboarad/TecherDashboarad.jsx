import { FaUsers, FaChalkboardTeacher, FaBook, FaChartBar, FaCalendarCheck, FaFileAlt } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { FaRegBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  return (
    <div className="ml-2 flex-1 bg-gray-100 overflow-y-auto">
      <div className="bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Teacher Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-5">
          <button className="text-gray-600 hover:text-blue-600 relative">
            <FaRegBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <button className="text-gray-600 hover:text-blue-600">
            <FiSettings className="text-xl" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-20">
        {/* First Row of Cards - Now with 2 cards */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student List Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUsers className="text-blue-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Student List</p>
                  <h3 className="text-2xl font-bold text-gray-800">142</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/student_list" className="text-blue-600 hover:text-blue-800 font-medium">
                  View Students →
                </Link>
              </div>
            </div>

        
           
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
  <div className="flex items-center justify-between mb-4">
    <div className="bg-teal-100 p-3 rounded-full">
      <FaFileAlt className="text-teal-600 text-5xl" />
    </div>
    <div className="text-right">
      <p className="text-gray-500 text-md mb-1">Assignment</p>
      <h3 className="text-2xl font-bold text-gray-800">87%</h3>
    </div>
  </div>
  <div className="flex justify-between border-t pt-4">
    <Link 
      to="/create-Assignment-by-teacher" 
      className="text-teal-600 hover:text-teal-800 font-medium"
    >
      Create Assignment →
    </Link>
    <Link 
      to="/view-Assignment-by-teacher" 
      className="text-teal-600 hover:text-teal-800 font-medium"
    >
      View Assignments →
    </Link>
  </div>
</div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FaFileAlt className="text-teal-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Online Class</p>
                  <h3 className="text-2xl font-bold text-gray-800">87%</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/online-classes" className="text-teal-600 hover:text-teal-800 font-medium">
                  Check Submissions →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row of Cards - Also with 2 cards */}
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Reports & Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Reports Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaChartBar className="text-indigo-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Report</p>
                  <h3 className="text-2xl font-bold text-gray-800">8</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/view-report-by-teacher" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Reports →
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCalendarCheck className="text-green-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Attendance</p>
                  <h3 className="text-2xl font-bold text-gray-800">89%</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/create-Attendance-by-teacher" className="text-green-600 hover:text-green-800 font-medium">
                  Take Attendance →
                </Link>
              </div>
            </div>
          
            {/* Assignment Submissions Card */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;