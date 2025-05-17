import { useState } from 'react';
import SubjectCustom from '../CustomComponent/SubjectCustom';
import SubjectLevelCustom from '../CustomComponent/SubjectLevelCustom';
import SourceCustom from '../CustomComponent/SourceCustom';
import PaperCustom from '../CustomComponent/PaperCustom';
import BoardCustom from '../CustomComponent/BoardCustom';
import TopicCustom from '../CustomComponent/TopicCustom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';

const SubTopicAdd = ({
  goToNextTab,
  selectedBoard,
  handleBoardChange,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [subtopicName, setSubtopicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const existingSubtopics = categories.categories
      .find((cat) => cat._id === selectedBoard)
      ?.subjects.find((sub) => sub._id === selectedSubject)
      ?.subjectlevels.find((level) => level._id === selectedSubjectLevel)
      ?.sources.find((source) => source._id === selectedSource)
      ?.papers.find((paper) => paper._id === selectedPaper)
      ?.topics.find((topic) => topic._id === selectedTopic)
      ?.subtopics || [];
  
    const normalizedSubtopicName = subtopicName.trim().replace(/\s+/g, ' ').toLowerCase();
    
    const isDuplicate = existingSubtopics.some(subtopic => 
      subtopic.subtopic_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedSubtopicName
    );
    
    if (isDuplicate) {
      toast.error('This subtopic already exists!');
      return;
    }
    
    try {
      const response = await Api.post('/categorys/subtopic/create', {
        board_id: selectedBoard,
        subject_id: selectedSubject,
        subject_level_id: selectedSubjectLevel,
        source_id: selectedSource,
        paper_id: selectedPaper,
        topic_id: selectedTopic,
        subtopic_name: subtopicName,
      });

      console.log('Full Response:', response);
      navigate('/view-category');
      
      if (response.data && response.data.success) {
        toast.success('Subtopic created successfully!');
        setSelectedSubject('');
        setSelectedSubjectLevel('');
        setSelectedSource('');
        setSelectedPaper('');
        setSelectedTopic('');
        setSubtopicName('');
        setIsSubmitting(true);
        goToNextTab();
      } else {
        console.error('Failed to create subtopic:', response);
        toast.error('Failed to create the subtopic. Please try again.');
      }
    } catch (error) {
      console.error('Error adding subtopic:', error);
      toast.error('An error occurred while saving the subtopic.');
    }
    refetch();
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
    }
    return label;
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mt-2">
              <BoardCustom selectedBoard={selectedBoard} setSelectedBoard={handleBoardChange} />
            </div>
            <div className="mt-2">
              <SubjectCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                getInputLabel={getInputLabel}
              />
            </div>
            <div className="mt-2">
              <SubjectLevelCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                selectedSubjectLevel={selectedSubjectLevel}
                setSelectedSubjectLevel={setSelectedSubjectLevel}
                getInputLabel={getInputLabel}
              />
            </div>
            <div className="mt-2">
              <SourceCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                selectedSubjectLevel={selectedSubjectLevel}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                getInputLabel={getInputLabel}
              />
            </div>
            <div className="mt-2">
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
            <div className="mt-2">
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
            <div>
              <label htmlFor="subtopicName" className="block text-sm font-medium text-gray-700 mb-1">
                {getInputLabel('SubTopic')}
              </label>
              <input
                type="text"
                id="subtopicName"
                name="subtopicName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={subtopicName}
                onChange={(e) => setSubtopicName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <BackButton/>
            <AddButton
                      type="submit" 
                      label="Add Subject" 
                      disabled={isSubmitting}
                    />
          </div>
        </div>
      </form>
      <ToastContainer />

    </div>
  );
};

export default SubTopicAdd;