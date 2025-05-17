import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const TopicCustom = ({
  selectedBoard,
  selectedSubject,
  selectedSubjectLevel,
  selectedSource,
  selectedPaper,
  selectedTopic,
  setSelectedTopic,
  getInputLabel,
}) => {
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();
  const [isOpen, setIsOpen] = React.useState(false);

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const topics = categories?.categories
    .find((cat) => cat._id === selectedBoard)
    ?.subjects?.find((sub) => sub._id === selectedSubject)
    ?.subjectlevels?.find((level) => level._id === selectedSubjectLevel)
    ?.sources?.find((source) => source._id === selectedSource)
    ?.papers?.find((paper) => paper._id === selectedPaper)
    ?.topics || [];

  const handleSelect = (topicId) => {
    setSelectedTopic(topicId);
    setIsOpen(false);
  };

  const selectedTopicName = topics.find(t => t._id === selectedTopic)?.topic_name || 'Select Topic';

  return (
    <div className="w-full relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel('Topic')}
      </label>
      
      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full  px-4 py-2 text-left border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm flex justify-between items-center"
        >
          <span className="truncate">{selectedTopicName}</span>
          <svg
            className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full  shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <div
                  key={topic._id}
                  onClick={() => handleSelect(topic._id)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${selectedTopic === topic._id ? 'bg-blue-100 text-blue-800' : 'text-gray-900'}`}
                >
                  {topic.topic_name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No topics available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicCustom;
// import React from 'react';
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import { useGetCategoryListQuery } from '../../../../Services/Category/CategoryApi';

// const TopicCustom = ({
//   selectedBoard,
//   selectedSubject,
//   selectedSubjectLevel,
//   selectedSource,
//   selectedPaper,
//   selectedTopic,
//   setSelectedTopic,
//   getInputLabel,
// }) => {
//   const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <FormControl fullWidth size="small">
//       <InputLabel htmlFor="topicID">{getInputLabel('Topic')}</InputLabel>
//       <Select
//         multiple // Enable multiple selections
//         label={getInputLabel('Topic')}
//         id="topicID"
//         name="topicID"
//         value={selectedTopic} // selectedTopic should now be an array
//         onChange={(e) => setSelectedTopic(e.target.value)} 
        
//       >
//         {categories.categories
//           .find((cat) => cat._id === selectedBoard)
//           ?.subjects.find((sub) => sub._id === selectedSubject)
//           ?.subjectlevels.find((level) => level._id === selectedSubjectLevel)
//           ?.sources.find((source) => source._id === selectedSource)
//           ?.papers.find((paper) => paper._id === selectedPaper)
//           ?.topics.map((topic) => (
//             <MenuItem key={topic._id} value={topic._id}
//             style={{
//               backgroundColor: selectedTopic.includes(topic._id)
//                 ? '#B2BEB5'
//                 : 'inherit',
//               color: selectedTopic.includes(topic._id)
//                 ? 'white' 
//                 : 'inherit', 
//             }}
//             >
//               {topic.topic_name}
//             </MenuItem>
//           ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default TopicCustom;