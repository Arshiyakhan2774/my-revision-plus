import { useState, useEffect, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import EditScheduleDialog from './EditComponent';
import { AiOutlineSchedule } from 'react-icons/ai';
import { FcSearch } from 'react-icons/fc';
import { CSVLink } from 'react-csv';
import { ImFileExcel } from 'react-icons/im';
import { useFetchScheduleQuery } from '../../Services/Attendance/AttendanceApi';
import { useDeleteScheduleMutation } from '../../Services/SchedulePage/ScheduleApi';
import Loader from '../Routing/Loader';
import DeleteConfirmation from '../../utilities/DeleteConfirmation';
import ScrollUpComponent from '../../utilities/ScroolupComponent';
import IconWithTitle from '../../utilities/IconsTittle';

const ScheduleView = () => {
  const [editMode, setEditMode] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: scheduleData, error, isLoading, refetch } = useFetchScheduleQuery();
  const schedule = scheduleData?.data?.schedule || [];
  const [deleteSchedule] = useDeleteScheduleMutation();
  
  const rowsPerPageOptions = [10, 25, 50, 100];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const value = event?.target?.value;
    if (value) {
      setRowsPerPage(parseInt(value, 10));
      setPage(0);
    }
  };

  const handleDeleteDialogOpen = (id) => {
    setUserToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await deleteSchedule(userToDelete).unwrap();
      refetch();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const filteredList = useMemo(() => {
    return schedule.filter((user) =>
      (user.teacher_id?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.student_id?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schedule, searchQuery]);
 
  const csvData = filteredList.map((item) => ({
    TeacherName: item.teacher_id?.name || "N/A",
    StudentName: item.student_id?.name || "N/A",
    Board: item.board_id?.board_prog_name || "N/A",
    StartDate: item.start_date ? new Date(item.start_date).toLocaleDateString() : "N/A",
    EndDate: item.end_date ? new Date(item.end_date).toLocaleDateString() : "N/A",
  }));
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (users) => {
    setUserToEdit(users);
    setEditMode(true);
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const columns = [
    { name: 'Teacher Name', selector: row => row.teacher_id?.name || 'N/A', sortable: true },
    { name: 'Student Name', selector: row => row.student_id?.name || 'N/A', sortable: true },
    { name: 'Board', selector: row => row.board_id?.board_prog_name || 'N/A', sortable: true },
    { name: 'Start Date', selector: row => new Date(row.start_date).toLocaleDateString() || 'N/A', sortable: true },
    { name: 'End Date', selector: row => new Date(row.end_date).toLocaleDateString() || 'N/A', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-500 hover:text-blue-700" 
            onClick={() => handleEdit(row)}
          >
            <CiEdit className="text-xl" />
          </button>
          <button 
            className="text-red-500 hover:text-red-700" 
            onClick={() => handleDeleteDialogOpen(row.id)}
          >
            <RiDeleteBin6Line className="text-xl" />
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return <Loader loading={isLoading} error={error} onRetry={refetch} />;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading schedule data.</div>;
  }

  if (!scheduleData || !scheduleData.data || scheduleData.data.schedule.length === 0) {
    return <div className="p-4">No schedules found.</div>;
  }

  return (
  
      <div className="container mx-auto px-4">
        <div className=" p-6">
          
          <IconWithTitle
            icon={AiOutlineSchedule}
            title="Schedule Listt"
            iconColor="white"
            backgroundColor="#1a73e8"
            iconSize="30px"
            titleColor="#1a73e8"
            titleFontSize="34px"
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Filter by Name"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
            </div>
            
            <CSVLink
              data={csvData} 
              filename={"schedule_list.csv"}
              className="bg-custom-primary hover:bg-[#001a4d] text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
            >
              <ImFileExcel className="text-xl" />
              Export to CSV
            </CSVLink>
          </div>
          
          <DataTable
            columns={columns}
            data={filteredList}
            customStyles={customStyles}
            pagination
            paginationRowsPerPageOptions={rowsPerPageOptions}
            paginationPerPage={rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            progressPending={isLoading}
            className=" overflow-hidden"
          />
          
          <DeleteConfirmation
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)} 
            onConfirm={handleDeleteUser}
          />
          
          <div className="text-start mt-6 text-gray-500">
            COPYRIGHT © 2024 My Revision+, All rights Reserved
          </div>
          
          <ScrollUpComponent/>
          
          {editMode && (
            <EditScheduleDialog
              open={editMode}
              setEditMode={setEditMode}
              userToEdit={userToEdit}
            />
          )}
        </div>
      </div>

  );
};

export default ScheduleView;