import { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit2, FiTrash2, FiPlus, FiBook, FiDownload, FiEye, FiSave } from 'react-icons/fi';

const CollapsibleLayout = () => {
  const [activeSection, setActiveSection] = useState(1);
  const [collapsedSections, setCollapsedSections] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const toggleSectionCollapse = (sectionId) => {
    if (collapsedSections.includes(sectionId)) {
      setCollapsedSections(collapsedSections.filter(id => id !== sectionId));
    } else {
      setCollapsedSections([...collapsedSections, sectionId]);
    }
  };

  const sections = [
    {
      id: 1,
      title: "Section 1",
      topics: [
        { 
          id: 101, 
          name: "Topic 1.1", 
          questions: [
            { id: 1001, text: "Explain the concept of state management in React.", marks: 5 },
            { id: 1002, text: "What are the benefits of using hooks?", marks: 3 }
          ] 
        },
        { 
          id: 102, 
          name: "Topic 1.2", 
          questions: [
            { id: 1003, text: "Differentiate between props and state.", marks: 4 },
            { id: 1004, text: "What is JSX?", marks: 2 }
          ] 
        }
      ]
    },
    {
      id: 2,
      title: "Section 2",
      topics: [
        { 
          id: 201, 
          name: "Topic 2.1", 
          questions: [
            { id: 2001, text: "Explain the virtual DOM concept.", marks: 5 },
            { id: 2002, text: "What are React Fragments?", marks: 2 }
          ] 
        }
      ]
    },
    {
      id: 3,
      title: "Section 3",
      topics: [
        { 
          id: 301, 
          name: "Topic 3.1", 
          questions: [
            { id: 3001, text: "What are custom hooks?", marks: 4 },
            { id: 3002, text: "Explain useContext hook.", marks: 3 }
          ] 
        }
      ]
    }
  ];

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    console.log("Editing question:", question);
  };

  const handleDeleteQuestion = (questionId) => {
    console.log("Deleting question with ID:", questionId);
    alert(`Question ${questionId} will be deleted`);
  };

  const handleAddQuestion = (topicId) => {
    console.log("Adding new question to topic:", topicId);
  };

  const handleDownload = () => {
    console.log("Downloading document");
    alert("Document downloaded!");
  };

  const handlePreview = () => {
    console.log("Previewing document");
    alert("Preview mode activated!");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft");
    alert("Draft saved successfully!");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <FiBook className="mr-2" />
          Question Bank
        </h1>
        <div className="flex space-x-4">
          <button 
            onClick={handleSaveDraft}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiSave className="mr-2" />
            Save Draft
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            <FiDownload className="mr-2" />
            Download
          </button>
          <button 
            onClick={handlePreview}
            className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
          >
            <FiEye className="mr-2" />
            Preview
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden ">
        {/* Left Sections Panel */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="divide-y divide-gray-200">
              {sections.map((section) => (
                <div key={section.id} className="bg-white">
                  <div 
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeSection === section.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleSectionCollapse(section.id);
                    }}
                  >
                    <div className="flex items-center">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-3">
                        {section.id}
                      </span>
                      <span className="font-medium text-gray-800">{section.title}</span>
                    </div>
                    {collapsedSections.includes(section.id) ? (
                      <FiChevronRight className="text-gray-400" />
                    ) : (
                      <FiChevronDown className="text-gray-400" />
                    )}
                  </div>
                  
                  {!collapsedSections.includes(section.id) && (
                    <div className="pl-14 pr-2 pb-2">
                      {section.topics.map((topic) => (
                        <div key={topic.id} className="mb-2">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{topic.name}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddQuestion(topic.id);
                              }}
                              className="p-1 text-blue-500 hover:text-blue-700"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <div className="mt-1 ml-4 space-y-1">
                            {topic.questions.map((question) => (
                              <div 
                                key={question.id} 
                                className="flex justify-between items-center p-2 text-sm rounded hover:bg-blue-50 cursor-pointer transition-colors"
                              >
                                <span className="text-gray-700">Q{question.id.toString().slice(-2)}</span>
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditQuestion(question);
                                    }}
                                    className="text-gray-500 hover:text-blue-500 p-1"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteQuestion(question.id);
                                    }}
                                    className="text-gray-500 hover:text-red-500 p-1"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Questions Panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={`${activeSection === section.id ? 'block' : 'hidden'}`}
              >
                <div className="flex items-center mb-6">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 text-lg font-bold mr-4">
                    {section.id}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <p className="text-gray-500">{section.topics.length} topics</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {section.topics.map((topic) => (
                    <div key={topic.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {topic.id.toString().slice(-2)}
                        </span>
                        {topic.name}
                      </h3>
                      
                      <div className="space-y-4">
                        {topic.questions.map((question, index) => (
                          <div 
                            key={question.id} 
                            className="p-5 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                                {question.marks} Marks
                              </span>
                              <div className="flex space-x-3">
                                <button 
                                  onClick={() => handleEditQuestion(question)}
                                  className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                                >
                                  <FiEdit2 />
                                </button>
                                <button 
                                  onClick={() => handleDeleteQuestion(question.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-gray-800 mb-2">Question {index + 1}:</h4>
                              <p className="text-gray-700">{question.text}</p>
                            </div>
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => handleAddQuestion(topic.id)}
                          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-colors flex items-center justify-center"
                        >
                          <FiPlus className="mr-2" />
                          Add New Question
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleLayout;