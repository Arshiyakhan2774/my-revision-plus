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
  Box,
  Tooltip,
  Button,
} from '@mui/material';
import { AiOutlineLaptop } from 'react-icons/ai';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IconWithTitle from '../../../../Utilities/IconsTittle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Api } from '../../../../Api/Api';
import TeacherNavBar from '../../../../Layout/Navbar/TeacherNavBar';
import BackButton from '../../../../Utilities/BackButrton';

import EditOnlineClasses from './EditOnlineClasses';
import ConfirmDelete from '../../../../Utilities/ConfirmDelete';
import DeleteConfirmation from '../../../../Utilities/DeleteConfirmation';


const FutureclassesTeacher = ({ isSidebarClosed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(location.state?.classData || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [apiResponses, setApiResponses] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClassForEdit, setSelectedClassForEdit] = useState(null);


  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [selectedClassForDeletion, setSelectedClassForDeletion] = useState(null);

  const handleDeleteClass = (cls, e) => {
    e.stopPropagation();
    setSelectedClassForDeletion(cls);
    setDeleteDialogOpen(true);
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
        online_id: cls._id, // Dynamic meeting ID
        uid: cls.host_id?.email,
        session_id: cls.meeting_id, // Dynamic session ID
        display_name: cls.meeting_name, // Dynamic display name
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
  const handleEditClass = (cls) => {
    setEditDialogOpen(true);
    if (cls?.upcoming_schedule?.length > 0) {
      const idsToDelete = cls.upcoming_schedule.map(schedule => schedule._id);
      setSelectedClassForEdit(idsToDelete);
      console.log(idsToDelete, "selectedClassForDeletion11");
  } else {
      console.log("No upcoming_schedule found!");
  }
   
   
   
  };



  const { upcoming_schedule, subject_id } = classData;

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Mathematics': return '#2a9d8f';
      case 'Science': return '#e76f51';
      case 'History': return '#00246B';
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
    <div>
      <TeacherNavBar/>
    <Container maxWidth="xxl">
      <IconWithTitle
        icon={AiOutlineLaptop}
        title="Upcoming Classes (Coming Soon)"
        iconColor="white"
        backgroundColor="#00246B"
        iconSize="30px"
        titleColor="#00246B"
        titleFontSize="34px"
      />
      <Paper sx={{ marginTop: '5%' ,marginBottom:"5%" }}>
        <Grid container spacing={3} sx={{ padding: '20px' }}>
          {currentClasses.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls.id}>
              <Card
                variant="outlined"
                sx={{
                  padding: '16px',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick(cls.meeting_url)}
              >
                <Box
                  sx={{
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
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
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
            onClick={() => handleApiCall(cls)}
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
                    onClick={(e) => e.stopPropagation()} // Prevent triggering card click
                  >
                    <Tooltip title="Edit Class">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClass(cls)}
                    
                        sx={{
    borderRadius: "50%",
    background: "#fce4ec",
    minWidth: "30px",
    padding: "8px",
    "&:hover": { backgroundColor: "#fce4ec" },
  }}
>
  <CiEdit color="#00246B" fontSize="20px" />
         </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Class">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClass(cls ,e)}
                        sx={{
                          borderRadius: "50%",
                          background: "#fce4ec",
                          minWidth: "30px",
                          padding: "8px",
                          "&:hover": { backgroundColor: "#fce4ec" },
                        }}
                      >
                      
                        <RiDeleteBin6Line color="red" fontSize="20px" />
                        
                     
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
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        />
      </Paper>
      <BackButton/>
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
    </Container>
    </div>
  );
};

export default FutureclassesTeacher;
