import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';
import { setUserResponse } from '../../store/UserSliceId';
import { logoutUser } from '../../Services/Authentication/AuthSlice';
import AdminEdit from '../../AdminDashboard/Usermangae/usersList/AdminEdit';
import EditUserModal from '../../AdminDashboard/Usermangae/StudentList/EditComponent';
import PasswordDialog from '../../AdminDashboard/Usermangae/usersList/PasswordDailog';

const BASE_URL = 'http://myrevisionplus.com/api/img/users/';

const NavbarTeacher = ({ dashboardLink, showEditProfile = false, userRole }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userResponse = useSelector((state) => state.idSlice.userResponse);

  useEffect(() => {
    const savedUserResponse = localStorage.getItem('userResponse');
    if (savedUserResponse) {
      dispatch(setUserResponse(JSON.parse(savedUserResponse)));
    }
  }, [dispatch]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('userResponse');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative mt-[-16px] ">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-2 bg-[#1a73e8] ">
        <Link to={dashboardLink} className="flex items-center space-x-3 cursor-pointer p-2">
          <div className="flex flex-col items-center">
            <span className="flex items-center">
              <div className="text-white font-bold text-xl">M</div>
              <h5 className="text-white font-semibold ml-1">My Revision +</h5>
            </span>
          </div>
        </Link>

        <div className="relative flex items-center dropdown-container">
          <div 
            onClick={toggleDropdown} 
            className="flex items-center space-x-2 cursor-pointer text-white hover:bg-blue-900 px-3 py-1 rounded transition-colors duration-200"
          >
            {userResponse?.image ? (
              <img
                src={`${BASE_URL}${userResponse.image}`}
                alt={userResponse.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-700 font-bold">
                {userResponse?.name?.charAt(0) || 'G'}
              </div>
            )}
            <span className="hidden sm:inline">
              {userRole === 'parent' ? userResponse?.parent?.name : userResponse?.name || 'Guest'}
            </span>
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 overflow-hidden">
              <ul className="text-black">
                {showEditProfile && (
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center transition-colors duration-150"
                    onClick={() => {
                      setOpenEditDialog(true);
                      setDropdownOpen(false);
                    }}
                  >
                    <FaUserEdit className="mr-2 text-gray-600" />
                    <span>My Profile</span>
                  </li>
                )}
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center transition-colors duration-150"
                  onClick={() => {
                    setOpenPasswordDialog(true);
                    setDropdownOpen(false);
                  }}
                >
                  <FaKey className="mr-2 text-gray-600" />
                  <span>Edit Password</span>
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-600 transition-colors duration-150"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Logout</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Profile Edit Dialog */}
      {openEditDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <button 
                onClick={() => setOpenEditDialog(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              {userRole === 'teacher' ? (
                <AdminEdit
                  onClose={() => setOpenEditDialog(false)}
                  user={userResponse}
                />
              ) : (
                <EditUserModal
                  onClose={() => setOpenEditDialog(false)}
                  user={userResponse}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <PasswordDialog
        open={openPasswordDialog}
        onClose={() => setOpenPasswordDialog(false)}
        userId={userResponse?._id}
      />
    </div>
  );
};

export default NavbarTeacher;