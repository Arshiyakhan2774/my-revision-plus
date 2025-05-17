// import  { useEffect, useRef, useState } from 'react';
// import {
//   IconButton,
//   Tooltip,
//   Box,
//   Paper,
//   Grid,
//   FormControlLabel,
//   Switch,
//   Button,
//   Container,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem
// } from '@mui/material';
// import PreviewIcon from '@mui/icons-material/Preview';
// import SubQuestionButtonGroup from "./SubQuestionButtonGroup"
// // import { Image as ImageIcon, VideoLibrary as VideoIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
// // import { CKEditor } from '@ckeditor/ckeditor5-react';
// // import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { IoImagesSharp } from "react-icons/io5";
// // import RichTextEditor from '../DispalyData/RichTextEditor';
// import MainQuestionView  from "./MainQuestionView";
// import '@wiris/mathtype-tinymce5';
// import 'tinymce/skins/content/default/content.css';
// import 'tinymce/skins/ui/oxide/skin.min.css'; 
// import { useDispatch, useSelector } from 'react-redux';

// import AddButtonStyle from "./AddButtonStyle"
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import IconWithTitle from '../../../../Utilities/IconsTittle';
// import { BsPatchQuestion } from 'react-icons/bs';
// import EditorFile from '../../Assignment-master/CreateAssignment/EditorFile';
// import { MdOutlineOndemandVideo } from 'react-icons/md';
// import { FaRegFilePdf } from 'react-icons/fa';
// import BackButton from '../../../../Utilities/BackButrton';
// import Loading from '../../../../Utilities/Loading';
// import SubQuestion from './SubQuestion';
// import { useCreateQuestionMutation, useDeleteQuestionMutation, useGetQuestionQuery, useUpdateQuestionMutation } from '../../../../Services/CreateQuestion/CreateQuestionApi';
// import { setPreviewId } from '../../../../store/all-Id-Slice/IdSlice';
// import SubMcq from './McqQuestion/SubMcq';
// import { closeDisplayCard, openDisplayCard } from '../../../../store/Random/StudentSlice';
// import LineSelectorWithMarks from './NumberOfLineSelector';
// import ModelAnswer from './ModelAnswer';


// const MainQuestionCreate= () => {
//   const [uploadedImages, setUploadedImages] = useState([]);
//   const [uploadedVideos, setUploadedVideos] = useState([]);
//   const [uploadedPdfs, setUploadedPdfs] = useState([]);
//   const [editorContent, setEditorContent] = useState('');
//   const [isPreviewOpen, setIsPreviewOpen] = useState(false);
//   const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
//   const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  
//   const [markSchemeContent, setMarkSchemeContent] = useState('');
//   const [savedData, setSavedData] = useState(null);
//   // const [isDisplayCardOpen, setIsDisplayCardOpen] = useState(true);
//   const [selectedAnswerType, setSelectedAnswerType] = useState('answerKey');
//   const [expandedSubQuestions,setExpandedSubQuestions]=useState([])
//   const [markSchemeImages, setMarkSchemeImages] = useState([]);
//   const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
//   const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
//   const [subQuestionsButtons, setSubQuestionsButtons] = useState(false);
//   // const [subQuestions, setSubQuestions] = useState([]);
//   const [showButtonGroup, setShowButtonGroup] = useState(false);
//   const [hidecOomponent, setHidecOomponent] = useState(true);
//   const [lonngQuestion, setLonngQuestion] = useState(false);
//   const [subQuestions, setSubQuestions] = useState([]);
//   const [subMcq, setSubMcq] = useState([]);
//   const [showMainQuestion, setShowMainQuestion] = useState(true);
//   const [loading, setLoading] = useState(false);
//   // const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [questionId, setQuestionId] = useState(null);
//   const [numberOfLines, setNumberOfLines] = useState('');
//   const [studentAnswer, setStudentAnswer] = useState('');
//   const [answerKeyContent, setAnswerKeyContent] = useState('');
//   const [modelAnswerContent, setModelAnswerContent] = useState('');
//   const [answerKeyImages, setAnswerKeyImages] = useState([]);
//   const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
//   const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
//   const [modelAnswerImages, setModelAnswerImages] = useState([]);
//   const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
//   const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  
//   const subTopicId = useSelector(state => state.idSlice.subTopicId);
//   const editorRef = useRef(null);
//    const previewId = useSelector((state) => state.idSlice.previewId);
//    const dispatch = useDispatch();
   
//    const handleNumberOfLinesChange = (event) => setNumberOfLines(event.target.value);
//    const handleStudentAnswerChange = (event) => setStudentAnswer(event.target.value);
 
//    const [createQuestion] = useCreateQuestionMutation();
//    const [updateQuestion] = useUpdateQuestionMutation();
//    const [deleteQuestion ,{refetch}] = useDeleteQuestionMutation();
//    const [marks, setMarks] = useState('');
//    const { data: questionData,} = useGetQuestionQuery(questionId, {
//     skip: !isEditing || typeof questionId !== 'string',
//   });
//   // useEffect(() => { 
//   //   const script = document.createElement('script');
//   //   script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
//   //   script.async = true;
//   //   document.body.appendChild(script);

//   //   script.onload = () => {
//   //     if (window.Wiris) {
//   //       window.Wiris.config.saveMode = 'xml';
//   //       console.log('Wiris saveMode set to XML.');
//   //     }
//   //   };

//   //   return () => {
//   //     document.body.removeChild(script);
//   //   };
//   // }, [editorContent]);

//   // const forceMathTypeRendering = () => {
//   //   if (window.Wiris && window.Wiris.Plugin && window.Wiris.Plugin.Viewer) {
//   //     window.Wiris.Plugin.Viewer.parseElement();
//   //   }
//   // };
//   useEffect(() => {
//     if (isEditing && questionData) {
//       setEditorContent(questionData.question_title || '');
//       setUploadedImages(questionData.images || []);
//       setUploadedVideos(questionData.videos || []);
//       setUploadedPdfs(questionData.docs || []);
//       setAnswerKeyContent(questionData.answer_key?.description || '');
//       setAnswerKeyImages(questionData.answer_key?.images || []);
//       setAnswerKeyVideos(questionData.answer_key?.videos || []);
//       setAnswerKeyPdfs(questionData.answer_key?.docs || []);
//       setModelAnswerContent(questionData.answer_model?.description|| '');
//       setModelAnswerImages(questionData.answer_model?.images || []);
//       setModelAnswerVideos(questionData.answer_model?.videos || []);
//       setModelAnswerPdfs(questionData.answer_model?.docs || []);
//       setMarkSchemeContent(questionData.markscheme?.description|| '');
//       setMarkSchemeImages(questionData.markscheme?.images || []);
//       setMarkSchemeVideos(questionData.markscheme?.videos || []);
//       setMarkSchemePdfs(questionData.markscheme?.docs || []);
//     }
//   }, [isEditing, questionData]);
//   useEffect(() => {
   
//     const files = [
//       ...markSchemeImages,
//       ...markSchemeVideos,
//       ...markSchemePdfs,
//       ...answerKeyImages,
//       ...answerKeyVideos,
//       ...answerKeyPdfs,
//       ... uploadedImages,
//       ...uploadedVideos,
//       ...uploadedPdfs,
//       ...modelAnswerImages,
//       ...modelAnswerVideos,
//       ...modelAnswerPdfs,
//     ];
//     const objectURLs = new Set();
//     files.forEach(file => {
//       if (file instanceof Blob) {
//         const url = URL.createObjectURL(file);
//         objectURLs.add(url);
//       }
//     });
//     return () => {
//       objectURLs.forEach(url => URL.revokeObjectURL(url));
//     };
//   }, [markSchemeImages, markSchemeVideos, markSchemePdfs, answerKeyImages, answerKeyVideos, answerKeyPdfs ,modelAnswerImages,modelAnswerPdfs,modelAnswerVideos]);

 
//   const  handleLongQuestion = () => {
//     if (subQuestions.length < 26) { 
//       const newLabel = String.fromCharCode(97 + subQuestions.length); 
//       setSubQuestions([...subQuestions, { label: newLabel, text: '' }]);
//     }
//     setLonngQuestion(true)
//     window.scrollTo({
//       top:100, 
//       behavior: 'smooth'
//     });
//   };
//   const handleMcqQuestion = () => {
//     if (subMcq.length < 26) {
//       const newLabel = String.fromCharCode(97 + subMcq.length);
//       setSubMcq([...subMcq, { label: newLabel, text: '' }]);
//     }
//     setLonngQuestion(true);
  
//     setTimeout(() => {
//       window.scrollTo({
//         top: document.body.scrollHeight,  
//         behavior: 'smooth',
//       });
//     }, 100); 
//   };
//   const handleCloseSubMcq = (index) => {
//     setSubMcq(prev => prev.filter((_, i) => i !== index)); 
//   };
//   const handleCloseSubQuestion = (index) => {
//     setSubQuestions(prev => prev.filter((_, i) => i !== index)); 
//   };


//   const handleSubQuestionButton = () => {
//     setShowButtonGroup(!showButtonGroup);
//   };
 
//   const toggleSubQuestion = (index) => {
//     setExpandedSubQuestions((prev) => {
//       const newExpanded = [...prev];
//       newExpanded[index] = !newExpanded[index]; 
//       return newExpanded;
//     });
//   };
//   const iconButtonStyle = {
//     color: 'white',
//     background: 'linear-gradient(90deg, #1f90fe,#74b0ec,#c571bd)',
//     width: '40px',
//     height: '40px',
//     marginRight: '8px',
//     border: '1px solid black',
//   };
 

//   const handlePreviewOpen = () => {
//     setIsPreviewOpen(true);
//   };

//   const updateFiles = (setter, files) => setter(prev => [...prev, ...files]);
//   const removeFiles = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
  
//   const handleFileChange = (type, e, context) => {
//     const files = Array.from(e.target.files).filter(file => file instanceof Blob);
    
//     if (!files.length) {
//       console.error('No valid files selected');
//       return;
//     }
  
//     const contextMap = {
//       main: {
//         image: setUploadedImages,
//         video: setUploadedVideos,
//         pdf: setUploadedPdfs,
//       },
//       answerKey: {
//         image: setAnswerKeyImages,
//         video: setAnswerKeyVideos,
//         pdf: setAnswerKeyPdfs,
//       },
//       modelAnswer: {
//         image: setModelAnswerImages,
//         video: setModelAnswerVideos,
//         pdf: setModelAnswerPdfs,
//       },
//       markScheme: {
//         image: setMarkSchemeImages,
//         video: setMarkSchemeVideos,
//         pdf: setMarkSchemePdfs,
//       },
//     };
  
//     const setter = contextMap[context]?.[type];
//     if (!setter) {
//       console.error(`Setter function is undefined for context: ${context} and type: ${type}`);
//       return;
//     }
//     updateFiles(setter, files);
//   };
  
//   const removeFile = (type, index, context) => {
//     const contextMap = {
//       main: {
//         image: setUploadedImages,
//         video: setUploadedVideos,
//         pdf: setUploadedPdfs,
//       },
//       answerKey: {
//         image: setAnswerKeyImages,
//         video: setAnswerKeyVideos,
//         pdf: setAnswerKeyPdfs, 
//       },
//       markScheme: {
//         image: setMarkSchemeImages,
//         video: setMarkSchemeVideos,
//         pdf: setMarkSchemePdfs,
//       },
//       modelAnswer: {
//         image: setModelAnswerImages,
//         video: setModelAnswerVideos,
//         pdf: setModelAnswerPdfs,
//       }, 
//     };
  
//     const setter = contextMap[context]?.[type];
//     if (setter) removeFiles(setter, index);
//   };
  
//   const handleMarksChange = (event) => {
//     setMarks(event.target.value);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     if (!subTopicId) {
//         console.error('No subTopicId provided.');
//         setLoading(false);
//         return;
//     }

//     const formData = new FormData();
//     formData.append('question_title', editorContent);
//     formData.append('subtopic_id', subTopicId);
//     formData.append('criteria', "Yes");
//     formData.append('marks', marks);
//     formData.append('answer_line', numberOfLines);

//     uploadedImages.forEach((image) => formData.append('images', image));
//     uploadedVideos.forEach((video) => formData.append('videos', video));
//     uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));
    
//     formData.append('answer_key[description]', answerKeyContent);
//     answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
//     answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
//     answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));
 
//     formData.append('markscheme[description]', markSchemeContent);
//     markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
//     markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
//     markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));

//     formData.append('answer_model[description]', modelAnswerContent);
//     modelAnswerImages.forEach((image) => formData.append('answer_model[images]', image));
//     modelAnswerVideos.forEach((video) => formData.append('answer_model[videos]', video));
//     modelAnswerPdfs.forEach((pdf) => formData.append('answer_model[docs]', pdf));

//     const questionId = isEditing ? savedData?.question?.id : null;
//     if (isEditing && !questionId ) {
//         console.error('Invalid questionId for editing.');
//         setLoading(false);
//         return;
//     }

//     try {
        
//         const response = isEditing
//         ? await updateQuestion({ questionId, formData }).unwrap()
//         : await createQuestion(formData).unwrap();
    
//     const savedDataview = response.data;
//      setSavedData(savedDataview);
//      dispatch(setPreviewId(response.data?.question?.id));
//     console.log(savedDataview, 'show savedDataview data');
    
//     dispatch(setPreviewId(savedDataview?.question?.id));
//         console.log(savedData, 'show updated savedData');
//       //  setIsDisplayCardOpen(true);
//       dispatch(openDisplayCard());
//         setSubQuestionsButtons(true);
//         setHidecOomponent(false);

//     } catch (error) {
//         console.error('Error submitting form:', error);
//     } finally {
//         setLoading(false);
       
//     }
// };



//   const handleDelete = async () => {
//     try {
//       await deleteQuestion(previewId).unwrap();
//       toast.success('Question deleted successfully'); 
//       window.location.reload(); 
//     } catch (error) {
//       console.error('Error deleting question:', error);
//       toast.error('Failed to delete question'); 
//     }
//   };

//   const handleEdit = (id) => {
//     setIsEditing(true);
//     setQuestionId(id);
//     setHidecOomponent(true);
//     setIsDisplayCardOpen(false);
//     // window.location.href = `/previewpage/${previewId}`;
//     // navigate(`/previewpage/${previewId}`);

//   };

//   return (
//       <Container maxWidth='xxl' className='mt-4 text-center'  sx={{ width:'90%' }}>
//          <IconWithTitle
//           icon={BsPatchQuestion}
//           title="Statement"
//           iconColor="white"
//           backgroundColor="#1a73e8"
//           iconSize="30px"
//           titleColor="#1a73e8"
//           titleFontSize="34px"
//         />
//             {hidecOomponent && (
//               <Box sx={{ padding: 2,   }}>

//       <Paper variant="outlined" className="p-4 ">
     
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={10} lg={10.2} style={{ flexBasis: '100%', maxWidth: '100%' }}>
//           <Grid container spacing={2} alignItems="center">
//   {/* Left: Dropdown for Number of Lines */}
//   {/* <Grid item xs={4} sm={6} md={2}>
//     <FormControl fullWidth variant="outlined">
//       <InputLabel id="line-number-label">Number of Lines</InputLabel>
//       <Select
//         labelId="line-number-label"
//         value={numberOfLines}
//         onChange={handleNumberOfLinesChange}
//         label="Number of Lines"
//       >
//         {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((line) => (
//           <MenuItem key={line} value={line}>
//             {line} {line === 1 ? 'Line' : 'Lines'}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   </Grid>

 
//   <Grid item xs={4} sm={6} md={2} style={{ marginLeft: 'auto', marginBottom: '6px' }}>
//     <TextField
//       label="Marks"
//       variant="outlined"
//       value={marks}
//       onChange={handleMarksChange}
//       fullWidth
//     />
//   </Grid>
// </Grid>*/}
// {/* <Grid item xs={12}>
//         <Box
//           mt={2}
//           p={2}
//           sx={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             backgroundColor: "#f9f9f9",
//             marginBottom:"20px",
//           }}
//         >
//           {[...Array(parseInt(numberOfLines || 0))].map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 borderBottom: "1px dashed #ccc",
//                 marginBottom: "8px",
//                 height: "20px",
//               }}
//             ></Box>
//           ))}
//         </Box>
      
//         </Grid> */}
//           </Grid> 
//         <LineSelectorWithMarks handleMarksChange={handleMarksChange}
//         numberOfLines={ numberOfLines}
//         marks={marks} 
//         handleNumberOfLinesChange={handleNumberOfLinesChange}/>
     
//         <EditorFile
//   content={editorContent}
//   onEditorChange={(newContent) => setEditorContent(newContent)}
// />
//             <Box className="flex flex-row justify-between mb-2 mt-4">
//               <Box className="flex flex-row">
//               <Tooltip title="Insert Image" arrow>
//   <IconButton onClick={() => document.getElementById('image').click()} sx={iconButtonStyle}>
//     <IoImagesSharp/>

