import { useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import { FcSearch } from 'react-icons/fc';
import { VscUngroupByRefType } from 'react-icons/vsc';
import { ImFileExcel } from 'react-icons/im';
import { toast, ToastContainer } from 'react-toastify';
import DataTable from 'react-data-table-component';
import DeleteConfirmation from '../../utilities/DeleteConfirmation';
import { useGetUserTypesQuery } from '../../Services/UserMangae/UserMangeSlice';
import { useDeleteUserTypeMutation } from '../../Services/userType/UserTypeApi';
import ScrollUpComponent from '../../utilities/ScroolupComponent';
import IconWithTitle from '../../utilities/IconsTittle';

const UserTypeModules = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState(null);
  const navigate = useNavigate();

  const { data: userTypesData, refetch, isLoading } = useGetUserTypesQuery();
  const [deleteUserType] = useDeleteUserTypeMutation();

  const userTypes = userTypesData?.data?.usertypes || [];
  const filteredUserTypes = userTypes.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdate = (id) => {
    navigate(`/user-type-edit/${id}`);
  };

  const handleDelete = async () => {
    if (selectedUserTypeId) {
      try {
        await deleteUserType(selectedUserTypeId).unwrap();
        toast.success("The user type has been successfully deleted.");
        refetch();
      } catch (error) {
        console.error('Error deleting user type:', error);
        toast.error("Failed to delete user type.");
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      name: 'Sr',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '80px',
    },
    {
      name: 'User Type',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Login Type',
      selector: row => row.login_type,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleUpdate(row._id)}
          className="text-blue-600 hover:text-blue-900"
          title="Edit"
        >
          <CiEdit size={20} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px',
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#1a73e8',
        color: 'white',
        fontSize: '16px',
      },
    },
    rows: {
      style: {
        minHeight: '50px',
        '&:hover': {
          backgroundColor: '#1a73e8',
        },
      },
    },
    pagination: {
      style: {
        borderTop: 'none',
      },
    },
  };

  return (
    <div className="w-full p-4">
      <IconWithTitle
        icon={VscUngroupByRefType}
        title="UserType"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />

      <div className="flex flex-wrap justify-between items-center pb-4 mb-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Filter by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          <FcSearch className="absolute right-3 top-2.5 text-xl" />
        </div>

        <CSVLink data={filteredUserTypes} filename="user_types.csv">
          <button className="bg-custom-primary text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-800">
            <ImFileExcel />
            Export to CSV
          </button>
        </CSVLink>
      </div>

      {/* DataTable */}
      
        <DataTable
          columns={columns}
          data={filteredUserTypes}
          customStyles={customStyles}
          progressPending={isLoading}
          progressComponent={
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto"></div>
              <p className="mt-2 text-blue-900 font-medium">Loading user types...</p>
            </div>
          }
          pagination
          highlightOnHover
          responsive
          noDataComponent={
            <div className="py-10 text-center text-gray-500">
              No user types found
            </div>
          }
        />
           <DeleteConfirmation
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        userName="this user type"
      />

      <div className="text-left mt-6 text-sm text-gray-600">
        COPYRIGHT © 2024 My Revision+, All rights Reserved
      </div>
      <ToastContainer />
      <ScrollUpComponent />
    </div>
  );
};

export default UserTypeModules;