// import React, { useState, useRef, useEffect } from 'react';
// import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

// const SubTopicCustom = ({
//   selectedBoard,
//   selectedSubject,
//   selectedSubjectLevel,
//   selectedSource,
//   selectedPaper,
//   selectedTopic = [],
//   selectedSubTopic = [],
//   setSelectedSubTopic,
//   getInputLabel,
// }) => {
//   const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const dropdownRef = useRef(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   if (isLoading) return <p className="text-gray-600">Loading...</p>;
//   if (error) return <p className="text-red-500">Error: {error.message}</p>;

//   const filteredSubTopics =
//     categories?.categories
//       .find((cat) => cat._id === selectedBoard)
//       ?.subjects?.find((sub) => sub._id === selectedSubject)
//       ?.subjectlevels?.find((level) => level._id === selectedSubjectLevel)
//       ?.sources?.find((source) => source._id === selectedSource)
//       ?.papers?.find((paper) => paper._id === selectedPaper)
//       ?.topics?.filter((topic) => selectedTopic.includes(topic._id))
//       ?.flatMap((topic) => topic.subtopics || []) || [];

//   // Filter subtopics based on search term
//   const filteredOptions = filteredSubTopics.filter(subtopic =>
//     subtopic.subtopic_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const toggleSubTopic = (subtopicId) => {
//     if (selectedSubTopic.includes(subtopicId)) {
//       setSelectedSubTopic(selectedSubTopic.filter(id => id !== subtopicId));
//     } else {
//       setSelectedSubTopic([...selectedSubTopic, subtopicId]);
//     }
//   };

//   const removeSubTopic = (subtopicId) => {
//     setSelectedSubTopic(selectedSubTopic.filter(id => id !== subtopicId));
//   };

//   const selectedSubTopicNames = filteredSubTopics
//     .filter(subtopic => selectedSubTopic.includes(subtopic._id))
//     .map(subtopic => subtopic.subtopic_name);

//   return (
//     <div className="w-full relative " ref={dropdownRef}>
//       <label className="block text-sm font-medium bg-gray-100 text-gray-700 mb-1">
//         {getInputLabel('SubTopic')}
//       </label>

//       {/* Custom Dropdown */}
//       <div className="relative">
//         <div
//           className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-h-[42px] cursor-pointer flex flex-wrap gap-1"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {selectedSubTopic.length > 0 ? (
//             selectedSubTopicNames.map(name => (
//               <span 
//                 key={name}
//                 className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm"
//               >
//                 {name}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const subtopic = filteredSubTopics.find(st => st.subtopic_name === name);
//                     if (subtopic) removeSubTopic(subtopic._id);
//                   }}
//                   className="ml-1  text-blue-500 hover:text-blue-700"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))
//           ) : (
//             <span className="text-gray-400">Select subtopics...</span>
//           )}
//           <svg
//             className={`h-5 w-5 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 ${isOpen ? 'rotate-180' : ''}`}
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </div>

//         {isOpen && (
//           <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
//             {/* Search input */}
//             <div className="sticky top-0 bg-white px-3 py-2">
//               <input
//                 type="text"
//                 placeholder="Search subtopics..."
//                 className="w-full p-2 bg-white  border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {/* Options list */}
//             {filteredOptions.length > 0 ? (
//               filteredOptions.map((subtopic) => (
//                 <div
//                   key={subtopic._id}
//                   onClick={() => toggleSubTopic(subtopic._id)}
//                   className={`px-4 py-2 text-sm cursor-pointer flex items-center ${
//                     selectedSubTopic.includes(subtopic._id)
//                       ? 'bg-white text-blue-800'
//                       : 'hover:bg-gray-100 text-gray-900'
//                   }`}
//                 >
//                   <span className="flex-1">{subtopic.subtopic_name}</span>
//                   {selectedSubTopic.includes(subtopic._id) && (
//                     <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="px-4 py-2 text-sm text-gray-500">No subtopics found</div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubTopicCustom;

import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const SubTopicCustom = ({
  selectedBoard,
  selectedSubject,
  selectedSubjectLevel,
  selectedSource,
  selectedPaper,
  selectedTopic,
  selectedSubTopic,
  setSelectedSubTopic,
  getInputLabel,
}) => {
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const subtopics = categories?.categories
    .find((cat) => cat._id === selectedBoard)
    ?.subjects?.find((sub) => sub._id === selectedSubject)
    ?.subjectlevels?.find((level) => level._id === selectedSubjectLevel)
    ?.sources?.find((source) => source._id === selectedSource)
    ?.papers?.find((paper) => paper._id === selectedPaper)
    ?.topics?.find((topic) => topic._id === selectedTopic)
    ?.subtopics || [];

  return (
    <div className="w-full">
      <label htmlFor="subTopicID" className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel('SubTopic')}
      </label>
      <div className="relative">
        <select
          id="subTopicID"
          name="subTopicID"
          value={selectedSubTopic}
          onChange={(e) => setSelectedSubTopic(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="">Select {getInputLabel('SubTopic')}</option>
          {subtopics.map((subtopic) => (
            <option key={subtopic._id} value={subtopic._id}>
              {subtopic.subtopic_name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SubTopicCustom;