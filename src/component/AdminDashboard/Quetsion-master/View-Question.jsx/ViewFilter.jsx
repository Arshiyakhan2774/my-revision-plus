
import { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Grid, Typography, Container, Chip, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toast } from 'bootstrap';
import LayoutPage from '../../../../Utilities/LayoutPage';
import BoardCustom from '../../CategoryMaster/CustomComponent/BoardCustom';
import SubjectCustom from '../../CategoryMaster/CustomComponent/SubjectCustom';
import SubjectLevelCustom from '../../CategoryMaster/CustomComponent/SubjectLevelCustom';
import SourceCustom from '../../CategoryMaster/CustomComponent/SourceCustom';
import PaperCustom from '../../CategoryMaster/CustomComponent/PaperCustom';
import Loading from '../../../../Utilities/Loading';
import { useGetCategoryListQuery } from '../../../../Services/Category/CategoryApi';
import { BsArrowLeft } from 'react-icons/bs';
import { setBoardId, setSubTopicId } from '../../../../store/all-Id-Slice/IdSlice';
import IconWithTitle from '../../../../Utilities/IconsTittle';
import { PiSealQuestionBold } from 'react-icons/pi';
import AddButton from '../../../../Utilities/SaveButton';
import ArraySubTopicCustom from '../../CategoryMaster/CustomComponent/ArraySubTopic';
import ArrayTopicCustom from '../../CategoryMaster/CustomComponent/ArrayTopicCustom';
import { AddIcCallOutlined, DeleteForever, EditNotifications, Preview } from '@mui/icons-material';
import QuestionPaperPreview from './QuestionPreview';
import QuestionPapersList from './QuestionPaperList';
import QuestionPaperPreviewModal from './QuestionPreview';

const ViewFilter = ({ isSidebarClosed }) => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [selectedSubTopic, setSelectedSubTopic] = useState([]);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: { data: categories } = {}, isLoading } = useGetCategoryListQuery();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedTopicName, setSelectedTopicName] = useState('');
  const [showPapersList, setShowPapersList] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const hardcodedQuestions = [
    { 
      id: 1, 
      text: "What is the capital of France?", 
      type: "MCQ",
      difficulty: "Easy",
      marks: 1
    },
    { 
      id: 2, 
      text: "Who painted the Mona Lisa?", 
      type: "Short Answer",
      difficulty: "Medium",
      marks: 2
    },
    { 
      id: 3, 
      text: "Solve the quadratic equation: x² - 5x + 6 = 0", 
      type: "Numerical",
      difficulty: "Medium",
      marks: 3
    },
    { 
      id: 4, 
      text: "Explain quantum physics basics in your own words", 
      type: "Essay",
      difficulty: "Hard",
      marks: 5
    },
    { 
      id: 5, 
      text: "What is Schrödinger's cat thought experiment about?", 
      type: "Short Answer",
      difficulty: "Hard",
      marks: 4
    }
  ];

  useEffect(() => {
    if (selectedTopic) {
      setQuestions(hardcodedQuestions);
      setSelectedTopicName("General Questions"); 
    } else {
      setQuestions([]);
      setSelectedTopicName('');
    }
  }, [selectedTopic]);
  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };
  useEffect(() => {
 
    if (categories) {
      console.log("Categories loaded:", categories);
    }
  }, [categories]);
  const handleSave = useCallback(() => {
    const selectedCategory = categories?.categories.find(cat => cat._id === selectedBoard);
  
    if (!selectedCategory) {
      console.error("Selected category not found.");
      return;
    }
  
    let subTopicOrTopic = [];
  
    if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      subTopicOrTopic = selectedCategory
        ?.subjects?.find(sub => sub._id === selectedSubject)
        ?.subjectlevels?.find(level => level._id === selectedSubjectLevel)
        ?.sources?.find(source => source._id === selectedSource)
        ?.papers?.find(paper => paper._id === selectedPaper)
        ?.topics?.find(topic => topic._id === selectedTopic)?._id || [];
    } else {
      subTopicOrTopic = selectedCategory
        ?.subjects?.find(sub => sub._id === selectedSubject)
        ?.subjectlevels?.find(level => level._id === selectedSubjectLevel)
        ?.sources?.find(source => source._id === selectedSource)
        ?.papers?.find(paper => paper._id === selectedPaper)
        ?.topics?.find(topic => topic._id === selectedTopic)
        ?.subtopics?.find(subtopic => subtopic._id === selectedSubTopic)?._id || [];
    }
  

    subTopicOrTopic = Array.isArray(subTopicOrTopic) ? subTopicOrTopic : [subTopicOrTopic].filter(Boolean);
  
    const boardID = selectedCategory?.board_prog_name;
  
    console.log("Selected Board:", selectedBoard);
    console.log("Selected Subject:", selectedSubject);
    console.log("Selected Subject Level:", selectedSubjectLevel);
    console.log("Selected Source:", selectedSource);
    console.log("Selected Paper:", selectedPaper);
    console.log("Selected Topic:", selectedTopic);
    console.log("Selected SubTopic:", selectedSubTopic);
    console.log("SubTopic or Topic ID:", subTopicOrTopic);
    console.log("Board ID:", boardID);

    dispatch(setBoardId(boardID));
    dispatch(setSubTopicId(selectedSubTopic));
  
    setSuccessMessageOpen(true);
  
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      navigate('/mypsection');
    } else {
      navigate(`/create-question/${boardID}/${selectedSubTopic.join(',')}`);
    }
  }, [
    categories,
    selectedBoard,
    selectedSubject,
    selectedSubjectLevel,
    selectedSource,
    selectedPaper,
    selectedTopic,
    selectedSubTopic,
    dispatch,
    navigate
  ]);
 
  const handleGoBack = () => {
  
    window.history.back();
  };

  const handleCloseSuccessMessage = () => {
    
    setSuccessMessageOpen(false);
  };
  const [showPaperPreview, setShowPaperPreview] = useState(false);

  // Add this function to handle viewing the paper
  const handleViewPaper = () => {
    setShowPaperPreview(true);
  };
  
  // Add this function to handle going back to questions
  const handleBackToQuestions = () => {
    setShowPaperPreview(false);
  };
  
  // Add this function to handle editing a question
  const handleEditQuestion = (questionId) => {
    // Implement your edit logic here
    console.log("Editing question:", questionId);
  };
  
  const getInputLabel = (label) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (label) {
        case 'Subject':
          return 'Grade';
        case 'Subject Level':
          return 'Subject';
        case 'Source':
          return 'Source';
        case 'Paper':
          return 'Topic';
        case 'Topic':
          return 'SubTopic';
        case 'SubTopic':
          return 'Rubics';
        default:
          return label;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (label) {
        case "Subject":
          return "Subject";
        case "Subject Level":
          return "Content";
        case "Source":
          return "Source ";
        case "Paper":
          return "SubTopics";
        case "Topic":
          return "Level";
        default:
          return label;
      }
    }
    return label;
  };


  // Add these functions
  const handleShowPapersList = () => {
    setShowPapersList(true);
  };
  
  const handleCreateNewPaper = () => {
    setShowPapersList(false);
    setShowPaperPreview(false);
    setSelectedQuestions([]);
  };
  const totalMarks = questions
  .filter(q => selectedQuestions.includes(q.id))
  .reduce((sum, q) => sum + q.marks, 0);
  const handleSavePaper = () => {
    const newPaper = {
      id: Date.now(),
      title: `Paper ${papers.length + 1}`,
      questions: selectedQuestions,
      totalMarks: totalMarks,
      dateCreated: new Date().toLocaleDateString(),
      questionsData: questions.filter(q => selectedQuestions.includes(q.id))
    };
    setPapers([...papers, newPaper]);
    setShowPaperPreview(false);
    setSelectedQuestions([]);
    navigate('/question-papers-display', { state: { papers: [...papers, newPaper] } });
  };
  const handleOpenPreview = () => {
    setPreviewModalOpen(true);
  };
  
  const handleClosePreview = () => {
    setPreviewModalOpen(false);
  };
  
  const handleSaveDraft = () => {
    // Implement save draft logic
    console.log("Saving draft...");
    handleClosePreview();
  };
  
  const handleAddMoreQuestions = () => {
    handleClosePreview();
    // You might want to scroll to questions section
  };
  
  const handleFinalizePaper = () => {
    // Implement finalize logic
    console.log("Finalizing paper...");
    handleClosePreview();
  };
  return (
    <LayoutPage isSidebarClosed={isSidebarClosed}>
  
      <Container maxWidth='xxl' className="mt-4">
      <IconWithTitle
      icon={PiSealQuestionBold}
      title="Create Question"
      iconColor="white"
      backgroundColor="#1a73e8"
      iconSize="30px"
      titleColor="#1a73e8"
      titleFontSize="34px"
    />
        <div className='mt-4 mb-4 text-black w-8 h-8'>
          <Button onClick={handleGoBack}>
            <BsArrowLeft size={24} />
          </Button>
        </div>
        <Accordion defaultExpanded>
          <AccordionSummary>
            <div className='flex flex-row justify-between'>
              <Typography className='text-lg mb-[-20px]'>Question Filter</Typography>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className='ml-4'
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </AccordionSummary>
          {selectedTopic && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg flex justify-between items-center">
            <Typography variant="subtitle1">
              Showing <strong>General Questions</strong>
            </Typography>
            {selectedQuestions.length > 0 && (
              <Chip 
                label={`${selectedQuestions.length} selected`} 
                color="primary"
                variant="outlined"
              />
            )}
            {selectedQuestions.length > 0 && (
  <Chip 
    label={`${selectedQuestions.length} selected (${totalMarks} marks)`} 
    color="primary"
    variant="outlined"
    sx={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
  />
)}
          </div>
        )}
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <BoardCustom selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard} />
              </Grid>
              <Grid item xs={12} md={4}>
                <SubjectCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  getInputLabel={getInputLabel}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SubjectLevelCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  setSelectedSubjectLevel={setSelectedSubjectLevel}
                  getInputLabel={getInputLabel}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SourceCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  getInputLabel={getInputLabel}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <PaperCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  selectedPaper={selectedPaper}
                  setSelectedPaper={setSelectedPaper}
                  getInputLabel={getInputLabel}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ArrayTopicCustom 
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  selectedPaper={selectedPaper}
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  getInputLabel={getInputLabel}
                />
              </Grid>
              <Grid item xs={12} md={4}>
  {selectedBoard !== "671f5e5bfd4c6a25ad4bb527" && (
    <ArraySubTopicCustom
      selectedBoard={selectedBoard}
      selectedSubject={selectedSubject}
      selectedSubjectLevel={selectedSubjectLevel}
      selectedSource={selectedSource}
      selectedPaper={selectedPaper}
      selectedTopic={selectedTopic}
      selectedSubTopic={selectedSubTopic}
      setSelectedSubTopic={setSelectedSubTopic}
      getInputLabel={getInputLabel}
    />
  )}
</Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      
        {selectedTopic && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5" className="font-bold text-gray-800">
                Available Questions
              </Typography>
              {selectedQuestions.length > 0 && (
                <Chip 
                  label={`${selectedQuestions.length} selected`} 
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                />
              )}
            </div>

            <div className="space-y-4">
              {questions.map((question) => (
                <div 
                  key={question.id} 
                  className={`p-4 border rounded-lg transition-all ${selectedQuestions.includes(question.id) ? 
                    'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-start">
                    <Checkbox
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleQuestionSelect(question.id)}
                      color="primary"
                      sx={{ padding: '0.5rem' }}
                    />
                    
                    <div className="ml-2 flex-1">
                      <Typography className="font-medium text-gray-800">
                        {question.text}
                      </Typography>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        <Chip 
                          label={question.type} 
                          size="small"
                          variant="outlined"
                          color="info"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip 
                          label={question.difficulty} 
                          size="small"
                          variant="outlined"
                          color={
                            question.difficulty === "Easy" ? "success" : 
                            question.difficulty === "Medium" ? "warning" : "error"
                          }
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip 
                          label={`${question.marks} mark${question.marks > 1 ? 's' : ''}`} 
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="info"
                        startIcon={<Preview fontSize="small" />}
                        sx={{ textTransform: 'none' }}
                      >
                        Preview
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="success"
                        startIcon={<EditNotifications fontSize="small" />}
                        sx={{ textTransform: 'none' }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selection Actions */}
            {selectedQuestions.length > 0 && (
  <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
    <div className="flex items-center space-x-4">
      <Typography variant="subtitle1">
        {selectedQuestions.length} question{selectedQuestions.length > 1 ? 's' : ''} selected ({totalMarks} marks)
      </Typography>
      <Button 
        variant="contained" 
        color="primary"
        startIcon={<Preview />}
        onClick={handleOpenPreview}
        sx={{ textTransform: 'none' }}
      >
        View Paper
      </Button>
      <Button 
        variant="outlined" 
        color="error"
        startIcon={<DeleteForever/>}
        onClick={() => setSelectedQuestions([])}
        sx={{ textTransform: 'none' }}
      >
        Clear Selection
      </Button>
    </div>
  </div>
)}
          </div>
        )}


      </Container>
      {isLoading && (
        <Loading/>
      )}
      <div className="text-start mt-6 ml-6">COPYRIGHT © 2024 My Revision+, All rights Reserved</div>
      {successMessageOpen && (
        <Toast message="Subtopic added successfully!" onClose={handleCloseSuccessMessage} />
      )}
         <QuestionPaperPreviewModal
          open={previewModalOpen}
          onClose={handleClosePreview}
          selectedQuestions={selectedQuestions}
          questions={questions}
          onEdit={handleEditQuestion}
          onSaveDraft={handleSaveDraft}
          onAddMore={handleAddMoreQuestions}
          onFinalize={handleFinalizePaper}
          onSavePaper={handleSavePaper} // Added save paper handler
        />


        {!showPapersList && !previewModalOpen && selectedQuestions.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <Typography variant="subtitle1">
                {selectedQuestions.length} question{selectedQuestions.length > 1 ? 's' : ''} selected
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<Preview />}
                onClick={handleOpenPreview}
              >
                View Paper
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteForever/>}
                onClick={() => setSelectedQuestions([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {!showPapersList && !previewModalOpen && (
          <Button 
            variant="outlined" 
            onClick={() => setShowPapersList(true)}
            sx={{ mt: 2 }}
          >
            View All Papers
          </Button>
        )}

   </LayoutPage>

  );
};

export default ViewFilter