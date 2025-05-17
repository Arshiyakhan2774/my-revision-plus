import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcSearch, FcOk } from 'react-icons/fc';
import { ImFileExcel } from 'react-icons/im';
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';

import { AiOutlineFundView } from 'react-icons/ai';

import monitorImage from "../../../assets/apple-monitor-screens-png-5.png";
import { useGetOnlineClassesTeacherQuery } from '../../Services/OnlineClasses/OnlineClassesApi';
import { Api } from '../../Api/Api';
import IconWithTitle from '../../utilities/IconsTittle';
import BackButton from '../../utilities/BackButrton';
import Loader from '../../AdminDashboard/Routing/Loader';
import EditOnlineClasses from './EditOnlineClasses';

const OnlineListTeacher = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const userResponse = useSelector(state => state.idSlice.userResponse);
  const { data, isLoading, error, refetch } = useGetOnlineClassesTeacherQuery(userResponse?._id);
  const [classesData, setClassesData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [generatedLinks, setGeneratedLinks] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (data) {
      if (data.status === 'success' && data.data?.transformedData) {
        setClassesData(data.data.transformedData);
      } else {
        toast.error('No data available');
      }
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(`API Error: ${error.message || 'Failed to fetch data'}`);
    }
  }, [error]);

  // Process classes data
  const upcomingClasses = classesData.filter(cls => 
    cls.upcoming_schedule?.length > 0
  ).flatMap(cls => 
    cls.upcoming_schedule.map(schedule => ({ 
      ...cls, 
      scheduleDetails: schedule,
      type: 'upcoming'
    }))
  );
  
  const pastClasses = classesData.filter(cls => 
    cls.past_schedule?.length > 0
  ).flatMap(cls => 
    cls.past_schedule.map(schedule => ({ 
      ...cls, 
      scheduleDetails: schedule,
      type: 'past'
    }))
  );

  const filteredUpcomingClasses = upcomingClasses.filter(cls =>
    cls?.host_id?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPastClasses = pastClasses.filter(cls =>
    cls?.host_id?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const generateMeetingLink = async (cls) => {
    try {
      const payload = {
        online_id: cls.scheduleDetails._id,
        uid: cls.host_id?.email,
        session_id: cls.scheduleDetails.meeting_id,
        display_name: cls.scheduleDetails.class_details
      };

      const response = await Api.post('/onlineclass/create-url', payload);
      const link = response.data?.data?.onlineclass; 
      
      if (link) { 
        setGeneratedLinks(prev => ({
          ...prev,
          [cls.scheduleDetails._id]: link
        }));
        return link;
      }
      throw new Error('No link generated');
    } catch (err) {
      toast.error('Failed to generate meeting link');
      console.error(err);
      return null;
    }
  };

  const handleJoinSession = async (cls) => {
    let link = generatedLinks[cls.scheduleDetails._id];
    if (!link) {
      link = await generateMeetingLink(cls);
    }
    if (link) {
      window.open(link, '_blank');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const handleDeleteClass = (cls) => {
    setSelectedClass(cls);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClass = async () => {
    if (!selectedClass) return;
    
    try {
      await Api.delete(`/onlineclass/${selectedClass.scheduleDetails._id}`);
      toast.success('Class deleted successfully');
      refetch();
    } catch (err) {
      toast.error('Failed to delete class');
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClass = (cls) => {
    setSelectedClass(cls);
    setEditDialogOpen(true);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Failed to fetch data</h2>
        <p>{error.message || 'Unknown error'}</p>
        <button 
          onClick={refetch}
          className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-5 max-w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <IconWithTitle
          icon={AiOutlineFundView}
          title="Online Classes"
          iconColor="white"
          backgroundColor="#00246B"
          iconSize="30px"
          titleColor="#00246B"
          titleFontSize="34px"
        />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filter by Teacher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" />
          </div>
          <Link
            to="/schedule-online-classes"
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
          >
            Add Class
          </Link>
        </div>

        {/* Tabbed Interface */}
        <div className="w-full mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange(0)}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${tabValue === 0 ? 'text-blue-900 bg-blue-50 border-b-2 border-blue-900' : 'text-gray-500 hover:text-blue-900'}`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center ${tabValue === 0 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <FcOk className={`text-sm ${tabValue === 0 ? 'text-blue-900' : 'text-gray-500'}`} />
              </div>
              Upcoming
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tabValue === 0 ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {filteredUpcomingClasses.length}
              </span>
            </button>
            <button
              onClick={() => handleTabChange(1)}
              className={`flex-1 py-4 px-6 text-center font-medium text-sm flex items-center justify-center gap-2 transition-colors ${tabValue === 1 ? 'text-red-600 bg-red-50 border-b-2 border-red-600' : 'text-gray-500 hover:text-red-600'}`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center ${tabValue === 1 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <ImFileExcel className={`text-sm ${tabValue === 1 ? 'text-red-600' : 'text-gray-500'}`} />
              </div>
              Past
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tabValue === 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                {filteredPastClasses.length}
              </span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="mt-4">
            {/* Upcoming Classes */}
            <div className={tabValue === 0 ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {filteredUpcomingClasses.length > 0 ? (
                  filteredUpcomingClasses.map((cls) => (
                    <MonitorCard 
                      key={`${cls._id}-${cls.scheduleDetails._id}`}
                      cls={cls} 
                      generatedLink={generatedLinks[cls.scheduleDetails._id]}
                      onJoin={() => handleJoinSession(cls)}
                      onCopy={() => copyToClipboard(generatedLinks[cls.scheduleDetails._id])}
                      onEdit={() => handleEditClass(cls)}
                      onDelete={() => handleDeleteClass(cls)}
                      generateLink={() => generateMeetingLink(cls)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <h3 className="text-lg font-semibold">No upcoming classes found</h3>
                  </div>
                )}
              </div>
            </div>

            {/* Past Classes */}
            <div className={tabValue === 1 ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {filteredPastClasses.length > 0 ? (
                  filteredPastClasses.map((cls) => (
                    <MonitorCard 
                      key={`${cls._id}-${cls.scheduleDetails._id}`}
                      cls={cls} 
                      isPast={true}
                      onEdit={() => handleEditClass(cls)}
                      onDelete={() => handleDeleteClass(cls)}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <h3 className="text-lg font-semibold">No past classes found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this class?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteClass}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <BackButton/>
      </div>

      <EditOnlineClasses
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        refetch={refetch}
        selectedClassForEdit={selectedClass}
      />

      <ToastContainer />
    </div>
  );
};

const MonitorCard = ({ 
  cls, 
  generatedLink, 
  isPast = false,
  onJoin, 
  onCopy, 
  onEdit, 
  onDelete,
  generateLink,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAndJoin = async () => {
    setIsGenerating(true);
    try {
      await generateLink();
      onJoin();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto transition-transform hover:-translate-y-1">
      {/* Monitor with Content */}
      <div 
        className="relative bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${monitorImage})`,
          aspectRatio: '10/9',
          padding: '1.5rem',
          paddingBottom: '1rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}
      >
        {/* Content Area */}
        <div className="h-full flex flex-col text-black">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-black">
              {cls.subject_id?.subject_name}
            </h4>
            <div className="flex gap-1">
              <button 
                onClick={onEdit}
                className="text-black hover:text-blue-600 p-1"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button 
                onClick={onDelete}
                className="text-black hover:text-red-600 p-1"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
          
          <p className="text-sm mt-1">
            <span className="font-semibold">Teacher:</span> {cls.host_id?.name || 'N/A'}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Student:</span> {cls.student_id?.name || 'N/A'}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Class Details:</span> {cls.scheduleDetails.class_details}
          </p>
          
          {cls.scheduleDetails.calendar?.map((event, idx) => (
            <div key={idx} className="mt-2">
              <p className="text-sm">
                <span className="font-semibold">{isPast ? 'Held' : 'Scheduled'}:</span>
                {new Date(event.start_time).toLocaleString()} to {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {!isPast ? (
                <button
                  onClick={handleGenerateAndJoin}
                  disabled={isGenerating}
                  className={`w-full py-1 text-sm mt-2 ${isGenerating ? 'bg-gray-400' : 'text-red-600 hover:underline'}`}
                >
                  {isGenerating ? 'Generating...' : 'JOIN SESSION'}
                </button>
              ) : (
                <p className="text-sm text-black flex items-center mt-2">
                  <FcOk className="mr-1" />
                  Session Completed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {!isPast && generatedLink && (
        <div className="flex items-center gap-2 mt-2 mb-1">
          <p className="text-sm truncate flex-1">
            {generatedLink}
          </p>
          <button 
            onClick={onCopy}
            className="text-black hover:text-blue-600 p-1"
            title="Copy link"
          >
            <FaCopy />
          </button>
        </div>
      )}
    </div>
  );
};

export default OnlineListTeacher;