import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcSearch, FcOk } from 'react-icons/fc';
import { ImFileExcel } from 'react-icons/im';
import { FaCopy, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import monitorImage from "../../../assets/apple-monitor-screens-png-5.png"
import { useGetOnlineClassesQuery } from '../../Services/OnlineClasses/OnlineClassesApi';
import { Api } from '../../Api/Api';
import Loader from '../Routing/Loader';
import IconWithTitle from '../../utilities/IconsTittle';
import { AiOutlineFundView } from 'react-icons/ai';
import DeleteConfirmation from '../../utilities/DeleteConfirmation';
import EditOnlineClasses from '../../TeacherDashboard/onlineTeacher/EditOnlineClasses';

const ViewOnlineClass = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error, refetch } = useGetOnlineClassesQuery();
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

  const handleJoinSession = async (cls) => {
    // Check if meeting_id is already a complete URL (like Google Meet)
    if (cls.scheduleDetails.meeting_id?.startsWith('http')) {
      window.open(cls.scheduleDetails.meeting_id, '_blank');
      return;
    }
  
    // For Insta VC or similar services that need link generation
    let link = generatedLinks[cls.scheduleDetails._id];
    if (!link) {
      link = await generateMeetingLink(cls);
    }
    if (link) {
      window.open(link, '_blank');
    }
  };
  
  const generateMeetingLink = async (cls) => {
    try {
      // If it's a direct link, return it immediately
      if (cls.scheduleDetails.meeting_id?.startsWith('http')) {
        return cls.scheduleDetails.meeting_id;
      }
  
      // For Insta VC, generate the meeting link
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

  // const handleJoinSession = async (cls) => {
  //   let link = generatedLinks[cls.scheduleDetails._id];
  //   if (!link) {
  //     link = await generateMeetingLink(cls);
  //   }
  //   if (link) {
  //     window.open(link, '_blank');
  //   }
  // };

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

  const handleEditSuccess = () => {
    refetch();
    setEditDialogOpen(false);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <h6 className="text-lg font-semibold">Failed to fetch data</h6>
        <p>{error.message || 'Unknown error'}</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-[#1a73e8] text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (

      <div className="max-w-full mx-auto p-2">
        <div className=" p-6">
          <IconWithTitle
            icon={AiOutlineFundView}
            title="Online Classes"
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
                placeholder="Filter by Teacher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
            </div>
            
            <div className="flex gap-2">
              <Link
                to="/schedule-online-classes"
                className="bg-custom-primary hover:bg-[#001a4d] text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Add Class
              </Link>
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="w-full">
            <div className="flex border-b border-gray-200 mb-3">
              <button
                onClick={() => handleTabChange(0)}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm relative ${tabValue === 0 ? 'text-[#1a73e8] bg-[rgba(0,36,107,0.05)]' : 'text-gray-500'}`}
              >
                <div className="flex items-center justify-center">
                  <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${tabValue === 0 ? 'bg-[#E1E9FF]' : 'bg-gray-100'}`}>
                    <FcOk className={`text-sm ${tabValue === 0 ? 'text-[#1a73e8]' : 'text-gray-500'}`} />
                  </div>
                  <span>Upcoming</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tabValue === 0 ? 'bg-[#1a73e8] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {filteredUpcomingClasses.length}
                  </span>
                </div>
                {tabValue === 0 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-[#1a73e8]"></div>
                )}
              </button>
              
              <button
                onClick={() => handleTabChange(1)}
                className={`flex-1 py-3 px-4 text-center font-medium text-sm relative ${tabValue === 1 ? 'text-[#E63946] bg-[rgba(230,57,70,0.05)]' : 'text-gray-500'}`}
              >
                <div className="flex items-center justify-center">
                  <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 ${tabValue === 1 ? 'bg-[#FFE5E5]' : 'bg-gray-100'}`}>
                    <ImFileExcel className={`text-sm ${tabValue === 1 ? 'text-[#E63946]' : 'text-gray-500'}`} />
                  </div>
                  <span>Past</span>
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${tabValue === 1 ? 'bg-[#E63946] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {filteredPastClasses.length}
                  </span>
                </div>
                {tabValue === 1 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-[#E63946]"></div>
                )}
              </button>
            </div>

            {/* Tab Panels */}
            <div className="p-2">
              {tabValue === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
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
                    <div className="col-span-full py-6 text-center">
                      <h6 className="text-m font-semibold">No upcoming classes found</h6>
                    </div>
                  )}
                </div>
              )}

              {tabValue === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="col-span-full py-6 text-center">
                      <h6 className="text-lg font-semibold">No past classes found</h6>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <DeleteConfirmation
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={confirmDeleteClass}
            userName="this Online class entry"
          />
      

        {/* Edit Dialog */}
        {editDialogOpen && selectedClass && (
          <EditOnlineClasses
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            refetch={refetch}
            selectedClassForEdit={selectedClass}
            onSuccess={handleEditSuccess}
          />
        )}
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
    <div className="w-[105%] transition-transform duration-300 hover:-translate-y-1">
      {/* Monitor with Stand */}
      <div 
        className="relative bg-contain bg-center bg-no-repeat p-2"
        style={{
          backgroundImage: `url(${monitorImage})`,
          aspectRatio: '16/14',
          padding: '3rem',
          paddingBottom: '1rem',
          paddingTop: '3.5rem',
        }}
      >
        {/* Content Area */}
        <div className="h-full overflow-auto text-black flex flex-col">
          <div className="flex justify-between items-start">
            <span className="font-bold text-black">
              {cls.subject_id?.subject_name}
            </span>
            
            <div className="flex gap-1">
              <button 
                onClick={onEdit}
                className="text-black hover:text-blue-600 p-1"
                title="Edit"
              >
                <FaEdit className="text-sm" />
              </button>
              <button 
                onClick={onDelete}
                className="text-black hover:text-red-600 p-1"
                title="Delete"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          </div>
          
          <p className="text-sm mt-1">
            <strong>Teacher:</strong> {cls.host_id?.name || 'N/A'}
          </p>
          <p className="text-sm">
            <strong>Student:</strong> {cls.student_id?.name || 'N/A'}
          </p>
          <p className="text-sm">
            <strong>Meet Type:</strong> {cls.scheduleDetails.meet_type}
          </p>
          <p className="text-sm">
            <strong>Class Details:</strong> {cls.scheduleDetails.class_details}
          </p>
          
          {cls.scheduleDetails.calendar?.map((event, idx) => (
            <div key={idx} className="mt-2">
              <p className="text-sm">
                <strong>{isPast ? 'Held' : 'Scheduled'}:</strong> 
                {new Date(event.start_time).toLocaleString()} to {new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {!isPast ? (
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateAndJoin}
                  className={`w-full py-1 text-sm mt-1 ${isGenerating ? 'bg-gray-400' : 'text-red-500 hover:underline'}`}
                >
                  {isGenerating ? 'Generating...' : 'JOIN SESSION'}
                </button>
              ) : (
                <p className="text-sm text-black flex items-center mt-1">
                  <FcOk className="inline mr-1" />
                  Session Completed
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {!isPast && generatedLink && (
        <div className="flex items-center gap-1 mt-2 mb-1">
          <p className="text-sm flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {generatedLink}
          </p>
          <button 
            onClick={onCopy}
            className="text-black hover:text-blue-600 p-1"
            title="Copy link"
          >
            <FaCopy className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewOnlineClass;