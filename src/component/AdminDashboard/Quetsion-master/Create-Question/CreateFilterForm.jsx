import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsArrowLeft } from 'react-icons/bs';
import { PiSealQuestionBold } from 'react-icons/pi';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import BoardCustom from '../../CategoryMaster/CustomComponent/BoardCustom';
import SubjectCustom from '../../CategoryMaster/CustomComponent/SubjectCustom';
import SubjectLevelCustom from '../../CategoryMaster/CustomComponent/SubjectLevelCustom';
import SourceCustom from '../../CategoryMaster/CustomComponent/SourceCustom';
import PaperCustom from '../../CategoryMaster/CustomComponent/PaperCustom';
import TopicCustom from '../../CategoryMaster/CustomComponent/TopicCustom';
import AddButton from '../../../utilities/SaveButton';
import Loader from '../../Routing/Loader';
import { setBoardId, setSubTopicId } from '../../../store/all-Id-Slice/IdSlice';
import SubTopicCustom from '../../CategoryMaster/CustomComponent/SubtopicCustom';

const CreateFilterForm = () => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubTopic, setSelectedSubTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: { data: categories } = {}, isLoading } = useGetCategoryListQuery();

  useEffect(() => {
    if (categories) {
      console.log("Categories loaded:", categories);
    }
  }, [categories]);

  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSave = useCallback(() => {
 
    const selectedCategory = categories?.categories.find(cat => cat._id === selectedBoard);
  
    let subTopicOrTopicId;
  
    if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
    
      subTopicOrTopicId = selectedCategory
        ?.subjects.find(sub => sub._id === selectedSubject)
        ?.subjectlevels.find(level => level._id === selectedSubjectLevel)
        ?.sources.find(source => source._id === selectedSource)
        ?.papers.find(paper => paper._id === selectedPaper)
        ?.topics.find(topic => topic._id === selectedTopic)?._id;
  
      console.log("Retrieved Topic ID:", subTopicOrTopicId);
    } else {
      subTopicOrTopicId = selectedCategory
        ?.subjects.find(sub => sub._id === selectedSubject)
        ?.subjectlevels.find(level => level._id === selectedSubjectLevel)
        ?.sources.find(source => source._id === selectedSource)
        ?.papers.find(paper => paper._id === selectedPaper)
        ?.topics.find(topic => topic._id === selectedTopic)
        ?.subtopics?.find(subtopic => subtopic._id === selectedSubTopic)?._id;
  
      console.log("Retrieved SubTopic ID:", subTopicOrTopicId);
    }
  
    const boardID = selectedCategory?.board_prog_name;
  
    if (boardID && subTopicOrTopicId) {
 
      dispatch(setBoardId(boardID));
      dispatch(setSubTopicId(subTopicOrTopicId));
  
      // setSuccessMessageOpen(true);
      if (selectedBoard === '665fffe9e02ec586b271fba2') {
        navigate('/mypsection'); 
      } else {
        navigate(`/create-question/${boardID}/${subTopicOrTopicId}`); 
      }
    } else {
      console.error("Failed to save: Missing Board ID or SubTopic/Topic ID.");
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

  const handleReset = () => {
    setSelectedBoard('');
    setSelectedSubject('');
    setSelectedSubjectLevel('');
    setSelectedSource('');
    setSelectedPaper('');
    setSelectedTopic('');
    setSelectedSubTopic('');
    showToast("Filters have been reset", 'info');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const toggleFilterCollapse = () => {
    setIsFilterCollapsed(!isFilterCollapsed);
  };

  const getInputLabel = (label) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (label) {
        case 'Subject': return 'Grade';
        case 'Subject Level': return 'Subject';
        case 'Source': return 'Source';
        case 'Paper': return 'Topic';
        case 'Topic': return 'SubTopic';
        case 'SubTopic': return 'Rubics';
        default: return label;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (label) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        case "Source": return "Source ";
        case "Paper": return "SubTopics";
        case "Topic": return "Level";
        default: return label;
      }
    }
    return label;
  };

  return (
    <div className="container mx-auto px-4 mt-4">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="flex items-center mb-6">
        <div className="bg-[#1a73e8] p-2 rounded-full mr-4">
          <PiSealQuestionBold className="text-white text-3xl" />
        </div>
        <h1 className="text-[#1a73e8] text-3xl font-bold">Create Question</h1>
      </div>
      
      {/* Back Button */}
      <div className='mt-4 mb-4 text-black'>
        <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-gray-100">
          <BsArrowLeft size={24} />
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="mb-6">
        <div className="border-b p-4">
          <div className='flex justify-between items-center cursor-pointer' onClick={toggleFilterCollapse}>
            <h2 className='text-lg font-medium'>Question Filter</h2>
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
              className={`ml-4 transition-transform duration-200 ${isFilterCollapsed ? 'transform rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        
        {!isFilterCollapsed && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <BoardCustom selectedBoard={selectedBoard} setSelectedBoard={setSelectedBoard} />
              </div>
              <div className="col-span-1">
                <SubjectCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  setSelectedSubject={setSelectedSubject}
                  getInputLabel={getInputLabel}
                />
              </div>
              <div className="col-span-1">
                <SubjectLevelCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  setSelectedSubjectLevel={setSelectedSubjectLevel}
                  getInputLabel={getInputLabel}
                />
              </div>
              <div className="col-span-1">
                <SourceCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  setSelectedSource={setSelectedSource}
                  getInputLabel={getInputLabel}
                />
              </div>
              <div className="col-span-1">
                <PaperCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  selectedPaper={selectedPaper}
                  setSelectedPaper={setSelectedPaper}
                  getInputLabel={getInputLabel}
                />
              </div>
              <div className="col-span-1">
                <TopicCustom
                  selectedBoard={selectedBoard}
                  selectedSubject={selectedSubject}
                  selectedSubjectLevel={selectedSubjectLevel}
                  selectedSource={selectedSource}
                  selectedPaper={selectedPaper}
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  getInputLabel={getInputLabel}
                />
              </div>
              {selectedBoard !== "671f5e5bfd4c6a25ad4bb527" && (
                <div className="col-span-1">
                  <SubTopicCustom
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
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <AddButton 
                type="button" 
                onClick={handleReset} 
                label="Reset" 
                className="mr-4"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Button */}
     
      
      {isLoading && <Loader/>}
     
      <div className="flex justify-between">
        <AddButton 
          type="button" 
          onClick={handleSave} 
          label={isSubmitting ? "Processing..." : "Add Question"}
          disabled={isSubmitting}
        />
  
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">Submitting your question...</p>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Footer */}
      <div className="text-start mt-6 ml-6 text-gray-500">
        COPYRIGHT © 2024 My Revision+, All rights Reserved
      </div>
    </div>
  );
};

export default CreateFilterForm;