import { Fragment, useEffect, useMemo, useState } from 'react';
import { MdEditSquare } from 'react-icons/md';
import { CSVLink } from 'react-csv';
import DataTable from 'react-data-table-component';
import { ImFileExcel } from 'react-icons/im';
import { FcSearch } from 'react-icons/fc';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';

const SubjectLevel = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [teacherData, setTeacherData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [subjectLevelName, setSubjectLevelName] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('categorys/subjectlevel');
        setTeacherData(response.data?.data?.subjectlevels || []);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = teacherData;
    
    if (selectedBoard) {
      filtered = filtered.filter(item => item.board_info._id === selectedBoard);
    }
    if (selectedSubject) {
      filtered = filtered.filter(item => item.subject_info._id === selectedSubject);
    }
    if (selectedSubjectLevel) {
      filtered = filtered.filter(item => item.subject_level_name === selectedSubjectLevel);
    }
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.subject_level_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.board_info.board_prog_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject_info.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
  }, [selectedBoard, selectedSubject, selectedSubjectLevel, searchQuery, teacherData]);

  const exportData = useMemo(() => {
    return filteredData.map((subjectLevel) => ({
      ID: subjectLevel._id,
      Board: subjectLevel.board_info?.board_prog_name || "N/A",
      Subject: subjectLevel.subject_info?.subject_name || "N/A",
      SubjectLevel: subjectLevel.subject_level_name || "N/A",
    }));
  }, [filteredData]);

 

  const handleEdit = (teacher) => {
    setSelectedTeacher({
      ...teacher,
      boardID: teacher.board_info._id,
      subjectID: teacher.subject_info._id,
    });
    setSubjectLevelName(teacher.subject_level_name);
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
      await Api.delete(`categorys/subjectlevel/${deleteTeacherId}`);
      setTeacherData((prevData) => prevData.filter((teacher) => teacher._id !== deleteTeacherId));
      setOpenDeleteDialog(false);
      setDeleteSuccessDialogOpen(true);
      toast.success('Subject level deleted successfully');
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error('Failed to delete subject level');
    }
  };

  const handleDeleteSuccessDialogClose = () => {
    setDeleteSuccessDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await Api.patch(
        `/categorys/subjectlevel/${selectedTeacher._id}`,
        {
          board_id: selectedTeacher.boardID,
          subject_id: selectedTeacher.subjectID,
          subject_level_name: subjectLevelName,
        }
      );

      if (response.data && response.data.status === 'success') {
        setTeacherData((prevData) =>
          prevData.map((teacher) =>
            teacher._id === selectedTeacher._id ? { ...teacher, subject_level_name: subjectLevelName } : teacher
          )
        );
        setSelectedTeacher(null);
        toast.success('Subject level updated successfully');
      } else {
        console.error("Edit API failed:", response.data?.message || "Unknown error");
        toast.error('Failed to update subject level');
      }
    } catch (error) {
      console.error("Error updating subject level:", error);
      toast.error('Failed to update subject level');
    }
  };

  const handleClose = () => {
    setSelectedTeacher(null);
  };

  const columns = [
    { name: 'Board Name', selector: row => row.board_info.board_prog_name, sortable: true },
    { name: 'Subject Name', selector: row => row.subject_info.subject_name, sortable: true },
    { name: 'Subject Level', selector: row => row.subject_level_name, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteDialogOpen(row._id)}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            aria-label="Delete"
          >
            <RiDeleteBin6Line className="text-red-600 text-xl" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
            aria-label="Edit"
          >
            <CiEdit className="text-blue-800 text-xl" />
          </button>
        </div>
      )
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#1a73e8',
        color: 'white',
        textAlign: 'center',
      },
    },
  }

  if (isLoading) {
    return   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
  }

  return (
    <Fragment>
      {/* Toast Container */}
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
        {/* Search and Export */}
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
            filename="subject_levels.csv" 
            className="inline-flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 transition-colors"
            aria-label="Export to CSV"
          >
            <ImFileExcel className="mr-2 text-xl" />
            Export
          </CSVLink>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={customStyles}
          pagination
          highlightOnHover
          striped
        />

        <div className="text-start mt-6 text-gray-500">
          COPYRIGHT © 2024 My Revision+, All rights Reserved
        </div>
        
        <ScrollUpComponent/>
      </div>

      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-red-500 mb-4">Delete Subject Level</h3>
            <p className="mb-6">Are you sure you want to delete this subject level?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteDialogClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Dialog */}
      {deleteSuccessDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-green-500 mb-4">Success</h3>
            <p className="mb-6">Subject level deleted successfully!</p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteSuccessDialogClose}
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-blue-900 mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit Subject Level</h3>
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
                >
                  {categories.categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.board_prog_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  value={selectedTeacher.subjectID}
                  onChange={(e) =>
                    setSelectedTeacher({ ...selectedTeacher, subjectID: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories.categories.find((cat) => cat._id === selectedTeacher?.boardID)?.subjects || []).map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subjectLevelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Level Name
                </label>
                <input
                  id="subjectLevelName"
                  type="text"
                  value={subjectLevelName}
                  onChange={(e) => setSubjectLevelName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800"
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

export default SubjectLevel;