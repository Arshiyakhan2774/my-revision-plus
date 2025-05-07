import React, { useState } from 'react';

import { GrChapterAdd, GrResources } from 'react-icons/gr';
import { SiOpensourcehardware } from 'react-icons/si';
import { BsNewspaper } from 'react-icons/bs';
import { MdSubject, MdTopic } from 'react-icons/md';
import Subject from '../SubjectComponent/SubjectListView';
import SubjectLevel from './SubjectLevel';
import Source from './Source';
import PaperLevel from './PaperLevel';
import TopicLevel from './TopicLevel';
import SubTopic from './SubTopic';

const tabData = [
  { icon: <GrChapterAdd fontSize={24}/>, label: "Subject", component: <Subject /> },
  { icon: <GrResources fontSize={24}/>, label: "Subject Level", component: <SubjectLevel/> },
  { icon: <SiOpensourcehardware fontSize={24}/>, label: "Source", component: <Source/> },
  { icon: <BsNewspaper fontSize={24}/>, label: "Paper", component: <PaperLevel/> },
  { icon: <MdTopic fontSize={24}/>, label: "Topic", component: <TopicLevel/> },
  { icon: <MdSubject fontSize={24}/>, label: "Subtopic", component: <SubTopic/> },
];

const ViewCategory = () => {
  const [value, setValue] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (

      <div className="w-full max-w-[100%] px-0">
        <div className="flex justify-center text-center">
          <div className="flex overflow-x-auto mt-16">
            {tabData.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleChange(index)}
                className={`flex flex-col items-center px-4 py-2 border-b-2 transition-colors duration-300 ${
                  value === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mb-1">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="border border-gray-200 mt-4 mb-2"></div>
        
        {tabData.map((tab, index) => (
          <div key={index} className={value === index ? 'block' : 'hidden'}>
            {tab.component}
          </div>
        ))}
      </div>
 
  );
};

export default ViewCategory;