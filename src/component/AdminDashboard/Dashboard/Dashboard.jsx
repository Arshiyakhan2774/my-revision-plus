import { FaUsersGear, FaChartBar, FaCalendarCheck, FaCableCar } from 'react-icons/fa6';
import { FiSettings } from 'react-icons/fi';
import { FaRegBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Dashboard = () => {
  return (
   
      <div className="ml-2 flex-1 overflow-y-auto">
        <div className="bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard Overview</h1>
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
        <div className="p-20">
          {/* Cards Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Card */}
              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-4">
                    <FaUsersGear className="text-blue-600 text-4xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-lg mb-1">Total Users</p>
                    {/* <h3 className="text-4xl font-bold text-gray-800">1,234</h3> */}
                  </div>
                </div>
                <div className="text-center border-t pt-4">
                  <Link to="/users" className="text-blue-600 hover:text-blue-800 font-medium text-lg">
                    Manage Users →
                  </Link>
                </div>
              </div>

              {/* Online Classes Card */}
              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-4">
                    <FaCableCar className="text-purple-600 text-4xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-lg mb-1">Online Classes</p>
                    {/* <h3 className="text-4xl font-bold text-gray-800">56</h3> */}
                  </div>
                </div>
                <div className="text-center border-t pt-4">
                  <Link to="/online-classes" className="text-purple-600 hover:text-purple-800 font-medium text-lg">
                    View Classes →
                  </Link>
                </div>
              </div>

              {/* Attendance Card */}
              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-4">
                    <FaCalendarCheck className="text-green-600 text-4xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-lg mb-1">Attendance</p>
                    {/* <h3 className="text-4xl font-bold text-gray-800">89%</h3> */}
                  </div>
                </div>
                <div className="text-center border-t pt-4">
                  <Link to="/attendance" className="text-green-600 hover:text-green-800 font-medium text-lg">
                    Check Attendance →
                  </Link>
                </div>
              </div>

              {/* Reports Card */}
              <div className="bg-white p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-orange-100 p-4">
                    <FaChartBar className="text-orange-600 text-4xl" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-lg mb-1">Reports</p>
                    {/* <h3 className="text-4xl font-bold text-gray-800">24</h3> */}
                  </div>
                </div>
                <div className="text-center border-t pt-4">
                  <Link to="/reports" className="text-orange-600 hover:text-orange-800 font-medium text-lg">
                    Generate Reports →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default Dashboard;