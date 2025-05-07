import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { ImFileExcel } from "react-icons/im";
import { FcSearch } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaUserCircle } from 'react-icons/fa';
import { CiEdit } from 'react-icons/ci';
import { TbPasswordFingerprint } from 'react-icons/tb';
import { RiDeleteBinLine } from 'react-icons/ri';
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordDialog from './PasswordDailog';
import UserProfileModal from './ProfileDailoge';
import AdminEdit from './AdminEdit';
import DeleteConfirmation from '../../../utilities/DeleteConfirmation';
import { useDeleteUserMutation, useGetAdminQuery, useUpdatePasswordMutation } from '../../../Services/UserMangae/UserMangeSlice';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import IconWithTitle from '../../../utilities/IconsTittle';

const UserDataList = () => {
    const [filterText, setFilterText] = useState('');
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [passwordId, setPasswordId] = useState(null);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: admin, refetch } = useGetAdminQuery();
    const [deleteTeacher] = useDeleteUserMutation();
    const [updatePassword] = useUpdatePasswordMutation();

    const userListData = admin?.data?.user || [];

    // Fixed image URL handling
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/40';
        
        // Check if the URL is already complete
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Handle relative paths
        return `https://myrevisionplus.com/api/img/users/${imagePath}`;
    };

    const handleDeleteDialogOpen = (userId) => {
        setDeleteUserId(userId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteUserId(null);
        setOpenDeleteDialog(false);
    };

    const handleDeleteClick = async () => {
        try {
            await deleteTeacher(deleteUserId).unwrap();
            toast.success("User deleted successfully!");
            handleDeleteDialogClose();
            refetch();
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
            await updatePassword({ id: passwordId, passwordData: data });
            toast.success("Password updated successfully!");
            handlePasswordModalClose();
        } catch (error) {
            console.error("Error updating password:", error);
            toast.error("Error updating password");
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
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                        src={getImageUrl(row.image)}
                        alt={row.name || 'User Avatar'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://ui-avatars.com/api/?name=' + 
                                encodeURIComponent(row.name || 'User') + 
                                '&background=00246B&color=fff&size=80';
                        }}
                        crossOrigin="anonymous" // Add this for CORS requests
                    />
                </div>
            ),
            sortable: false,
            width: '9%',
        },
        { name: 'Name', selector: row => row.name || 'N/A', sortable: true, width: '20%' },
        { name: 'Email', selector: row => row.email || 'N/A', sortable: true, width: '25%' },
        {
            name: 'Expire Date',
            selector: row => row.expire_date ? new Date(row.expire_date).toLocaleDateString() : 'N/A',
            sortable: true,
            width: '12%',
        },
        {
            name: 'User Type',
            selector: row => row.usertype_id?.name || 'N/A',
            sortable: true,
            width: '12%',
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
                        onClick={() => handleDeleteDialogOpen(row._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete User"
                    >
                        <RiDeleteBinLine className="text-xl" />
                    </button>
                </div>
            ),
        },
    ];

    const filteredData = userListData.filter(item =>
        item.name?.toLowerCase().includes(filterText.toLowerCase())
    );

    const csvHeaders = [
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Expire Date', key: 'expire_date' },
        { label: 'User Type', key: 'usertype_id.name' },
    ];

    const csvData = filteredData.map(item => ({
        name: item.name || 'N/A',
        email: item.email || 'N/A',
        expire_date: item.expire_date ? new Date(item.expire_date).toLocaleDateString() : 'N/A',
        usertype_id: item.usertype_id?.name || 'N/A',
    }));

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#1a73e8' ,
                color: '#fff',
                fontWeight: 'bold',
            },
        },
    };

    return (
        <div className="max-w-full w-full mx-auto px-4 py-10">
           
            <IconWithTitle
              icon={LiaChalkboardTeacherSolid}
              title="Teacher List"
              iconColor="white"
              backgroundColor="#1a73e8"
              iconSize="30px"
              titleColor="#1a73e8"
              titleFontSize="34px"
            />
            <div className="flex justify-between items-center mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Filter by Name"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-72"
                    />
                    <FcSearch className="absolute right-3 top-3 text-xl" />
                </div>
                
                <div className="flex gap-4">
                    <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename="UserData.csv"
                        className="flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-[#0056b3] transition-colors"
                    >
                        <ImFileExcel className="text-xl mr-2" />
                        Export
                    </CSVLink>
                    
                    <Link 
                        to="/add-users" 
                        className="flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-[#0056b3] transition-colors"
                    >
                        <MdOutlineAddCircleOutline className="text-xl mr-2" />
                        Add User
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                customStyles={customStyles}
                highlightOnHover
                className="border border-gray-200 rounded-lg overflow-hidden"
            />

            <div className="text-start mt-6 text-gray-600">
                COPYRIGHT © 2024 My Revision+, All rights Reserved
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
            <DeleteConfirmation
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                onConfirm={handleDeleteClick}
            />
            <PasswordDialog
                open={openPasswordModal}
                onClose={handlePasswordModalClose}
                onConfirm={handleUpdatePasswordConfirm}
            />
            {dialogOpen && (
                <UserProfileModal
                    idData={userId}
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                />
            )}
            {showEditModal && (
                <AdminEdit
                    refetch={refetch}
                    open={showEditModal}
                    onClose={handleCloseEditModal}
                    user={selectedUser}
                />
            )}
            <ScrollUpComponent />
        </div>
    );
};

export default UserDataList;