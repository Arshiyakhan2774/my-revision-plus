import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
  Box,
  Tooltip,
  FormControlLabel,
  Radio,
  Button,
  RadioGroup,
} from '@mui/material';
import { FaRegImage } from "react-icons/fa6";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";
import 'tinymce/skins/content/default/content.css';
import 'tinymce/skins/ui/oxide/skin.min.css'; 
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { SlClose } from "react-icons/sl"
import { Editor } from '@tinymce/tinymce-react';
import EditorFile from '../../../Assignment-master/CreateAssignment/EditorFile';
import { useDispatch, useSelector } from 'react-redux';
import { RiDeleteBin3Fill, RiFeedbackFill } from 'react-icons/ri';
import BackButton from '../../../../../Utilities/BackButrton';
import { IoClose } from 'react-icons/io5';
import PreviweMcq from './PreviweMcq';
import McqToggleButton from './McqToggleButton';
import { useCreateSubSatQuestionMutation } from '../../../../../Services/CreateQuestion/CreateQuestionApi';

const SubMcq = ({  label, subQuestiopnsavedData, onClose }) => {
  const [marks, setMarks] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [answerKeyContent, setAnswerKeyContent] = useState('');
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [markSchemeContent, setMarkSchemeContent] = useState('');
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
  const [subQuestionsHide, setSubQuestionsHide] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [subQuestionId, setSubQuestionId] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [savedData, setSavedData] = useState(null);

  const [subSubQuestionsButtons, setSubSubQuestionsButtons] = useState(false);
  const [isDisplayCardOpen, setIsDisplayCardOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dispatch = useDispatch();
  const previewId = useSelector((state) => state.idSlice.previewId);
 
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [createQuestion] = useCreateSubSatQuestionMutation();

  const [options, setOptions] = useState([
    { id: 'A', text: '', feedback: '', image: '', showFeedbackEditor: false },
    { id: 'B', text: '', feedback: '', image: '', showFeedbackEditor: false },
    { id: 'C', text: '', feedback: '', image: '', showFeedbackEditor: false },
    { id: 'D', text: '', feedback: '', image: '', showFeedbackEditor: false },
    // { id: 'E', text: '', feedback: '', image: '', showFeedbackEditor: false },
    // { id: 'F', text: '', feedback: '', image: '', showFeedbackEditor: false },
  ]);
  
  // Extract option text values from the array
  const optionA = options.find(option => option.id === 'A')?.text || '';
  const optionB = options.find(option => option.id === 'B')?.text || '';
  const optionC = options.find(option => option.id === 'C')?.text || '';
  const optionD = options.find(option => option.id === 'D')?.text || '';
  
  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index].text = e.target.value;
    setOptions(newOptions);
  };

  const handleFeedbackChange = (index, content) => {
    const newOptions = [...options];
    newOptions[index].feedback = content;
    setOptions(newOptions);
  };

  const handleImageUpload = (index, e) => {
    const newOptions = [...options];
    newOptions[index].image = URL.createObjectURL(e.target.files[0]);
    setOptions(newOptions);
  };

  const toggleFeedbackEditor = (index) => {
    const newOptions = [...options];
    newOptions[index].showFeedbackEditor = !newOptions[index].showFeedbackEditor;
    setOptions(newOptions);
  };

  const addOption = () => {
    const newOptionId = String.fromCharCode(65 + options.length); 
    setOptions([
      ...options,
      { id: newOptionId, text: '', feedback: '', image: '', showFeedbackEditor: false },
    ]);
  
    window.scrollTo({
      top:100,
      behavior: 'smooth', 
    });
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);

    if (options[index].id === correctAnswer) {
      setCorrectAnswer(newOptions.length > 0 ? newOptions[0].id : '');
    }
  };

  const handleCorrectAnswerChange = (event) => {
    setCorrectAnswer(event.target.value);
  };
  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };
  const iconButtonStyle = {
    color: 'white',
    background: '#1a73e8',
    width: '40px',
    height: '40px',
    marginRight: '8px',
    border: '1px solid black',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#1a73e8', 
      background: 'white',
    },
  };

  const updateFiles = (setter, files) => setter((prev) => [...prev, ...files]);
  const removeFile = (setter, index) => setter((prev) => prev.filter((_, i) => i !== index));

  const handleFileChange = (type, e, context) => {
    const files = Array.from(e.target.files);
    const contextMap = {
      main: {
        image: setUploadedImages,
        video: setUploadedVideos,
        pdf: setUploadedPdfs,
      },
      answerKey: {
        image: setAnswerKeyImages,
        video: setAnswerKeyVideos,
        pdf: setAnswerKeyPdfs,
      },
      markScheme: {
        image: setMarkSchemeImages,
        video: setMarkSchemeVideos,
        pdf: setMarkSchemePdfs,
      },
    };

    const setter = contextMap[context]?.[type];
    if (setter) updateFiles(setter, files);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
  
    if (!previewId) {
      console.error('Preview ID is required.', previewId);
      setLoading(false);
      return;
    }
  
    if (!options || typeof options !== 'object') {
      console.error('MCQ options are not defined or invalid:', options);
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', editorContent || '');
    formData.append('question_id', previewId);
    formData.append('criteria', 'Yes');
    formData.append('marks', marks);
  
    uploadedImages.forEach((image) => formData.append('images', image));
    uploadedVideos.forEach((video) => formData.append('videos', video));
    uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));
  
    formData.append('answer_key[description]', answerKeyContent || '');
    answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
    answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
    answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));
  
    formData.append('markscheme[description]', markSchemeContent || '');
    markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
    markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
    markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));
  
    // Ensure options are valid
    formData.append('mcq_options_a', optionA);
    formData.append('mcq_options_b', optionB);
    formData.append('mcq_options_c', optionC);
    formData.append('mcq_options_d', optionD);
    formData.append('correct_answer', correctAnswer);
  
    try {
      const response = isEditing
        ? await updateQuestion({ questionId: subQuestiopnsavedData?.question?.id, formData }).unwrap()
        : await createQuestion(formData).unwrap();
  
      console.log('API Response:', response);
      const savedData1 = response.data;
      setSavedData(savedData1)
      // if (!savedData) {
      //   throw new Error('No data returned from API');
      // }
  
      dispatch(setSubQuestionId(savedData?.question?.id));
      
      setSnackbarMessage('Question saved successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
    setSubSubQuestionsButtons(true);
      setIsDisplayCardOpen(true);
      setSubQuestionsHide(false);
  };
  

  const handleEdit = (id) => {
    setIsEditing(true);
    setSubQuestionsHide(true);
    setIsDisplayCardOpen(false);
  };

  const handleDelete = async () => {
    if (!subQuestionId) {
      console.error('No subQuestionId provided for deletion.');
      return;
    }
    setLoading(true);
    try {
      await deleteQuestion(subQuestionId).unwrap();
      setSnackbarMessage('Question deleted successfully');
      setIsDisplayCardOpen(false);
      setSubSubQuestionsButtons(false);
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className="mt-20 cursor-pointer">
      {subQuestionsHide && (
        <Paper variant="outlined" className="p-8 ">
          <Grid container spacing={2}>
            <div className="flex justify-between items-center w-full">
              <Typography className="text-bold">({label})</Typography>
              <IconButton onClick={onClose} style={{ border: '1px solid red', color: 'red' }}>
              <IoClose />
              </IconButton>
            </div>

            <Grid item xs={12} md={10} lg={10.2} style={{ flexBasis: '100%', maxWidth: '100%' }}>
              <Grid item xs={12} sm={6} md={2} style={{ marginLeft: 'auto', marginBottom: '6px' }}>
                <TextField
                  label="Marks"
                  variant="outlined"
                  value={marks}
                  onChange={handleMarksChange}
                  fullWidth
                />
              </Grid>

              <EditorFile content={editorContent} onEditorChange={setEditorContent} />
              <Box className="flex flex-row justify-between mb-2 mt-4">
                <Box className="flex flex-row">
                  <Tooltip title="Insert Image" arrow>
                    <IconButton onClick={() => document.getElementById('image').click()} sx={iconButtonStyle}>
                      <FaRegImage  />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    id="image"
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange('image', e, 'main')}
                  />
                  <Tooltip title="Insert Video" arrow>
                    <IconButton onClick={() => document.getElementById('video').click()} sx={iconButtonStyle}>
                      <MdOutlineVideoLibrary  />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    id="video"
                    style={{ display: 'none' }}
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileChange('video', e, 'main')}
                  />
                  <Tooltip title="Insert PDF" arrow>
                    <IconButton onClick={() => document.getElementById('pdf').click()} sx={iconButtonStyle}>
                     <FaFilePdf />
                    </IconButton>
                  </Tooltip>
                  <input
                    type="file"
                    id="pdf"
                    style={{ display: 'none' }}
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFileChange('pdf', e, 'main')}
                  />
                </Box>
              </Box>
              <Paper sx={{marginTop:"20px",}}>
              <RadioGroup value={correctAnswer} onChange={handleCorrectAnswerChange}>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'start',
              gap:"10px",
              alignItems: 'center',
              marginBottom: '16px',
              padding:"20px",
              marginTop:"20px"
            }}
          >
            <FormControlLabel
              control={<Radio />}
          
              value={option.id}
            />
             <Grid item xs={12} sm={6} md={4} key={option.id}>
          <TextField
            fullWidth
            label={`Option ${option.id} Text`}
            variant="outlined"
            value={option.text}
            onChange={(e) => handleOptionChange(index, e)}
          />
           
        </Grid>
           <div className='flex justify-between'><Tooltip title="Edit Feedback" arrow>
              <IconButton
                onClick={() => toggleFeedbackEditor(index)}
                color="primary"
                sx={iconButtonStyle}
              >
              <RiFeedbackFill/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Insert Image" arrow>
              <IconButton
                onClick={() => document.getElementById(`image-${index}`).click()}
                sx={iconButtonStyle}
              >
                <FaRegImage />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" arrow>
            <IconButton   sx={iconButtonStyle} onClick={() => removeOption(index)} color="error" >
              <RiDeleteBin3Fill />
            </IconButton>
            </Tooltip></div>
            {option.showFeedbackEditor && (
              <Editor
              className="mt-4"
                init={{
                  height: 100,
                  menubar: false,
                  plugins: 'advlist autolink lists link image charmap print preview anchor',
                  toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | link',
                }}
                Value={option.feedback}
                onEditorChange={(content) => handleFeedbackChange(index, content)}
              />
            )}
         
            <input
              type="file"
              id={`image-${index}`}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleImageUpload(index, e)}
            />
            {option.image && (
              <img
                src={option.image}
                alt={`Option ${option.id}`}
                style={{ width: '50px', marginLeft: '8px' }}
              />
            )}
            
          </div>
        ))}
      </RadioGroup>
