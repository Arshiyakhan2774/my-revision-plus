import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { MdAddHomeWork, MdOutlineCategory, MdAssignmentTurnedIn, MdOutlineBookOnline, MdOutlineCancelScheduleSend, MdViewCompact } from 'react-icons/md';
import { FaUsersGear, FaBookOpenReader, FaArrowUpRightDots } from 'react-icons/fa6';
import { PiBookOpenDuotone, PiUserSwitchFill } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import { FaMailBulk } from "react-icons/fa";
import { TbCategoryPlus, TbMapQuestion } from 'react-icons/tb';
import { BsFillPatchQuestionFill, BsQuestionDiamond } from 'react-icons/bs';
import { ImLibrary, ImMail4 } from 'react-icons/im';
import { VscGitPullRequestCreate } from 'react-icons/vsc';
import { RiCalendarScheduleLine, RiPresentationLine } from 'react-icons/ri';
import { TfiViewListAlt } from 'react-icons/tfi';
import { GrSchedules } from 'react-icons/gr';
import { SiBasicattentiontoken, SiAnytype, SiPastebin } from 'react-icons/si';
import { LuFileType2 } from 'react-icons/lu';
import { FaShareSquare } from "react-icons/fa";
import LogoComponent from './Sidebar/LogoComponent';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../Services/Authentication/AuthSlice';
import UserProfileModal from './Usermangae/usersList/ProfileDailoge';
const Sidebar = ({ toggleSidebar1}) => {
const [isOpen, setIsOpen] = useState(true);
const [activeMenuId, setActiveMenuId] = useState(null);
const dispatch = useDispatch();
  const navigate =useNavigate()

const handleMenuClick = (id) => {
  setActiveMenuId(prev => prev === id ? null : id);
};
  const toggleSidebar = () => {
    
    setIsOpen(!isOpen);
    toggleSidebar1()
  };

//   const toggleSubmenu = (id) => {
//     setOpenSubmenus(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }));
//   };
const location = useLocation();

useEffect(() => {
  const findActiveMenu = () => {
    for (const item of menuItems) {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(
          subItem => location.pathname === subItem.link
        );
        if (isSubmenuActive) {
          setActiveMenuId(item.id);
          return;
        }
      }
    }
  };
  findActiveMenu();
}, [location]);
const [openDialog, setOpenDialog] = useState(false);
const userResponse = useSelector(state => state.idSlice.userResponse);

const handleOpenDialog = () => setOpenDialog(true);
const handleCloseDialog = () => setOpenDialog(false);

