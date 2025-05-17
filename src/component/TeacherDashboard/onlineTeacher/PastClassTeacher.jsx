import { useState } from 'react';
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Container,
  Pagination,
} from '@mui/material';
import { FaLaptopFile } from 'react-icons/fa6';
import { useLocation } from 'react-router-dom';
import IconWithTitle from '../../../../Utilities/IconsTittle';

const PastClassTeacher = () => {
  const location = useLocation();
  const { classData } = location.state || {};
  const [currentPage, setCurrentPage] = useState(1);
  
  if (!classData) {
    return <Typography variant="h6" color="error">No past class data available.</Typography>;
  }

  const { past_schedule, subject_id } = classData;


  const classesPerPage = 6;

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = past_schedule.slice(indexOfFirstClass, indexOfLastClass);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Math': return '#2a9d8f';
      case 'Science': return '#e76f51';
      case 'Economics': return '#00246B';
      case 'English': return '#ffb3b3';
      case 'Geography': return '#E8FFC6';
      case 'Biology': return '#FFCDF7';
      default: return '#6c757d';
    }
  };

  return (
    <Container maxWidth="xxl">
        <IconWithTitle
          icon={FaLaptopFile}
          title="Past Classes"
          iconColor="white"
          backgroundColor="#00246B"
          iconSize="30px"
          titleColor="#00246B"
          titleFontSize="34px"
        />

        <Paper mt={4}>
          <Divider style={{ marginBottom: '20px' }} />

          <Grid container spacing={3} style={{ padding: '20px' }}>
            {currentClasses.map((cls) => (
              <Grid item xs={12} sm={6} md={4} key={cls._id}>
                <div
                  style={{
                    background: 'linear-gradient(to bottom, #f3f4f6, #e3e4e6)',
                    borderRadius: '15px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    position: 'relative',
                    height: '300px',
                    width: '100%',
                    display: 'flex',
                  }}
                >
                 
                  <div
                    style={{
                      width: '10px',
                      background: `linear-gradient(
                        to bottom,
                        ${getSubjectColor(subject_id.subject_name)} 0%,
                        #f8b400 25%,
                        #ff5733 50%,
                        #28b6f6 75%,
                        #7e57c2 100%
                      )`,
                      borderRadius: '5px 0 0 5px',
                    }}
                  ></div>
                  <div
                    style={{
                      height: '85%',
                      width: '100%',
                      backgroundColor: 'white',
                      borderRadius: '0 0 0 10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      style={{ marginBottom: '8px', color: getSubjectColor(subject_id.subject_name) }}
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
                  </div>
                  <div
                    style={{
                      height: '15%',
                      background: '#d1d5db',
                      borderRadius: '0 0 15px 15px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '50%',
                        height: '8px',
                        background: '#9ca3af',
                        borderRadius: '4px',
                      }}
                    ></div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(past_schedule.length / classesPerPage)}
            page={currentPage}
            onChange={handleChangePage}
            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        </Paper>
      </Container>
   
  );
};
export default PastClassTeacher