</Paper>
<Tooltip title="Add Options" arrow>
      <Button
        variant="contained"
        color="primary"
        onClick={addOption}
      
        sx={{ marginBottom:"30px",borderRadius: '80px', padding: ' 20px', marginTop: '16px' ,background:"#1a73e8" ,color:"white"}}
      >
       <AddIcon />
      </Button>
      </Tooltip>
    <McqToggleButton previewId={previewId} 
    label ={label} 
    subQuestiopnsavedData={subQuestiopnsavedData}
    setAnswerKeyContent={ setAnswerKeyContent}
    setMarkSchemeContent={setMarkSchemeContent}
    markSchemeContent={markSchemeContent}
    answerKeyContent={answerKeyContent}
    markSchemeImages={markSchemeImages}
    setMarkSchemeImages={setMarkSchemeImages}
    markSchemeVideos={markSchemeVideos}
    setMarkSchemeVideos={setMarkSchemeVideos}
markSchemePdfs={markSchemePdfs}
 setMarkSchemePdfs={setMarkSchemePdfs}
 answerKeyImages={answerKeyImages}
 setAnswerKeyImages={setAnswerKeyImages}
 answerKeyVideos={answerKeyVideos}
 setAnswerKeyVideos={setAnswerKeyVideos}
 answerKeyPdfs={answerKeyPdfs}
 setAnswerKeyPdfs={ setAnswerKeyPdfs}
    onClose={onClose}
    marks={marks}
    handleMarksChange={ handleMarksChange}
    iconButtonStyle={iconButtonStyle}

    />

              {uploadedImages.length > 0 && (
                <div>
                  <Typography variant="h6">Uploaded Images</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {uploadedImages.map((image, index) => (
                      <Box key={index} sx={{ position: 'relative', margin: '4px' }}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`uploaded-image-${index}`}
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                        <IconButton
                          onClick={() => removeFile('image', index, 'main')}
                          sx={{ position: 'absolute', top: '0', right: '0', color: 'white' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                </div>
              )}

              {uploadedVideos.length > 0 && (
                <div>
                  <Typography variant="h6">Uploaded Videos</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {uploadedVideos.map((video, index) => (
                      <Box key={index} sx={{ position: 'relative', margin: '4px' }}>
                        <video
                          width="150"
                          height="150"
                          controls
                          src={URL.createObjectURL(video)}
                        />
                        <IconButton
                          onClick={() => removeFile('video', index, 'main')}
                          sx={{ position: 'absolute', top: '0', right: '0', color: 'white' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                </div>
              )}

              {uploadedPdfs.length > 0 && (
                <div>
                  <Typography variant="h6">Uploaded PDFs</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {uploadedPdfs.map((pdf, index) => (
                      <Box key={index} sx={{ position: 'relative', margin: '4px' }}>
                        <a
                          href={URL.createObjectURL(pdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PdfIcon />
                        </a>
                        <IconButton
                          onClick={() => removeFile('pdf', index, 'main')}
                          sx={{ position: 'absolute', top: '0', right: '0', color: 'white' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="space-between">
          <BackButton/>
        <Button variant="contained"  
        sx={{ background: '#1a73e8',color:'white'}}
         onClick={handleSubmit}>{isEditing ? 'Update Question' : 'Save Question'} 
      </Button>
        </Box>
        </Paper>
      )}
     
    </div>

    {isDisplayCardOpen && savedData && (
    <PreviweMcq
        open={isDisplayCardOpen}
        onClose={() => setIsDisplayCardOpen(false)}
        savedData={savedData}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        // handleDelete={handleDelete}
        // handleCopy={handleCopy}
        // content={content} 
    />
)}
    
   </div>
  );
};

export default SubMcq