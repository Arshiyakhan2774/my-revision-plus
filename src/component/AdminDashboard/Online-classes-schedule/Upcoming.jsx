import { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Container,
  Pagination,
  IconButton,
  Tooltip,
  Box,
  Button,
} from '@mui/material';
import axios from 'axios';
import LayoutPage from '../../../Utilities/LayoutPage';
import { AiOutlineLaptop } from 'react-icons/ai';
import IconWithTitle from '../../../Utilities/IconsTittle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import BackButton from '../../../Utilities/BackButrton';
import { Api } from '../../../Api/Api';
import DeleteConfirmation from '../../../Utilities/DeleteConfirmation';
import ConfirmDelete from '../../../Utilities/ConfirmDelete';
import EditOnlineClasses from '../../TeacherDashbaord/TeacherDashboard/onlineTeacher/EditOnlineClasses';


const Upcoming = ({ isSidebarClosed }) => {
  const location = useLocation();
  const [classData, setClassData] = useState(location.state?.classData || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [apiResponses, setApiResponses] = useState(null);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [selectedClassForDeletion, setSelectedClassForDeletion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);
  if (!classData || !classData.upcoming_schedule) {
    return (
      <Typography variant="h6" color="error" align="center">
        No upcoming class data available.
      </Typography>
    );
  }



  // Open delete confirmation dialog
  const handleDeleteClass = (cls, e) => {
    e.stopPropagation();
    setSelectedClassForDeletion(cls);
    setDeleteDialogOpen(true);
  };
  const handleEditClass = (cls) => {
    setEditDialogOpen(true);
  
      setSelectedClassForEdit(cls);
      console.log(idsToDelete, "selectedClassForDeletion11");

  };
  const handleDeleteOnlineClass = async () => {
    if (!selectedClassForDeletion) return;
    try {
      await Api.delete(`/onlineclass/${selectedClassForDeletion._id}`);
      
      const updatedSchedule = classData.upcoming_schedule.filter(
        (cls) => cls._id !== selectedClassForDeletion._id
      );

      setClassData((prevData) => ({
        ...prevData,
        upcoming_schedule: updatedSchedule,
      }));

      setDeleteDialogOpen(false);
      setDeleteSuccessDialogOpen(true);
    } catch (error) {
      console.error("Error deleting class:", error);
      setDeleteDialogOpen(false);
    }
  };
  if (!classData || !classData.upcoming_schedule) {
    return (
      <Typography variant="h6" color="error" align="center">
        No upcoming class data available.
      </Typography>
    );
  }
  const handleApiCall = async (cls) => {
    try {
      const payload = {
        online_id: cls._id, 
        uid: cls.host_id?.email,
        session_id: cls.meeting_id, 
        display_name: cls.meeting_name, 
      };

      const response = await Api.post('/onlineclass/create-url', payload);
      const classUrl = response.data?.data?.onlineclass; 

      if (classUrl) {
        setApiResponses((prev) => ({
          ...prev,
          [cls._id]: classUrl, 
        }));
      } else {
        console.error("No class URL found in response");
      }
    } catch (error) {
      console.error("API Call Failed:", error);
    }
  };

  const handleCardClick = (cls) => {
    handleApiCall(cls);
  };

  
 

  const { upcoming_schedule, subject_id } = classData;

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Mathematics': return '#2a9d8f';
      case 'Science': return '#e76f51';
      case 'History': return '#1a73e8';
      case 'English': return '#ffb3b3';
      case 'Geography': return '#E8FFC6';
      case 'Biology': return '#FFCDF7';
      default: return '#6c757d';
    }
  };

  const classesPerPage = 6;
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = upcoming_schedule.slice(indexOfFirstClass, indexOfLastClass);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <LayoutPage isSidebarClosed={isSidebarClosed}>
      <Container maxWidth="xxl">
        <IconWithTitle
          icon={AiOutlineLaptop}
          title="Upcoming Classes (Coming Soon)"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />
        <Paper sx={{ marginTop: '5%' }}>
        <Grid container spacing={2} style={{ padding: '20px' }}>
  {currentClasses.map((cls) => (
    <Grid item xs={12} sm={6} md={6} key={cls.id}> 
      <Card
        variant="outlined"
        style={{
          padding: '16px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={() => handleCardClick(cls)}
      >
        <div
          style={{
            width: '8px',
            background: `linear-gradient(
              to bottom,
              ${getSubjectColor(subject_id.subject_name)} 0%,
              #f8b400 25%,
              #ff5733 50%,
              #28b6f6 75%,
              #7e57c2 100%
            )`,
            borderRadius: '5px 0 0 5px',
            marginRight: '16px',
          }}
        ></div>

        <CardContent style={{ flex: 1 }}>
          <Typography
            variant="h6"
            component="div"
            style={{
              marginBottom: '8px',
              color: getSubjectColor(subject_id.subject_name),
            }}
          >
            {subject_id.subject_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Meeting Name:</strong> {cls.meeting_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Class Details:</strong> {cls.class_details || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Meeting ID:</strong> {cls.meeting_id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Meeting Type:</strong> {cls.meet_type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Schedule:</strong>{' '}
            {cls.calendar.map((event) => (
              <span key={event._id}>
                {new Date(event.start_time).toLocaleString()} -{' '}
                {new Date(event.end_time).toLocaleString()}
              </span>
            ))}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => handleApiCall(cls._id)}
          >
            Start Session 
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '8px',
              gap: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip title="Edit Class">
              <IconButton
                color="primary"
                onClick={(e) => handleEditClass(cls, e)}
                sx={{
                  borderRadius: '50%',
                  background: '#fce4ec',
                  minWidth: '30px',
                  padding: '8px',
                  '&:hover': { backgroundColor: '#fce4ec' },
                }}
              >
                <CiEdit color="#1a73e8" fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Class">
              <IconButton
                color="error"
                onClick={(e) => handleDeleteClass(cls, e)}
                sx={{
                  borderRadius: '50%',
                  background: '#fce4ec',
                  minWidth: '30px',
                  padding: '8px',
                  '&:hover': { backgroundColor: '#fce4ec' },
                }}
              >
                <RiDeleteBin6Line color="red" fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
          {apiResponses && apiResponses[cls._id] && (
  <Box 
    sx={{
      width: "300px",  // ✅ Set specific width
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      marginTop:"20px"
    }}
  >
    <Typography variant="body2" color="textSecondary">
      Class Link:
    </Typography>
    <Link 
      to={apiResponses[cls._id]} 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ wordBreak: "break-word", color: "#007bff" }} // ✅ Handle long URLs
    >
      {apiResponses[cls._id]}
    </Link>
  </Box>
)}
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

          <Pagination
            count={Math.ceil(upcoming_schedule.length / classesPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        </Paper>

        <DeleteConfirmation
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteOnlineClass}
          userName={selectedClassForDeletion ? selectedClassForDeletion.meeting_name : "this attendance entry"}
        />
        <ConfirmDelete
          open={deleteSuccessDialogOpen}
          onClose={() => setDeleteSuccessDialogOpen(false)}
          title="Delete Successful"
          message="The online class  has been successfully deleted."
          buttonText="OK"
          onButtonClick={() => setDeleteSuccessDialogOpen(false)}
        />
  <EditOnlineClasses
        open ={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        
        selectedClassForEdit={selectedClassForEdit}/>
  
        <div className="mt-4 ml-8">
          <BackButton />
        </div>
      </Container>
    </LayoutPage>
  );
};

export default Upcoming;

