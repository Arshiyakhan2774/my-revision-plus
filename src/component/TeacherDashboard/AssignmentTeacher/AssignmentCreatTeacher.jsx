import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaPiedPiperPp, FaGraduationCap } from 'react-icons/fa';
import { GiBookshelf, GiSchoolBag, GiDiploma } from 'react-icons/gi';
import { SiSat1 } from "react-icons/si";
import { Api } from '../../Api/Api';
import { setAssignmentSubTopicId } from '../../store/all-Id-Slice/IdSlice';
import CreateAssignmentList from '../../AdminDashboard/Assignment-master/CreateAssignment/CreateAssignmentList';
import ModelAssignmentCreate from './ModelAssignmentCreate';


const iconMap = {
  "Program A": <FaPiedPiperPp size={24} />,
  "Program B": <SiSat1 size={24} />,
  "Program C": <FaGraduationCap size={24} />,
};

const AssignmentCreatTeacher = () => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boardId, setBoardId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState(' ');
  const [anchorEl, setAnchorEl] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [subtopicName, setSubtopicName] = useState('');
  const [value, setValue] = useState([]);
  const [expandedSection, setExpandedSection] = useState({
    levels: false,
    sources: false,
    papers: false,
    topics: false,
    subtopics: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userResponse = useSelector((state) => state.idSlice?.userResponse);

  const [selectedAssignment, setSelectedAssignment] = useState({
    level: null,
    source: null,
    paper: null,
    topic: null,
    subtopic: null,
  });

  const iconMap = {
    DP: <GiDiploma size={24} className="text-yellow-400" />,
    MYP: <GiSchoolBag size={24} className="text-green-400" />,
    SAT: <GiBookshelf size={24} className="text-red-400" />,
  };

  const quotesMap = {
    DP: "",
    MYP: "",
    SAT: "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(subjectDetails, "Updated subjectDetails");
  }, [subjectDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Api.get('categorys');
        setValue(res.data.data.boards);
        console.log(res.data, "data..................");
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userResponse?._id) {
        setError('Teacher ID not available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await Api.post('teacherdashboard/get-teacher-category-details', {
          id: boardId,
          teacher_id: userResponse._id,
        });

        console.log("Teacher API Response:", response.data);

        if (response?.data?.status === "success" && response?.data?.data?.subjectDetails) {
          setSubjectDetails(response.data.data.subjectDetails);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (boardId && userResponse?._id) {
      fetchData();
    }
  }, [boardId, userResponse?._id]);

  useEffect(() => {
    const fetchBoardsAndSubjects = async () => {
      if (!boardId || subjectDetails.length === 0) return;

      try {
        const response = await Api.get(`categorys/catsubject/${boardId}`);
        console.log("Category API Response:", response.data);

        let fetchedSubjects = response.data.data.subjects || [];

        const matchedSubjects = fetchedSubjects.filter(subject =>
          subjectDetails.some(detail => detail.subject_name === subject.subject)
        );

        if (matchedSubjects.length > 0) {
          setSubjects(matchedSubjects);
        } else {
          setSubjects([]);
          console.log("No subject match");
        }

      } catch (error) {
        console.error('Error fetching boards and subjects:', error);
      }
    };

    fetchBoardsAndSubjects();
  }, [boardId, subjectDetails]);

  const handleClickOpenBoard = (boardId) => {
    setBoardId(boardId);
    setSelectedBoard(boardId);
    setModalOpen(true);
    console.log('Selected Board ID:', boardId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedLevel(null);
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
    setBreadcrumb([]);
  };

  const handleSubjectClick = (subject) => {
    setExpandedSubject((prev) => (prev === subject.subject ? null : subject.subject));
    setSelectedLevel(null);
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
    setBreadcrumb([{ label: subject.subject, type: 'subject' }]);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, levels: !expandedSection.levels });
    setBreadcrumb((prev) => [
      ...prev,
      { label: level.name, type: 'level' },
    ]);
    setSelectedAssignment(prev => ({
      ...prev,
      levelId: level._id,
      sourceId: null,
      paperId: null,
      topicId: null,
      subtopicId: null,
    }));
  };

  const handleSourceClick = (source) => {
    setSelectedSource(source);
    setSelectedPaper(null);
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, sources: !expandedSection.sources });
    setBreadcrumb((prev) => [
      ...prev.slice(0, prev.findIndex((crumb) => crumb.type === 'level') + 1),
      { label: source.name, type: 'source' },
    ]);
    setSelectedAssignment(prev => ({
      ...prev,
      sourceId: source._id,
      paperId: null,
      topicId: null,
      subtopicId: null,
    }));
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, papers: !expandedSection.papers });
    setBreadcrumb((prev) => [
      ...prev.slice(0, prev.findIndex((crumb) => crumb.type === 'source') + 1),
      { label: paper.name, type: 'paper' },
    ]);
    setSelectedAssignment(prev => ({
      ...prev,
      paperId: paper._id,
      topicId: null,
      subtopicId: null,
    }));
  };

  const handleTopicClick = async (event, topic) => {
    setSelectedTopic(topic);
    setAnchorEl(event.currentTarget);
    setExpandedSection((prev) => ({
      ...prev,
      topics: !prev.topics,
    }));

    setBreadcrumb((prev) => [
      ...prev.slice(0, prev.findIndex((crumb) => crumb.type === 'paper') + 1),
      { label: topic.name, type: 'topic' },
    ]);

    setSelectedAssignment((prev) => ({
      ...prev,
      topicId: topic._id,
      subtopicId: null,
    }));

    const topicName = topic.name;

    if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      console.log('Stored Topic ID for SAT:', topicName);

      try {
        const response = await Api.post('categorys/topic_id/details', {
          subtopic: topicName,
        });

        const subtopicArray = response.data.data.subtopic;

        if (subtopicArray && subtopicArray.length > 0) {
          const topicId = subtopicArray[0]._id;

          console.log('API Response Topic ID:', topicId);

          dispatch(setAssignmentSubTopicId(topicId));

          navigate(`/create-Assignment/${topicId}`);
        }

      } catch (error) {
        console.error('Error fetching topic details:', error);
      }
    }
  };

  const handSubTopic = async (subtopic, event) => {
    setSelectedSubtopic(subtopic);
    setSubtopicName(subtopic.id);
    setExpandedSection((prev) => ({ ...prev, subtopics: !prev.subtopics }));

    setSelectedAssignment((prev) => ({
      ...prev,
      subtopic,
      subtopicId: subtopic.id,
    }));
    console.log(selectedAssignment, "...sub...topic...id")
    const selectedName = subtopic.id;
    console.log('Selected Subtopic Name:', selectedName);

    if (!selectedName) {
      console.error('No subtopic selected');
      return;
    }

    console.log('Payload:', { subtopic: selectedName });
    dispatch(setAssignmentSubTopicId(selectedName));
    navigate(`/create-Assignment/${selectedName}`);
    setModalOpen(false);
  };

  return (
<div>
      

<div className="text-center grid grid-cols-1 md:grid-cols-2 gap-6 w-full p-4">
  {value.slice(0, 4).map((board, index) => (
    <div
      key={index}
      onClick={() => handleClickOpenBoard(board._id)}
      className="cursor-pointer flex flex-col items-center justify-center p-8 bg-white hover:from-blue-100 hover:to-blue-200 transition-all shadow-md hover:shadow-lg"
    >
      <div className="text-3xl mb-4 text-blue-600">
        {iconMap[board.board_prog_name] || <FaGraduationCap />}
      </div>
      <h3 className="text-2xl font-semibold text-gray-800">
        {board.board_prog_name}
      </h3>
      <p className="mt-2 text-gray-600">
        Create {board.board_prog_name} assignments
      </p>
    </div>
  ))}
</div>

     

      <ModelAssignmentCreate
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        subjects={subjects}
        expandedSubject={expandedSubject}
        handleSubjectClick={handleSubjectClick}
        handleLevelClick={handleLevelClick}
        handleSourceClick={handleSourceClick}
        handlePaperClick={handlePaperClick}
        handleTopicClick={handleTopicClick}
        handSubTopic={handSubTopic}
        subjectDetails={subjectDetails}
        selectedLevel={selectedLevel}
        selectedSource={selectedSource}
        selectedPaper={selectedPaper}
        selectedTopic={selectedTopic}
        selectedSubtopic={selectedSubtopic}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        expandedSection={expandedSection}
        subtopicName={subtopicName}
      />

      {assignmentOpen && <CreateAssignmentList
        selectedSubtopicId={selectedSubtopicId}
      />}
    </div>
  )
}

export default AssignmentCreatTeacher;