//   </IconButton>
// </Tooltip>
//                 <input
//   type="file"
//   id="image"
//   name='images'
//   style={{ display: 'none' }}
//   accept="image/*"
//   multiple
//   onChange={(e) => handleFileChange('image', e, 'main')}
// />


//                 <Tooltip title="Insert Video" arrow>
//                   <IconButton onClick={() => document.getElementById('video').click()} sx={iconButtonStyle}>
//                     <MdOutlineOndemandVideo />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="video"
//                   style={{ display: 'none' }}
//                   accept="video/*"
//                   multiple
//                   onChange={(e) => handleFileChange('video', e, 'main')}
//                 />
//                 <Tooltip title="Insert PDF" arrow>
//                   <IconButton onClick={() => document.getElementById('pdf').click()} sx={iconButtonStyle}>
//                     <FaRegFilePdf />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="pdf"
//                   style={{ display: 'none' }}
//                   accept="application/pdf"
//                   multiple
//                   onChange={(e) => handleFileChange('pdf', e, 'main')}
//                 />
//               </Box>
//               <Tooltip title="Preview" arrow>
//                 <IconButton onClick={handlePreviewOpen} sx={iconButtonStyle}>
//                   <PreviewIcon />
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             <Box className="flex flex-col mt-4">
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
               
//   {/* <img
  
//     src={URL.createObjectURL(image)}
//     alt={`uploaded-${index}`}
//     style={{  width: '100%', height: 'auto' }}
//   /> */}   {uploadedImages.map((image, index) => {
    
//         if (!(image instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(image);
//         return (
//           <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <img src={objectURL} alt={`uploaded Image ${index}`} style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('image', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}
//                     </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                
 
//   {uploadedVideos.map((video, index) => {
//         if (!(video instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(video);
//         return (
//           <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <video src={objectURL} alt={`uploaded video' ${index}`} style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('video', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}

                   
//               </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>

//           {uploadedPdfs.map((pdf, index) => {
//         if (!(pdf instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(pdf);
//         return (
//           <div key={index} style={{ width: '48%',height:'600px' ,margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <iframe src={objectURL} alt={`uploaded pdf' ${index}`} style={{ width: '100%', height: '600px' }} />
//           <IconButton onClick={() => removeFile('pdf', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}
          
//     </div>
//             </Box>
//           </Grid>
//         </Grid>
       
//         <FormControlLabel
//           control={
//             <Switch
//               checked={showAnswerKeyEditor}
//               onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
//             />
//           }
//           label="Add Answer Type"
//         />
//            {showAnswerKeyEditor && (
//             <>
//       <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
//         <InputLabel id="answer-type-label">Select Answer Type</InputLabel>
//         <Select
//           labelId="answer-type-label"
//           value={selectedAnswerType}
//           onChange={(e) => setSelectedAnswerType(e.target.value)}
//           label="Select Answer Type"
//         >
//           <MenuItem value="answerKey">Answer Key</MenuItem>
//           <MenuItem value="modelAnswer">Model Answer</MenuItem>
//           <MenuItem value="both">Both</MenuItem>
//         </Select>
//       </FormControl>

    
//       {selectedAnswerType === 'answerKey' && (
//         <ModelAnswer
//         editorContent={answerKeyContent}
//             setEditorContent={setAnswerKeyContent}
//         images={answerKeyImages}
//             videos={answerKeyVideos}
//             pdfs={answerKeyPdfs}
//         handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
//         removeFile={(type, index) => removeFile(type, index, 'answerKey')}
//         iconButtonStyle={iconButtonStyle}
//       />
//       )}

//       {selectedAnswerType === 'modelAnswer' && (
//         <ModelAnswer
//           editorContent={modelAnswerContent}
//           setEditorContent={setModelAnswerContent}
//           images={modelAnswerImages}
//           videos={modelAnswerVideos}
//           pdfs={modelAnswerPdfs}
//           handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
//         removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
//           iconButtonStyle={iconButtonStyle}
//         />
//       )}

//       {selectedAnswerType === 'both' && (
//         <>
//           <h4>Answer Key</h4>
//           <ModelAnswer
//             editorContent={answerKeyContent}
//             setEditorContent={setAnswerKeyContent}
//             images={answerKeyImages}
//             videos={answerKeyVideos}
//             pdfs={answerKeyPdfs}
//             handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
//             removeFile={(type, index) => removeFile(type, index, 'answerKey')}
//             iconButtonStyle={iconButtonStyle}
//           />
//           <h4>Model Answer</h4>
//           <ModelAnswer
//             editorContent={modelAnswerContent}
//             setEditorContent={setModelAnswerContent}
//             images={modelAnswerImages}
//             videos={modelAnswerVideos}
//             pdfs={modelAnswerPdfs}
//             handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
//             removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
//             iconButtonStyle={iconButtonStyle}
//           />
//         </>
//       )}
//       </>
//     )}
   
        
//         {/* <FormControlLabel
//           control={
//             <Switch
//               checked={showAnswerKeyEditor}
//               onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
//             />
//           }
//           label="Add Answer Key"
//         />
//         {showAnswerKeyEditor && (
//           <div style={{ textAlign: 'center' }}>
         
//             <EditorFile
//   content={answerKeyContent}
//   onEditorChange={(newContent) => setAnswerKeyContent(newContent)}
// />
       
      
    
//             <Box className="flex flex-row justify-between mb-2 mt-4">
//               <Box className="flex flex-row">
//                 <Tooltip title="Insert Image" arrow>
//                   <IconButton onClick={() => document.getElementById('answerImage').click()} sx={iconButtonStyle}>
//                     <IoImagesSharp />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="answerImage"
//                   style={{ display: 'none' }}
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => handleFileChange('image', e, 'answerKey')}
//                 />
//                 <Tooltip title="Insert Video" arrow>
//                   <IconButton onClick={() => document.getElementById('answerVideo').click()} sx={iconButtonStyle}>
//                     <MdOutlineOndemandVideo />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="answerVideo"
//                   style={{ display: 'none' }}
//                   accept="video/*"
//                   multiple
//                   onChange={(e) => handleFileChange('video', e, 'answerKey')}
//                 />
//                 <Tooltip title="Insert PDF" arrow>
//                   <IconButton onClick={() => document.getElementById('answerPdf').click()} sx={iconButtonStyle}>
//                     <FaRegFilePdf />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="answerPdf"
//                   style={{ display: 'none' }}
//                   accept="application/pdf"
//                   multiple
//                   onChange={(e) => handleFileChange('pdf', e, 'answerKey')}
//                 />
//               </Box>
//             </Box>

//             <Box className="flex flex-col mt-4">
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              

//               {answerKeyImages.map((image, index) => {
//         if (!(image instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(image);
//         return (
//           <div key={index} style={{ width: '30%', margin: '1%' }}>
//             <img src={objectURL} alt={`Answer Key Image ${index}`} style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('image', index, 'answerKey')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}
//       </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//               {answerKeyVideos.map((video, index) => {
//         if (!(video instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(video);
//         return (
//           <div key={index} style={{ width: '30%', margin: '1%' }}>
//             <video src={objectURL} controls style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('video', index, 'answerKey')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}

//               </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//               {answerKeyPdfs.map((pdf, index) => {
//         if (!(pdf instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(pdf);
//         return (
//           <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <iframe src={objectURL} style={{ width: '100%', height: '500px' }} frameBorder="0" />
//             <IconButton onClick={() => removeFile('pdf', index, 'answerKey')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}
//     </div>
//             </Box>
//           </div>
//         )} */}

//         <FormControlLabel
//           control={
//             <Switch
//               checked={showMarkSchemeEditor}
//               onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
//             />
//           }
//           label="Add Mark Scheme"
//         />
//         {showMarkSchemeEditor && (
//           <div style={{ textAlign: 'center' }}>
//           <EditorFile
//   content={markSchemeContent}
//   onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
// />
//  <Box className="flex flex-row justify-between mb-2 mt-4">
//               <Box className="flex flex-row">
//                 <Tooltip title="Insert Image" arrow>
//                   <IconButton onClick={() => document.getElementById('markImage').click()} sx={iconButtonStyle}>
//                     <IoImagesSharp />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="markImage"
//                   style={{ display: 'none' }}
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => handleFileChange('image', e, 'markScheme')}
//                 />
//                 <Tooltip title="Insert Video" arrow>
//                   <IconButton onClick={() => document.getElementById('markVideo').click()} sx={iconButtonStyle}>
//                     <MdOutlineOndemandVideo />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="markVideo"
//                   style={{ display: 'none' }}
//                   accept="video/*"
//                   multiple
//                   onChange={(e) => handleFileChange('video', e, 'markScheme')}
//                 />
//                 <Tooltip title="Insert PDF" arrow>
//                   <IconButton onClick={() => document.getElementById('markPdf').click()} sx={iconButtonStyle}>
//                     <FaRegFilePdf />
//                   </IconButton>
//                 </Tooltip>
//                 <input
//                   type="file"
//                   id="markPdf"
//                   style={{ display: 'none' }}
//                   accept="application/pdf"
//                   multiple
//                   onChange={(e) => handleFileChange('pdf', e, 'markScheme')}
//                 />
//               </Box>
//             </Box>

