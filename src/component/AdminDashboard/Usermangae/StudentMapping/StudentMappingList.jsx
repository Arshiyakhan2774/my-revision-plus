import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import { ImFileExcel } from "react-icons/im";
import { FcSearch } from "react-icons/fc";
import { useDeleteStudentMappingMutation, useGetStudentMappingQuery } from "../../../Services/UserMangae/UserMangeSlice";
import StudentMappingAdd from "./StudentMapingAdd";
import { toast, ToastContainer } from "react-toastify";
import ScrollUpComponent from "../../../utilities/ScroolupComponent";
import DeleteConfirmation from "../../../utilities/DeleteConfirmation";
import 'react-toastify/dist/ReactToastify.css';
import { PiStudentLight } from "react-icons/pi";
import IconWithTitle from "../../../utilities/IconsTittle";

const StudentMappingList = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteMappingId, setDeleteMappingId] = useState(null);
  const [filterText, setFilterText] = useState("");

  const { data: mappingData, refetch } = useGetStudentMappingQuery();
  const [deleteStudentMapping] = useDeleteStudentMappingMutation();

  const studentMappingData = mappingData?.data?.result || [];
  const filteredData = studentMappingData.filter((item) => {
    const searchTerm = filterText.toLowerCase();
    return (
      item.student_info?.name.toLowerCase().includes(searchTerm) ||
      item.teacher_info?.name.toLowerCase().includes(searchTerm) ||
      item.board_info?.board_prog_name.toLowerCase().includes(searchTerm) ||
      item.subject_info?.subject_name.toLowerCase().includes(searchTerm) ||
      item.subjectlevel_info?.subject_level_name.toLowerCase().includes(searchTerm)
    );
  });

  const handleDeleteDialogOpen = (mappingId) => {
    setDeleteMappingId(mappingId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteMappingId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    if (deleteMappingId) {
      try {
        await deleteStudentMapping(deleteMappingId).unwrap();
        refetch();
      toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting mapping:", error);
      toast.error("Error deleting user");
      }
    }
    setOpenDeleteDialog(false);
  };

  const columns = [
    {
      name: "Student Name",
      selector: (row) => row.student_info?.name || "N/A",
      sortable: true,
    },
    {
      name: "Teacher Name",
      selector: (row) => row.teacher_info?.name || "N/A",
      sortable: true,
    },
    {
      name: "Board",
      selector: (row) => row.board_info?.board_prog_name || "N/A",
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject_info?.subject_name || "N/A",
      sortable: true,
    },
    {
      name: "Subject Level",
      selector: (row) => row.subjectlevel_info?.subject_level_name || "N/A",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleDeleteDialogOpen(row._id)}
            className="text-red-500 hover:text-red-700"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#1a73e8",
        color: "white",
      },
    },
    headCells: {
      style: {
        textAlign: "center",
      },
    },
    cells: {
      style: {
        textAlign: "center",
      },
    },
  };

  return (
   <div className="w-full px-4 sm:px-6 lg:px-8">
     <IconWithTitle
        icon={PiStudentLight}
        title="Student Details"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />
      <StudentMappingAdd refetch={refetch} />
      
      
          <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full md:w-80 pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            </div>
            <CSVLink
              data={filteredData.map(item => ({
                student_name: item.student_info?.name || "N/A",
                teacher_name: item.teacher_info?.name || "N/A",
                board_name: item.board_info?.board_prog_name || "N/A",
                subject_name: item.subject_info?.subject_name || "N/A",
                subject_level_name: item.subjectlevel_info?.subject_level_name || "N/A",
              }))}
              filename="student_mapping.csv"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ImFileExcel className="h-5 w-5" />
              <span>Export</span>
            </CSVLink>
          </div>
          
          <div className="w-full overflow-x-auto">
            <DataTable
              columns={columns}
              data={filteredData}
              customStyles={customStyles}
              pagination
          
              paginationTotalRows={filteredData.length}
              
              highlightOnHover
              className="border border-gray-200 rounded-lg"
            />
          </div>
          
          <div className="text-left mt-6 text-gray-500 text-sm">
            COPYRIGHT © 2024 My Revision+, All rights Reserved
          </div>
          <ScrollUpComponent />
    
  

      {/* Delete Dialog */}
      <DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteClick}
      />
        <ToastContainer/>
</div>
    
  );
};

export default StudentMappingList;