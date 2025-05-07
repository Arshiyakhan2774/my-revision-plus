import React, { Fragment, useState } from 'react';
import { GrChapterAdd } from "react-icons/gr";
import { SiOpensourcehardware } from "react-icons/si";
import { BsNewspaper } from "react-icons/bs";
import { GrResources } from "react-icons/gr";
import { MdTopic } from "react-icons/md";
import { MdSubject } from "react-icons/md";
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import SubjectAdd from '../SubjectComponent/SubjectAdd';
import SubjectLevelAdd from '../SubjectLevelComponent/SubjectLevelAdd';
import SourceAdd from '../SourceComponent/SourceAdd';
import PaperAdd from '../PaperComponent/PaperAdd';
import TopicAdd from '../Topic/TopicAdd';
import SubTopicAdd from '../SubTopicComonnet/SubTopicAdd';

const tabData = [
  { icon: <GrChapterAdd className="text-xl" />, label: "Subject", component: <SubjectAdd /> },
  { icon: <GrResources className="text-xl" />, label: "Subject Level", component: <SubjectLevelAdd /> },
  { icon: <SiOpensourcehardware className="text-xl" />, label: "Source", component: <SourceAdd /> },
  { icon: <BsNewspaper className="text-xl" />, label: "Paper", component: <PaperAdd /> },
  { icon: <MdTopic className="text-xl" />, label: "Topic", component: <TopicAdd/> },
  { icon: <MdSubject className="text-xl" />, label: "Subtopic", component: <SubTopicAdd /> },
];

const AddCategory = () => {
  const [value, setValue] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState('');
  const { refetch } = useGetCategoryListQuery(); 

  const handleChange = (newValue) => {
    setValue(newValue); 
    refetch(); 
  };

  const handleBoardChange = (board) => {
    setSelectedBoard(board);
  };

  const handleNextTab = () => {
    setValue((prev) => (prev + 1 < filteredTabData.length ? prev + 1 : prev));
  };

  const filteredTabData = selectedBoard === '671f5e5bfd4c6a25ad4bb527' ? tabData.slice(0, 5) : tabData;

  const getTabLabel = (originalLabel) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (originalLabel) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        case "Source": return "Source";
        case "Paper": return "Topic";
        case "Topic": return "Subtopic";
        case "Subtopic": return "Rubics";
        default: return originalLabel;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (originalLabel) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        case "Source": return "Source";
        case "Paper": return "SubTopics";
        case "Topic": return "Level";
        default: return originalLabel;
      }
    }
    return originalLabel;
  };

  return (
    <Fragment>
      <div className="w-full max-w-full px-0">
        <div className="flex justify-center text-center">
          <div className="flex overflow-x-auto scrollbar-hide mt-16">
            {filteredTabData.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleChange(index)}
                className={`flex flex-col items-center px-4 py-2 mx-1 rounded-t-lg transition-colors ${value === index ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                <span>{tab.icon}</span>
                <span className="mt-1 text-sm">{getTabLabel(tab.label)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border-b border-white my-2"></div>
        <div className="mt-3 p-3">
          {filteredTabData.map((tab, index) => (
            <React.Fragment key={index}>
              {value === index &&
                React.cloneElement(tab.component, { 
                  selectedBoard, 
                  handleBoardChange, 
                  refetch, 
                  goToNextTab: handleNextTab 
                })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default AddCategory;