//             <Box className="flex flex-col mt-4">
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//               {markSchemeImages.map((image, index) => {
//         if (!(image instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(image);
//         return (
//           <div key={index} style={{ width: '30%', margin: '1%' }}>
//             <img src={objectURL} alt={`Mark Scheme Image ${index}`} style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('image', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}

//               </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//               {markSchemeVideos.map((video, index) => {
//         if (!(video instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(video);
//         return (
//           <div key={index} style={{ width: '30%', margin: '1%' }}>
//             <video src={objectURL} controls style={{ width: '100%', height: 'auto' }} />
//             <IconButton onClick={() => removeFile('video', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}

//               </div>
//               <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//               {markSchemePdfs.map((pdf, index) => {
//         if (!(pdf instanceof Blob)) return null;
//         const objectURL = URL.createObjectURL(pdf);
//         return (
//           <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <iframe src={objectURL} style={{ width: '100%', height: '500px' }} frameBorder="0" />
//             <IconButton onClick={() => removeFile('pdf', index, 'main')}>
//               <DeleteIcon />
//             </IconButton>
//           </div>
//         );
//       })}
//               </div>
//             </Box>
//           </div>
//         )}

//         <Box display="flex" justifyContent="space-between">
//           <BackButton/>
//         <Button variant="contained"  
//         sx={{ background: '#1a73e8',color:'white'}}
//          onClick={handleSubmit}>{isEditing ? 'Update Question' : 'Save Question'} 
      
            
//             </Button>
//         </Box>
//         <ToastContainer/>
//       </Paper>
//       {loading && (
//         <Loading />
//       )}
//       </Box>
          
// )}
//       {openDisplayCard && savedData && (
//     <MainQuestionView
//         open={openDisplayCard} 
//         onClose={() => dispatch(closeDisplayCard())} 
//         savedData={savedData} 
//         handleEdit={handleEdit} 
//         handleDelete={handleDelete} 
//     />
// )}
// <> 
//       {subQuestionsButtons && (
//         <AddButtonStyle
//           onClick={handleSubQuestionButton}
//           title="Add Sub-Question"
//           buttonText='Add Sub-Question'
//           iconType="add"
//           onClose={() => setSubQuestionsButtons(false)}
//         />
//       )}

//       {showButtonGroup && (
//           <SubQuestionButtonGroup onClick={() => toggleSubQuestion}
//              onClose={() =>{
//              setShowButtonGroup (false)}}
//              handleLongQuestion={ handleLongQuestion}
//              handleMcqQuestion={handleMcqQuestion}
//   handleCloseSubQuestion={handleCloseSubQuestion}
//   subQuestions={subQuestions}
//   label={subQuestions.map(q => q.label)}
//   lonngQuestion={lonngQuestion}
//   // showMainQuestion={showMainQuestion}
//   savedData={savedData}
//           />
//           )}
        
//     </>
//     {lonngQuestion && subQuestions.map((subQuestion, index) => ( 
//         <SubQuestion 
//           key={index} 
//           label={subQuestion.label}
//           setShowButtonGroup={setShowButtonGroup}
//           setSubQuestionsButtons={setSubQuestionsButtons}
//           savedData={savedData}
//           onClose={() => handleCloseSubQuestion(index)} 
//           handleCloseSubQuestion={handleCloseSubQuestion}
//           setSubQuestions={setSubQuestions}

//         />
//       ))}
//       {lonngQuestion && subMcq.map((subMcq, index) => ( 
//         <SubMcq
//           key={index} 
//           label={subMcq.label}
//           setShowButtonGroup={setShowButtonGroup}
//           setSubQuestionsButtons={setSubQuestionsButtons}
//           savedData={savedData}
//           onClose={() => handleCloseSubMcq(index)} 
//           handleCloseSubQuestion={handleCloseSubQuestion}
//           setSubMcq={setSubMcq}

//         />
//       ))}
     

//     </Container>

//   );
// };


// export default MainQuestionCreate

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { BsPatchQuestion } from 'react-icons/bs';
// import { setPreviewId } from '../../../store/all-Id-Slice/IdSlice';
// import IconWithTitle from '../../../utilities/IconsTittle';
// import EditorFile from './MianQues/EditorFile';
// import FileUploadButton from './MianQues/FileUpload';
// import MediaPreview from './MianQues/MediaPreview';
// import { MdOutlineOndemandVideo } from 'react-icons/md';
// import { FaRegFilePdf } from 'react-icons/fa6';
// import { IoImagesSharp } from 'react-icons/io5';
// import { useCreateQuestionMutation, useDeleteQuestionMutation, useGetQuestionQuery, useUpdateQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';
// import AnswerTypeSection from './MianQues/AnswerTypeSection';
// import MainQuestionView from './MainQuestionView';
// import AddButtonStyle from './AddButtonStyle';
// import SubQuestionButtonGroup from './SubQuestionButtonGroup';
// import SubQuestion from './SubQuestion';


// const MainQuestionCreate = () => {
//   const [state, setState] = useState({
//     uploadedImages: [],
//     uploadedVideos: [],
//     uploadedPdfs: [],
//     editorContent: '',
//     showAnswerKeyEditor: false,
//     showMarkSchemeEditor: false,
//     markSchemeContent: '',
//     showButtonGroup:false ,
//     selectedAnswerType: 'answerKey',
//     expandedSubQuestions: [],
//     markSchemeImages: [],
//     markSchemeVideos: [],
//     markSchemePdfs: [],
//     subQuestionsButtons: false,
//     subQuestions: [],
//     subMcq: [],
//     showMainQuestion: true,
//     isEditing: false,
//     questionId: null,
//     numberOfLines: '',
//     studentAnswer: '',
//     answerKeyContent: '',
//     modelAnswerContent: '',
//     answerKeyImages: [],
//     answerKeyVideos: [],
//     answerKeyPdfs: [],
//     modelAnswerImages: [],
//     modelAnswerVideos: [],
//     modelAnswerPdfs: [],
//     marks: '',
//     hideComponent: true,
//     openDisplay: false,
//     loading: false,
   
//   });
//   const [lonngQuestion, setLonngQuestion] = useState(false);
//   const [subMcq, setSubMcq] = useState([]);
//   const [subQuestions, setSubQuestions] = useState([]);
//   const [savedData, setSavedData] = useState(null);
//   const [subQuestionsButtons, setSubQuestionsButtons] = useState(false);
//   const [showButtonGroup, setShowButtonGroup] = useState(false);
//   const dispatch = useDispatch();
//   const subTopicId = useSelector(state => state.idSlice.subTopicId);
//   const [expandedSubQuestions,setExpandedSubQuestions]=useState([])
//   const [createQuestion] = useCreateQuestionMutation();
//   const [updateQuestion] = useUpdateQuestionMutation();
//   const [deleteQuestion] = useDeleteQuestionMutation();
//   const { data: questionData } = useGetQuestionQuery(state.questionId, {
//     skip: !state.isEditing || typeof state.questionId !== 'string',
//   });

//   useEffect(() => {
//     if (state.isEditing && questionData) {
//       setState(prev => ({
//         ...prev,
//         editorContent: questionData.question_title || '',
//         uploadedImages: questionData.images || [],
//         uploadedVideos: questionData.videos || [],
//         uploadedPdfs: questionData.docs || [],
//         answerKeyContent: questionData.answer_key?.description || '',
//         answerKeyImages: questionData.answer_key?.images || [],
//         answerKeyVideos: questionData.answer_key?.videos || [],
//         answerKeyPdfs: questionData.answer_key?.docs || [],
//         modelAnswerContent: questionData.answer_model?.description || '',
//         modelAnswerImages: questionData.answer_model?.images || [],
//         modelAnswerVideos: questionData.answer_model?.videos || [],
//         modelAnswerPdfs: questionData.answer_model?.docs || [],
//         markSchemeContent: questionData.markscheme?.description || '',
//         markSchemeImages: questionData.markscheme?.images || [],
//         markSchemeVideos: questionData.markscheme?.videos || [],
//         markSchemePdfs: questionData.markscheme?.docs || [],
//         marks: questionData.marks || '',
//         numberOfLines: questionData.answer_line || ''
//       }));
//     }
//   }, [state.isEditing, questionData]);
//   const handleFileChange = (type, e, context) => {
//     const files = Array.from(e.target.files).filter(file => file instanceof Blob);
//     if (!files.length) return;

