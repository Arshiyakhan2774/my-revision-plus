import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useGetCategoryListQuery } from '../../../../Services/Category/CategoryApi';

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  

  return (
    <FormControl fullWidth size="small">
      <InputLabel htmlFor="subTopicID">{getInputLabel('SubTopic')}</InputLabel>
      <Select
        label={getInputLabel('SubTopic')}
        id="subTopicID"
        name="subTopicID"
        value={selectedSubTopic}
        onChange={(e) => setSelectedSubTopic(e.target.value)}
      >
        {categories.categories
          .find((cat) => cat._id === selectedBoard)
          ?.subjects.find((sub) => sub._id === selectedSubject)
          ?.subjectlevels.find((level) => level._id === selectedSubjectLevel)
          ?.sources.find((source) => source._id === selectedSource)
          ?.papers.find((paper) => paper._id === selectedPaper)
          ?.topics.find((topic) => topic._id === selectedTopic)
          ?.subtopics.map((subtopic) => (
            <MenuItem key={subtopic._id} value={subtopic._id}>
              {subtopic.subtopic_name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SubTopicCustom;
// import React from 'react';
// import { FormControl, InputLabel, MenuItem, Select, Chip } from '@mui/material';
// import { useGetCategoryListQuery } from '../../../../Services/Category/CategoryApi';

// const SubTopicCustom = ({
//   selectedBoard,
//   selectedSubject,
//   selectedSubjectLevel,
//   selectedSource,
//   selectedPaper,
//   selectedTopic = [], // Default to an empty array if undefined
//   selectedSubTopic = [], // Default to an empty array if undefined
//   setSelectedSubTopic,
//   getInputLabel,
// }) => {
//   const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   // Debugging: Log categories and selected topics
//   console.log("Categories:", categories);
//   console.log("Selected Topics:", selectedTopic);

//   // Filter subtopics based on all selected topics
//   const filteredSubTopics =
//     categories?.categories
//       .find((cat) => cat._id === selectedBoard)
//       ?.subjects?.find((sub) => sub._id === selectedSubject)
//       ?.subjectlevels?.find((level) => level._id === selectedSubjectLevel)
//       ?.sources?.find((source) => source._id === selectedSource)
//       ?.papers?.find((paper) => paper._id === selectedPaper)
//       ?.topics?.filter((topic) => selectedTopic.includes(topic._id)) // Filter topics based on selectedTopics
//       ?.flatMap((topic) => topic.subtopics || []) || []; // Flatten subtopics from all selected topics

//   // Debugging: Log filtered subtopics
//   console.log("Filtered Subtopics:", filteredSubTopics);

//   // Render selected subtopics as chips
//   const renderSelectedValues = (selected) => {
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
//         {selected.map((value) => {
//           const subtopic = filteredSubTopics.find((subtopic) => subtopic._id === value);
//           return (
//             <Chip
//               key={value}
//               label={subtopic?.subtopic_name || 'Unknown'}
             
//             />
//           );
//         })}
//       </div>
//     );
//   };

//   return (
//     <FormControl fullWidth size="small">
//       <InputLabel htmlFor="subTopicID">{getInputLabel('SubTopic')}</InputLabel>
//       <Select
//         multiple
//         label={getInputLabel('SubTopic')}
//         id="subTopicID"
//         name="subTopicID"
//         value={selectedSubTopic || []} // Ensure value is always an array
//         onChange={(e) => setSelectedSubTopic(e.target.value)}
//         renderValue={renderSelectedValues}
//       >
//         {filteredSubTopics.length > 0 ? (
//           filteredSubTopics.map((subtopic) => (
//             <MenuItem
//               key={subtopic._id}
//               value={subtopic._id}
//               style={{
//                 backgroundColor: selectedSubTopic?.includes(subtopic._id)
//                   ? '#B2BEB5' // Green background for selected subtopics
//                   : 'inherit', // Default background
//                 color: selectedSubTopic?.includes(subtopic._id)
//                   ? 'white' // White text for selected subtopics
//                   : 'inherit', // Default text color
//               }}
//             >
//               {subtopic.subtopic_name}
//             </MenuItem>
//           ))
//         ) : (
//           <MenuItem disabled>No subtopics available</MenuItem>
//         )}
//       </Select>
//     </FormControl>
//   );
// };

// export default SubTopicCustom;
