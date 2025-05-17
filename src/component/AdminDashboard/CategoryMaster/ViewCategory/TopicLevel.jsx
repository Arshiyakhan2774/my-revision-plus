import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEditSquare } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import SearchAndExport from './Searchbar';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from '../../../Api/Api';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const TopicLevel = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTopicId, setDeleteTopicId] = useState(null);
  const [topicData, setTopicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get('categorys/topic');
        setTopicData(response.data?.data?.topics || []);
        setLoading(false);
        toast.success('Data loaded successfully');
      } catch (error) {
        console.error('Error fetching topic data:', error);
        setLoading(false);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = topicData.filter((topic) => {
      const query = searchQuery.toLowerCase();
      return (
        topic.board_info?.board_prog_name?.toLowerCase().includes(query) ||
        topic.subject_info?.subject_name?.toLowerCase().includes(query) ||
        topic.subjectlevel_info?.subject_level_name?.toLowerCase().includes(query) ||
        topic.source_info?.source_name?.toLowerCase().includes(query) ||
        topic.paper_info?.paper_name?.toLowerCase().includes(query) ||
        topic.topic_name?.toLowerCase().includes(query)
      );
    });
    setFilteredData(filtered);
  }, [searchQuery, topicData]);

  const handleEdit = (topic) => {
    setSelectedTopic({
      ...topic,
      boardID: topic.board_info._id,
      subjectID: topic.subject_info._id,
      subjectlevelID: topic.subjectlevel_info?._id,
      sourceID: topic.source_info?._id,
      paperID: topic.paper_info?._id
    });
    setTopicName(topic.topic_name);
  };

  const handleDeleteDialogOpen = (topicId) => {
    setDeleteTopicId(topicId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteTopicId(null);
    setOpenDeleteDialog(false);
  };

  const handleDeleteClick = async () => {
    try {
      await Api.delete(`categorys/topic/${deleteTopicId}`);
      setTopicData(prevData => prevData.filter(topic => topic._id !== deleteTopicId));
      setOpenDeleteDialog(false);
      toast.success('Topic deleted successfully');
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to delete topic');
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await Api.patch(
        `categorys/topic/${selectedTopic._id}`,
        {
          board_id: selectedTopic.boardID,
          subject_id: selectedTopic.subjectID,
          subject_level_id: selectedTopic.subjectlevelID,
          source_id: selectedTopic.sourceID,
          paper_id: selectedTopic.paperID,
          topic_name: topicName
        }
      );

      if (response.data?.status === "success") {
        setTopicData(prevData =>
          prevData.map(topic =>
            topic._id === selectedTopic._id ? { 
              ...topic, 
              topic_name: topicName,
              board_info: categories.categories.find(cat => cat._id === selectedTopic.boardID),
              subject_info: categories.categories
                .find(cat => cat._id === selectedTopic.boardID)
                ?.subjects?.find(sub => sub._id === selectedTopic.subjectID),
              subjectlevel_info: categories.categories
                .find(cat => cat._id === selectedTopic.boardID)
                ?.subjects?.find(sub => sub._id === selectedTopic.subjectID)
                ?.subjectlevels?.find(lvl => lvl._id === selectedTopic.subjectlevelID),
              source_info: { _id: selectedTopic.sourceID },
              paper_info: { _id: selectedTopic.paperID }
            } : topic
          )
        );
        setSelectedTopic(null);
        toast.success('Topic updated successfully');
      } else {
        throw new Error(response.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      toast.error('Failed to update topic');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setSelectedTopic(null);
  };

  const exportData = filteredData.map((topic) => ({
    'Board Name': topic.board_info?.board_prog_name || 'N/A',
    'Subject Name': topic.subject_info?.subject_name || 'N/A',
    'Subject Level': topic.subjectlevel_info?.subject_level_name || 'N/A',
    'Source': topic.source_info?.source_name || 'N/A',
    'Paper/Book': topic.paper_info?.paper_name || 'N/A',
    'Topic': topic.topic_name || 'N/A'
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
      selector: row => row.topic_name, 
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
          fileName="topic_data.csv"
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
            <p className="mb-6">Are you sure you want to delete this topic?</p>
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
      {selectedTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-full bg-custom-primary mr-3">
                <MdEditSquare className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-semibold text-blue-900">Edit Topic</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Board Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                <select
                  value={selectedTopic.boardID || ''}
                  onChange={(e) => setSelectedTopic(prev => ({ ...prev, boardID: e.target.value }))}
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
                  value={selectedTopic.subjectID || ''}
                  onChange={(e) => setSelectedTopic(prev => ({ ...prev, subjectID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories?.find(cat => cat._id === selectedTopic?.boardID)?.subjects || []).map(
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
                  value={selectedTopic.subjectlevelID || ''}
                  onChange={(e) => setSelectedTopic(prev => ({ ...prev, subjectlevelID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find(cat => cat._id === selectedTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedTopic?.subjectID)
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
                  value={selectedTopic.sourceID || ''}
                  onChange={(e) => setSelectedTopic(prev => ({ ...prev, sourceID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {(categories?.categories
                    ?.find(cat => cat._id === selectedTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedTopic?.subjectID)
                    ?.subjectlevels?.find(lvl => lvl._id === selectedTopic?.subjectlevelID)
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
                  value={selectedTopic.paperID || ''}
                  onChange={(e) => setSelectedTopic(prev => ({ ...prev, paperID: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                >
                  {categories?.categories
                    ?.find(cat => cat._id === selectedTopic?.boardID)
                    ?.subjects?.find(sub => sub._id === selectedTopic?.subjectID)
                    ?.subjectlevels?.find(lvl => lvl._id === selectedTopic?.subjectlevelID)
                    ?.sources?.find(src => src._id === selectedTopic?.sourceID)
                    ?.papers?.map((paper) => (
                      <option key={paper._id} value={paper._id}>
                        {paper.paper_name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Topic Name Input */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Name</label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
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

export default TopicLevel;