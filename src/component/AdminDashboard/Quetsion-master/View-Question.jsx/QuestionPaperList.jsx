import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemText, Divider, Chip, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const QuestionPaperDisplay = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { papers = [] } = location.state || {};
  const [selectedPaper, setSelectedPaper] = useState(null);

  // If no papers passed, redirect back
  if (papers.length === 0) {
    navigate(-1);
    return null;
  }

  // Set first paper as selected by default
  if (!selectedPaper && papers.length > 0) {
    setSelectedPaper(papers[0]);
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Left Section - Paper List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Question Papers
            </Typography>
            <List>
              {papers.map((paper) => (
                <React.Fragment key={paper.id}>
                  <ListItem 
                    button 
                    onClick={() => setSelectedPaper(paper)}
                    selected={selectedPaper?.id === paper.id}
                  >
                    <ListItemText
                      primary={paper.title}
                      secondary={
                        <>
                          <span>{paper.questions.length} questions</span>
                          <span> • {paper.totalMarks} marks</span>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => navigate('/create-question-paper')}
            >
              Create New Paper
            </Button>
          </Paper>
        </Grid>

        {/* Right Section - Paper Display */}
        <Grid item xs={12} md={8}>
          {selectedPaper ? (
            <Paper elevation={3} sx={{ p: 3 }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h4" gutterBottom>
                    {selectedPaper.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    Created on: {selectedPaper.dateCreated}
                  </Typography>
                </div>
                <div className="text-right">
                  <Chip 
                    label={`${selectedPaper.questions.length} Questions`} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={`${selectedPaper.totalMarks} Marks`} 
                    color="secondary" 
                    variant="outlined"
                  />
                </div>
              </div>

              <Divider sx={{ my: 3 }} />

              <div className="question-list">
                {selectedPaper.questionsData.map((question, index) => (
                  <div key={question.id} className="mb-6">
                    <div className="flex items-start">
                      <Typography variant="h6" component="span" sx={{ mr: 2 }}>
                        Q{index + 1}.
                      </Typography>
                      <div className="flex-1">
                        <Typography variant="body1" paragraph>
                          {question.text}
                        </Typography>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Chip 
                            label={question.type} 
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                          <Chip 
                            label={question.difficulty} 
                            size="small"
                            variant="outlined"
                            color={
                              question.difficulty === "Easy" ? "success" : 
                              question.difficulty === "Medium" ? "warning" : "error"
                            }
                          />
                          <Chip 
                            label={`${question.marks} mark${question.marks > 1 ? 's' : ''}`} 
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        </div>
                      </div>
                    </div>
                    {index < selectedPaper.questionsData.length - 1 && (
                      <Divider sx={{ my: 3 }} />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => window.print()}
                >
                  Print Paper
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/create-question-paper')}
                >
                  Create New
                </Button>
              </div>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">Select a paper to view</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionPaperDisplay;