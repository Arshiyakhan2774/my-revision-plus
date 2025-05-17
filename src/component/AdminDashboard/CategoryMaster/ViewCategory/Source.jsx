import { Fragment, useEffect, useState } from 'react';
import { MdEditSquare } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import SearchAndExport from './Searchbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import DataTable from 'react-data-table-component';

const Source = () => {
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const teachersPerPage = 15;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTeacherId, setDeleteTeacherId] = useState(null);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [sourceName1, setSourceName1] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { data: { data: categories } = {}, } = useGetCategoryListQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('categorys/source');
        setTeacherData(response.data?.data?.sources || []);
        setLoading(false);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        toast.error('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleEdit = (teacher) => {
    setSelectedTeacher({
      ...teacher,
      boardID: teacher.board_info._id,
      subjectID: teacher.subject_info._id,
      subjectlevelID: teacher.subjectlevel_info?._id,
    });
    setSourceName1(teacher.source_name);
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
      await Api.delete(`categorys/source/${deleteTeacherId}`);
      setTeacherData((prevData) => prevData.filter((teacher) => teacher._id !== deleteTeacherId));
      setOpenDeleteDialog(false);
      setDeleteSuccessDialogOpen(true);
      toast.success('Source deleted successfully');
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete source');
    }
  };

  const handleDeleteSuccessDialogClose = () => {
    setDeleteSuccessDialogOpen(false);
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await Api.patch(`categorys/source/${selectedTeacher._id}`, {
        board_id: selectedTeacher.boardID,
        subject_id: selectedTeacher.subjectID,
        subject_level_id: selectedTeacher.subjectlevelID,
        source_name: sourceName1,
      });

      if (response.data && response.data.status === 'success') {
        setTeacherData((prevData) =>
          prevData.map((teacher) =>
            teacher._id === selectedTeacher._id ? { ...teacher, source_name: sourceName1 } : teacher
          )
        );
        setSelectedTeacher(null);
        setSourceName1('');
        toast.success('Source updated successfully');
      } else {
        console.error('Edit API failed:', response.data?.message || 'Unknown error');
        toast.error('Failed to update source');
      }
    } catch (error) {
      console.error('Error updating source:', error);
      toast.error('Failed to update source');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData = teacherData.filter(
    (teacher) =>
      teacher.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject_info?.subject_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.board_info?.board_prog_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjectlevel_info?.subject_level_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const exportData = filteredData.map((teacher) => ({
    "Board Name": teacher.board_info?.board_prog_name || "N/A",
    "Subject Name": teacher.subject_info?.subject_name || "N/A",
    "Subject Level": teacher.subjectlevel_info?.subject_level_name || "N/A",
    "Source": teacher.source_name || "N/A",
  }));
  
  const handleClose = () => {
    setSelectedTeacher(null);
  };

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
      name: 'Board Name',
      selector: (row) => row.board_info?.board_prog_name,
      sortable: true,
    },
    {
      name: 'Subject Name',
      selector: (row) => row.subject_info?.subject_name,
      sortable: true,
    },
    {
      name: 'Subject Level',
      selector: (row) => row.subjectlevel_info?.subject_level_name,
      sortable: true,
    },
    {
      name: 'Source',
      selector: (row) => row.source_name,
      sortable: true,
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleDeleteDialogOpen(row._id)}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
          >
            <RiDeleteBin6Line className="text-red-600 text-xl" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
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
        <SearchAndExport
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          exportData={exportData} 
          fileName="source.csv" 
        />

        <DataTable
          columns={columns}
          data={filteredData.slice((page - 1) * teachersPerPage, page * teachersPerPage)}
          customStyles={customStyles}
          pagination
          progressPending={loading}
          highlightOnHover
          striped
        />

<div className="text-start mt-6 text-gray-500">
          COPYRIGHT © 2024 My Revision+, All rights Reserved
        </div>
        
        <ScrollUpComponent/>
      </div>

      {/* Delete Confirmation Dialog */}
      {openDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-red-500 mb-4">Delete Source</h3>
            <p className="mb-6">Are you sure you want to delete this source?</p>
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
            <p className="mb-6">Source deleted successfully!</p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteSuccessDialogClose}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800"
              >
                OK
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
              <div className="p-2 rounded-full bg-custom-primary mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit Source</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Board Selection */}
                <div>
                  <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                    Board
                  </label>
                  <select
                    id="board"
                    value={selectedTeacher?.boardID || ''}
                    onChange={(e) =>
                      setSelectedTeacher({ ...selectedTeacher, boardID: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  >
                    {categories?.categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.board_prog_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject Selection */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={selectedTeacher?.subjectID || ''}
                    onChange={(e) =>
                      setSelectedTeacher({ ...selectedTeacher, subjectID: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  >
                    {(categories?.categories?.find((cat) => cat._id === selectedTeacher?.boardID)?.subjects || []).map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Level Selection */}
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Level
                </label>
                <select
                  id="level"
                  value={selectedTeacher?.subjectlevelID || ''}
                  onChange={(e) =>
                    setSelectedTeacher({ ...selectedTeacher, subjectlevelID: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find((category) => category._id === selectedTeacher?.boardID)
                    ?.subjects?.find((subject) => subject._id === selectedTeacher?.subjectID)
                    ?.subjectlevels || []
                  ).map((level) => (
                    <option key={level._id} value={level._id}>
                      {level.subject_level_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source Name */}
              <div>
                <label htmlFor="sourceName" className="block text-sm font-medium text-gray-700 mb-1">
                  Source Name
                </label>
                <input
                  id="sourceName"
                  type="text"
                  value={sourceName1}
                  onChange={(e) => setSourceName1(e.target.value)}
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
                disabled={isSaving}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 flex items-center justify-center min-w-20"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Source;