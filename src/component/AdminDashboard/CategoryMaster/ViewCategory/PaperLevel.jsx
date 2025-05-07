import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEditSquare } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';

import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from '../../../Api/Api';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import SearchAndExport from './Searchbar';

const PaperLevel = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletePaperId, setDeletePaperId] = useState(null);
  const [paperData, setPaperData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperName, setPaperName] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('categorys/paper');
        setPaperData(response.data?.data?.papers || []);
        setLoading(false);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching paper data:', error);
        setLoading(false);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = paperData.filter((item) =>
      item.paper_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.board_info?.board_prog_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject_info?.subject_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source_info?.source_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchQuery, paperData]);

  const handleEdit = (paper) => {
    setSelectedPaper({
      ...paper,
      boardID: paper.board_info._id,
      subjectID: paper.subject_info._id,
      subjectlevelID: paper.subjectlevel_info?._id,
      sourceID: paper.source_info?._id
    });
    setPaperName(paper.paper_name);
  };

  const handleDeleteDialogOpen = (paperId) => {
    setDeletePaperId(paperId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeletePaperId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    try {
      await Api.delete(`categorys/paper/${deletePaperId}`);
      setPaperData(prevData => prevData.filter(paper => paper._id !== deletePaperId));
      setOpenDeleteDialog(false);
      toast.success('Paper deleted successfully');
    } catch (error) {
      console.error("Error deleting paper:", error);
      toast.error('Failed to delete paper');
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await Api.patch(
        `categorys/paper/${selectedPaper._id}`,
        {
          board_id: selectedPaper.boardID,
          subject_id: selectedPaper.subjectID,
          subject_level_id: selectedPaper.subjectlevelID,
          source_id: selectedPaper.sourceID,
          paper_name: paperName
        }
      );

      if (response.data?.status === "success") {
        setPaperData(prevData =>
          prevData.map(paper =>
            paper._id === selectedPaper._id ? { 
              ...paper, 
              paper_name: paperName,
              board_info: categories.categories.find(cat => cat._id === selectedPaper.boardID),
              subject_info: categories.categories
                .find(cat => cat._id === selectedPaper.boardID)
                ?.subjects?.find(sub => sub._id === selectedPaper.subjectID),
              subjectlevel_info: categories.categories
                .find(cat => cat._id === selectedPaper.boardID)
                ?.subjects?.find(sub => sub._id === selectedPaper.subjectID)
                ?.subjectlevels?.find(lvl => lvl._id === selectedPaper.subjectlevelID),
              source_info: { _id: selectedPaper.sourceID }
            } : paper
          )
        );
        setSelectedPaper(null);
        toast.success('Paper updated successfully');
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating paper:", error);
      toast.error('Failed to update paper');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedPaper(null);
  };

  const exportData = filteredData.map((paper) => ({
    'Board Name': paper.board_info?.board_prog_name || 'N/A',
    'Subject Name': paper.subject_info?.subject_name || 'N/A',
    'Subject Level': paper.subjectlevel_info?.subject_level_name || 'N/A',
    'Source': paper.source_info?.source_name || 'N/A',
    'Paper/Book': paper.paper_name || 'N/A'
  }));

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
      selector: row => row.board_info?.board_prog_name, 
      sortable: true 
    },
    { 
      name: 'Subject Name', 
      selector: row => row.subject_info?.subject_name, 
      sortable: true 
    },
    { 
      name: 'Subject Level', 
      selector: row => row.subjectlevel_info?.subject_level_name, 
      sortable: true 
    },
    { 
      name: 'Source', 
      selector: row => row.source_info?.source_name, 
      sortable: true 
    },
    { 
      name: 'Paper/Book', 
      selector: row => row.paper_name, 
      sortable: true 
    },
    {
      name: 'Action',
      cell: row => (
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }

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
          fileName="paper_data.csv"
        />

        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          progressPending={loading}
          highlightOnHover
          responsive
          striped
          customStyles={customStyles}
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
            <h3 className="text-lg font-medium text-red-500 mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this paper?</p>
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

      {/* Edit Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-blue-900 mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit Paper</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Board Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <select
                  value={selectedPaper.boardID || ''}
                  onChange={(e) => setSelectedPaper(prev => ({ ...prev, boardID: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedPaper.subjectID || ''}
                  onChange={(e) => setSelectedPaper(prev => ({ ...prev, subjectID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories?.find(cat => cat._id === selectedPaper?.boardID)?.subjects || []).map(
                    (subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.subject_name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Subject Level Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Level</label>
                <select
                  value={selectedPaper.subjectlevelID || ''}
                  onChange={(e) => setSelectedPaper(prev => ({ ...prev, subjectlevelID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find(cat => cat._id === selectedPaper?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedPaper?.subjectID)
                    ?.subjectlevels || []).map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.subject_level_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Paper Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper Name</label>
                <input
                  type="text"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
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
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 flex items-center justify-center min-w-20"
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

export default PaperLevel;