const defaultName = userResponse?.name || 'User Name';
const defaultEmail = userResponse?.email || 'user@company.com';
  const menuItems = [
    {
      id: "0a",
      title: 'Dashboard',
      icon: <MdAddHomeWork />,
      link: '/dashboard',
    },
    {
      id: "1a",
      title: 'User Manage',
      icon: <FaUsersGear />,
      submenu: [
        { title: 'Teacher/Admin', icon: <PiBookOpenDuotone />, link: '/users' },
        { title: 'Student', icon: <PiUserSwitchFill />, link: '/student-view-list' },
        { title: 'Teacher Subject Mapping', icon: <GiTeacher />, link: '/teacher-mapping' },
        { title: 'Student Mapping', icon: <GiTeacher />, link: '/student-mapping' },
      ],
    },
    {
      id: "2a",
      title: 'Category Master',
      icon: <MdOutlineCategory />,
      submenu: [
        { title: 'Add Category', icon: <TbCategoryPlus />, link: '/add-category' },
        { title: 'View Category', icon: <MdOutlineCategory />, link: '/view-category' },
      ],
    },
    {
      id: "3a",
      title: 'Question Master',
      icon: <BsFillPatchQuestionFill />,
      submenu: [
        { title: 'Add Question', icon: <BsQuestionDiamond />, link: '/create-question' },
        { title: 'View Question', icon: <TbMapQuestion />, link: '/create-filter' },
        { title: 'Library', icon: <ImLibrary />, link: '/library' },
      ],
    },
    {
      id: "4a",
      title: 'Assignment Master',
      icon: <FaBookOpenReader />,
      submenu: [
        { title: 'Create Assignment', icon: <VscGitPullRequestCreate />, link: '/create-Assignment' },
        { title: 'Shared Assignment', icon: <FaShareSquare />, link: '/shared-assignment' },
        { title: 'View Assignment', icon: <FaArrowUpRightDots />, link: '/view-Assignment' },
        { title: 'Practice Question', icon: <MdAssignmentTurnedIn />, link: '/practiceQuestion' },
      ],
    },
    {
      id: "5a",
      title: 'Schedule Master',
      icon: <RiCalendarScheduleLine />,
      submenu: [
        { title: 'Create Schedule', icon: <TfiViewListAlt />, link: '/schedule-submit' },
        { title: 'View Schedule', icon: <GrSchedules />, link: '/schedule-view' },
      ],
    },
    {
      id: "6a",
      title: 'Attendance Master',
      icon: <SiBasicattentiontoken />,
      submenu: [
        { title: 'Submit Attendance', icon: <MdOutlineCancelScheduleSend />, link: '/attendance-submit' },
        { title: 'View Attendance', icon: <MdViewCompact />, link: '/attendance-view' },
      ],
    },
    {
      id: "7a",
      title: 'User Type',
      icon: <LuFileType2 />,
      submenu: [
        { title: 'UserType Modules', icon: <SiAnytype />, link: '/user-type' },
      ],
    },
    {
      id: "8a",
      title: 'Mail Configuration',
      icon: <FaMailBulk />,
      submenu: [
        { title: 'Mail Configuration', icon: <ImMail4 />, link: '/mail-configration' },
      ],
    },
    {
      id: "9a",
      title: 'Online Class Schedule',
      icon: <MdOutlineBookOnline />,
      submenu: [
        { title: 'Schedule Classes', icon: <RiPresentationLine />, link: '/schedule-Online-classes' },
        { title: 'View Schedule Classes', icon: <SiPastebin />, link: '/online-classes-view' },
      ],
    },
    {
      id: "10a",
      title: 'Report',
      icon: <MdOutlineBookOnline />,
      submenu: [
        { title: 'Report View', icon: <RiPresentationLine />, link: '/Report-for-admin' },
      ],
    },
  ];
  const handleLogout = async () => {
    console.log("First click received");
    try {
      console.log("Dispatching logout");
      await dispatch(logoutUser()).unwrap();
      console.log("Logout successful, navigating");
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  const avatarUrl = userResponse?.image
  ? `https://myrevisionplus.com/api/img/users/${userResponse.image}`
  : null;
  return (
    <div className={`flex flex-col h-full bg-gray-100 text-gray-800  ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="p-4 border-b border-gray-200 ">
        <div className="flex items-center justify-between">
          {isOpen ? (
          <LogoComponent/>
          ) : (
            <div className="flex items-center justify-center w-[35px] h-[35px] min-w-[35px] min-h-[35px] rounded-lg text-2xl font-bold bg-gradient-to-r from-[#1a73e8] to-[#cadcfc] mr-2.5">
            M
          </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* User Info */}
      <div className="p-4">
      <div className="flex items-center cursor-pointer" >
        <div className="h-10 w-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-bold">
        {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userResponse?.name}
              className="h-10 w-10 rounded-full object-cover"
              onClick={handleOpenDialog}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-bold">
              {userResponse?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        {isOpen && (
          <div className="ml-3">
            <p className="text-sm font-medium">{defaultName}</p>
            <p className="text-xs text-gray-500">{defaultEmail}</p>
          </div>
        )}
      </div>
      <UserProfileModal openDialog={openDialog} handleCloseDialog={handleCloseDialog} isOpen={isOpen}/>
      </div>

      {/* Sidebar Menu with Submenus */}
      <nav className="flex-1 overflow-y-auto bg-gray-100">
  <ul className="space-y-1 p-2">
    {menuItems.map((item) => {
      const isActive = item.link 
        ? location.pathname === item.link
        : activeMenuId === item.id;

      return (
        <li 
          key={item.id} 
          className={` transition-colors ${
            isActive ? ' ' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {item.link ? (
            <NavLink
              to={item.link}
              onClick={() => setActiveMenuId(null)}
              className={({ isActive: linkActive }) => 
                `flex items-center p-3 rounded-[30px] ${
                  linkActive 
                    ? 'bg-[#1a73e8] text-white'
                    : 'hover:bg-blue-100'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.title}</span>}
            </NavLink>
          ) : (
            <div>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`flex items-center justify-between w-full p-3 rounded-[30px] ${
                  activeMenuId === item.id 
                    ? 'text-[#1a73e8] font-semibold' 
                    : 'hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg">{item.icon}</span>
                  {isOpen && <span className="ml-3">{item.title}</span>}
                </div>
                {isOpen && (
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      activeMenuId === item.id ? 'transform rotate-90 text-[#1a73e8]' : 'text-gray-600'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
              
              {activeMenuId === item.id && isOpen && item.submenu && (
                <ul className="ml-8 mt-1 space-y-1  p-2 rounded-lg">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.title} className="group">
                      <NavLink
                        to={subItem.link}
                        className={({ isActive }) => 
                          `flex items-center p-2 pl-3 rounded-[30px] transition-colors ${
                            isActive 
                              ? 'bg-[#1a73e8] text-white' 
                              : 'hover:bg-blue-100'
                          }`
                        }
                      >
                        <span className="text-lg mr-3">{subItem.icon}</span>
                        {subItem.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </li>
      );
    })}
  </ul>
</nav>
<div className="border-t border-gray-20">
      <div className="p-2 border-t border-gray-200">
        <button 
          type="button"
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
    </div>
  );
};

export default Sidebar;