
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Button,
//   Card,
//   Grid,
//   CardContent,
// } from '@mui/material';
// import SuccessMsg from './SuccessMsg';
// import { useGetCategoryListQuery } from '../../../Services/CategoryMasterApi/CategoryApi';

// const SubTopicAdd = () => {
//   const initialFormData = {
//     boardID: '',
//     subjectID: '',
//     subjectlevelID: '',
//     sourceID: '',
//     paperID: '',
//     topicID: '',
//     subtopicName: '',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [successMessageOpen, setSuccessMessageOpen] = useState(false);
//   const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

//   useEffect(() => {
//     if (categories && categories.categories && categories.categories.length > 0) {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         boardID: categories.categories[0]._id,
//       }));
//     }
//   }, [categories]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('/api/v1/categorys/subtopic/create', {
//         board_id: formData.boardID,
//         subject_id: formData.subjectID,
//         subject_level_id: formData.subjectlevelID,
//         source_id: formData.sourceID,
//         paper_id: formData.paperID,
//         topic_id: formData.topicID,
//         subtopic_name: formData.subtopicName,
//       });
//       console.log('Response from server:', response.data);
//       setFormData(initialFormData);
//       setSuccessMessageOpen(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//     }
//   };

//   const handleCloseSuccessMessage = () => {
//     setSuccessMessageOpen(false);
//   };

//   return (
//     <div>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p>Error: {error.error}</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <Card>
//             <CardContent>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="boardID">Board</InputLabel>
//                     <Select
//                       label="Board"
//                       id="boardID"
//                       name="boardID"
//                       value={formData.boardID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories.map((board) => (
//                         <MenuItem key={board._id} value={board._id}>
//                           {board.board_prog_name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="subjectID">Subject Name</InputLabel>
//                     <Select
//                       label="Subject Name"
//                       id="subjectID"
//                       name="subjectID"
//                       value={formData.subjectID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories
//                         .find((board) => board._id === formData.boardID)
//                         ?.subjects.map((subject) => (
//                           <MenuItem key={subject._id} value={subject._id}>
//                             {subject.subject_name}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="subjectlevelID">Subject Level</InputLabel>
//                     <Select
//                       label="Subject Level"
//                       id="subjectlevelID"
//                       name="subjectlevelID"
//                       value={formData.subjectlevelID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories
//                         .find((board) => board._id === formData.boardID)
//                         ?.subjects.find((subject) => subject._id === formData.subjectID)
//                         ?.subjectlevels.map((level) => (
//                           <MenuItem key={level._id} value={level._id}>
//                             {level.subject_level_name}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="sourceID">Source</InputLabel>
//                     <Select
//                       label="Source"
//                       id="sourceID"
//                       name="sourceID"
//                       value={formData.sourceID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories
//                         .find((board) => board._id === formData.boardID)
//                         ?.subjects.find((subject) => subject._id === formData.subjectID)
//                         ?.subjectlevels.find((level) => level._id === formData.subjectlevelID)
//                         ?.sources.map((source) => (
//                           <MenuItem key={source._id} value={source._id}>
//                             {source.source_name}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="paperID">Paper/Book</InputLabel>
//                     <Select
//                       label="Paper/Book"
//                       id="paperID"
//                       name="paperID"
//                       value={formData.paperID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories
//                         .find((board) => board._id === formData.boardID)
//                         ?.subjects.find((subject) => subject._id === formData.subjectID)
//                         ?.subjectlevels.find((level) => level._id === formData.subjectlevelID)
//                         ?.sources.find((source) => source._id === formData.sourceID)
//                         ?.papers.map((paper) => (
//                           <MenuItem key={paper._id} value={paper._id}>
//                             {paper.paper_name}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <FormControl fullWidth size="small">
//                     <InputLabel htmlFor="topicID">Topic</InputLabel>
//                     <Select
//                       label="Topic"
//                       id="topicID"
//                       name="topicID"
//                       value={formData.topicID}
//                       onChange={handleChange}
//                     >
//                       {categories.categories
//                         .find((board) => board._id === formData.boardID)
//                         ?.subjects.find((subject) => subject._id === formData.subjectID)
//                         ?.subjectlevels.find((level) => level._id === formData.subjectlevelID)
//                         ?.sources.find((source) => source._id === formData.sourceID)
//                         ?.papers.find((paper) => paper._id === formData.paperID)
//                         ?.topics.map((topic) => (
//                           <MenuItem key={topic._id} value={topic._id}>
//                             {topic.topic_name}
//                           </MenuItem>
//                         ))}
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <TextField
//                     label="Subtopic Name"
//                     id="subtopicName"
//                     name="subtopicName"
//                     fullWidth
//                     required
//                     variant="outlined"
//                     margin="normal"
//                     value={formData.subtopicName}
//                     onChange={handleChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sx={{ textAlign: 'right', mt: 2 }}>
//                   <Button type="submit" variant="contained" color="primary">
//                     Save
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </form>
//       )}
//       <SuccessMsg
//         message="Data saved successfully!"
//         open={successMessageOpen}
//         onClose={handleCloseSuccessMessage}
//       />
//     </div>
//   );
// };

// export default SubTopicAdd;
