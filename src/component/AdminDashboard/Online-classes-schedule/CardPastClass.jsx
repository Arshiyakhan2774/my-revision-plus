import React, { useState } from 'react';
import { Card, CardContent, Grid, Typography, Paper, LinearProgress, Container, Pagination } from '@mui/material';
import { useMediaQuery } from 'react-responsive';

const CardPastClass = ({ isSidebarClosed }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6; // Set the number of classes per page to 6

  const pastClasses = [
    { id: 1, date: '2024-10-05', time: '10:00 AM', location: 'Room 101', roomNumber: '101', subject: 'Mathematics', content: 'Algebra and Geometry Review', completion:30 },
    { id: 2, date: '2024-10-06', time: '02:00 PM', location: 'Room 202', roomNumber: '202', subject: 'Science', content: 'Physics: Laws of Motion', completion: 50 },
    { id: 3, date: '2024-10-07', time: '09:00 AM', location: 'Room 303', roomNumber: '303', subject: 'History', content: 'World War II Overview', completion: 70 },
    { id: 4, date: '2024-10-08', time: '11:00 AM', location: 'Room 404', roomNumber: '404', subject: 'English', content: 'Shakespearean Plays', completion: 100 },
    { id: 5, date: '2024-10-09', time: '01:00 PM', location: 'Room 505', roomNumber: '505', subject: 'Geography', content: 'Earth and its Features', completion: 20 },
    { id: 6, date: '2024-10-10', time: '08:00 AM', location: 'Room 606', roomNumber: '606', subject: 'Biology', content: 'Cell Structure and Function', completion: 80 },
    { id: 7, date: '2024-10-11', time: '03:00 PM', location: 'Room 707', roomNumber: '707', subject: 'Physics', content: 'Quantum Mechanics', completion: 40 },
    { id: 8, date: '2024-10-12', time: '10:00 AM', location: 'Room 808', roomNumber: '808', subject: 'Chemistry', content: 'Organic Chemistry', completion: 90 },
    // Add more past classes as needed
  ];

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'Mathematics':
        return '#2a9d8f'; // Greenish color for Math
      case 'Science':
        return '#e76f51'; // Orangish color for Science
      case 'History':
        return '#1a73e8'; // Blue color for History
      case 'English':
        return '#ffb3b3'; // Light pinkish for English
      case 'Geography':
        return ' #E8FFC6'; // Yellow for Geography
      case 'Biology':
        return '#FFCDF7'; // Red for Biology
      default:
        return '#6c757d'; // Default color
    }
  };

  const getProgressColor = (completion) => {
    if (completion === 100) return '#4caf50'; // Green for complete
    if (completion >= 75) return '#ffeb3b'; // Yellow for high
    if (completion >= 50) return '#ff9800'; // Orange for moderate
    return '#f44336'; // Red for low
  };

  const isSmallScreen = useMediaQuery({ maxWidth: 1024 });
  const sidebarWidth = isSidebarClosed ? '40px' : '262px';
  const mainComponentWidth = isSmallScreen ? '100%' : `calc(100% - ${sidebarWidth})`;
  const styles = {
    width: mainComponentWidth,
    marginLeft: isSidebarClosed ? '65px' : (isSmallScreen ? '0' : '262px'),
    transition: 'width 0.3s, margin-left 0.3s',
  };

  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = pastClasses.slice(indexOfFirstClass, indexOfLastClass);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="xxl" style={styles}>
      <Paper mt={4}>
        <Typography variant="h4" mt={4} mb={2} color='#1a73e8' align='center'>
          Johnson
        </Typography>

        <Grid container spacing={3} style={{ padding: '20px' }}>
          {currentClasses.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls.id}>
              <Card variant="outlined" style={{ padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'row' }}>
                {/* Left Vertical Line */}
                <div style={{
                  width: '10px',
                  backgroundColor: getSubjectColor(cls.subject),
                  borderRadius: '5px',
                  marginRight: '16px',
                }} />

                {/* Card Content */}
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" style={{ marginBottom: '8px' }}>
                    {cls.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Date:</strong> {cls.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Time:</strong> {cls.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {cls.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Room Number:</strong> {cls.roomNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '12px' }}>
                    <strong>Content:</strong> {cls.content}
                  </Typography>

                  {/* Linear Progress Bar */}
                  <div style={{ marginTop: '12px' }}>
                    <LinearProgress
                      variant="determinate"
                      value={cls.completion}
                      sx={{
                        height: 8,
                        borderRadius: '4px',
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getProgressColor(cls.completion),
                        },
                      }}
                    />
                  </div>
                  <Typography variant="body2" color="text.secondary" style={{ marginTop: '8px', textAlign: 'center' }}>
                    {cls.completion}% Complete
                  </Typography>
                </CardContent>

                {/* Subject Circle */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: getSubjectColor(cls.subject),
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '10px',
                }}>
                  {cls.subject[0].toUpperCase()}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Pagination
          count={Math.ceil(pastClasses.length / classesPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        />
      </Paper>
    </Container>
  );
};

export default CardPastClass;
