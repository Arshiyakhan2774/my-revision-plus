import { useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import AddMapping from './AddMapping';
import { ImFileExcel } from 'react-icons/im';
import { FcSearch } from 'react-icons/fc';
import { useDeleteMappingMutation, useGetTeacherMappingQuery } from '../../../Services/UserMangae/UserMangeSlice';
import DeleteConfirmation from '../../../utilities/DeleteConfirmation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
const MappingListView = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const { data: teacher, refetch } = useGetTeacherMappingQuery();
  const [deleteTeacherMapping] = useDeleteMappingMutation();
  const teacherData = teacher?.data?.result || [];
  const [filterText, setFilterText] = useState('');
  
  const teachersPerPage = 5;

  const handleDeleteDialogOpen = (teacherId) => {
    setDeleteTeacherId(teacherId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteTeacherId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    if (deleteTeacherId) {
      try {
        await deleteTeacherMapping(deleteTeacherId).unwrap();
        refetch();
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Error deleting user");
      }
    }
    setOpenDeleteDialog(false);
  };

  // Filter data based on search input
  const filteredData = teacherData.filter(
    (row) =>
      row.teacher_info?.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.board_info?.board_prog_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.subject_info?.subject_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      row.subjectlevel_info?.subject_level_name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: 'Teacher Name',
      selector: (row) => row.teacher_info?.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Board Name',
      selector: (row) => row.board_info?.board_prog_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Subject Name',
      selector: (row) => row.subject_info?.subject_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Subject Level Name',
      selector: (row) => row.subjectlevel_info?.subject_level_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex justify-center">
          <button 
            onClick={() => handleDeleteDialogOpen(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <RiDeleteBin6Line size={20} />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#1a73e8',
        color: 'white',
      },
    },
    headCells: {
      style: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        textAlign: 'center',
      },
    },
  };

  // Format data for CSV export
  const exportData = filteredData.map((row) => ({
    teacher_name: row.teacher_info?.name || 'N/A',
    board_name: row.board_info?.board_prog_name || 'N/A',
    subject_name: row.subject_info?.subject_name || 'N/A',
    subject_level_name: row.subjectlevel_info?.subject_level_name || 'N/A',
  }));

  return (

 
        <div className=" w-full shadow p-6 w-full px-4 py-6">
         
            <AddMapping refetch={refetch} />
         

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full md:w-80 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
            </div>

            <CSVLink
              data={exportData}
              filename="teacher_mapping.csv"
              className="flex items-center gap-2 px-4 py-2 bg-custom-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <ImFileExcel size={20} />
              <span>Export to Excel</span>
            </CSVLink>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              customStyles={customStyles}
              pagination
              paginationPerPage={teachersPerPage}
              paginationTotalRows={filteredData.length}
           
              highlightOnHover
              className="border border-gray-200 rounded-lg overflow-hidden"
            />
          </div>

          <div className="text-start mt-6 text-gray-500 text-sm">
            COPYRIGHT © 2024 My Revision+, All rights Reserved
          </div>
          <ScrollUpComponent />
       
     

      <DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteClick}
      />
<ToastContainer/>
     </div>
  
  );
};

export default MappingListView;