import React, { Fragment, useEffect, useState } from 'react';
import { MdEditSquare } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import SearchAndExport from './Searchbar';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';

const SubTopic = () => {
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteSubTopicId, setDeleteSubTopicId] = useState(null);
  const [subTopicData, setSubTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subTopicName, setSubTopicName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('categorys/subtopic');
        setSubTopicData(response.data?.data?.subtopics || []);
        setLoading(false);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching subtopic data:', error);
        setLoading(false);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = subTopicData.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.board_info?.board_prog_name?.toLowerCase().includes(query) ||
        item.subject_info?.subject_name?.toLowerCase().includes(query) ||
        item.subjectlevel_info?.subject_level_name?.toLowerCase().includes(query) ||
        item.source_info?.source_name?.toLowerCase().includes(query) ||
        item.paper_info?.paper_name?.toLowerCase().includes(query) ||
        item.topic_info?.topic_name?.toLowerCase().includes(query) ||
        item.subtopic_name?.toLowerCase().includes(query)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, subTopicData]);

  const handleEdit = (subtopic) => {
    setSelectedSubTopic({
      ...subtopic,
      boardID: subtopic.board_info._id,
      subjectID: subtopic.subject_info._id,
      subjectlevelID: subtopic.subjectlevel_info?._id,
      sourceID: subtopic.source_info?._id,
      paperID: subtopic.paper_info?._id,
      topicID: subtopic.topic_info?._id
    });
    setSubTopicName(subtopic.subtopic_name);
  };

  const handleDeleteDialogOpen = (subtopicId) => {
    setDeleteSubTopicId(subtopicId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteSubTopicId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    try {
      await Api.delete(`categorys/subtopic/${deleteSubTopicId}`);
      setSubTopicData(prevData => prevData.filter(subtopic => subtopic._id !== deleteSubTopicId));
      setOpenDeleteDialog(false);
      toast.success('SubTopic deleted successfully');
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      toast.error('Failed to delete subtopic');
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await Api.patch(
        `categorys/subtopic/${selectedSubTopic._id}`,
        {
          board_id: selectedSubTopic.boardID,
          subject_id: selectedSubTopic.subjectID,
          subject_level_id: selectedSubTopic.subjectlevelID,
          source_id: selectedSubTopic.sourceID,
          paper_id: selectedSubTopic.paperID,
          topic_id: selectedSubTopic.topicID,
          subtopic_name: subTopicName
        }
      );

      if (response.data?.status === "success") {
        setSubTopicData(prevData =>
          prevData.map(subtopic =>
            subtopic._id === selectedSubTopic._id ? { 
              ...subtopic, 
              subtopic_name: subTopicName,
              board_info: categories.categories.find(cat => cat._id === selectedSubTopic.boardID),
              subject_info: categories.categories
                .find(cat => cat._id === selectedSubTopic.boardID)
                ?.subjects?.find(sub => sub._id === selectedSubTopic.subjectID),
              subjectlevel_info: categories.categories
                .find(cat => cat._id === selectedSubTopic.boardID)
                ?.subjects?.find(sub => sub._id === selectedSubTopic.subjectID)
                ?.subjectlevels?.find(lvl => lvl._id === selectedSubTopic.subjectlevelID),
              source_info: { _id: selectedSubTopic.sourceID },
              paper_info: { _id: selectedSubTopic.paperID },
              topic_info: { _id: selectedSubTopic.topicID }
            } : subtopic
          )
        );
        setSelectedSubTopic(null);
        toast.success('SubTopic updated successfully');
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating subtopic:", error);
      toast.error('Failed to update subtopic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedSubTopic(null);
  };

  const exportData = filteredData.map((subtopic) => ({
    'Board Name': subtopic.board_info?.board_prog_name || 'N/A',
    'Subject Name': subtopic.subject_info?.subject_name || 'N/A',
    'Subject Level': subtopic.subjectlevel_info?.subject_level_name || 'N/A',
    'Source': subtopic.source_info?.source_name || 'N/A',
    'Paper/Book': subtopic.paper_info?.paper_name || 'N/A',
    'Topic': subtopic.topic_info?.topic_name || 'N/A',
    'SubTopic': subtopic.subtopic_name || 'N/A'
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
      sortable: true,
      center: true
    },
    { 
      name: 'Subject Name', 
      selector: row => row.subject_info?.subject_name, 
      sortable: true,
      center: true
    },
    { 
      name: 'Subject Level', 
      selector: row => row.subjectlevel_info?.subject_level_name, 
      sortable: true,
      center: true
    },
    { 
      name: 'Source', 
      selector: row => row.source_info?.source_name, 
      sortable: true,
      center: true
    },
    { 
      name: 'Paper/Book', 
      selector: row => row.paper_info?.paper_name, 
      sortable: true,
      center: true
    },
    { 
      name: 'Topic', 
      selector: row => row.topic_info?.topic_name, 
      sortable: true,
      center: true
    },
    { 
      name: 'SubTopic', 
      selector: row => row.subtopic_name, 
      sortable: true,
      center: true
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
      center: true,
      ignoreRowClick: true,
      allowOverflow: true
    }
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
          fileName="subtopic_data.csv"
        />

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          customStyles={customStyles}
          pagination
          highlightOnHover
          striped
          responsive
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
            <p className="mb-6">Are you sure you want to delete this subtopic?</p>
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
      {selectedSubTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-custom-primary mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit SubTopic</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Board Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <select
                  value={selectedSubTopic.boardID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, boardID: e.target.value }))}
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
                  value={selectedSubTopic.subjectID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, subjectID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories?.find(cat => cat._id === selectedSubTopic?.boardID)?.subjects || []).map(
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
                  value={selectedSubTopic.subjectlevelID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, subjectlevelID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find(cat => cat._id === selectedSubTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedSubTopic?.subjectID)
                    ?.subjectlevels || []).map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.subject_level_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={selectedSubTopic.sourceID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, sourceID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find(cat => cat._id === selectedSubTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedSubTopic?.subjectID)
                    ?.subjectlevels?.find(lvl => lvl._id === selectedSubTopic?.subjectlevelID)
                    ?.sources || []).map((source) => (
                      <option key={source._id} value={source._id}>
                        {source.source_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Paper Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paper</label>
                <select
                  value={selectedSubTopic.paperID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, paperID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {categories?.categories
                    ?.find(cat => cat._id === selectedSubTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedSubTopic?.subjectID)
                    ?.subjectlevels?.find(lvl => lvl._id === selectedSubTopic?.subjectlevelID)
                    ?.sources?.find(src => src._id === selectedSubTopic?.sourceID)
                    ?.papers?.map((paper) => (
                      <option key={paper._id} value={paper._id}>
                        {paper.paper_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <select
                  value={selectedSubTopic.topicID || ''}
                  onChange={(e) => setSelectedSubTopic(prev => ({ ...prev, topicID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {categories?.categories
                    ?.find(cat => cat._id === selectedSubTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedSubTopic?.subjectID)
                    ?.subjectlevels?.find(lvl => lvl._id === selectedSubTopic?.subjectlevelID)
                    ?.sources?.find(src => src._id === selectedSubTopic?.sourceID)
                    ?.papers?.find(paper => paper._id === selectedSubTopic?.paperID)
                    ?.topics?.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.topic_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* SubTopic Name Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SubTopic Name</label>
                <input
                  type="text"
                  value={subTopicName}
                  onChange={(e) => setSubTopicName(e.target.value)}
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

export default SubTopic;