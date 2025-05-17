import React from 'react';
import { GiSecretBook } from 'react-icons/gi';
import { SiLevelsdotfyi } from 'react-icons/si';
import { GrResources } from 'react-icons/gr';
import { RiFilePaperLine } from 'react-icons/ri';
import { BsMenuUp } from 'react-icons/bs';
import { VscLayersDot } from 'react-icons/vsc';
import { FiMinus, FiPlus } from 'react-icons/fi';

const ModelAssignmentCreate = ({
  modalOpen,
  subjects,
  subjectDetails,
  expandedSubject,
  handleSubjectClick,
  handleLevelClick,
  handleSourceClick,
  handlePaperClick,
  handleTopicClick,
  handSubTopic,
  selectedLevel,
  selectedSource,
  selectedPaper,
  selectedTopic,
  selectedSubtopic,
  anchorEl,
  expandedSection,
}) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl h-5/6 flex overflow-hidden border-2 border-l-8 border-gray-300">
        {/* Subject List */}
        <div className="w-1/4 border-r p-4 overflow-y-auto">
          <h3 className="text-lg font-bold mb-4">Subjects</h3>
          <ul>
            {subjects.map((subject) => (
              <li
                key={subject.subject}
                onClick={() => handleSubjectClick(subject)}
                className={`p-2 mb-1 rounded flex items-center cursor-pointer ${
                  expandedSubject === subject.subject
                    ? 'bg-blue-900 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <GiSecretBook
                  className={`text-xl rounded-full p-1 ${
                    expandedSubject === subject.subject
                      ? 'text-blue-900 bg-white'
                      : 'text-white bg-blue-900'
                  }`}
                />
                <span className="ml-2">{subject.subject}</span>
                {expandedSubject === subject.subject ? (
                  <FiMinus className="ml-auto" />
                ) : (
                  <FiPlus className="ml-auto" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Subject Details */}
        {expandedSubject && subjectDetails?.map((subjectDetail) => (
          subjectDetail.subject_name === expandedSubject && (
            <div className="w-3/4 p-4 overflow-y-auto" key={subjectDetail.subject_name}>
              <h3 className="text-lg font-bold mb-4">{expandedSubject}</h3>
              
              {subjectDetail.levels?.map((level) => (
                <div key={level.name} className="mb-2">
                  <div
                    onClick={() => handleLevelClick(level)}
                    className={`p-2 rounded flex items-center cursor-pointer ${
                      selectedLevel === level ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                    }`}
                  >
                    <SiLevelsdotfyi className="text-blue-900 mr-2" />
                    <span>{level.name}</span>
                    {expandedSection.levels && selectedLevel === level ? (
                      <FiMinus className="ml-auto text-blue-900" />
                    ) : (
                      <FiPlus className="ml-auto text-blue-900" />
                    )}
                  </div>

                  {expandedSection.levels && selectedLevel === level && (
                    <div className="pl-4 mt-2">
                      {level.sources?.map((source) => (
                        <div key={source.name} className="mb-2">
                          <div
                            onClick={() => handleSourceClick(source)}
                            className={`p-2 rounded flex items-center cursor-pointer ${
                              selectedSource === source ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                            }`}
                          >
                            <GrResources
                              className={`text-xl rounded-full p-1 ${
                                selectedSource === source
                                  ? 'text-white bg-blue-900'
                                  : 'text-blue-900 bg-white'
                              }`}
                            />
                            <span className="ml-2">{source.name}</span>
                            {expandedSection.sources && selectedSource === source ? (
                              <FiMinus className="ml-auto text-blue-900" />
                            ) : (
                              <FiPlus className="ml-auto text-blue-900" />
                            )}
                          </div>

                          {expandedSection.sources && selectedSource === source && (
                            <div className="pl-4 mt-2">
                              {source.papers?.map((paper) => (
                                <div key={paper.name} className="mb-2">
                                  <div
                                    onClick={() => handlePaperClick(paper)}
                                    className={`p-2 rounded flex items-center cursor-pointer ${
                                      selectedPaper === paper ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100'
                                    }`}
                                  >
                                    <RiFilePaperLine className="text-blue-900 mr-2" />
                                    <span>{paper.name}</span>
                                    {expandedSection.papers && selectedPaper === paper ? (
                                      <FiMinus className="ml-auto text-blue-900" />
                                    ) : (
                                      <FiPlus className="ml-auto text-blue-900" />
                                    )}
                                  </div>

                                  {expandedSection.papers && selectedPaper === paper && (
                                    <div className="pl-4 mt-2">
                                      {paper.topics?.map((topic) => (
                                        <div
                                          key={topic.name}
                                          onClick={(e) => handleTopicClick(e, topic)}
                                          className={`p-2 rounded flex items-center cursor-pointer ${
                                            selectedTopic === topic ? 'bg-blue-900 text-white' : 'hover:bg-gray-100'
                                          }`}
                                        >
                                          <BsMenuUp className={`mr-2 ${
                                            selectedTopic === topic ? 'text-white' : 'text-blue-900'
                                          }`} />
                                          <span>{topic.name}</span>
                                          {expandedSection.topics && selectedTopic === topic ? (
                                            <FiMinus className="ml-auto" />
                                          ) : (
                                            <FiPlus className="ml-auto" />
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
                </div>
              ))}
            </div>
          )
        ))}

        {/* Subtopic Menu */}
        {anchorEl && (
          <div 
            className="fixed z-50 bg-white shadow-lg rounded-md p-4 mt-1"
            style={{
              top: anchorEl?.getBoundingClientRect().bottom,
              left: anchorEl?.getBoundingClientRect().left
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedTopic && (
              <div className="w-full">
                <h4 className="text-lg font-bold mb-2">{selectedTopic.name}</h4>
                <ul className="space-y-1">
                  {selectedTopic.subtopics?.map((subtopic) => (
                    <li
                      key={subtopic.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handSubTopic(subtopic, e);
                      }}
                      className={`p-2 rounded flex items-center cursor-pointer ${
                        selectedSubtopic === subtopic
                          ? 'bg-blue-900 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <VscLayersDot
                        className={`text-xl rounded-full p-1 ${
                          selectedSubtopic === subtopic
                            ? 'text-blue-900 bg-white'
                            : 'text-white bg-blue-900'
                        }`}
                      />
                      <span className="ml-2">{subtopic.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelAssignmentCreate;