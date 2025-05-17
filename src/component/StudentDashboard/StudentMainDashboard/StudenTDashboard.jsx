import { FaUserGraduate, FaBook, FaChartBar, FaCalendarCheck, FaFileAlt, FaChalkboardTeacher } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { FaRegBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="ml-2 flex-1 bg-gray-100 overflow-y-auto">
      <div className="bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Student Dashboard</h1>
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
        {/* First Row of Cards */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Teacher Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Courses Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaBook className="text-blue-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Teacher List</p>
                  <h3 className="text-2xl font-bold text-gray-800">total Teacher Mapping</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/teacher-list" className="text-blue-600 hover:text-blue-800 font-medium">
                  View Teacher List →
                </Link>
              </div>
            </div>

            {/* Class Schedule Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaChalkboardTeacher className="text-purple-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Class Schedule</p>
                  <h3 className="text-2xl font-bold text-gray-800">Today: 2</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/online-classes-view-student" className="text-purple-600 hover:text-purple-800 font-medium">
                  View Online Class Schedule →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row of Cards */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">My Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignments Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 p-3 rounded-full">
                  <FaFileAlt className="text-teal-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">Assignment </p>
                  <h3 className="text-2xl font-bold text-gray-800">09</h3>
                </div>
              </div>
              <div className="flex justify-between border-t pt-4">
                <Link 
                  to="/shared-assignment-student" 
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
            Assignment View→
                </Link>
              
              </div>
            </div>

            {/* Grades Card */}
           
          </div>
        </div>

        {/* Third Row of Cards */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">My Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaUserGraduate className="text-orange-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">My Attendance</p>
                  <h3 className="text-2xl font-bold text-gray-800">92%</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
              <Link 
                  to="/student-details-by-student" 
                  className="text-teal-600 hover:text-teal-800 font-medium"
                >
               View Attendance →
                </Link>
              </div>
            </div>

            {/* Teachers Card */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaChalkboardTeacher className="text-indigo-600 text-5xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-md mb-1">My Report</p>
                  <h3 className="text-2xl font-bold text-gray-800">7</h3>
                </div>
              </div>
              <div className="text-center border-t pt-4">
                <Link to="/student-report" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View Report →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;