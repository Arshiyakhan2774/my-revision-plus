import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_URL_Images, API_URL_PDF } from '../FinalPreviwe';





const PreviweMcqStatic = ({ savedData, isDisplayCardOpen }) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showTeacherExplanation, setShowTeacherExplanation] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');

  const { question } = savedData;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Wiris) {
        window.Wiris.config.saveMode = 'xml';
        console.log('Wiris saveMode set to XML.');
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [savedData]);

  const handleOpenVideoDialog = () => {
    setOpenVideoDialog(true);
  };

  const handleCloseVideoDialog = () => {
    setOpenVideoDialog(false);
  };

  const renderMedia = (mediaArray, type) => {
    if (!mediaArray || mediaArray.length === 0) return null;

    console.log('Rendering media:', mediaArray, type);

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} mt={2} justifyContent="center">
        {mediaArray.map((media, index) => (
          <Box key={index} style={{ width: '100%', maxWidth: '600px', marginBottom: '16px' }}>
            {type === 'image' && (
              <img
                src={`${API_URL_Images}${media}`}
                alt={`media-${index}`}
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            {type === 'video' && (
              <video controls style={{ width: '100%', height: 'auto' }}>
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {type === 'pdf' && (
              <embed
                style={{ width: '100%', height: '600px' }}
                src={`${API_URL_PDF}${media}`}
                type="application/pdf"
              />
            )}
          </Box>
        ))}
      </Box>
    );
  };

  const options = [
    { label: 'A', value: question.mcq_options.mcq_options_a },
    { label: 'B', value: question.mcq_options.mcq_options_b },
    { label: 'C', value: question.mcq_options.mcq_options_c },
    { label: 'D', value: question.mcq_options.mcq_options_d },
  ];

  return (
    <div className="mt-8">
      <Box maxWidth="xxl" display="flex" justifyContent="center" alignItems="center">
        <Card
          variant="outlined"
          style={{
            width: '100%',
            marginBottom: '15px',
            display: 'block',
            fontSize: '16px',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            hyphens: 'auto',
          }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid grey"
              padding={1}
            >
              <Box display="flex" flexDirection="row" alignItems="center">
                {question.videos.length > 0 && (
                  <Tooltip title="Video" arrow>
                    <IconButton
                      onClick={handleOpenVideoDialog}
                      style={{
                        backgroundColor: '#24ECB1',
                        color: '#fff',
                        margin: '5px',
                      }}
                    >
                      <VideoLibraryIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Edit" arrow>
                  <IconButton style={{ backgroundColor: '#C571BD', color: '#fff' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <IconButton style={{ backgroundColor: '#FF7A7A', color: '#fff' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Typography
              style={{
                fontFamily: 'Almarai',
                marginBottom: '10px',
                textAlign: 'left',
                marginTop: '20px',
              }}
            >
              <span className="mr-7">
                <strong>1.</strong>
              </span>
              Maximum Marks: <strong>{question.marks || '[10]'}</strong>
            </Typography>

            <div className="flex text-xl">
              <div className="ml-10">
                <div dangerouslySetInnerHTML={{ __html: question.title }} />
              </div>
            </div>

            {renderMedia(question.images, 'image')}
            {renderMedia(question.docs, 'pdf')}
            {renderMedia(question.videos, 'video')}

            <Box display="flex" flexWrap="wrap" marginTop={2}>
              {options.map((option, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor:
                      option.label === question.mcq_options.correct_answer ? 'lightgreen' : 'white',
                    border: '1px solid grey',
                    borderRadius: '8px',
                    padding: '10px',
                    margin: '5px',
                    width: 'calc(50% - 10px)',
                  }}
                >
                  <Typography variant="body1">
                    {option.label}: {option.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textTransform: 'none',
                width: '30%',
                textAlign: 'left',
              }}
              onClick={() => setShowTeacherExplanation((prev) => !prev)}
              endIcon={<ExpandMoreIcon />}
            >
              {showTeacherExplanation ? '' : "Teacher's Explanation"}
            </Button>

            <Collapse in={showTeacherExplanation}>
              <Typography variant="body1" style={{ fontFamily: 'Almarai', marginTop: '10px' }}>
                Teacher's Explanation:
                <div dangerouslySetInnerHTML={{ __html: question.markscheme.description || 'No explanation provided.' }} />
                {renderMedia(question.markscheme.images, 'image')}
            {renderMedia(question.markscheme.docs, 'pdf')}
            {renderMedia(question.markscheme.videos, 'video')}
              </Typography>
            </Collapse>

            <Button
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textTransform: 'none',
                width: '30%',
                textAlign: 'left',
              }}
              onClick={() => setShowAnswerKey((prev) => !prev)}
              endIcon={<ExpandMoreIcon />}
            >
              {showAnswerKey ? '' : 'Answer-Key'}
            </Button>

            <Collapse in={showAnswerKey}>
              <Typography variant="body1" style={{ fontFamily: 'Almarai', marginTop: '10px' }}>
                Correct Answer:
                <div dangerouslySetInnerHTML={{ __html: question.answer_key.description || 'No explanation provided.' }} />
                {renderMedia(question.answer_key.images, 'image')}
            {renderMedia(question.answer_key.docs, 'pdf')}
            {renderMedia(question.answer_key.videos, 'video')}
              </Typography>
            </Collapse>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={openVideoDialog} onClose={handleCloseVideoDialog} maxWidth="md" fullWidth>
        <DialogTitle>Video Preview</DialogTitle>
        <DialogContent>
          {question.videos.length > 0 && (
            <video src={question.videos[0]} controls style={{ width: '100%', height: 'auto' }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVideoDialog} color="primary"> 
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviweMcqStatic;
