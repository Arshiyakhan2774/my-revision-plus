import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaPiedPiperPp, FaGraduationCap } from 'react-icons/fa';
import { GiBookshelf, GiSchoolBag, GiDiploma, GiSecretBook } from 'react-icons/gi';
import { SiLevelsdotfyi, SiSat1 } from "react-icons/si";
import { GrResources } from 'react-icons/gr';
import { RiFilePaperLine } from 'react-icons/ri';
import { BsMenuUp } from 'react-icons/bs';
import { VscLayersDot } from 'react-icons/vsc';
import { setAssignmentBoardId, setAssignmentPaperId, setAssignmentSourceId, setAssignmentSubjectId, setAssignmentSubjectLevelId, setAssignmentSubTopicId, setAssignmentTopicId } from '../../../store/all-Id-Slice/IdSlice';
import { Api } from '../../../Api/Api';
import CreateAssignmentList from './CreateAssignmentList';


const CreateAssignment = () => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const [boardId, setBoardId] = useState(null);
  const [boardId1, setBoardId1] = useState(null);
  const [boardId2, setBoardId2] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedSubject, setExpandedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [selectedTopic, setSelectedTopic] = useState([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [expandedSection, setExpandedSection] = useState({
    levels: false,
    sources: false,
    papers: false,
    topics: false,
    subtopics: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quotesMap = {
    DP: "",
    MYP: "",
    SAT: "",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(`categorys/categorylist/${boardId}`);
        setSubjectDetails(response.data.data.subjectDetails);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [boardId]);
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Api.get('categorys');
        setValue(res.data.data.boards);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBoardsAndSubjects = async () => {
      if (boardId) { 
        try {
          const response = await Api.get(`categorys/catsubject/${boardId}`);
          setSubjects(response.data.data.subjects);
        } catch (error) {
          console.error('Error fetching boards and subjects:', error);
        }
      }
    };
    fetchBoardsAndSubjects();
  }, [boardId]);

  const handleClickOpenBoard = (boardId) => {
    setBoardId(boardId);
    setSelectedBoard(boardId);
    dispatch(setAssignmentBoardId(boardId));
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedLevel(null);
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setBoardId2(subject.id);
    dispatch(setAssignmentSubjectId(subject.id));
    setExpandedSubject(prev => prev === subject.subject ? null : subject.subject);
    setSelectedLevel(null);
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
  };

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setBoardId1(level.id);
    dispatch(setAssignmentSubjectLevelId(level.id));
    setSelectedSource(null);
    setSelectedPaper(null);
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, levels: !expandedSection.levels });
  };

  const handleSourceClick = (source) => {
    setSelectedSource(source);
    dispatch(setAssignmentSourceId(source.id));
    setSelectedPaper(null);
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, sources: !expandedSection.sources });
  };

  const handlePaperClick = (paper) => {
    setSelectedPaper(paper);
    dispatch(setAssignmentPaperId(paper.id));
    setSelectedTopic(null);
    setExpandedSection({ ...expandedSection, papers: !expandedSection.papers });
  };

  const handleTopicClick = (event, topic) => {
    if (!topic) return;
    setSelectedTopic(prevSelected => {
      if (!prevSelected) prevSelected = [];
      const isAlreadySelected = prevSelected.some(t => t.id === topic.id);
      return isAlreadySelected 
        ? prevSelected.filter(t => t.id !== topic.id) 
        : [...prevSelected, topic];
    });
    setAnchorEl(event.currentTarget);
  };
  
  const handSubTopic = (subtopic) => {
    if (!subtopic) return;
    setSelectedSubtopic(prevSelected => {
      if (!prevSelected) prevSelected = [];
      const isAlreadySelected = prevSelected.some(st => st.id === subtopic.id);
      return isAlreadySelected 
        ? prevSelected.filter(st => st.id !== subtopic.id)
        : [...prevSelected, subtopic];
    });
  };

  const handleSaveAndRedirect = (subtopic) => {
    setSelectedSubtopicId(prevSelected => {
      const currentSelected = prevSelected || [];
      const isAlreadySelected = currentSelected.includes(subtopic.id);
      return isAlreadySelected
        ? currentSelected.filter(id => id !== subtopic.id)
        : [...currentSelected, subtopic.id];
    });
  
  
    if (selectedBoard === '671f5e5bfd4c6a25ad4bb527' && selectedTopic) {
      dispatch(setAssignmentTopicId(selectedTopic));
      navigate(`/create-Assignment/${selectedTopic}`);
      setModalOpen(false);
      return;
    }
  
    selectedSubtopic.forEach(sub => {
      dispatch(setAssignmentSubTopicId(sub.id));
    });
  
    navigate(`/create-Assignment/${selectedSubtopic.map(st => st.id).join(',')}`);
    setModalOpen(false);
  };

  return (
    <div className="w-full h-min-screen p-4">
      <div className="">
      <div className="flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-4 mt-20  w-full">
    {value.slice(0, 4).map((board, index) => (
      <div
        key={index}
        onClick={() => handleClickOpenBoard(board._id)}
        className="cursor-pointer bg-white p-6 hover:bg-blue-50 transition-all text-center"
      >
        <div className="flex items-center justify-center mb-2">
          {board.board_prog_name === "DP" && <GiDiploma className="text-yellow-500 text-3xl" />}
          {board.board_prog_name === "MYP" && <GiSchoolBag className="text-green-500 text-3xl" />}
          {board.board_prog_name === "SAT" && <GiBookshelf className="text-red-500 text-3xl" />}
          <span className="ml-3 text-lg font-semibold">{board.board_prog_name}</span>
        </div>
        <p className="text-sm text-gray-600">{quotesMap[board.board_prog_name]}</p>
      </div>
    ))}
  </div>
</div>


        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-6xl h-5/6 flex overflow-hidden">
              <div className="w-1/4 border-r p-4 overflow-y-auto">
                <h3 className="font-bold text-lg mb-4">Subjects</h3>
                <ul>
                  {subjects.map((subject) => (
                    <li 
                      key={subject.id}
                      onClick={() => handleSubjectClick(subject)}
                      className={`p-2 mb-1 rounded flex items-center cursor-pointer ${
                        expandedSubject === subject.subject 
                          ? 'bg-custom-primary text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <GiSecretBook className={`mr-2 ${
                        expandedSubject === subject.subject 
                          ? 'text-white bg-custom-primary rounded-full' 
                          : 'text-blue-900 bg-white rounded-full'
                      }`} />
                      {subject.subject}
                      {expandedSubject === subject.subject ? (
                        <span className="ml-auto">-</span>
                      ) : (
                        <span className="ml-auto">+</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {expandedSubject && (
                <div className="w-3/4 p-4 overflow-y-auto">
                  <h3 className="font-bold text-lg mb-4">{expandedSubject}</h3>
                  
                  {subjectDetails[subjects?.find((s) => s.subject === expandedSubject).category]?.levels.map((level) => (
                    <div key={level.id} className="mb-2">
                      <div 
                        onClick={() => handleLevelClick(level)}
                        className={`p-2 rounded flex items-center cursor-pointer ${
                          selectedLevel === level ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                        }`}
                      >
                        <SiLevelsdotfyi className="mr-2 text-blue-900" />
                        {level.name}
                        {expandedSection.levels && selectedLevel === level ? (
                          <span className="ml-auto">-</span>
                        ) : (
                          <span className="ml-auto">+</span>
                        )}
                      </div>

                      {expandedSection.levels && selectedLevel === level && (
                        <div className="pl-4 mt-2">
                          {level.sources.map((source) => (
                            <div key={source.id} className="mb-2">
                              <div 
                                onClick={() => handleSourceClick(source)}
                                className={`p-2 rounded flex items-center cursor-pointer ${
                                  selectedSource === source ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                                }`}
                              >
                                <GrResources className={`mr-2 ${
                                  selectedSource === source ? 'text-white bg-custom-primary rounded-full' : 'text-blue-900'
                                }`} />
                                {source.name}
                                {expandedSection.sources && selectedSource === source ? (
                                  <span className="ml-auto">-</span>
                                ) : (
                                  <span className="ml-auto">+</span>
                                )}
                              </div>

                              {expandedSection.sources && selectedSource === source && (
                                <div className="pl-4 mt-2">
                                  {source.papers.map((paper) => (
                                    <div key={paper.id} className="mb-2">
                                      <div 
                                        onClick={() => handlePaperClick(paper)}
                                        className={`p-2 rounded flex items-center cursor-pointer ${
                                          selectedPaper === paper ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                                        }`}
                                      >
                                        <RiFilePaperLine className="mr-2 text-blue-900" />
                                        {paper.name}
                                        {expandedSection.papers && selectedPaper === paper ? (
                                          <span className="ml-auto">-</span>
                                        ) : (
                                          <span className="ml-auto">+</span>
                                        )}
                                      </div>

                                      {expandedSection.papers && selectedPaper === paper && (
                                        <div className="pl-4 mt-2">
                                          {paper.topics.map((topic) => {
                                            const isTopicSelected = selectedTopic?.some(t => t.id === topic.id);
                                            return (
                                              <div 
                                                key={topic.id}
                                                onClick={(e) => handleTopicClick(e, topic)}
                                                className={`p-2 rounded flex items-center cursor-pointer ${
                                                  isTopicSelected ? 'bg-custom-primary text-white' : 'hover:bg-gray-100'
                                                }`}
                                              >
                                                <BsMenuUp className={`mr-2 ${
                                                  isTopicSelected ? 'text-white' : 'text-blue-900'
                                                }`} />
                                                {topic.name}
                                                {expandedSection.topics && isTopicSelected ? (
                                                  <span className="ml-auto">-</span>
                                                ) : (
                                                  <span className="ml-auto">+</span>
                                                )}
                                              </div>
                                            );
                                          })}
                                          <div
  className={`fixed inset-0 z-50 ${!anchorEl ? 'hidden' : 'block'}`}
  onClick={() => setAnchorEl(null)}
>
  <div 
    className="absolute bg-white shadow-lg rounded-md p-4 w-auto max-w-lg"
    style={{
      top: anchorEl?.getBoundingClientRect().bottom + window.scrollY,
      left: anchorEl?.getBoundingClientRect().left,
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {selectedTopic && selectedTopic.length > 0 && (
      <div className="w-full">
        <h3 className="text-xl font-bold mb-2">Subtopics</h3>
        <ul className="space-y-1">
          {selectedTopic.flatMap((topic) =>
            topic.subtopics ? topic.subtopics.map((subtopic) => {
              const isSubtopicSelected = selectedSubtopic ? 
                selectedSubtopic.some((st) => st.id === subtopic.id) : 
                false;
              
              return (
                <li
                  key={subtopic.id}
                  onClick={() => handSubTopic(subtopic)}
                  className={`
                    flex items-center px-3 py-2 rounded-md cursor-pointer
                    ${isSubtopicSelected ? 
                      'bg-[#1a73e8] text-white' : 
                      'hover:bg-gray-100'}
                  `}
                >
                  <div className={`
                    p-1 rounded-full mr-2
                    ${isSubtopicSelected ? 
                      'bg-white text-[#1a73e8]' : 
                      'bg-[#1a73e8] text-white'}
                  `}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      width="24" 
                      height="24"
                      fill="currentColor"
                    >
                      <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
                    </svg>
                  </div>
                  <span>{subtopic.name}</span>
                </li>
              );
            }) : null
          )}
        </ul>
      </div>
    )}
  </div>
</div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleSaveAndRedirect}
                  className="bg-custom-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
                >
                  Save and Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {assignmentOpen && (
          <CreateAssignmentList
            selectedSubtopicId={selectedSubtopicId}
            selectedSubject={selectedSubject}
            selectedLevel={selectedLevel}
            selectedBoard={selectedBoard}
            boardId1={boardId1}
            boardId2={boardId2}
            boardId={boardId}
          />
        )}
      </div>
    </div>
  );
};

export default CreateAssignment;  
