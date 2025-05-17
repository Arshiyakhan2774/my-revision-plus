import React, { Fragment, useState } from 'react';
import { Button, Tabs, Box, Container, Grid, Card, CardContent, Typography } from '@mui/material';
import Nav from '../PracticeAssignment/Nav';
import { Link } from 'react-router-dom';
import Navbar1 from '../Dashboard Components/Buttons1';
import StudentNavSmall from '../StudentDashboard/StudentNavSmall';

const OnlineClasses = () => {
  const [value, setValue] = useState(0);
  const [showScheduleContainer, setShowScheduleContainer] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleScheduleClick = () => {
    setShowScheduleContainer(true);
  };
  const studentList = [
    { id: 1, name: 'Student 1' },
    { id: 2, name: 'Student 2' },
    { id: 3, name: 'Student 3' },
   
  ];
  const buttonStyle = {
    transition: 'background-color 0.3s ease, transform 0.3s ease', 
    '&:hover': {
      color: '#fff',
      transform: 'scale(1.1)',
    },
  };

  return (
    <Fragment>
      <Nav />
      {/* <Navbar1 /> */}
      <StudentNavSmall/>
      <Container maxWidth="xxl">
        <div>
          <h1 className='mt-8 mb-2 text-center text-blue-600 hover: hover:translate-y-1.5'>OnlineClasses</h1>
          <h2 className='mt-8 mb-8 text-center text-sky-500 hover:translate-y-10'>Muhammad Musabani</h2>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card
              sx={{
                marginTop: '50px',
                background: '#ededed',
                marginBottom: '20px',
                borderRadius: '10px',
                boxShadow: '0px 3px 6px #00000029',
              }}
            >
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" color="primary">
                      Online Classes
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                  <Link to="/past-class">
                    <Button
                      onClick={(e) => handleChange(e, 0)}
                      variant="contained"
                      color="primary"
                      sx={{
                        background:
                          'linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important',
                ...buttonStyle,
                      }}
                    >
                      Scheduled Class
                    </Button>
                    </Link>
                    <Link to="/past-class">
                      <Button
                        onClick={(e) => handleChange(e, 1)}
                        variant="contained"
                        color="primary"
                        sx={{
                          marginLeft: '10px',
                          background:
                            'linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important',
                         ...buttonStyle,
                        }}
                      >
                        Past Classes
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
                  
                <Box
                  sx={{
                    marginTop: '2%',
                    marginBottom: '2%',
                    background:
                      'linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important',
                    height: '2px',
                  }}
                ></Box>
                <div className='flex felx flex-grow-0 text-center justify-between'>
                 <Box
                  sx={{
                    display: value === 0 ? 'block' : 'none',
                  }}
                >
                 <Link to="/schdule-box">
             
                  <Button
                   
                    variant="contained"
                    color="info"
                    sx={{
                      marginBottom: '10px',
                      background:
                        'linear-gradient(139.62deg, #002B4F 0.57%, #12b6e9 100%, #002B4F) !important',
                      ...buttonStyle, 
                    }}
                    onClick={handleScheduleClick}
                  >
                    Schedule New Class
                  </Button>
                  </Link>
                  {showScheduleContainer && (
                    <section className="container--tabs">
                    </section>
                  )}
                </Box>
                <Box
                  sx={{
                    display: value === 1 ? 'block' : 'none',
                  }}
                >
                  <section className="container--tabs">
                    <Tabs value={value} onChange={handleChange}></Tabs>
                    <Box className="tab-content"></Box>
                  </section>
                  
                </Box>
                <div className="mb-4 flex flex-col w-40">
          {studentList.map((student) => (
            <Button
              key={student.id}
              variant="contained"
              color="info"
              className="mr-2 mb-2 bg-gradient-to-r from-blue-800 to-blue-500 text-white hover:from-blue-500 hover:to-blue-300 hover:bg-blue-600 ...buttonStyle"
            >
              {student.name}
            </Button>
          ))}
        </div>
        </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default OnlineClasses;
