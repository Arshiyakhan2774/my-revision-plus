import { useState } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { TbPasswordFingerprint } from 'react-icons/tb';
import { RiDeleteBinLine } from 'react-icons/ri';
import { PiStudentBold } from "react-icons/pi";
import ReUseAble from './ReUseAble';
import { useDeleteStudentMutation, useGetUserQuery, useUpdatePasswordUserMutation } from '../../../Services/UserMangae/UserMangeSlice';
import EditUserModal from './EditComponent';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import StudentProfile from './StudentProfile';
import PasswordDialog from '../usersList/PasswordDailog';
import DeleteConfirmation from '../../../utilities/DeleteConfirmation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentView = () => {
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedUser] = useDeleteStudentMutation();
  const [passwordUpdate] = useUpdatePasswordUserMutation();
  const [userId, setUserId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordId, setPasswordId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const { data, refetch } = useGetUserQuery();
  const userListData = data?.data?.user || [];

  // Function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://ui-avatars.com/api/?name=User&background=00246B&color=fff&size=80';
    
    // Check if the URL is already complete
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Handle relative paths
    return `https://myrevisionplus.com/api/img/users/${imagePath}`;
  };

  const handleDeleteDialogOpen = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteUserId(null);
    setDeleteUserName('');
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    try {
      await deletedUser(deleteUserId).unwrap();
      toast.success("User deleted successfully!");
      refetch();
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    }
  };

  const handleUpdatePassword = (userId) => {
    setPasswordId(userId);
    setOpenPasswordModal(true);
  };

  const handlePasswordModalClose = () => setOpenPasswordModal(false);

  const handleUpdatePasswordConfirm = async (data) => {
    try {
      await passwordUpdate(data).unwrap();
      toast.success("Password updated successfully!");
      handlePasswordModalClose();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleProfileClick = (id) => {
    setUserId(id);
    setDialogOpen(true); 
  };

  const columns = [
    {
      name: 'Photo',
      selector: row => (
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
          <img 
            src={getImageUrl(row.image)}
            alt={row.name || 'User Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://ui-avatars.com/api/?name='+encodeURIComponent(row.name || 'User')+'&background=00246B&color=fff&size=80';
            }}
          />
        </div>
      ),
      sortable: false,
      width: '8%',
    },
    { 
      name: 'Name', 
      selector: row => row.name || 'N/A', 
      sortable: true, 
      width: '15%' 
    },
    { 
      name: 'Email', 
      selector: row => row.email || 'N/A', 
      sortable: true, 
      width: '23%' 
    },
    {
      name: 'Expire Date',
      selector: row => row.expire_date ? new Date(row.expire_date).toLocaleDateString() : 'N/A',
      sortable: true,
      width: '12%',
    },
    {
      name: 'Parent Info',
      selector: row => row.parent ? (
        <div className="space-y-1">
          <div><span className="font-medium">Name:</span> {row.parent.name || 'N/A'}</div>
          <div><span className="font-medium">Email:</span> {row.parent.email || 'N/A'}</div>
        </div>
      ) : 'N/A',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleProfileClick(row._id)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View Profile"
          >
            <FaUserCircle className="text-xl" />
          </button>
          <button 
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit User"
          >
            <CiEdit className="text-xl" />
          </button>
          <button 
            onClick={() => handleUpdatePassword(row._id)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Update Password"
          >
            <TbPasswordFingerprint className="text-xl" />
          </button>
          <button 
            onClick={() => handleDeleteDialogOpen(row._id, row.name)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete User"
          >
            <RiDeleteBinLine className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full px-4 py-6 ">
      <ReUseAble
        data={userListData}
        columns={columns}
        exportFilename="UserData.csv"
        filterPlaceholder="Filter by Name"
        title="Student List"
        IconComponent={PiStudentBold}
      />
      
      <DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteClick}
        userName={deleteUserName}
      />
    
      <PasswordDialog
        open={openPasswordModal}
        onClose={handlePasswordModalClose}
        onConfirm={handleUpdatePasswordConfirm}
        userId={passwordId}
      />
      
      {dialogOpen && (
        <StudentProfile
          idData={userId}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      
      {selectedUser && (
        <EditUserModal
          open={showEditModal}
          onClose={handleCloseEditModal}
          user={selectedUser}
          refetch={refetch}
          userListData={userListData}
        />
      )}
      
      <ScrollUpComponent />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentView;