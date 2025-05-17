import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Api } from '../../../Api/Api';
import Loader from '../../Routing/Loader';
import CreateQuestionNavbar from './CreateQuestionNavbar';
import RowButton from './RowButton';
import AddButtonStyle from './AddButtonStyle';


const AddCreateQuestion = () => {
  const navigate = useNavigate();
  const [openMainQuestion, setOpenMainQuestion] = useState(false);
  const [openStatementButton, setOpenStatementButton] = useState(false);
  const [openSubQuestion, setOpenSubQuestion] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const subTopicId = useSelector(state => state.idSlice.subTopicId);
  const boardId = useSelector(state => state.idSlice.boardId);

  useEffect(() => {
    const fetchData = async () => {
      if (subTopicId && boardId) {
        setLoading(true);
        try {
          const response = await Api.get(`/categorys/subtopics/${subTopicId}/${boardId}`);
          console.log('API Response:', response.data);
          const data = response.data?.data;
          if (data) {
            setSavedData(data);
            if (data.board_info && data.board_info._id) {
              console.log('Board ID from response:', data.board_info._id);
            }
          } else {
            console.error('Invalid response structure:', response.data);
            setError('Invalid response structure');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Error fetching data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [subTopicId, boardId]);
  
  useEffect(() => {
    if (savedData) {
      let breadcrumbString = '';
  
      if (savedData.topics && savedData.topics.length > 0) {
        const topic = savedData.topics[0];
        breadcrumbString = [
          topic.board_info?.board_prog_name || 'Unknown Board',
          topic.subject_info?.subject_name || 'Unknown Subject',
          topic.subjectlevel_info?.subject_level_name || 'Unknown Level',
          topic.source_info?.source_name || 'Unknown Source',
          topic.paper_info?.paper_name || 'Unknown Paper',
          topic.topic_info?.topic_name || 'Unknown Topic'
        ].join(' / ');
      } 
      else if (savedData.subtopics && savedData.subtopics.length > 0) {
        const subtopic = savedData.subtopics[0];
        breadcrumbString = [
          subtopic.board_info?.board_prog_name || 'Unknown Board',
          subtopic.subject_info?.subject_name || 'Unknown Subject',
          subtopic.subjectlevel_info?.subject_level_name || 'Unknown Level',
          subtopic.source_info?.source_name || 'Unknown Source',
          subtopic.paper_info?.paper_name || 'Unknown Paper',
          subtopic.topic_info?.topic_name || 'Unknown Topic',
          subtopic.subtopic_info?.subtopic_name || 'Unknown Subtopic'
        ].join(' / ');
      } else {
        breadcrumbString = 'No topics or subtopics available';
      }
  
      setBreadcrumb(breadcrumbString); 
    }
  }, [savedData]);

  const handleAddItem = () => {
    console.log("Breadcrumb on button click:", breadcrumb);
    setOpenMainQuestion(false);
    setOpenStatementButton(true);
    setOpenSubQuestion(false);
  };

  const handleAddStatement = () => {
    setOpenStatementButton(false);
    setOpenMainQuestion(true);
    setOpenSubQuestion(false);
    navigate(`/mainquestion/${subTopicId}`);  
  };

  return (
    <Fragment>
      {/* {subTopicId && <CreateQuestionNavbar/>}  */}
      <div className="max-w-[100%]">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        <div className="flex justify-between items-center">
          <div>
            <AddButtonStyle
              onClick={handleAddItem}
              title="Add Question"
              buttonText="New"
              iconType="add"
            />
          </div>
          <p className="mb-2.5 mt-2.5 flex justify-end">
            {breadcrumb}
          </p>
        </div>

        {openStatementButton && (
          <div className="flex justify-center items-center mt-5">
            <RowButton  
              onAddStatement={handleAddStatement}
            />
          </div>
        )}

        {/* {openMainQuestion && (
          <MainQuestion setOpenMainQuestion={setOpenMainQuestion} subTopicId={subTopicId} />
        )} */}
      </div>
      {loading && <Loader/>}
    </Fragment>
  );
};

export default AddCreateQuestion;