//     const propertyMap = {
//       main: {
//         image: 'uploadedImages',
//         video: 'uploadedVideos',
//         pdf: 'uploadedPdfs'
//       },
//       answerKey: {
//         image: 'answerKeyImages',
//         video: 'answerKeyVideos',
//         pdf: 'answerKeyPdfs'
//       },
//       modelAnswer: {
//         image: 'modelAnswerImages',
//         video: 'modelAnswerVideos',
//         pdf: 'modelAnswerPdfs'
//       },
//       markScheme: {
//         image: 'markSchemeImages',
//         video: 'markSchemeVideos',
//         pdf: 'markSchemePdfs'
//       }
//     };

//     const property = propertyMap[context]?.[type];
//     if (property) {
//       setState(prev => ({
//         ...prev,
//         [property]: [...prev[property], ...files]
//       }));
//     }
//   };

//   const removeFile = (type, index, context) => {
//     const propertyMap = {
//       main: {
//         image: 'uploadedImages',
//         video: 'uploadedVideos',
//         pdf: 'uploadedPdfs'
//       },
//       answerKey: {
//         image: 'answerKeyImages',
//         video: 'answerKeyVideos',
//         pdf: 'answerKeyPdfs'
//       },
//       modelAnswer: {
//         image: 'modelAnswerImages',
//         video: 'modelAnswerVideos',
//         pdf: 'modelAnswerPdfs'
//       },
//       markScheme: {
//         image: 'markSchemeImages',
//         video: 'markSchemeVideos',
//         pdf: 'markSchemePdfs'
//       }
//     };
   
//     const property = propertyMap[context]?.[type];
//     if (property) {
//       setState(prev => ({
//         ...prev,
//         [property]: prev[property].filter((_, i) => i !== index)
//       }));
//     }
//   };
  
//   const handleSubmit = async () => {
//     setState(prev => ({ ...prev, loading: true }));
  
//     if (!subTopicId) {
//       toast.error('No subTopicId provided.');
//       setState(prev => ({ ...prev, loading: false }));
//       return;
//     }
  
//     const formData = new FormData();
    
//     // Append basic fields
//     formData.append('question_title', state.editorContent || '');
//     formData.append('subtopic_id', subTopicId);
//     formData.append('criteria', "Yes");
//     formData.append('marks', state.marks || '');
//     formData.append('answer_line', state.numberOfLines || '');
  
//     // Append media files - using simple append like working version
//     state.uploadedImages.forEach((image) => formData.append('images', image));
//     state.uploadedVideos.forEach((video) => formData.append('videos', video));
//     state.uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));
  
//     // Answer key
//     formData.append('answer_key[description]', state.answerKeyContent || '');
//     state.answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
//     state.answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
//     state.answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));
  
//     // Model answer
//     formData.append('answer_model[description]', state.modelAnswerContent || '');
//     state.modelAnswerImages.forEach((image) => formData.append('answer_model[images]', image));
//     state.modelAnswerVideos.forEach((video) => formData.append('answer_model[videos]', video));
//     state.modelAnswerPdfs.forEach((pdf) => formData.append('answer_model[docs]', pdf));
  
//     // Mark scheme
//     formData.append('markscheme[description]', state.markSchemeContent || '');
//     state.markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
//     state.markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
//     state.markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));
  
//     try {
//       const questionId = state.isEditing ? state.questionId : null;
      
//       if (state.isEditing && !questionId) {
//         toast.error('Invalid question ID for editing');
//         setState(prev => ({ ...prev, loading: false }));
//         return;
//       }
  
//       const response = state.isEditing
//         ? await updateQuestion({ 
//             questionId, 
//             data: formData 
//           }).unwrap()
//         : await createQuestion(formData).unwrap();
  
//       const responseData = response.data || response;
//       const question = responseData.question || responseData;
  
//       // Simplified state update like working version
//       setState(prev => ({
//         ...prev,
//         savedData: responseData,
//         loading: false,
//         questionId: question.id || question._id,
//         hideComponent: false,
//         openDisplay: true
//       }));
  
//       setSubQuestionsButtons(true);
//       setSavedData(responseData.question);
//       dispatch(setPreviewId(responseData.question?.id));
  
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error(error.data?.message || 'Error submitting form');
//       setState(prev => ({ ...prev, loading: false }));
//     }
//   };
 
//   const handleDelete =()=>{
//     console.log("abcdef")
//       }
//       const  handleLongQuestion = () => {
//         if (subQuestions.length < 26) { 
//           const newLabel = String.fromCharCode(97 + subQuestions.length); 
//           setSubQuestions([...subQuestions, { label: newLabel, text: '' }]);
//         }
//         setLonngQuestion(true)
//         window.scrollTo({
//           top:100, 
//           behavior: 'smooth'
//         });
//       };
//       const handleMcqQuestion = () => {
//         if (subMcq.length < 26) {
//           const newLabel = String.fromCharCode(97 + subMcq.length);
//           setSubMcq([...subMcq, { label: newLabel, text: '' }]);
//         }
//         setLonngQuestion(true);
      
//         setTimeout(() => {
//           window.scrollTo({
//             top: document.body.scrollHeight,  
//             behavior: 'smooth',
//           });
//         }, 100); 
//       };
//       const handleCloseSubMcq = (index) => {
//         setSubMcq(prev => prev.filter((_, i) => i !== index)); 
//       };
//       const handleCloseSubQuestion = (index) => {
//         setSubQuestions(prev => prev.filter((_, i) => i !== index)); 
//       };
//       // Modified toggle function for subquestions
//       const toggleSubQuestion = (index) => {
//         setSubQuestions(prev => prev.map((q, i) => 
//           i === index ? { ...q, isOpen: !q.isOpen } : q
//         ));
//       };
    
     
//       const handleSubQuestionButton = () => {
//         setShowButtonGroup(!showButtonGroup)
//       };
     
//         const handleEdit = (id) => {
//           setState(prev => ({
//             ...prev,
//             isEditing: true,
//             questionId: id,
//             hideComponent: true,
//             openDisplay: false,
//           }));
//     // window.location.href = `/previewpage/${previewId}`;
//     // navigate(`/previewpage/${previewId}`);

//   };
//       const iconButtonStyle = {
//         color: 'white',
//         background: 'linear-gradient(90deg, #1f90fe,#74b0ec,#c571bd)',
//         width: '40px',
//         height: '40px',
//         marginRight: '8px',
//         border: '1px solid black',
//       };
//   return (
//     <div className="w-full p-4">
//       {/* Add global CSS fixes for Wiris */}
//       <style jsx global>{`
//         /* Fix Wiris formula container styles */
//         .WirisformulaContainer {
//           display: inline-block;
//           vertical-align: middle;
//           margin: 0 2px;
//         }
        
//         /* Fix Wiris formula styles */
//         .Wirisformula {
//           color: inherit;
//           background: transparent;
//         }
        
//         /* Fix TinyMCE editor container */
//         .tox-tinymce {
//           border-radius: 0.375rem !important;
//           border: 1px solid #e2e8f0 !important;
//         }
        
//         /* Fix editor content area */
//         .tox-editor-container {
//           background-color: white !important;
//         }
//       `}</style>

//       <div className='mt-14'>
//         <IconWithTitle
//           icon={BsPatchQuestion}
//           title="Statement"
//           iconColor="white"
//           backgroundColor="#1a73e8"
//           iconSize="30px"
//           titleColor="#1a73e8"
//           titleFontSize="34px"
//         />
//       </div>

//       {state.hideComponent && (
//         <div className="p-14 mb-6 border ">
//   <EditorFile
//            content={state.editorContent}
//            onEditorChange={(content) => setState({...state, editorContent: content})}
//             wirisConfig={{
//               imagesPath: '/node_modules/@wiris/mathtype-tinymce5/wirisplugin-iframe.html',
//               saveMode: 'xml'
//             }}
//           />
//           <div className="flex justify-between mt-4">
//             <div className="flex space-x-2">
//               <FileUploadButton
//                 type="image"
//                 context="main"
//                 onChange={(e) => handleFileChange('image', e, 'main')}
//                 icon={<IoImagesSharp className="text-lg"/>}
//                 tooltip="Insert Image"
//               />
//               <FileUploadButton
//                 type="video"
//                 context="main"
//                 onChange={(e) => handleFileChange('video', e, 'main')}
//                 icon={<MdOutlineOndemandVideo className="text-lg"/>}
//                 tooltip="Insert Video"
//               />
//               <FileUploadButton
//                 type="pdf"
//                 context="main"
//                 onChange={(e) => handleFileChange('pdf', e, 'main')}
//                 icon={<FaRegFilePdf className="text-lg"/>}
//                 tooltip="Insert PDF"
//               />
//             </div>
//           </div>

         
//           <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
//   {/* Images */}
//   {state.uploadedImages.map((img, index) => (
//     <MediaPreview
//       key={`img-${index}`}
//       media={img}
//       type="image"
//       onRemove={() => removeFile('image', index, 'main')}
//       context="main"
//     />
//   ))}
//   </div>
//   {/* Videos */}
//   <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
//   {state.uploadedVideos.map((video, index) => (
//     <MediaPreview
//       key={`video-${index}`}
//       media={video}
//       type="video"
//       onRemove={() => removeFile('video', index, 'main')}
//       context="main"
//     />
//   ))}
//   </div>
//   {/* PDFs */}
//   <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
//   {state.uploadedPdfs.map((pdf, index) => (
//     <MediaPreview
//       key={`pdf-${index}`}
//       media={pdf}
//       type="pdf"
//       onRemove={() => removeFile('pdf', index, 'main')}
//       context="main"
//     />
//   ))}
// </div>
//           <div className="mt-6">
//             <label className="flex items-center space-x-2 mb-4">
//               <input
//                 type="checkbox"
//                 checked={state.showAnswerKeyEditor}
//                 onChange={() => setState({...state, showAnswerKeyEditor: !state.showAnswerKeyEditor})}
//                 className="form-checkbox h-5 w-5 text-blue-600 rounded"
//               />
//               <span className="text-gray-700">Add Answer Type</span>
//             </label>

//             {state.showAnswerKeyEditor && (
//               <div className="space-y-4">
//                 <select
//                   value={state.selectedAnswerType}
//                   onChange={(e) => setState({...state, selectedAnswerType: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="answerKey">Answer Key</option>
//                   <option value="modelAnswer">Model Answer</option>
//                   <option value="both">Both</option>
//                 </select>

//                 {/* Answer Key Section */}
//                 {(state.selectedAnswerType === 'answerKey' || state.selectedAnswerType === 'both') && (
//                   <AnswerTypeSection
//                     type="answerKey"
//                     title="Answer Key"
//                     content={state.answerKeyContent}
//                     setContent={(content) => setState({...state, answerKeyContent: content})}
//                     images={state.answerKeyImages}
//                     videos={state.answerKeyVideos}
//                     pdfs={state.answerKeyPdfs}
//                     handleFileChange={handleFileChange}
//                     removeFile={removeFile}
//                   />
//                 )}

//                 {/* Model Answer Section */}
//                 {(state.selectedAnswerType === 'modelAnswer' || state.selectedAnswerType === 'both') && (
//                   <AnswerTypeSection
//                     type="modelAnswer"
//                     title="Model Answer"
//                     content={state.modelAnswerContent}
//                     setContent={(content) => setState({...state, modelAnswerContent: content})}
//                     images={state.modelAnswerImages}
//                     videos={state.modelAnswerVideos}
//                     pdfs={state.modelAnswerPdfs}
//                     handleFileChange={handleFileChange}
//                     removeFile={removeFile}
//                   />
//                 )}

//                 {/* Mark Scheme Section (independent checkbox) */}
//                 <label className="flex items-center space-x-2 mb-4 mt-6">
//                   <input
//                     type="checkbox"
//                     checked={state.showMarkSchemeEditor}
//                     onChange={() => setState({...state, showMarkSchemeEditor: !state.showMarkSchemeEditor})}
//                     className="form-checkbox h-5 w-5 text-blue-600 rounded"
//                   />
//                   <span className="text-gray-700">Add Mark Scheme</span>
//                 </label>

//                 {state.showMarkSchemeEditor && (
//                   <AnswerTypeSection
//                     type="markScheme"
//                     title="Mark Scheme"
//                     content={state.markSchemeContent}
//                     setContent={(content) => setState({...state, markSchemeContent: content})}
//                     images={state.markSchemeImages}
//                     videos={state.markSchemeVideos}
//                     pdfs={state.markSchemePdfs}
//                     handleFileChange={handleFileChange}
//                     removeFile={removeFile}
//                   />
//                 )}
//               </div>
//             )}
//           </div>
          
//           <div className="flex justify-end mt-6">
//             <button
//               onClick={handleSubmit}
//               disabled={state.loading}
//               className={`bg-blue-800 hover:bg-custom-primary text-white font-bold py-2 px-6 rounded-md transition-colors ${
//                 state.loading ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {state.loading ? 'Processing...' : state.isEditing ? 'Update Question' : 'Save Question'}
//             </button>
//           </div>
//         </div>
//       )}
// {state.openDisplay && state.savedData && (
//   <MainQuestionView
 
//     open={state.openDisplay}
//     onClose={() =>
//       setState((prev) => ({
//         ...prev,
//         openDisplay: false,
//       }))
//     }
//     savedData={savedData} 
//     handleEdit={handleEdit} 
//     handleDelete={handleDelete} 
//   />
// )}
    
//         {subQuestionsButtons && (
//         <AddButtonStyle
//           onClick={handleSubQuestionButton}
//           title="Add Sub-Question"
//           buttonText='Add Sub-Question'
//           iconType="add"
//           onClose={() => setSubQuestionsButtons(false)}
//         />
//       )} 

// {showButtonGroup && (
//           <SubQuestionButtonGroup onClick={() => toggleSubQuestion}
//           onClose={() => setShowButtonGroup(false)}
//          handleLongQuestion={ handleLongQuestion}
//              handleMcqQuestion={handleMcqQuestion}
//   handleCloseSubQuestion={handleCloseSubQuestion}
//   subQuestions={subQuestions}
//   label={subQuestions.map(q => q.label)}
//   lonngQuestion={lonngQuestion}
//   // showMainQuestion={showMainQuestion}
//   savedData={savedData}
//           />
//           )} 
//  {lonngQuestion && subQuestions.map((subQuestion, index) => ( 
//         <SubQuestion 
//           key={index} 
//           label={subQuestion.label}
//           setShowButtonGroup={setShowButtonGroup}
//           setSubQuestionsButtons={setSubQuestionsButtons}
//           savedData={savedData}
//           onClose={() => handleCloseSubQuestion(index)} 
//           handleCloseSubQuestion={handleCloseSubQuestion}
//           setSubQuestions={setSubQuestions}

//         />
//       ))}
//       {lonngQuestion && subMcq.map((subMcq, index) => ( 
//         <SubMcq
//           key={index} 
//           label={subMcq.label}
//           setShowButtonGroup={setShowButtonGroup}
//           setSubQuestionsButtons={setSubQuestionsButtons}
//           savedData={savedData}
//           onClose={() => handleCloseSubMcq(index)} 
//           handleCloseSubQuestion={handleCloseSubQuestion}
//           setSubMcq={setSubMcq}

//         />
//       ))}
     
 
//       <ToastContainer position="bottom-right" autoClose={5000} />
//     </div>
//   );
// };

// export default MainQuestionCreate;
import MainQuestionView from "./MainQuestionView";
import SubQuestionButtonGroup from "./SubQuestionButtonGroup";
import SubQuestion from './SubQuestion';
// import SubMcq from './McqQuestion/SubMcq';
import LineSelectorWithMarks from './NumberOfLineSelector';
import ModelAnswer from './ModelAnswer';

// API
import { useCreateQuestionMutation, useDeleteQuestionMutation, useGetQuestionQuery, useUpdateQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';
import { setPreviewId } from '../../../store/all-Id-Slice/IdSlice';
import { closeDisplayCard, openDisplayCard } from '../../../store/Random/StudentSlice';
import EditorFile from './MianQues/EditorFile';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BsPatchQuestion } from "react-icons/bs";
import IconWithTitle from "../../../utilities/IconsTittle";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaEye, FaFilePdf, FaImage, FaTrash } from "react-icons/fa";
import BackButton from "../../../utilities/BackButrton";
import Loader from "../../Routing/Loader";
import { useDispatch, useSelector } from "react-redux";


const MainQuestionCreate = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  const [markSchemeContent, setMarkSchemeContent] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [selectedAnswerType, setSelectedAnswerType] = useState('answerKey');
  const [expandedSubQuestions, setExpandedSubQuestions] = useState([]);
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
  const [subQuestionsButtons, setSubQuestionsButtons] = useState(false);
  const [subQuestions, setSubQuestions] = useState([]);
  const [showButtonGroup, setShowButtonGroup] = useState(false);
  const [hideComponent, setHideComponent] = useState(true);
  const [longQuestion, setLongQuestion] = useState(false);
  const [subMcq, setSubMcq] = useState([]);
  const [showMainQuestion, setShowMainQuestion] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [numberOfLines, setNumberOfLines] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [answerKeyContent, setAnswerKeyContent] = useState('');
  const [modelAnswerContent, setModelAnswerContent] = useState('');
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const [marks, setMarks] = useState('');

  // Redux
  const subTopicId = useSelector(state => state.idSlice.subTopicId);
  const previewId = useSelector((state) => state.idSlice.previewId);
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const { data: questionData } = useGetQuestionQuery(questionId, {
    skip: !isEditing || typeof questionId !== 'string',
  });

  const handleNumberOfLinesChange = (event) => setNumberOfLines(event.target.value);
  const handleStudentAnswerChange = (event) => setStudentAnswer(event.target.value);
  const handleMarksChange = (event) => setMarks(event.target.value);

  useEffect(() => {
    if (isEditing && questionData) {
      setEditorContent(questionData.question_title || '');
      setUploadedImages(questionData.images || []);
      setUploadedVideos(questionData.videos || []);
      setUploadedPdfs(questionData.docs || []);
      setAnswerKeyContent(questionData.answer_key?.description || '');
      setAnswerKeyImages(questionData.answer_key?.images || []);
      setAnswerKeyVideos(questionData.answer_key?.videos || []);
      setAnswerKeyPdfs(questionData.answer_key?.docs || []);
      setModelAnswerContent(questionData.answer_model?.description || '');
      setModelAnswerImages(questionData.answer_model?.images || []);
      setModelAnswerVideos(questionData.answer_model?.videos || []);
      setModelAnswerPdfs(questionData.answer_model?.docs || []);
      setMarkSchemeContent(questionData.markscheme?.description || '');
      setMarkSchemeImages(questionData.markscheme?.images || []);
      setMarkSchemeVideos(questionData.markscheme?.videos || []);
      setMarkSchemePdfs(questionData.markscheme?.docs || []);
    }
  }, [isEditing, questionData]);

  useEffect(() => {
    const files = [
      ...markSchemeImages,
      ...markSchemeVideos,
      ...markSchemePdfs,
      ...answerKeyImages,
      ...answerKeyVideos,
      ...answerKeyPdfs,
      ...uploadedImages,
      ...uploadedVideos,
      ...uploadedPdfs,
      ...modelAnswerImages,
      ...modelAnswerVideos,
      ...modelAnswerPdfs,
    ];
    const objectURLs = new Set();
    files.forEach(file => {
      if (file instanceof Blob) {
        const url = URL.createObjectURL(file);
        objectURLs.add(url);
      }
    });
    return () => {
      objectURLs.forEach(url => URL.revokeObjectURL(url));
    };
  }, [markSchemeImages, markSchemeVideos, markSchemePdfs, answerKeyImages, answerKeyVideos, answerKeyPdfs, modelAnswerImages, modelAnswerPdfs, modelAnswerVideos]);

  const handleLongQuestion = () => {
    if (subQuestions.length < 26) {
      const newLabel = String.fromCharCode(97 + subQuestions.length);
      setSubQuestions([...subQuestions, { label: newLabel, text: '' }]);
    }
    setLongQuestion(true);
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  };

  const handleMcqQuestion = () => {
    if (subMcq.length < 26) {
      const newLabel = String.fromCharCode(97 + subMcq.length);
      setSubMcq([...subMcq, { label: newLabel, text: '' }]);
    }
    setLongQuestion(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleCloseSubMcq = (index) => {
    setSubMcq(prev => prev.filter((_, i) => i !== index));
  };

  const handleCloseSubQuestion = (index) => {
    setSubQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubQuestionButton = () => {
    setShowButtonGroup(!showButtonGroup);
  };

  const toggleSubQuestion = (index) => {
    setExpandedSubQuestions((prev) => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const handlePreviewOpen = () => {
    setIsPreviewOpen(true);
  };

  // File management
  const updateFiles = (setter, files) => setter(prev => [...prev, ...files]);
  const removeFiles = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const handleFileChange = (type, e, context) => {
    const files = Array.from(e.target.files).filter(file => file instanceof Blob);
    
    if (!files.length) {
      console.error('No valid files selected');
      return;
    }

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
      modelAnswer: {
        image: setModelAnswerImages,
        video: setModelAnswerVideos,
        pdf: setModelAnswerPdfs,
      },
      markScheme: {
        image: setMarkSchemeImages,
        video: setMarkSchemeVideos,
        pdf: setMarkSchemePdfs,
      },
    };

    const setter = contextMap[context]?.[type];
    if (!setter) {
      console.error(`Setter function is undefined for context: ${context} and type: ${type}`);
      return;
    }
    updateFiles(setter, files);
  };

  const removeFile = (type, index, context) => {
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
      modelAnswer: {
        image: setModelAnswerImages,
        video: setModelAnswerVideos,
        pdf: setModelAnswerPdfs,
      },
    };

    const setter = contextMap[context]?.[type];
    if (setter) removeFiles(setter, index);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!subTopicId) {
      console.error('No subTopicId provided.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('question_title', editorContent);
    formData.append('subtopic_id', subTopicId);
    formData.append('criteria', "Yes");
    formData.append('marks', marks);
    formData.append('answer_line', numberOfLines);

    uploadedImages.forEach((image) => formData.append('images', image));
    uploadedVideos.forEach((video) => formData.append('videos', video));
    uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));
    
    formData.append('answer_key[description]', answerKeyContent);
    answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
    answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
    answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));

    formData.append('markscheme[description]', markSchemeContent);
    markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
    markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
    markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));

    formData.append('answer_model[description]', modelAnswerContent);
    modelAnswerImages.forEach((image) => formData.append('answer_model[images]', image));
    modelAnswerVideos.forEach((video) => formData.append('answer_model[videos]', video));
    modelAnswerPdfs.forEach((pdf) => formData.append('answer_model[docs]', pdf));

    const questionId = isEditing ? savedData?.question?.id : null;
    if (isEditing && !questionId) {
      console.error('Invalid questionId for editing.');
      setLoading(false);
      return;
    }

    try {
      const response = isEditing
        ? await updateQuestion({ questionId, formData }).unwrap()
        : await createQuestion(formData).unwrap();
    
      const savedDataview = response.data;
      setSavedData(savedDataview);
      dispatch(setPreviewId(response.data?.question?.id));
      dispatch(openDisplayCard());
      setSubQuestionsButtons(true);
      setHideComponent(false);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(previewId).unwrap();
      toast.success('Question deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    setQuestionId(id);
    setHideComponent(true);
    dispatch(closeDisplayCard());
  };

  return (
    <div className="container mt-[-20px] text-center w-[100%]">
     <div className="">
     <IconWithTitle
        icon={BsPatchQuestion}
        title="Statement"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />
     </div>
     <div className="">
     <IconWithTitle
        icon={BsPatchQuestion}
        title="Statement"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />
     </div>
      {hideComponent && (
        <div className="p-4">
          <div className="border border-gray-300 rounded-lg p-4">
            <LineSelectorWithMarks 
              handleMarksChange={handleMarksChange}
              numberOfLines={numberOfLines}
              marks={marks}
              handleNumberOfLinesChange={handleNumberOfLinesChange}
            />

            <EditorFile
              content={editorContent}
              onEditorChange={(newContent) => setEditorContent(newContent)}
            />

            <div className="flex justify-between mb-2 mt-4">
              <div className="flex">
                <button
                  onClick={() => document.getElementById('image').click()}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                  title="Insert Image"
                >
                  <FaImage className="text-sm" />
                </button>
                <input
                  type="file"
                  id="image"
                  name='images'
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange('image', e, 'main')}
                />

                <button
                  onClick={() => document.getElementById('video').click()}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                  title="Insert Video"
                >
                  <MdOutlineOndemandVideo className="text-sm" />
                </button>
                <input
                  type="file"
                  id="video"
                  className="hidden"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange('video', e, 'main')}
                />

                <button
                  onClick={() => document.getElementById('pdf').click()}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                  title="Insert PDF"
                >
                  <FaFilePdf className="text-sm" />
                </button>
                <input
                  type="file"
                  id="pdf"
                  className="hidden"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => handleFileChange('pdf', e, 'main')}
                />
              </div>

              <button
                onClick={handlePreviewOpen}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white border border-black"
                title="Preview"
              >
                <FaEye className="text-sm" />
              </button>
            </div>

            <div className="flex flex-col mt-4">
              <div className="flex flex-wrap">
                {uploadedImages.map((image, index) => {
                  if (!(image instanceof Blob)) return null;
                  const objectURL = URL.createObjectURL(image);
                  return (
                    <div key={index} className="w-[48%] m-[1%] flex items-center justify-between">
                      <img src={objectURL} alt={`uploaded Image ${index}`} className="w-full h-auto" />
                      <button
                        onClick={() => removeFile('image', index, 'main')}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap">
                {uploadedVideos.map((video, index) => {
                  if (!(video instanceof Blob)) return null;
                  const objectURL = URL.createObjectURL(video);
                  return (
                    <div key={index} className="w-[48%] m-[1%] flex items-center justify-between">
                      <video src={objectURL} alt={`uploaded video ${index}`} className="w-full h-auto" controls />
                      <button
                        onClick={() => removeFile('video', index, 'main')}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap">
                {uploadedPdfs.map((pdf, index) => {
                  if (!(pdf instanceof Blob)) return null;
                  const objectURL = URL.createObjectURL(pdf);
                  return (
                    <div key={index} className="w-[48%] h-[600px] m-[1%] flex items-center justify-between">
                      <iframe src={objectURL} alt={`uploaded pdf ${index}`} className="w-full h-full" />
                      <button
                        onClick={() => removeFile('pdf', index, 'main')}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center mt-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAnswerKeyEditor}
                  onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">Add Answer Type</span>
              </label>
            </div>

            {showAnswerKeyEditor && (
              <>
                <div className="w-full mb-4">
                  <label htmlFor="answer-type" className="block mb-2 text-sm font-medium text-gray-900">Select Answer Type</label>
                  <select
                    id="answer-type"
                    value={selectedAnswerType}
                    onChange={(e) => setSelectedAnswerType(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="answerKey">Answer Key</option>
                    <option value="modelAnswer">Model Answer</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {selectedAnswerType === 'answerKey' && (
                  <ModelAnswer
                    editorContent={answerKeyContent}
                    setEditorContent={setAnswerKeyContent}
                    images={answerKeyImages}
                    videos={answerKeyVideos}
                    pdfs={answerKeyPdfs}
                    handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                    removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                    buttonStyle="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                  />
                )}

                {selectedAnswerType === 'modelAnswer' && (
                  <ModelAnswer
                    editorContent={modelAnswerContent}
                    setEditorContent={setModelAnswerContent}
                    images={modelAnswerImages}
                    videos={modelAnswerVideos}
                    pdfs={modelAnswerPdfs}
                    handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
                    removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
                    buttonStyle="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                  />
                )}

                {selectedAnswerType === 'both' && (
                  <>
                    <h4 className="text-lg font-semibold mt-4">Answer Key</h4>
                    <ModelAnswer
                      editorContent={answerKeyContent}
                      setEditorContent={setAnswerKeyContent}
                      images={answerKeyImages}
                      videos={answerKeyVideos}
                      pdfs={answerKeyPdfs}
                      handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                      removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                      buttonStyle="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                    />
                    <h4 className="text-lg font-semibold mt-4">Model Answer</h4>
                    <ModelAnswer
                      editorContent={modelAnswerContent}
                      setEditorContent={setModelAnswerContent}
                      images={modelAnswerImages}
                      videos={modelAnswerVideos}
                      pdfs={modelAnswerPdfs}
                      handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
                      removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
                      buttonStyle="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                    />
                  </>
                )}
              </>
            )}

            <div className="flex items-center mt-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMarkSchemeEditor}
                  onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">Add Mark Scheme</span>
              </label>
            </div>

            {showMarkSchemeEditor && (
              <div className="text-center mt-4">
                <EditorFile
                  content={markSchemeContent}
                  onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
                />

                <div className="flex justify-between mb-2 mt-4">
                  <div className="flex">
                    <button
                      onClick={() => document.getElementById('markImage').click()}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                      title="Insert Image"
                    >
                      <FaImage className="text-sm" />
                    </button>
                    <input
                      type="file"
                      id="markImage"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('image', e, 'markScheme')}
                    />

                    <button
                      onClick={() => document.getElementById('markVideo').click()}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                      title="Insert Video"
                    >
                      <MdOutlineOndemandVideo className="text-sm" />
                    </button>
                    <input
                      type="file"
                      id="markVideo"
                      className="hidden"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileChange('video', e, 'markScheme')}
                    />

                    <button
                      onClick={() => document.getElementById('markPdf').click()}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-custom-primary text-white mr-2 border border-black"
                      title="Insert PDF"
                    >
                      <FaFilePdf className="text-sm" />
                    </button>
                    <input
                      type="file"
                      id="markPdf"
                      className="hidden"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => handleFileChange('pdf', e, 'markScheme')}
                    />
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <div className="flex flex-wrap">
                    {markSchemeImages.map((image, index) => {
                      if (!(image instanceof Blob)) return null;
                      const objectURL = URL.createObjectURL(image);
                      return (
                        <div key={index} className="w-[30%] m-[1%]">
                          <img src={objectURL} alt={`Mark Scheme Image ${index}`} className="w-full h-auto" />
                          <button
                            onClick={() => removeFile('image', index, 'main')}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap">
                    {markSchemeVideos.map((video, index) => {
                      if (!(video instanceof Blob)) return null;
                      const objectURL = URL.createObjectURL(video);
                      return (
                        <div key={index} className="w-[30%] m-[1%]">
                          <video src={objectURL} controls className="w-full h-auto" />
                          <button
                            onClick={() => removeFile('video', index, 'main')}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap">
                    {markSchemePdfs.map((pdf, index) => {
                      if (!(pdf instanceof Blob)) return null;
                      const objectURL = URL.createObjectURL(pdf);
                      return (
                        <div key={index} className="w-[48%] m-[1%] flex items-center justify-between">
                          <iframe src={objectURL} className="w-full h-[500px] border-0" />
                          <button
                            onClick={() => removeFile('pdf', index, 'main')}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <BackButton/>
              <button
                onClick={handleSubmit}
                className="bg-[#1a73e8] text-white px-4 py-2 rounded"
              >
                {isEditing ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </div>
          <ToastContainer/>
        </div>
      )}

      {loading && <Loader/>}

      {savedData && (
        <MainQuestionView
          savedData={savedData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}

      {subQuestionsButtons && (
        <button
          onClick={handleSubQuestionButton}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
        Add Sub-Question
        </button>
      )}

      {showButtonGroup && (
        <SubQuestionButtonGroup
          onClick={() => toggleSubQuestion}
          onClose={() => setShowButtonGroup(false)}
          handleLongQuestion={handleLongQuestion}
          handleMcqQuestion={handleMcqQuestion}
          handleCloseSubQuestion={handleCloseSubQuestion}
          subQuestions={subQuestions}
          label={subQuestions.map(q => q.label)}
          longQuestion={longQuestion}
          savedData={savedData}
        />
      )}

      {longQuestion && subQuestions.map((subQuestion, index) => (
        <SubQuestion
          key={index}
          label={subQuestion.label}
          setShowButtonGroup={setShowButtonGroup}
          setSubQuestionsButtons={setSubQuestionsButtons}
          savedData={savedData}
          onClose={() => handleCloseSubQuestion(index)}
          handleCloseSubQuestion={handleCloseSubQuestion}
          setSubQuestions={setSubQuestions}
        />
      ))}

      {/* {longQuestion && subMcq.map((subMcq, index) => (
        <SubMcq
          key={index}
          label={subMcq.label}
          setShowButtonGroup={setShowButtonGroup}
          setSubQuestionsButtons={setSubQuestionsButtons}
          savedData={savedData}
          onClose={() => handleCloseSubMcq(index)}
          handleCloseSubQuestion={handleCloseSubQuestion}
          setSubMcq={setSubMcq}
        />
      ))} */}
    </div>
  );
};

export default MainQuestionCreate;