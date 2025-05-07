import { useState } from 'react';
import SubjectCustom from '../CustomComponent/SubjectCustom';
import SubjectLevelCustom from '../CustomComponent/SubjectLevelCustom';
import SourceCustom from '../CustomComponent/SourceCustom';
import PaperCustom from '../CustomComponent/PaperCustom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddButton from '../../../utilities/SaveButton';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import BoardCustom from '../CustomComponent/BoardCustom';
import BackButton from '../../../utilities/BackButrton';

const TopicAdd = ({ goToNextTab, selectedBoard, handleBoardChange }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const existingTopics = categories.categories
        .find((cat) => cat._id === selectedBoard)
        ?.subjects.find((sub) => sub._id === selectedSubject)
        ?.subjectlevels.find((level) => level._id === selectedSubjectLevel)
        ?.sources.find((source) => source._id === selectedSource)
        ?.papers.find((paper) => paper._id === selectedPaper)
        ?.topics || [];
    
      const normalizedTopicName = selectedTopic.trim().replace(/\s+/g, ' ').toLowerCase();
    
      const isDuplicate = existingTopics.some(topic => 
        topic.topic_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedTopicName
      );
    
      if (isDuplicate) {
        toast.error('This topic already exists!');
        return;
      }
    
      const response = await Api.post('/categorys/topic/create', {
        board_id: selectedBoard,
        subject_id: selectedSubject,
        subject_level_id: selectedSubjectLevel,
        source_id: selectedSource,
        paper_id: selectedPaper,
        topic_name: selectedTopic,
      });
  
      console.log('Full Response:', response);
  
      if (response && response.data && response.data.status === 'success') {
        toast.success('Topic created successfully!');
        goToNextTab();
        setSelectedSubject('');
        setSelectedSubjectLevel('');
        setSelectedSource('');
        setSelectedPaper('');
        setSelectedTopic('');
        setIsSubmitting(true);
        refetch(); 
      } else {
        console.error('Failed to create topic:', response);
        toast.error('Failed to create the topic. Please try again.');
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      toast.error('An error occurred while saving the topic.');
    }
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
          return "Source";
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-4">
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
            <div>
              <label htmlFor="topicName" className="block text-sm font-medium text-gray-700">
                {getInputLabel('Topic')}
              </label>
              <input
                type="text"
                id="topicName"
                name="topicName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-sm"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
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

export default TopicAdd;