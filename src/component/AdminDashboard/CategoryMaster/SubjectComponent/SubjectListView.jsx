import { Fragment, useMemo, useState } from "react";
import DataTable from "react-data-table-component";

import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { ImFileExcel } from "react-icons/im";
import { MdEditSquare } from "react-icons/md";
import { CSVLink } from "react-csv";
import { FcSearch } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDeleteSubjectMutation, useGetCategoryListQuery, useGetSubjectsQuery } from "../../../Services/Category/CategoryApi";
import { Api } from "../../../Api/Api";
import ScrollUpComponent from "../../../utilities/ScroolupComponent";
import DeleteConfirmation from "../../../utilities/DeleteConfirmation";

const Subject = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesData, error: categoryError, isLoading: categoryLoading } = useGetCategoryListQuery();
  const { data: subjectsData, error: subjectError, isLoading: subjectLoading, refetch } = useGetSubjectsQuery();
  const [deleteSubject] = useDeleteSubjectMutation();

  const categories = categoriesData?.data?.categories || [];
  const subjects = subjectsData?.data?.subjects || [];

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) =>
      subject?.subject_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subjects]);

  const exportData = useMemo(() => {
    return filteredSubjects.map((subject) => ({
      ID: subject._id,
      Board: subject.board_info.board_prog_name || "N/A",
      Subject: subject.subject_name || "N/A",
    }));
  }, [filteredSubjects]);

  const handleEdit = (teacher) => {
    setSelectedTeacher({
      ...teacher,
      boardID: teacher.board_info._id,
    });
    setSubjectName(teacher.subject_name);
  };

  const handleDeleteDialogOpen = (teacherId) => {
    setDeleteTeacherId(teacherId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteTeacherId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    try {
      const result = await deleteSubject(deleteTeacherId).unwrap();
      toast.success("Subject deleted successfully!");
      handleDeleteDialogClose();
      refetch();
      return result; // Ensure you return the result
    } catch (error) {
      toast.error("Failed to delete subject");
      console.error("Error deleting subject:", error);
      throw error; // Re-throw the error
    }
  };

  const handleSaveEdit = async () => {
    try {
      await Api.patch(
        `categorys/subject/${selectedTeacher._id}`,
        {
          id: selectedTeacher._id,
          board_id: selectedTeacher.boardID,
          subject_name: subjectName,
        }
      );
      toast.success("Subject updated successfully!");
      refetch();
      setSelectedTeacher(null);
    } catch (error) {
      toast.error("Failed to update subject");
      console.error("Error updating subject:", error);
      // Make sure to return something even in error cases
      return Promise.reject(error);
    }
  };

  if (categoryLoading || subjectLoading) {
    return  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  }

  if (categoryError || subjectError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error loading data.</div>;
  }

  const handleClose = () => setSelectedTeacher(null);

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#1a73e8',
        color: 'white',
        textAlign: 'center',
      },
    },
  };

  const columns = [
    {
      name: "Board Name",
      selector: (row) => row.board_info.board_prog_name,
      sortable: true,
    },
    {
      name: "Subject Name",
      selector: (row) => row.subject_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteDialogOpen(row._id)}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            aria-label="Delete subject"
          >
            <RiDeleteBin6Line className="text-red-600 text-xl" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            aria-label="Edit subject"
          >
            <CiEdit className="text-blue-800 text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="container mx-auto px-4 mt-4 max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Filter by Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
              aria-label="Search subjects"
            />
            <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
          </div>
          <CSVLink 
            data={exportData} 
            filename={"subject_list.csv"} 
            className="inline-flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 transition-colors"
            aria-label="Export to CSV"
          >
            <ImFileExcel className="mr-2 text-xl" />
            Export
          </CSVLink>
        </div>

        <DataTable
          columns={columns}
          data={filteredSubjects}
          customStyles={customStyles}
          pagination
          highlightOnHover
          striped
          noDataComponent="No subjects found"
        />

        <div className="text-start mt-6 text-gray-500">
          COPYRIGHT © 2024 My Revision+, All rights Reserved
        </div>
        <ScrollUpComponent/>
      </div>

      <DeleteConfirmation
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteClick}
        userName={subjects.find(sub => sub._id === deleteTeacherId)?.subject_name || "this subject"}
      />

      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-custom-primary mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit Subject</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                  Board
                </label>
                <select
                  id="board"
                  value={selectedTeacher.boardID}
                  onChange={(e) =>
                    setSelectedTeacher({ ...selectedTeacher, boardID: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  aria-label="Select board"
                >
                  {categories.map((board) => (
                    <option key={board._id} value={board._id}>
                      {board.board_prog_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  id="subjectName"
                  type="text"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Subject name"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800"
                aria-label="Save changes"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Subject;