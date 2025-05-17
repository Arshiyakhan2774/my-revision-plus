import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton
} from '@mui/material';
import { Close, Edit, Add, Delete } from '@mui/icons-material';

const QuestionPaperPreviewModal = ({ 
  open, 
  onClose, 
  selectedQuestions, 
  questions, 
  onEdit,
  onSaveDraft,
  onAddMore,
  onFinalize
}) => {
  const selectedQuestionsData = questions.filter(q => selectedQuestions.includes(q.id));

  const questionsByType = selectedQuestionsData.reduce((acc, question) => {
    if (!acc[question.type]) {
      acc[question.type] = [];
    }
    acc[question.type].push(question);
    return acc;
  }, {});

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            Question Paper Preview
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box mb={4}>
          <Typography variant="h6" mb={1}>
            Paper Title: {selectedQuestionsData[0]?.paperTitle || "Untitled Paper"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Total Questions: {selectedQuestions.length} | Total Marks: {
              selectedQuestionsData.reduce((sum, q) => sum + q.marks, 0)
            }
          </Typography>
        </Box>

        {/* Sections */}
        {Object.entries(questionsByType).map(([type, questions], index) => (
          <Box key={type} mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Section {index + 1}: {type} Questions
              </Typography>
              <Chip 
                label={`${questions.length} questions | ${questions.reduce((sum, q) => sum + q.marks, 0)} marks`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {questions.map((question, qIndex) => (
              <Box key={question.id} mb={3} p={2} border={1} borderColor="divider" borderRadius={1}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography fontWeight="bold">
                    Q{qIndex + 1}. {question.text}
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<Edit />}
                      onClick={() => onEdit(question.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                      startIcon={<Delete />}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
                
                <Box display="flex" gap={1} mt={1}>
                  <Chip 
                    label={`${question.marks} mark${question.marks > 1 ? 's' : ''}`} 
                    size="small"
                    color="secondary"
                  />
                  <Chip 
                    label={question.difficulty} 
                    size="small"
                    color={
                      question.difficulty === "Easy" ? "success" : 
                      question.difficulty === "Medium" ? "warning" : "error"
                    }
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Box display="flex" justifyContent="space-between" width="100%" p={2}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={onSaveDraft}
          >
            Save Draft
          </Button>
          <Box display="flex" gap={2}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<Add />}
              onClick={onAddMore}
            >
              Add More Questions
            </Button>
            <Button 
              variant="contained" 
              color="success"
              onClick={onFinalize}
            >
              Finalize Paper
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionPaperPreviewModal;