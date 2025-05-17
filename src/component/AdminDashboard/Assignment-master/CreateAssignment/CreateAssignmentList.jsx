// import  { useEffect, useRef, useState } from 'react';

// import '@wiris/mathtype-tinymce5';
// import 'tinymce/skins/content/default/content.css';
// import {useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import qrCode from '../../../../assets/qr-test.png';
// import 'react-toastify/dist/ReactToastify.css';
// import { RiDeleteBin3Line } from 'react-icons/ri';
// import { CiEdit } from 'react-icons/ci';
// import { toast, ToastContainer } from 'react-toastify';
// import { setQuestionEdit, setSelectedId, setSelectedSubChildquestionId, setSelectedSubquestionId } from '../../../store/all-Id-Slice/IdSlice';

// import { PiArrowULeftUpBold } from 'react-icons/pi';
// import { API_URL_Images, API_URL_PDF, API_URL_Videos } from '../../Quetsion-master/Create-Question/FinalPreviwe';

// // import ModelAnswerDialog from './ModelAnswerDialog';
// import { useDeleteSubChildQuestionMutation, useDeleteSubQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';
// import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
// import { Api } from '../../../Api/Api';
// import ScrollUpComponent from '../../../utilities/ScroolupComponent';
// import { CgKeyboard } from 'react-icons/cg';
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
// import CreateFilterData from './CreateFilterData';
// import SaveAssignmentDailogue from './SaveAssignmentDailogue';
// import { FiDelete } from 'react-icons/fi';
// import PdfDialog from './PdfComponnet';
// import MarkSchemeComponent from './MarkSchemeComponnr';
// import ModelAnswerDialog from './ModelAnswerDialog';
// import VdoComponent from './VdoComponnet';
// import AnswerKeyDialog from './AnswerKeyComponent';
// import DeleteComponent from './DeleteComponnet';

// const CreateAssignmentIcon = (props) => (
//   <SvgIcon {...props}>
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-10v4h4v-2h-2V8h-2v2H8v2h4z" />
//   </SvgIcon>
// );

// const CreateAssignmentList = () => {
//   const [selectAll, setSelectAll] = useState(false);
//   const [showAssignmentPreview, setShowAssignmentPreview] = useState(false); 
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedQuestionToDelete, setSelectedQuestionToDelete] = useState(null);
//   const [markschemeContent, setMarkschemeContent] = useState(null);
//   const [activeMarkschemeIndex, setActiveMarkschemeIndex] = useState(null);
//   const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
//   const [assignmentName, setAssignmentName] = useState('');
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [questions, setQuestions] = useState([]);
//   const [showSaveSuccess, setShowSaveSuccess] = useState(false);
// const [showSaveError, setShowSaveError] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [openMarkSchemeDialog, setOpenMarkSchemeDialog] = useState(false);
  
//   const [openAnswerKeyDialog, setOpenAnswerKeyDialog] = useState(false);

// const [selectedQuestions, setSelectedQuestions] = useState([]);
// const [selectedSubquestions, setSelectedSubquestions] = useState([]);
// const [selectedSubchildquestions, setSelectedSubchildquestions] = useState([]);

// const [filteredQuestions, setFilteredQuestionsState] = useState([]);

// const [answerKeyContent, setAnswerKeyContent] = useState([]);
// const [activeAnswerKeyIndex, setActiveAnswerKeyIndex] = useState(null);


// const [modelAnswerContent, setModelAnswerContent] = useState([]);
// const [activeModelAnswerIndex, setActiveModelAnswerIndex] = useState(null);

// const [subjects, setSubjects] = useState([]);
// const [selectedSubjectId, setSelectedSubjectId] = useState('');
// const [printOptions, setPrintOptions] = useState({
//   showQuestion: true,
//   showAnswerKey: true,
//   showMarkScheme: true,
//   showSubquestions: true,
//   showSubchildquestions: true,
//   coverLetter:true,
//   lineSpceForAnswer: true,
//  subtopicDetails: true,
// });
//   const [saveAssignmentDialogOpen, setSaveAssignmentDialogOpen] = useState(false);
//   const [coverLetterDetails, setCoverLetterDetails] = useState({
//     studentName: '',
//     level: '',
//     grade: '',
//     subject: '',
//     date: null ,
//     duration: '',
//     component: '',
//     totalMarks: '',
//     topicName: '',
//     testType: '',
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const selectedId = useSelector((state) => state.idSlice.selectedId);

//   const assignmentBoardId = useSelector((state) => state.idSlice.assignmentBoardId );
//   const assignmentSubjectLevelId = useSelector((state) => state.idSlice.assignmentSubjectLevelId);
//   const assignmentSubjectId = useSelector((state) => state.idSlice.assignmentSubjectId);
//   const assignmentPaperId = useSelector((state) => state.idSlice.assignmentPaperId);
//   const assignmentSourceId = useSelector((state) => state.idSlice.assignmentSourceId);

//   const [pdfContent, setPdfContent] = useState([]);
//   const [activePdfIndex, setActivePdfIndex] = useState(null);
 
// // State variables
// const [videoContent, setVideoContent] = useState([]);
// const [activeVideoIndex, setActiveVideoIndex] = useState(null);

// // Handler function

// console.log(assignmentSubjectLevelId,"assignmentSubjectLevelId")
//   const selectedSubquestionId = useSelector((state) => state.idSlice.selectedSubquestionId);
 
//   const [openDialog, setOpenDialog] = useState(false)
//   const navigate = useNavigate();
//   const qrCodeRef = useRef();
//   const dispatch = useDispatch();
//   const [deleteQuestion] = useDeleteSubQuestionMutation();
//   const userResponse = useSelector(state => state.idSlice.userResponse);
//   const selectedTeacher = userResponse?.usertype_id;
//   const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();  
//   const [deletesubchildQuestion] = useDeleteSubChildQuestionMutation();
//   const handleDeleteDialogClose = () => {
//     setDeleteDialogOpen(false);
//   };

//   const handleDeleteSuccessDialogClose = () => {
//     setDeleteSuccessDialogOpen(false);
//   };
 
//   const handleDeleteDialogOpen = (question) => {
//     console.log('Opening delete dialog for:', question);
//     setSelectedQuestionToDelete(question);
//     setDeleteDialogOpen(true);
// };

//   console.log("Selected subjectlevel abcde.............:", assignmentSubjectLevelId , assignmentBoardId);


// const handleCloseDialog = () => {
//   setOpenDialog(false);
// };

// const handleDeleteSubQuestionDialogOpen = (id) => {
//   dispatch(setSelectedSubquestionId(id));
//   setOpenDialog(true);
// }
// const handleDeleteSubquestionChild = async (subquestionChildId) => {
//   if (!subquestionChildId) {
//     console.error('No subquestion child ID provided for deletion.');
//     return;
//   }
//   const confirmation = window.confirm('Are you sure you want to delete this subquestion child?');

//   if (!confirmation) {
//     return;
//   }
//   setLoading(true);

//   try {
//     await deletesubchildQuestion(subquestionChildId).unwrap(); 
//     toast.success('Subquestion child deleted successfully!');
//     fetchQuestions(); 

//   } catch (error) {
//     console.error('Error deleting subquestion child:', error);
//     toast.error('Failed to delete the subquestion child. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };
// const handleSubquestionSelect = (subquestionId) => {
//   setSelectedSubquestions((prevSelectedSubquestions) =>
//     prevSelectedSubquestions.includes(subquestionId)
//       ? prevSelectedSubquestions.filter((id) => id !== subquestionId)
//       : [...prevSelectedSubquestions, subquestionId]
//   );
// };

// const handleSubchildquestionSelect = (subchildquestionId) => {
//   setSelectedSubchildquestions((prevSelectedSubchildquestions) =>
//     prevSelectedSubchildquestions.includes(subchildquestionId)
//       ? prevSelectedSubchildquestions.filter((id) => id !== subchildquestionId)
//       : [...prevSelectedSubchildquestions, subchildquestionId]
//   );
// }
//   const assignmentSubTopicId = useSelector(state => state.idSlice.assignmentSubTopicId);
//   const API_URL = `http://myrevisionplus.com/api/img/question/`;
//   const fetchQuestions = async () => {
//     try {
//       const payload = { subtopic_id: [assignmentSubTopicId] };
//       const response = await Api.post(`questions/questionlist/all`, payload);
//       const data = response.data;
  
//       if (data.status === 'success') {
//         // Extract the nested questions array correctly
//         const fetchedQuestions = data?.data?.questions[0]?.questions || [];
//         setQuestions(fetchedQuestions);
//         setFilteredQuestionsState(fetchedQuestions); // Sync both states
//         console.log('Fetched Questions:', fetchedQuestions);
//         dispatch(setQuestionEdit(fetchedQuestions));
//       } else {
//         throw new Error('Failed to fetch data');
//       }
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   useEffect(() => {
//     if (assignmentSubTopicId) { // Check if subtopic IDs are available
//       setLoading(true);
//       fetchQuestions();
//     }
//   }, [assignmentSubTopicId]); // Trigger when selectedSubtopicId changes
   
//   const handleDelete = async () => {
//     if (!selectedSubquestionId) {
//       console.error('No subQuestionId provided for deletion.');
//       return;
//     }

//     setLoading(true);

//     try {
//       await deleteQuestion(selectedSubquestionId).unwrap();
//       toast.success('Question deleted successfully!');
    
     

//       fetchQuestions(); 

//       handleCloseDialog(); 
//     } catch (error) {
//       console.error('Error deleting question:', error);
//       toast.error('Failed to delete the question. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
 

// useEffect(() => {
//   const script = document.createElement('script');
//   script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
//   script.async = true;
//   document.body.appendChild(script);

//   script.onload = () => {
//     if (window.Wiris) {
//       window.Wiris.config.saveMode = 'xml';
//       console.log('Wiris saveMode set to XML.');
//     }
//   };

//   return () => {
//     document.body.removeChild(script);
//   };
// }, 

// [questions,openMarkSchemeDialog,openAnswerKeyDialog,showAssignmentPreview ,printOptions, filteredQuestions, selectedQuestions, coverLetterDetails, qrCode]
// );
// useEffect(() => {
//   if (questions?.questions) {
//     setSelectAll(selectedQuestions.size === questions.questions.length);
//   }
// }, [selectedQuestions, questions?.questions]);
// useEffect(() => {
//   setFilteredQuestionsState(questions?.questions || questions || []);
// }, [questions]);

// const handleMarkSchemeOpen = (type, index) => {
//   const question = filteredQuestions[index];
//   let allMarkschemes = [];

//   // Add main question markscheme if exists
//   if (question.markscheme) {
//     allMarkschemes.push({
//       type: 'Question',
//       content: question.markscheme,
//       identifier: `${index + 1}`
//     });
//   }

//   // Add subquestions markschemes
//   question.subquestions?.forEach((subq, subIndex) => {
//     if (subq.markscheme) {
//       allMarkschemes.push({
//         type: 'Subquestion',
//         content: subq.markscheme,
//         identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})`
//       });
//     }

//     // Add subchildquestions markschemes
//     subq.subchildquestions?.forEach((subchild, childIndex) => {
//       if (subchild.markscheme) {
//         allMarkschemes.push({
//           type: 'Subchildquestion',
//           content: subchild.markscheme,
//           identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})(${toRoman(childIndex + 1)})`
//         });
//       }
//     });
//   });

//   setMarkschemeContent(allMarkschemes);
//   setActiveMarkschemeIndex(index);
// };
// const handleAnswerKeyOpen = (type, index) => {
//   const question = filteredQuestions[index];
//   let allAnswerKeys = [];

//   // Add main question answer key if exists
//   if (question.answer_key) {
//     allAnswerKeys.push({
//       type: 'Question',
//       content: question.answer_key,
//       identifier: `${index + 1}`
//     });
//   }

//   // Add subquestions answer keys
//   question.subquestions?.forEach((subq, subIndex) => {
//     if (subq.answer_key) {
//       allAnswerKeys.push({
//         type: 'Subquestion',
//         content: subq.answer_key,
//         identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})`
//       });
//     }

//     // Add subchildquestions answer keys
//     subq.subchildquestions?.forEach((subchild, childIndex) => {
//       if (subchild.answer_key) {
//         allAnswerKeys.push({
//           type: 'Subchildquestion',
//           content: subchild.answer_key,
//           identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})(${toRoman(childIndex + 1)})`
//         });
//       }
//     });
//   });

//   setAnswerKeyContent(allAnswerKeys);
//   setActiveAnswerKeyIndex(index);
// };

// const handleModelAnswerOpen = (type, index) => {
//   const question = filteredQuestions[index];
//   let allModelAnswers = [];

//   // Main question model answer
//   if (question.answer_model) {
//     allModelAnswers.push({
//       type: 'Question',
//       content: question.answer_model,
//       identifier: `${index + 1}`
//     });
//   }

//   // Subquestions model answers
//   question.subquestions?.forEach((subq, subIndex) => {
//     if (subq.answer_model) {
//       allModelAnswers.push({
//         type: 'Subquestion',
//         content: subq.answer_model,
//         identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})`
//       });
//     }

//     // Subchildquestions model answers
//     subq.subchildquestions?.forEach((subchild, childIndex) => {
//       if (subchild.answer_model) {
//         allModelAnswers.push({
//           type: 'Subchildquestion',
//           content: subchild.answer_model,
//           identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})(${toRoman(childIndex + 1)})`
//         });
//       }
//     });
//   });

//   setModelAnswerContent(allModelAnswers);
//   setActiveModelAnswerIndex(index);
// };
// const handleVideoOpen = (index) => {
//   const question = filteredQuestions[index];
//   let allVideos = [];

//   // Main question videos
//   if (question.videos && question.videos.length > 0) {
//     allVideos.push({
//       type: 'Question',
//       videos: question.videos,
//       identifier: `${index + 1}`
//     });
//   }

//   // Subquestions videos
//   question.subquestions?.forEach((subq, subIndex) => {
//     if (subq.videos && subq.videos.length > 0) {
//       allVideos.push({
//         type: 'Subquestion',
//         videos: subq.videos,
//         identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})`
//       });
//     }

//     // Subchildquestions videos
//     subq.subchildquestions?.forEach((subchild, childIndex) => {
//       if (subchild.videos && subchild.videos.length > 0) {
//         allVideos.push({
//           type: 'Subchildquestion',
//           videos: subchild.videos,
//           identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})(${toRoman(childIndex + 1)})`
//         });
//       }
//     });
//   });

//   setVideoContent(allVideos);
//   setActiveVideoIndex(index);
// };
// const handleSelectAll = () => {
//   if (selectAll) {
//     // Deselect all questions, subquestions, and subchild questions
//     setSelectedQuestions([]);
//     setSelectedSubquestions([]);
//     setSelectedSubchildquestions([]);
//   } else {
//     // Select all questions
//     const allQuestions = filteredQuestions.map((q) => q._id);

//     // Select all subquestions and subchild questions
//     const allSubquestions = filteredQuestions
//       .flatMap((q) => q.subquestions || [])
//       .map((subq) => subq._id);

//     const allSubchildquestions = filteredQuestions
//       .flatMap((q) => q.subquestions || [])
//       .flatMap((subq) => subq.subchildquestions || [])
//       .map((subchildq) => subchildq._id);

//     // Update the state
//     setSelectedQuestions(allQuestions);
//     setSelectedSubquestions(allSubquestions);
//     setSelectedSubchildquestions(allSubchildquestions);
//   }

//   // Toggle the select all state
//   setSelectAll((prev) => !prev);
// };


// const handleDeleteQuestion = async () => {
//   try {
//     const response = await Api.delete(`questions/ques/${selectedQuestionToDelete?._id}`);
    
//     if (response.status !== 200) {
//       throw new Error('Failed to delete the question');
//     }

//     setFilteredQuestionsState(prevQuestions =>
//       prevQuestions.filter(question => question._id !== selectedQuestionToDelete?._id)
//     );

//     setDeleteDialogOpen(false);
//     setDeleteSuccessDialogOpen(true);
//   } catch (error) {
//     console.error('Error deleting question:', error.message);
//   }
// };
// const toRoman = (num) => {
//     const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
//     return romanMap[num - 1] || num;
//   };
 

// useEffect(() => {
//   const fetchSubjects = async () => {
//     try {
//       const response = await Api.get('categorys/subject');
//       console.log(response.data); 
//       setSubjects(response.data.data.subjects || []); 
//     } catch (error) {
//       console.error('Error fetching subjects:', error);
//     }
//   };

//   fetchSubjects(); 
// }, []);
// useEffect(() => {
//   if (assignmentSubjectId && subjects.length > 0) {
//     const selectedSubject = subjects.find(subject => subject._id === assignmentSubjectId);
//     if (selectedSubject) {
//       setCoverLetterDetails({
//         subject: selectedSubject._id,
//         subjectName: selectedSubject.subject_name,
//         subjectId: selectedSubject._id
//       });
//       setSelectedSubjectId(selectedSubject._id);
//     }
//   }
// }, [assignmentSubjectId, subjects]); // Jab subjects API se load ho ya Redux value aaye
// useEffect(() => {
//   if (assignmentBoardId && assignmentSubjectId) {
//     const selectedCategory = categories?.categories?.find(cat => cat._id === assignmentBoardId);
//     const selectedSubject = selectedCategory?.subjects?.find(sub => sub._id === assignmentSubjectId);
    
//     if (selectedSubject && selectedSubject.subjectlevels.length > 0) {
//       const defaultLevel = selectedSubject.subjectlevels[0]; // First level as default
//       setCoverLetterDetails(prevDetails => ({
//         ...prevDetails,
//         level: defaultLevel.subject_level_name,
//         levelName: defaultLevel._id,
//       }));
//     }
//   }
// }, [assignmentBoardId, assignmentSubjectId, categories]);
// const handleCoverLetterChange = (event) => {       
//   const { name, value } = event.target;       
//   setCoverLetterDetails((prevDetails) => ({         
//     ...prevDetails,         
//     [name]: value,       
//   }));        

//   if (name === 'subject') {         
//     const selectedSubject = subjects.find(subject => subject._id === value);         
//     if (selectedSubject) {           
//       setCoverLetterDetails((prevDetails) => ({             
//         ...prevDetails,             
//         subjectName: selectedSubject.subject_name,              
//         subjectId: selectedSubject._id,                      
//       }));           
//       setSelectedSubjectId(selectedSubject._id);          
//     }       
//   }     
// }; 
// useEffect(() => {
//   if (assignmentBoardId && assignmentSubjectId && assignmentSubjectLevelId ) {
//     const selectedCategory = categories?.categories?.find(cat => cat._id === assignmentBoardId);
//     const selectedSubject = selectedCategory?.subjects?.find(sub => sub._id === assignmentSubjectId);
//     const selectedLevel = selectedSubject?.subjectlevels?.find(level => level._id === assignmentSubjectLevelId);
//     const selectedSource = selectedLevel?.sources?.find(source => source._id === assignmentSourceId);

//     if (selectedSource && selectedSource.papers.length > 0) {
//       const defaultPaper = selectedSource.papers[0]; // First paper as default
//       setCoverLetterDetails(prevDetails => ({
//         ...prevDetails,
//         paper: defaultPaper._id,
//         component: defaultPaper.paper_name
//       }));
//     }
//   }
// }, [assignmentBoardId, assignmentSubjectId, assignmentSubjectLevelId, assignmentSourceId, categories]);


   
//   const handleSubmit = (event) => {
//     event.preventDefault();
  
//     setShowAssignmentPreview(true);
//   };
//   const handlePdfOpen = (index) => {
//     const question = filteredQuestions[index];
//     let allPdfs = [];
  
//     // Main question PDFs
//     if (question.docs && question.docs.length > 0) {
//       allPdfs.push({
//         type: 'Question',
//         docs: question.docs,
//         identifier: `${index + 1}`
//       });
//     }
  
//     // Subquestions PDFs
//     question.subquestions?.forEach((subq, subIndex) => {
//       if (subq.docs && subq.docs.length > 0) {
//         allPdfs.push({
//           type: 'Subquestion',
//           docs: subq.docs,
//           identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})`
//         });
//       }
  
//       // Subchildquestions PDFs
//       subq.subchildquestions?.forEach((subchild, childIndex) => {
//         if (subchild.docs && subchild.docs.length > 0) {
//           allPdfs.push({
//             type: 'Subchildquestion',
//             docs: subchild.docs,
//             identifier: `${index + 1}(${String.fromCharCode(97 + subIndex)})(${toRoman(childIndex + 1)})`
//           });
//         }
//       });
//     });
  
//     setPdfContent(allPdfs);
//     setActivePdfIndex(index);
//   };
 
 
  
//   const handleOptionChange = (event) => {
//     const { name, checked } = event.target;
//     setPrintOptions((prevOptions) => ({
//       ...prevOptions,
//       [name]: checked, 
//     }));
//   };
  
 

//   const handleQuestionSelect = (questionId) => {
//     setSelectedQuestions((prevSelectedQuestions) =>
//       prevSelectedQuestions.includes(questionId)
//         ? prevSelectedQuestions.filter((id) => id !== questionId)
//         : [...prevSelectedQuestions, questionId]
//     );
//   };



 
// const renderMediaForPrint = (mediaArray, type) => {
//   if (!mediaArray || mediaArray.length === 0) return '';

//   return mediaArray.map((media, index) => {
//       const mediaUrl = `${API_URL_Images}${media}`;
//       if (type === 'image') {
//           return `<img src="${mediaUrl}" alt="Image ${index + 1}" style="max-width: 100%; height: auto;" />`;
//       } else if (type === 'pdf') {
//           return `
//               <div>
//                   <embed src="${mediaUrl}" type="application/pdf" width="100%" height="600px" />
//                   <br />
//                   <a href="${mediaUrl}" download="document.pdf" style="display: inline-block; margin-top: 10px; text-decoration: none; color: blue;">
//                       Download PDF
//                   </a>
//               </div>
//           `;
//       }
//       return '';
//   }).join('');
// };         
//   const calculateTotalMarks = (question) => {
//     let totalMarks = 0;
  
//     question.subquestions?.forEach((subquestion) => {
//       totalMarks += calculateSubquestionMarks(subquestion); 
//     });
  
//     return totalMarks || Number(question.marks) || 0;
//   };
//   const calculateSubquestionMarks = (subquestion) => {
//     let subquestionMarks = 0;
//     if (subquestion.subchildquestions?.length > 0) {
     
//       subquestionMarks = calculateSubchildMarks(subquestion);
//     } else {
      
//       if (selectedSubquestions.includes(subquestion._id)) {
//         subquestionMarks = Number(subquestion.marks) || 0; 
//       }
//     }
  
//     return subquestionMarks; 
//   };
  
//   const calculateSubchildMarks = (subquestion) => {
//     let subchildMarks = 0;
  
//     subquestion.subchildquestions?.forEach((subchildquestion) => {
//       if (selectedSubchildquestions.includes(subchildquestion._id)) {
//         subchildMarks += Number(subchildquestion.marks) || 0; 
//       }
//     });
  
//     return subchildMarks;
//   };
    
//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//    const handleSaveAssignment1=()=>{
//     setSaveAssignmentDialogOpen(true);
//   }
//   const handlePrint = () => {
    
//     const printWindow = window.open('', 'IB Global Academy');
//     let printContent = `
//       <html>
//         <head>
//           <title>--IB Global Academy--</title>
//           <style>
//             body {
//             font-family: Calibri, sans-serif;
//             font-size: 16px
//         padding:40px;
            
//           }
//           h2, h3, h4 {
//             font-size: 17px;
//           }
//        @page {
//  padding:40px;
// }
//           .no-break {
//             page-break-inside: avoid;
//           }
//           .page-break {
//             page-break-before: always;
//              padding-top: 30px;
        
//           }
//                .question {
//             page-break-inside: avoid;
//             padding:5px
//           }
//           .marks {
//             display: flex;
//             justify-content: end;
//             font-weight: bold;
//           }
           
//             .details-container {
//               border: 1px solid black;
//               padding:10px;
             
//             }
  

// .ib-global-header img {
//   width: 120px; 
//   height: auto;
// }
//             .details-grid {
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 10px;
//             }
//             .details-grid p {
//               margin: 10px;
//               padding-bottom: 6px;
//               font-weight: bold;
//               font-size: 17px;
//             }
//             .details-grid input {
//               width: 100%;
//               border: none;
//               border-bottom: 1px solid black;
//               margin-top: 5px;
//               padding: 5px 0;
//               font-size: 30px;
//             }
//             .cover-letter-container {
//             margin-top : 5px;
//               height: 97vh;
//             }
  
//             .name-input {
//               width: 90%;
//               font-size: 16px;
//               padding: 8px;
//               box-sizing: border-box;
//             }
//               .details-container {
//                 border: 1px solid black;
//                 padding: 10px;
//               }
//               .details-grid {
//                 grid-template-columns: 1fr 1fr;
//                 gap: 3px;
//               }
//               .details-grid p {
//                 margin: 0;
//                 padding-bottom: 0px;
//               }
//             }
//               .print-header img {
//     width: 100px; 
//     height: auto;
//   }
    
//           </style>
          
//         </head>
//         <body>
//     `;

//     printContent += `
//     <div class="print-header">
//     </div>
//   `;
//     if (printOptions.coverLetter) {
//       printContent += `   
//         <div class="page-break details-container cover-letter-container" style="page-break-before: always; page-break-after: always;">
//           <nav style="background-color: #f8f9fa; display: flex; flex-direction: row; border-bottom: 10px solid #002b4f; padding: 5px; align-items: center;">
//             <span class="pro-sidebar-logo ml-8" style="display: flex; align-items: center;">
//               <div>M</div>
//               <h5 style="color: black; margin-left: 8px;">My Revision<sup style="color: blue;">+</sup></h5>
//             </span>
//           </nav>
//           <div>
//             <p>Name: <input type="text" class="name-input" placeholder="" /></p>
//             <div class="details-grid" style="border: 1px solid black; padding:10px ">
//               <p>Level: ${coverLetterDetails.level}</p>
//               <p>Grade: ${coverLetterDetails.grade}</p>
//               <p>Subject: ${coverLetterDetails.subjectName}</p>
//               <p>Date: ${coverLetterDetails.date}</p>
//               <p>Duration: ${coverLetterDetails.duration}</p>
//               <p>Component: ${coverLetterDetails.component}</p>
//               <p>Total Marks: ${coverLetterDetails.totalMarks}</p>
//               <p>Topic Name: ${coverLetterDetails.topicName}</p>
//               <p>Test Type: ${coverLetterDetails.testType}</p>
//             </div>
//           </div>
//           <div>
//             <h3>Cover Letter Instructions</h3>
//             <p>• Write your name in the boxes above.<br>
//             <p>• Do not open this examination paper until instructed to do so.</p>
//             <p>• A graphic display calculator is required for this paper.</p>
//             <p>• Answer all questions.</p>
//             <p>• Unless otherwise stated in the questions, all numerical answers should be given exactly or correct to three significant figures.</p>
//             <p>• A clean copy of the mathematics: Application and Interpretation formula booklet is required for this paper.</p>
//             <p>• The maximum marks for this examination paper is [110 marks].</p>
//             <div style="text-align: center; margin-top:5px;">
//               <img src="${qrCode}" id="qrCodeImage" alt="QR Code" width="128" height="128" />
//             </div>
//             <p style="text-align: center;">Please scan the above code and give a valuable Google review</p>
//             <div style="display: flex; justify-content: space-between; margin: 10px; ">
//               <div>
//                 <p>Just Call or WhatsApp on:</p>
//                 <p>9971017569 | 9312411928</p>
//               </div>
//               <div>
//                 <p>For more info, visit:</p>
//                 <p>https://www.ibglobalacademy.org/</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       `;
//     }

//     const getSelectedSubquestions = () => {
//       const subquestions = [];
//       filteredQuestions.forEach(question => {
//         const isParentSelected = selectedQuestions.includes(question._id);
//         question.subquestions.forEach(subquestion => {
//           if (selectedSubquestions.includes(subquestion._id)) {
//             subquestions.push({
//               ...subquestion,
//               parentQuestion: question,
//               isParentSelected
//             });
//           }
//         });
//       });
//       return subquestions;
//     };
    
//     const selectedSubqs = getSelectedSubquestions();
//     const standaloneSubqs = selectedSubqs.filter(subq => !subq.isParentSelected);
//     const childSubqs = selectedSubqs.filter(subq => subq.isParentSelected);
    
//     let questionCounter = 1;
    
//     if (printOptions.showQuestion) {
//       if (selectedQuestions.length > 0) {
//         filteredQuestions
//           .filter(question => selectedQuestions.includes(question._id))
//           .forEach((question) => {
//             const questionAnswerLines = question.answer_line || 0;
//             printContent += `
//               <div class="question" style="margin-top:-20px">
//                 <div style="display: flex; justify-content: space-between; align-items: center;">
//                   <span><h2 style="font-weight: bold;">${questionCounter++}. </h2></span>
//                   <span style="font-weight: bold; margin-left: auto; padding-right: 20px;">[Maximum Marks: ${calculateTotalMarks(question)}]</span>
//                 </div>
//                 <div style="margin-top: -25px; padding-left: 10px; padding-right: 10px; margin-left:-15px">
//                   ${question.question_title}
//                 </div>
//                 ${renderMediaForPrint(question.images, 'image')}
//                 ${renderMediaForPrint(question.docs, 'pdf')}
//             `;
    
//             childSubqs
//               .filter(subq => subq.parentQuestion._id === question._id)
//               .forEach((subquestion, subIndex) => {
//                 const marks = calculateSubquestionMarks(subquestion);
//                 const subquestionAnswerLines = subquestion.answer_line || 0;
//                 printContent += `
//                   <div style="margin-top: -10px; padding-left: 10px; padding-right: 10px;">
//                     <div style="display: flex; justify-content: space-between;">
//                       <span style="font-weight: bold;">(${String.fromCharCode(97 + subIndex)})</span>
//                       <span style="font-weight: bold;">[${marks || ""}]</span>
//                     </div>
//                     <div style="margin-top: -15px;">
//                       ${subquestion.title}
//                     </div>
//                     ${renderMediaForPrint(subquestion.images, 'image')}
//                     ${renderMediaForPrint(subquestion.docs, 'pdf')}
//                 `;
    
//                 if (subquestion.mcq_options) {
//                   const options = [
//                     { label: 'A', value: subquestion.mcq_options.mcq_options_a },
//                     { label: 'B', value: subquestion.mcq_options.mcq_options_b },
//                     { label: 'C', value: subquestion.mcq_options.mcq_options_c },
//                     { label: 'D', value: subquestion.mcq_options.mcq_options_d },
//                   ];
    
//                   printContent += `
//                     <div style="margin-top: 10px; margin-left: 20px;">
//                       ${options.map(option => `
//                         <div class="mcq-option ${option.label === subquestion.mcq_options.correct_answer ? 'correct-answer' : ''}">
//                           ${option.label}. ${option.value}
//                         </div>
//                       `).join('')}
//                     </div>
//                   `;
//                 }
    
//                 if (subquestion.subchildquestions?.length > 0) {
//                   subquestion.subchildquestions
//                     .filter(subchild => selectedSubchildquestions.includes(subchild._id))
//                     .forEach((subchildquestion, subChildIndex) => {
//                       const marks = Number(subchildquestion.marks);
//                       const subchildAnswerLines = subchildquestion.answer_line || 0;
//                       printContent += `
//                         <div style="margin-left: 40px; margin-top: 10px;">
//                           <div style="display: flex; justify-content: space-between;">
//                             <span style="font-weight: bold;">(${toRoman(subChildIndex + 1)})</span>
//                             <span style="font-weight: bold;">[${marks || ""}]</span>
//                           </div>
//                           <div style="margin-top: -15px;">
//                             ${subchildquestion.title}
//                           </div>
//                           ${renderMediaForPrint(subchildquestion.images, 'image')}
//                           ${renderMediaForPrint(subchildquestion.docs, 'pdf')}
//                           ${subchildAnswerLines > 0 ? `
//                             <div style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
//                               ${[...Array(subchildAnswerLines)].map(() => `
//                                 <div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>
//                               `).join('')}
//                             </div>
//                           ` : ''}
//                         </div>
//                       `;
//                     });
//                 }
    
//                 printContent += subquestionAnswerLines > 0 ? `
//                   <div style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
//                     ${[...Array(subquestionAnswerLines)].map(() => `
//                       <div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>
//                     `).join('')}
//                   </div>
//                 ` : '';
    
//                 printContent += `</div>`;
//               });
    
//             printContent += questionAnswerLines > 0 ? `
//               <div style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
//                 ${[...Array(questionAnswerLines)].map(() => `
//                   <div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>
//                 `).join('')}
//               </div>
//             ` : '';
    
//             printContent += `</div>`;
//           });
//       }
    
//       if (standaloneSubqs.length > 0) {
//         standaloneSubqs.forEach((subquestion) => {
//           const marks = calculateSubquestionMarks(subquestion);
//           const subquestionAnswerLines = subquestion.answer_line || 0;
//           printContent += `
//             <div class="question" style="margin-top:-20px">
//               <div style="display: flex; justify-content: space-between; align-items: center;">
//                 <span><h2 style="font-weight: bold;">${questionCounter++}. </h2></span>
//                 <span style="font-weight: bold; margin-left: auto; padding-right: 20px;">[Marks: ${marks || ""}]</span>
//               </div>
//               <div style="margin-top: -25px; padding-left: 10px; padding-right: 10px; margin-left:-15px">
//                 ${subquestion.title}
//               </div>
//               ${renderMediaForPrint(subquestion.images, 'image')}
//               ${renderMediaForPrint(subquestion.docs, 'pdf')}
//           `;
    
//           if (subquestion.mcq_options) {
//             const options = [
//               { label: 'A', value: subquestion.mcq_options.mcq_options_a },
//               { label: 'B', value: subquestion.mcq_options.mcq_options_b },
//               { label: 'C', value: subquestion.mcq_options.mcq_options_c },
//               { label: 'D', value: subquestion.mcq_options.mcq_options_d },
//             ];
//             printContent += `
//               <div style="margin-top: 10px; margin-left: 20px;">
//                 ${options.map(option => `
//                   <div class="mcq-option ${option.label === subquestion.mcq_options.correct_answer ? 'correct-answer' : ''}">
//                     ${option.label}. ${option.value}
//                   </div>
//                 `).join('')}
//               </div>
//             `;
//           }
    
//           if (subquestion.subchildquestions?.length > 0) {
//             subquestion.subchildquestions
//               .filter(subchild => selectedSubchildquestions.includes(subchild._id))
//               .forEach((subchildquestion, subChildIndex) => {
//                 const marks = Number(subchildquestion.marks);
//                 const subchildAnswerLines = subchildquestion.answer_line || 0;
//                 printContent += `
//                   <div style="margin-left: 40px; margin-top: 10px;">
//                     <div style="display: flex; justify-content: space-between;">
//                       <span style="font-weight: bold;">(${String.fromCharCode(97 + subChildIndex)})</span>
//                       <span style="font-weight: bold;">[${marks || ""}]</span>
//                     </div>
//                     <div style="margin-top: -15px;">
//                       ${subchildquestion.title}
//                     </div>
//                     ${renderMediaForPrint(subchildquestion.images, 'image')}
//                     ${renderMediaForPrint(subchildquestion.docs, 'pdf')}
//                     ${subchildAnswerLines > 0 ? `
//                       <div style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
//                         ${[...Array(subchildAnswerLines)].map(() => `
//                           <div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>
//                         `).join('')}
//                       </div>
//                     ` : ''}
//                   </div>
//                 `;
//               });
//           }
    
//           printContent += subquestionAnswerLines > 0 ? `
//             <div style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
//               ${[...Array(subquestionAnswerLines)].map(() => `
//                 <div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>
//               `).join('')}
//             </div>
//           ` : '';
    
//           printContent += `</div>`;
//         });
//       }
//     }
    
    
//     if (printOptions.showMarkScheme) {
//       printContent += `<div class="page-break"><h2>Mark Scheme</h2>`;
//       filteredQuestions
//         .filter((question) => selectedQuestions.includes(question._id))
//         .forEach((question, index) => {
//           if (question.markscheme) {
//             printContent += `
//               <div>
//               <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">${index + 1}. </h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${question.markscheme.description || ''}</span>

// </div>
              
            
//                 ${renderMediaForPrint(question.markscheme.images, 'image')}
//                 ${renderMediaForPrint(question.markscheme.docs, 'pdf')}
//                 <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//               </div>
//             `;
//           }
    
//           if (question.subquestions) {
//             question.subquestions.forEach((subquestion, subIndex) => {
//               if (subquestion.markscheme) {
//                 printContent += `
//                   <div style="margin-left: 20px; padding-left: 10px; padding-right: 10px">
//                   <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">${String.fromCharCode(97 + subIndex)}. </h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${subquestion.markscheme.description || ''}</span>

// </div>
                    
//                     ${renderMediaForPrint(subquestion.markscheme.images, 'image')}
//                     ${renderMediaForPrint(subquestion.markscheme.docs, 'pdf')}
//                     <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                   </div>
//                 `;
//               }
    
//               if (subquestion.subchildquestions) {
//                 subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
//                   if (subchildquestion.markscheme) {
//                     printContent += `
//                       <div style="margin-left: 40px;padding-left: 10px; padding-right: 10px">
//                         <div>(${toRoman(subChildIndex + 1)}) ${subchildquestion.markscheme.description || ''}</div>
//                         ${renderMediaForPrint(subchildquestion.markscheme.images, 'image')}
//                         ${renderMediaForPrint(subchildquestion.markscheme.docs, 'pdf')}
//                         <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                       </div>
//                     `;
//                   }
//                 });
//               }
//             });
//           }
//         });
    
//       printContent += `</div>`; 
//     }
    
//     if (printOptions.showAnswerKey) {
//       printContent += `<div class="page-break"><h2>Answer Key /Answer Key</h2>`;
//       filteredQuestions
//         .filter((question) => selectedQuestions.includes(question._id))
//         .forEach((question, index) => {
//           if (question.answer_key) {
//             printContent += `
//               <div>
//                   <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;"> ${index + 1}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${question.answer_key.description || ''}</span>

// </div>
              
//                 ${renderMediaForPrint(question.answer_key.images, 'image')}
//                 ${renderMediaForPrint(question.answer_key.docs, 'pdf')}
//                 <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//               </div>
//             `;
//           }
//           if (question.answer_model) {
//             printContent += `
//               <div>
//                   <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;"> ${index + 1}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${question.answer_model.description || ''}</span>

// </div>
              
//                 ${renderMediaForPrint(question.answer_model.images, 'image')}
//                 ${renderMediaForPrint(question.answer_model.docs, 'pdf')}
//                 <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//               </div>
//             `;
//           }
//           if (question.subquestions) {
//             question.subquestions.forEach((subquestion, subIndex) => {
//               if (subquestion.answer_key) {
//                 printContent += `
//                   <div style="margin-left: 20px;">
//                    <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">  ${String.fromCharCode(97 + subIndex)}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${subquestion.answer_key.description || ''}</span>

// </div>
                  
//                     ${renderMediaForPrint(subquestion.answer_key.images, 'image')}
//                     ${renderMediaForPrint(subquestion.answer_key.docs, 'pdf')}
//                     <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                   </div>
//                 `;
//               }
//               if (subquestion.answer_model) {
//                 printContent += `
//                   <div style="margin-left: 20px;">
//                    <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">  ${String.fromCharCode(97 + subIndex)}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${subquestion.answer_model.description || ''}</span>

// </div>
                  
//                     ${renderMediaForPrint(subquestion.answer_model.images, 'image')}
//                     ${renderMediaForPrint(subquestion.answer_model.docs, 'pdf')}
//                     <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                   </div>
//                 `;
//               }
    
//               if (subquestion.subchildquestions) {
//                 subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
//                   if (subchildquestion.answer_key) {
//                     printContent += `
//                       <div style="margin-left: 40px;">
//                            <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">${toRoman(subChildIndex + 1)}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${subchildquestion.answer_key.description || ''}</span>

// </div>
//                         ${renderMediaForPrint(subchildquestion.answer_key.images, 'image')}
//                         ${renderMediaForPrint(subchildquestion.answer_key.docs, 'pdf')}
//                         <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                       </div>
//                     `;
//                   }
//                   if (subchildquestion.answer_model) {
//                     printContent += `
//                       <div style="margin-left: 40px;">
//                            <div style="display: flex; align-items: left; gap: 5px;">
//   <span><h2 style="font-weight: bold;">${toRoman(subChildIndex + 1)}.</h2></span>
//  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">${subchildquestion.answer_model.description || ''}</span>

// </div>
//                         ${renderMediaForPrint(subchildquestion.answer_model.images, 'image')}
//                         ${renderMediaForPrint(subchildquestion.answer_model.docs, 'pdf')}
//                         <br style="margin-top: 10px; margin-bottom: 10px;"/> <!-- Add line here -->
//                       </div>
//                     `;
//                   }
//                 });
//               }
//             });
//           }
//         });
    
//       printContent += `</div>`;
//     }
    
//     printContent += `</body></html>`;
//      const updatePageNumbers = () => {
//         const pages = document.querySelectorAll(".content > .details-container");
//         pages.forEach((page, index) => {
//           const pageNumbers = document.querySelectorAll(".page-number");
//           pageNumbers.forEach((number) => {
//             number.textContent = index + 1; 
//           });
//         });
//       };

//       document.addEventListener("DOMContentLoaded", updatePageNumbers);
//     printWindow.document.open();
//     printWindow.document.write(printContent);
//     printWindow.document.close();
  
//     const wirisScript = printWindow.document.createElement('script');
//     wirisScript.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
//     wirisScript.async = true;
  
//     const initiatePrintWithDelay = () => {
//       setTimeout(() => {
//         printWindow.focus();
//         printWindow.print();
//       }, 2000); 
//     };
  
//     wirisScript.onload = () => {
//       initiatePrintWithDelay();
//     };

//     printWindow.document.head.appendChild(wirisScript);
//     const qrCodeImage = printWindow.document.getElementById('qrCodeImage');
//     if (qrCodeImage) {
//       qrCodeImage.onload = () => initiatePrintWithDelay();
//       qrCodeImage.onerror = () => initiatePrintWithDelay();
//     } else {
     
//       setTimeout(() => initiatePrintWithDelay(), 1000);
//     }
//   }

//   const handleSaveAssignment = async () => {
//     console.log("Saving Assignment...");
//     const filteredAssignment = filteredQuestions
//       .filter((question) => selectedQuestions.includes(question._id))
//       .map((question) => {
//         const subquestions = question.subquestions
//           .filter((subquestion) => selectedSubquestions.includes(subquestion._id))
//           .map((subquestion) => {
//             const subchildquestions = subquestion.subchildquestions
//               .filter((subchildquestion) => selectedSubchildquestions.includes(subchildquestion._id));
  
//             return { ...subquestion, subchildquestions };
//           });
  
//         return { ...question, subquestions };
//       });
      
//     const questionIds = filteredAssignment.map((question) => question._id);
  
//     if (!assignmentName) {
//       setShowSaveError(true);
//      toast.error('Assignment name is required!');
//       return;
//     }
    
//     console.log("Cover Letter Date (Before Conversion):", coverLetterDetails.date);
//     if (!coverLetterDetails.date || coverLetterDetails.date.trim() === "") {
//       console.log("Error: Cover letter date is missing!");
//       setShowSaveError(true);
//       toast.error("Cover letter date is required!");
//       return;
//     }
  
//     const formattedDate = new Date(coverLetterDetails.date);
//     console.log("Formatted Date:", formattedDate);
  
//     if (isNaN(formattedDate.getTime())) {
//       console.log("Error: Cover letter date is invalid!");
//       setShowSaveError(true);
//       toast.error("Invalid date format for cover letter!");
//       return;
//     }
//   console.log("Saving Assignment...1");
//     const data = {
//       assignment_name:assignmentName,
//       user_id:selectedTeacher, 
//       question_id:questionIds, 
//      board_id: assignmentBoardId,
//        subject_id: assignmentSubjectId,
//        subjectlevel_id: assignmentSubjectLevelId,
//       options: [
//         printOptions.showQuestion ? "Question" : null,
//         printOptions.showAnswerKey ? "Answer" : null,
//         printOptions.showMarkScheme ? "Marks" : null,
//         printOptions.lineSpceForAnswer? "SpaceLine" : null , 
//         printOptions.subtopicDetails? "subtopicDetails" :null,
//       ].filter(Boolean),
//       cover_details: {
//         level: coverLetterDetails.level,
//         grade: coverLetterDetails.grade,
//         subject: coverLetterDetails.subject,
//         date: formattedDate.toISOString(),
//         duration: coverLetterDetails.duration,
//         component: coverLetterDetails.component,
//         total_marks: coverLetterDetails.totalMarks,
//         topic_name: coverLetterDetails.topicName,
//         test_type: coverLetterDetails.testType,
//       },
//     };
//     console.log("Saving Assignment...2");
//     try {
//       const response = await Api.post('assignment/create', data);
//       console.log("Assignment saved:", response.data);
  
//       setShowSaveSuccess(true);
//       toast.success('Assignment saved successfully!');
//       setSaveAssignmentDialogOpen(false);
//     } catch (error) {
//       setShowSaveError(true);
//       toast.error(`Failed to save assignment: ${error.message}`);
//     }
//   };
//   const renderMedia = (mediaArray, type) => {
//     if (!mediaArray || mediaArray.length === 0) return null;
  
//     return (
//       <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
//         {mediaArray.map((media, index) => (
//           <div key={index} className="w-full max-w-[600px] mb-4">
//             {type === 'image' && (
//               <img
//                 src={`${API_URL_Images}${media}`}
//                 alt={`Image ${index}`}
//                 className="w-full h-auto"
//               />
//             )}
//             {type === 'video' && (
//               <video controls className="w-full h-auto">
//                 <source src={`${API_URL_Videos}${media}`} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )}
//             {type === 'pdf' && (
//               <embed
//                 src={`${API_URL_PDF}${media}`}
//                 className="w-full h-[800px] border-none"
//                 title={`PDF ${index + 1}`}
//               />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };
//   return (
   
//     <div className="max-w-full mx-auto px-4">
//       <div className="grid grid-cols-1 gap-4">
//         <div className="col-span-1">
//           <div className="mt-12">
//             <form onSubmit={handleSubmit}>
//               <div className="flex justify-between items-center my-4 mx-8 p-4">
//                 <h3 className="text-xl font-semibold text-custom-primary">Select Questions</h3>
//                 <button
//   className={`px-4 py-2 rounded text-white bg-custom-primary flex items-center justify-center ${
//     selectedQuestions.length === 0 || isLoading ? 'opacity-50 cursor-not-allowed' : ''
//   }`}
//   type="submit"
//   disabled={selectedQuestions.length === 0 || isLoading}
// >
//   {isLoading ? (
//     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//   ) : (
//     <span>Create Assignment</span>
//   )}
// </button>
//               </div>

//               <div className="ml-5">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox"
//                     checked={selectAll}
//                     onChange={handleSelectAll}
//                   />
//                   <span className="ml-2">Select All</span>
//                 </label>
//               </div>

//               {filteredQuestions?.map((question, index) => {
//     const calculateTotalMarks = (question) => {
//         let totalMarks = 0;

//         question.subquestions?.forEach((subquestion) => {
//             let subquestionMarks = 0;

//             subquestion.subchildquestions?.forEach((subchildquestion) => {
//                 if (selectedSubchildquestions.includes(subchildquestion._id)) {
//                     subquestionMarks += Number(subchildquestion.marks) || 0; 
//                 }
//             });

//             if (selectedSubquestions.includes(subquestion._id)) {
//                 totalMarks += subquestionMarks > 0 ? subquestionMarks : Number(subquestion.marks) || 0;
//             }
//         });

//         return totalMarks > 0 ? totalMarks : Number(question.marks) || 0; 
//     };

//     return (
//         <div key={question._id} className="w-[100%] overflow-hidden p-4 font-calibri flex items-center justify-start">
//             <div className="bg-white w-full border border-gray-300 rounded-3xl shadow-md">
//                 <div className="flex relative p-[1%]">
//                     <div className={`text-black mt-1 block w-full text-base whitespace-normal overflow-wrap-break-word min-h-[80vh] h-auto word-break-all hyphens-auto transition-[flex-basis] duration-300 ease-in-out font-calibri relative ${isCollapsed ? 'basis-[85%]' : 'basis-[86%]'}`}>
//                     <label className="inline-flex items-center cursor-pointer">
//   <div className="relative">
//     <input
//       type="checkbox"
//       className="sr-only peer"
//       checked={selectedQuestions.includes(question._id)}
//       onChange={() => handleQuestionSelect(question._id)}
//     />
//     <div className="w-5 h-5 bg-white border-2 border-gray-400 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all">
//       {/* Checkmark icon */}
//       {selectedQuestions.includes(question._id) && (
//         <svg
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white w-3 h-3"
//           viewBox="0 0 20 20"
//           fill="currentColor"
//         >
//           <path
//             fillRule="evenodd"
//             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//             clipRule="evenodd"
//           />
//         </svg>
//       )}
//     </div>
//   </div>
//   <span className="ml-2 text-gray-700">{/* Optional label */}</span>
// </label>

//                         <div>
//                             <span className="mr-2 ml-2 font-bold text-base">
//                                 {`${index + 1}.`}
//                             </span>

//                             <span className="ml-5">
//                                 Maximum Marks: <strong>[{calculateTotalMarks(question) || question.marks}]</strong>
//                             </span>
//                         </div>

//                         <div className="ml-[5%] text-lg" dangerouslySetInnerHTML={{ __html: question.question_title }} />

//                         {renderMedia(question.images, 'image')}
//                         {renderMedia(question.docs, 'pdf')}
                        
//                         {question.answer_key && (
//                             (question.answer_key.description ||
//                             (question.answer_key.images && question.answer_key.images.length > 0) ||
//                             (question.answer_key.videos && question.answer_key.videos.length > 0) ||
//                             (question.answer_key.docs && question.answer_key.docs.length > 0)) && (
//                                 <div>
//                                     <div className="text-xxl text-[#1a73e8] ml-[5%]">AnswerKey:</div>
//                                     {question.answer_key.description && (
//                                         <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: question.answer_key.description }}></div>
//                                     )}
//                                     {renderMedia(question.answer_key.images, 'image')}
//                                     {renderMedia(question.answer_key.videos, 'video')}
//                                     {renderMedia(question.answer_key.docs, 'pdf')}
//                                 </div>
//                             )
//                         )}
                        
//                             {question.answer_model && (
//                             (question.answer_model.description ||
//                             (question.answer_model.images && question.answer_model.images.length > 0) ||
//                             (question.answer_model.videos && question.answer_model.videos.length > 0) ||
//                             (question.answer_model.docs && question.answer_model.docs.length > 0)) && (
//                                 <div>
//                                     <div className="text-xxl text-[#1a73e8] ml-[5%]">Model Answer:</div>
//                                     {question.answer_model.description && (
//                                         <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: question.answer_model.description }}></div>
//                                     )}
//                                     {renderMedia(question.answer_model.images, 'image')}
//                                     {renderMedia(question.answer_model.videos, 'video')}
//                                     {renderMedia(question.answer_model.docs, 'pdf')}
//                                 </div>
//                             )
//                         )}
                        
//                         {question.markscheme && (
//                             (question.markscheme.description ||
//                             (question.markscheme.images && question.markscheme.images.length > 0) ||
//                             (question.markscheme.videos && question.markscheme.videos.length > 0) ||
//                             (question.markscheme.docs && question.markscheme.docs.length > 0)) && (
//                                 <div>
//                                     <div className="text-xxl text-[#1a73e8] ml-[5%]">Markscheme:</div>
//                                     {question.markscheme.description && (
//                                         <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: question.markscheme.description }}></div>
//                                     )}
//                                     {renderMedia(question.markscheme.images, 'image')}
//                                     {renderMedia(question.markscheme.videos, 'video')}
//                                     {renderMedia(question.markscheme.docs, 'pdf')}
//                                 </div>
//                             )
//                         )}
                        
//                         {question.subquestions?.length > 0 && (
//                             <div>
//                                 {question.subquestions.map((subquestion, subIndex) => {
//                                     return (
//                                         <div key={subquestion._id} className="mb-2.5 font-calibri text-base">
//                                            <label className="inline-flex items-center cursor-pointer">
//   <div className="relative">
//     <input
//       type="checkbox"
//       checked={selectedSubquestions.includes(subquestion._id)}
//       onChange={() => handleSubquestionSelect(subquestion._id)}
//       className="sr-only" // Hide default checkbox
//     />
//     <div className={`block w-4 h-4 rounded border-2 ${
//       selectedSubquestions.includes(subquestion._id) 
//         ? 'bg-blue-500 border-blue-500' 
//         : 'border-gray-400'
//     }`}>
//       {selectedSubquestions.includes(subquestion._id) && (
//         <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//         </svg>
//       )}
//     </div>
//   </div>
//   <span className="ml-2">{subquestion.text}</span>
// </label>
//                                             <div className="flex justify-start">
//                                                 <div className="ml-[5%]">
//                                                     {`(${String.fromCharCode(97 + subIndex)})`}
//                                                 </div>
//                                                 <div
//                                                     className="pl-[1%] pr-[2%]"
//                                                     dangerouslySetInnerHTML={{ __html: subquestion.title }}
//                                                 />
//                                             </div>
//                                             {renderMedia(subquestion.images, 'image')}
//                                             {renderMedia(subquestion.videos, 'videos')}
//                                             {renderMedia(subquestion.docs, 'pdf')}
                                            
//                                             {subquestion.mcq_options && (
//                                                 (() => {
//                                                     const options = [
//                                                         { label: 'A', value: subquestion.mcq_options.mcq_options_a },
//                                                         { label: 'B', value: subquestion.mcq_options.mcq_options_b },
//                                                         { label: 'C', value: subquestion.mcq_options.mcq_options_c },
//                                                         { label: 'D', value: subquestion.mcq_options.mcq_options_d },
//                                                     ];

//                                                     return (
//                                                         <div className="flex flex-wrap mt-2">
//                                                             {options.map((option, optIndex) => (
//                                                                 <div
//                                                                     key={optIndex}
//                                                                     className={`bg-${
//                                                                         option.label === subquestion.mcq_options.correct_answer ? 'lightgreen' : 'white'
//                                                                     } border border-gray-500 rounded-lg p-2.5 m-1 w-[calc(50%-10px)]`}
//                                                                 >
//                                                                     <div>
//                                                                         {option.label}: {option.value}
//                                                                     </div>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     );
//                                                 })()
//                                             )}
                                            
//                                             {subquestion.answer_key && (
//                                                 (subquestion.answer_key.description ||
//                                                 (subquestion.answer_key.images && subquestion.answer_key.images.length > 0) ||
//                                                 (subquestion.answer_key.videos && subquestion.answer_key.videos.length > 0) ||
//                                                 (subquestion.answer_key.docs && subquestion.answer_key.docs.length > 0)) && (
//                                                     <div className="ml-[9%]">
//                                                         <div className="text-xxl text-[#1a73e8]">Answer Key:</div>
//                                                         {subquestion.answer_key.description && (
//                                                             <div dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }} />
//                                                         )}
//                                                         {renderMedia(subquestion.answer_key.images, 'image')}
//                                                         {renderMedia(subquestion.answer_key.videos, 'video')}
//                                                         {renderMedia(subquestion.answer_key.docs, 'pdf')}
//                                                     </div>
//                                                 )
//                                             )}

//                                             {subquestion.answer_model && (
//                                                 (subquestion.answer_model.description ||
//                                                 (subquestion.answer_model.images && subquestion.answer_model.images.length > 0) ||
//                                                 (subquestion.answer_model.videos && subquestion.answer_model.videos.length > 0) ||
//                                                 (subquestion.answer_model.docs && subquestion.answer_model.docs.length > 0)) && (
//                                                     <div className="ml-[9%]">
//                                                         <div className="text-xxl text-[#1a73e8]">Answer Model:</div>
//                                                         {subquestion.answer_model.description && (
//                                                             <div className="ml-[4%]" dangerouslySetInnerHTML={{ __html: subquestion.answer_model.description }} />
//                                                         )}
//                                                         {renderMedia(subquestion.answer_model.images, 'image')}
//                                                         {renderMedia(subquestion.answer_model.videos, 'video')}
//                                                         {renderMedia(subquestion.answer_model.docs, 'pdf')}
//                                                     </div>
//                                                 )
//                                             )}

//                                             {subquestion.markscheme && (
//                                                 (subquestion.markscheme.description ||
//                                                 (subquestion.markscheme.images && subquestion.markscheme.images.length > 0) ||
//                                                 (subquestion.markscheme.videos && subquestion.markscheme.videos.length > 0) ||
//                                                 (subquestion.markscheme.docs && subquestion.markscheme.docs.length > 0)) && (
//                                                     <div className="ml-[9%]">
//                                                         <div className="text-xxl text-[#1a73e8]">Markscheme:</div>
//                                                         {subquestion.markscheme.description && (
//                                                             <div className="ml-[4%]" dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }} />
//                                                         )}
//                                                         {renderMedia(subquestion.markscheme.images, 'image')}
//                                                         {renderMedia(subquestion.markscheme.videos, 'video')}
//                                                         {renderMedia(subquestion.markscheme.docs, 'pdf')}
//                                                     </div>
//                                                 )
//                                             )}

//                                             <div className="ml-auto flex justify-end">
//                                                 <div>
//                                                     <strong>[{calculateSubquestionMarks(subquestion) || subquestion.marks}]</strong>
//                                                 </div>
//                                                 <RiDeleteBin3Line
//                                                     className="text-red-500 text-2xl"
//                                                     onClick={() => handleDeleteSubQuestionDialogOpen(subquestion._id)}
//                                                 />
//                                                 <CiEdit
//                                                     className="text-blue-500 text-3xl"
//                                                     onClick={() => {
//                                                         dispatch(setSelectedId(question._id));
//                                                         dispatch(setSelectedSubquestionId(subquestion._id));
//                                                         navigate(`/sub-question-edit/${subquestion._id}`);
//                                                     }}
//                                                 />
//                                             </div>
                                        
//                                             {subquestion.subchildquestions?.length > 0 && (
//                                                 <div>
//                                                     {subquestion.subchildquestions.map((subchildquestion, subChildIndex) => (
//                                                         <div key={subchildquestion._id} className="mb-2.5 font-calibri text-base">
//                                                            <label className="relative inline-flex items-center cursor-pointer">
//   <input
//     type="checkbox"
//     checked={selectedSubchildquestions.includes(subchildquestion._id)}
//     onChange={() => handleSubchildquestionSelect(subchildquestion._id)}
//     className="sr-only peer" // Hide default checkbox
//   />
//   <div className="w-4 h-4 border-2 border-gray-300 rounded-sm flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-200 transition-colors">
//     {selectedSubchildquestions.includes(subchildquestion._id) && (
//       <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
//         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//       </svg>
//     )}
//   </div>

// </label>
//                                                             <div className="flex justify-start">
//                                                                 <div className="ml-[8%]">{`(${toRoman(subChildIndex + 1)})`}</div>
//                                                                 <div className="ml-[1%]" dangerouslySetInnerHTML={{ __html: subchildquestion.title }}></div>
//                                                             </div>
//                                                             {renderMedia(subchildquestion.images, 'image')}
//                                                             {renderMedia(subchildquestion.videos, 'video')}
//                                                             {renderMedia(subchildquestion.docs, 'pdf')}
                                                            
//                                                             {subchildquestion.answer_key && (
//                                                                 (subchildquestion.answer_key.description ||
//                                                                 (subchildquestion.answer_key.images && subchildquestion.answer_key.images.length > 0) ||
//                                                                 (subchildquestion.answer_key.videos && subchildquestion.answer_key.videos.length > 0) ||
//                                                                 (subchildquestion.answer_key.docs && subchildquestion.answer_key.docs.length > 0)) && (
//                                                                     <div className="ml-[11.5%]">
//                                                                         <div className="text-xxl text-[#1a73e8]">Answerkey:</div>
//                                                                         {subchildquestion.answer_key.description && (
//                                                                             <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}></div>
//                                                                         )}
//                                                                         {renderMedia(subchildquestion.answer_key.images, 'image')}
//                                                                         {renderMedia(subchildquestion.answer_key.videos, 'video')}
//                                                                         {renderMedia(subchildquestion.answer_key.docs, 'pdf')}
//                                                                     </div>
//                                                                 )
//                                                             )}

//                                                             {subchildquestion.markscheme && (
//                                                                 (subchildquestion.markscheme.description ||
//                                                                 (subchildquestion.markscheme.images && subchildquestion.markscheme.images.length > 0) ||
//                                                                 (subchildquestion.markscheme.videos && subchildquestion.markscheme.videos.length > 0) ||
//                                                                 (subchildquestion.markscheme.docs && subchildquestion.markscheme.docs.length > 0)) && (
//                                                                     <div className="ml-[11.5%]">
//                                                                         <div className="text-xxl text-[#1a73e8]">Markcheme:</div>
//                                                                         {subchildquestion.markscheme.description && (
//                                                                             <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}></div>
//                                                                         )}
//                                                                         {renderMedia(subchildquestion.markscheme.images, 'image')}
//                                                                         {renderMedia(subchildquestion.markscheme.videos, 'video')}
//                                                                         {renderMedia(subchildquestion.markscheme.docs, 'pdf')}
//                                                                     </div>
//                                                                 )
//                                                             )}
                                                            
//                                                             {subchildquestion.answer_model && (
//                                                                 (subchildquestion.answer_model.description ||
//                                                                 (subchildquestion.answer_model.images && subchildquestion.answer_model.images.length > 0) ||
//                                                                 (subchildquestion.answer_model.videos && subchildquestion.answer_model.videos.length > 0) ||
//                                                                 (subchildquestion.answer_model.docs && subchildquestion.answer_model.docs.length > 0)) && (
//                                                                     <div className="ml-[11.5%]">
//                                                                         <div className="text-xxl text-[#1a73e8]">Answer Model:</div>
//                                                                         {subchildquestion.answer_model.description && (
//                                                                             <div className="ml-[5%]" dangerouslySetInnerHTML={{ __html: subchildquestion.answer_model.description }}></div>
//                                                                         )}
//                                                                         {renderMedia(subchildquestion.answer_model.images, 'image')}
//                                                                         {renderMedia(subchildquestion.answer_model.videos, 'video')}
//                                                                         {renderMedia(subchildquestion.answer_model.docs, 'pdf')}
//                                                                     </div>
//                                                                 )
//                                                             )}
                                                            
//                                                             <div className="ml-auto flex justify-end gap-1.5">
//                                                                 <div>
//                                                                     <strong>[{Number(subchildquestion.marks) || 'N/A'}]</strong>
//                                                                 </div>
//                                                                 <RiDeleteBin3Line
//                                                                     className="text-red-500 text-2xl"
//                                                                     onClick={() => handleDeleteSubquestionChild(subchildquestion._id)}
//                                                                 />
//                                                                 <CiEdit
//                                                                     className="text-blue-500 text-3xl"
//                                                                     onClick={() => {
//                                                                         dispatch(setSelectedId(question._id)); 
//                                                                         dispatch(setSelectedSubquestionId(subquestion._id)); 
//                                                                         dispatch(setSelectedSubChildquestionId(subchildquestion._id)); 
//                                                                         navigate(`/subchild-question-edit/${subchildquestion._id}`);
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             )}
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         )}
//                     </div>
                    
//                     <div
//                         className={`absolute top-0 bottom-0 bg-gray-300 transition-all duration-300 ease-in-out ${
//                             isCollapsed ? 'right-[11%] w-px' : 'right-[14%] w-0.5'
//                         }`}
//                     />

//                     {!isCollapsed && (
//                         <div className={`basis-[15%] transition-[flex-basis] duration-300 ease-in-out flex flex-col justify-center items-center`}>
//                             <div className="flex flex-col gap-2.5">
//                                 <button
//                                     className="bg-[#8A70D6] text-white px-4 py-2 rounded hover:bg-[#7A60C6] transition-colors"
//                                     onClick={() => handleMarkSchemeOpen('markScheme', index)}
//                                 >
//                                     Mark Scheme
//                                 </button>
//                                 <button
//                                     className=" text-[#fdac04] px-4 py-2 rounded hover:bg-[#ed9c00] transition-colors"
//                                     onClick={() => handleAnswerKeyOpen('answerKey', index)}
//                                 >
//                                     Answer Key
//                                 </button>
//                                 <button
//                                     className="text-[#0ed59e]  px-4 py-2 rounded hover:bg-[#0dc590] transition-colors"
//                                     onClick={() => handleModelAnswerOpen('modelAnswer', index)}
//                                 >
//                                     Model Answer
//                                 </button>
//                                 <button
//                                     className="text-[#13c3dd] text px-4 py-2 rounded hover:bg-[#12b3cd] transition-colors"
//                                     onClick={() => handleVideoOpen(index)}
//                                 >
//                                     Video
//                                 </button>
//                                 <button
//                                     className="bg-[#0ed59e] text-white px-4 py-2 rounded hover:bg-[#0dc590] transition-colors"
//                                     onClick={() => handlePdfOpen(index)}
//                                 >
//                                     PDF
//                                 </button>
//                                 <button
//                                     className="text-[#a9da44]  px-4 py-2 rounded hover:bg-[#99ca34] transition-colors flex items-center"
//                                     onClick={() => {
//                                         dispatch(setSelectedId(question._id));
//                                         navigate(`/main-question-edit/${question._id}`);
//                                     }}
//                                 >
//                                     <CiEdit className="mr-1" />
//                                     Edit
//                                 </button>
//                                 <button
//                                     className="text-[#dc3545] px-4 py-2 rounded hover:bg-[#cc2535] transition-colors flex items-center"
//                                     onClick={() => handleDeleteDialogOpen(question)}
//                                 >
//                                     <FiDelete className="mr-1" />
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     <button
//                         onClick={toggleCollapse}
//                         className={`absolute top-1/2 text-black min-w-[40px] min-h-[40px] flex justify-center items-center p-1.5 ${
//                             isCollapsed ? 'right-[1%] flex-col' : 'right-[11%] flex-row'
//                         }`}
//                         style={{ transform: 'translateY(-50%)' }}
//                     >
//                         {isCollapsed ? (
//                             <div className="flex items-center">
//                                 <MdKeyboardArrowLeft/>
//                                 <div className="writing-mode-vertical-rl rotate-90 text-xl text-center text-[#8A70D6] ">
//                                     Question Help
//                                 </div>
//                             </div>
//                         ) : (
//                             <MdKeyboardArrowRight />
//                         )}
//                     </button>
//                 </div>
//             </div>

//             <CreateFilterData
//                 showAssignmentPreview={showAssignmentPreview}
//                 setShowAssignmentPreview={setShowAssignmentPreview}
//                 printOptions={printOptions}
//                 handleOptionChange={handleOptionChange}
//                 filteredQuestions={filteredQuestions}
//                 selectedQuestions={selectedQuestions}
//                 renderMedia={renderMedia}
//                 coverLetterDetails={coverLetterDetails}
//                 handleCoverLetterChange={handleCoverLetterChange}
//                 subjects={subjects}
//                 assignmentBoardId={assignmentBoardId}
//                 assignmentSubjectId={assignmentSubjectId}
//                 categories={categories}
//                 assignmentSubjectLevelId={assignmentSubjectLevelId}
//                 assignmentSourceId={assignmentSourceId}
//                 assignmentPaperId={assignmentPaperId}
//                 showSaveSuccess={showSaveSuccess}
//                 showSaveError={showSaveError}
//                 handlePrint={handlePrint}
//                 handleSaveAssignment={handleSaveAssignment}
//                 setShowSaveSuccess={setShowSaveSuccess}
//                 setShowSaveError={setShowSaveError}
//                 calculateTotalMarks={calculateTotalMarks}
//                 selectedSubquestions={selectedSubquestions}
//                 calculateSubquestionMarks={calculateSubquestionMarks}
//                 selectedSubchildquestions={selectedSubchildquestions}
//                 toRoman={toRoman}
//                 handleSaveAssignment1={handleSaveAssignment1}
//             />

//           <SaveAssignmentDailogue
//                 saveAssignmentDialogOpen={saveAssignmentDialogOpen}
//                 setSaveAssignmentDialogOpen={setSaveAssignmentDialogOpen}
//                 assignmentName={assignmentName}
//                 setAssignmentName={setAssignmentName}
//                 handleSaveAssignment={handleSaveAssignment}
//             /> 
//         </div>
//     );
// })}

           
//             </form>
//           </div>

     

//           <AnswerKeyDialog
//             open={activeAnswerKeyIndex !== null}
//             onClose={() => setActiveAnswerKeyIndex(null)}
//             answerKeyContent={answerKeyContent}
//             activeQuestionIndex={activeAnswerKeyIndex}
//             renderMedia={renderMedia}
//           />
         

//           <DeleteComponent
//             deleteDialogOpen={deleteDialogOpen}
//             deleteSuccessDialogOpen={deleteSuccessDialogOpen}
//             selectedQuestionToDelete={selectedQuestionToDelete}
//             handleDeleteDialogClose={handleDeleteDialogClose}
//             handleDeleteSuccessDialogClose={handleDeleteSuccessDialogClose}
//             handleDeleteQuestion={handleDeleteQuestion}
//           /> 
//  <PdfDialog
//             open={activePdfIndex !== null}
//             onClose={() => setActivePdfIndex(null)}
//             pdfContent={pdfContent}
//             activeQuestionIndex={activePdfIndex}
//             renderMedia={renderMedia}
//           /> 
//            <MarkSchemeComponent
//             open={activeMarkschemeIndex !== null}
//             onClose={() => setActiveMarkschemeIndex(null)}
//             markschemeContent={markschemeContent}
//             activeQuestionIndex={activeMarkschemeIndex}
//             renderMedia={renderMedia}
//           />
//            <ModelAnswerDialog
//             open={activeModelAnswerIndex !== null}
//             onClose={() => setActiveModelAnswerIndex(null)}
//             modelAnswerContent={modelAnswerContent}
//             activeQuestionIndex={activeModelAnswerIndex}
//             renderMedia={renderMedia}
//           />
//            <VdoComponent
//             open={activeVideoIndex !== null}
//             onClose={() => setActiveVideoIndex(null)}
//             videoContent={videoContent}
//             activeQuestionIndex={activeVideoIndex}
//             renderMedia={renderMedia}
//           />
//           {loading && (
//             <div>Loading..........................</div>
//           )}

        

//           <ToastContainer />
//           <ScrollUpComponent />
//         </div>
//       </div>
//     </div>
//   );
// };






// export default CreateAssignmentList
import React from 'react'

const CreateAssignmentList = () => {
  return (
    <div>CreateAssignmentList</div>
  )
}

export default CreateAssignmentList