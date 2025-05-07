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

  if (isLoading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const topics = categories.categories
    .find((cat) => cat._id === selectedBoard)
    ?.subjects.find((sub) => sub._id === selectedSubject)
    ?.subjectlevels.find((level) => level._id === selectedSubjectLevel)
    ?.sources.find((source) => source._id === selectedSource)
    ?.papers.find((paper) => paper._id === selectedPaper)
    ?.topics || [];

  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTopic(options);
  };

  return (
    <div className="w-full">
      <label htmlFor="topicID" className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel('Topic')}
      </label>
      <select
        multiple
        id="topicID"
        name="topicID"
        value={selectedTopic}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm h-auto"
      >
        {topics.map((topic) => (
          <option 
            key={topic._id} 
            value={topic._id}
            className={`${selectedTopic.includes(topic._id) ? 'bg-gray-200 text-gray-900' : ''}`}
          >
            {topic.topic_name}
          </option>
        ))}
      </select>
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