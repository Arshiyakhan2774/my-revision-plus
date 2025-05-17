// import { useState, useEffect } from "react";
// import { 
//   Container, IconButton, Button, Dialog, DialogTitle, 
//   DialogContent, DialogActions, Typography, Tooltip, Box
// } from "@mui/material";
// import { RiFolderSharedLine, RiSlideshowView } from "react-icons/ri";
// import DataTable from "react-data-table-component";
// import { useSelector } from "react-redux";


// import { MdAssignmentAdd } from "react-icons/md";
// import { Api } from "../../../Api/Api";
// import IconWithTitle from "../../../Utilities/IconsTittle";
// import CoverDetails from "../../AdminDashboard/Assignment-master/AssignmentListView/CoverDetails";
// import RenderMedia from "../../AdminDashboard/Assignment-master/AssignmentListView/RenderMedia";
// const toRoman = (num) => {
//     const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
//     return romanMap[num - 1] || num;
//   };
// const SharedAssignmentList = ({ isSidebarClosed }) => {
//   const [assignments, setAssignments] = useState([]); 
//   const [loading, setLoading] = useState(false);
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [openModal, setOpenModal] = useState(false); 
//   const [coverDetails, setCoverDetails] = useState(null);
//   const sharedAssignment = useSelector((state) => state.idSlice.sharedAssignment);
//   const baseURL = "http://myrevisionplus.com/api/img/question/"; // Change this to your actual base URL
//   const userResponse = useSelector((state) => state.idSlice?.userResponse);
//   useEffect(() => {
//     if (sharedAssignment) {
//       fetchSharedAssignment();
//     }
//   }, [sharedAssignment]);

//   const fetchSharedAssignment = async () => {
//     setLoading(true);
//     try {
//       const response = await Api.post("/studentdashboard/get-student-sharedassignment", {
//         student_id:'6752cadffb79fbc8a3f6d2d0', 
//       });

    //   if (response.data?.data?.assignments) {
    //     let uniqueAssignments = [];
    //     let uniquePairs = new Set();

    //     response.data.data.assignments.forEach((assignment) => {
    //       const key = `${assignment.assignment_id?._id}-${assignment.student_id?._id}`;
    //       if (!uniquePairs.has(key)) {
    //         uniquePairs.add(key);
    //         uniqueAssignments.push(assignment);
    //       }
    //     });
    //     setAssignments(uniqueAssignments);

    //     if (uniqueAssignments.length > 0) {
    //       setCoverDetails(uniqueAssignments[0].assignment_id?.cover_details || null);
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error fetching shared assignments:", error);
    // }
//     setLoading(false);
//   };
//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: '#1a73e8',
//         color: '#fff',
//         fontWeight: 'bold',
//       },
//     },
//   };
//   const handleView = (row) => {
//     setSelectedRow(row);
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//   };

//   const columns = [
//     { name: "Teacher", selector: (row) => row.teacher_id?.name || "N/A", sortable: true },
//     { name: "Student", selector: (row) => row.student_id?.name || "N/A", sortable: true },
//     { name: "Email", selector: (row) => row.student_id?.email || "N/A", sortable: true },
//     { name: "Duration", selector: (row) => row.assignment_id?.cover_details?.duration || "N/A", sortable: true },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <Tooltip title="View Assignment" arrow>
//           <Button variant="contained" style={{ background: '#1a73e8', color: '#fff' }} onClick={() => handleView(row)}>
//             <RiSlideshowView fontSize={24} />
//           </Button>
//         </Tooltip>
//       ),
//     },
//   ];

//   return (
    
      // <Container maxWidth="xxl">
      //   <IconWithTitle
      //     icon={RiFolderSharedLine}
      //     title="Shared Assignments"
      //     iconColor="white"
      //     backgroundColor="#1a73e8"
      //     iconSize="30px"
      //     titleColor="#1a73e8"
      //     titleFontSize="30px"
      //   />

      //   <DataTable
      //     columns={columns}
      //     data={assignments}
      //     customStyles={customStyles}
      //     progressPending={loading}
      //     pagination
      //   />

      //   <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
      //     <DialogTitle>
      //     <IconWithTitle
      //   icon={MdAssignmentAdd}
      //   title="Assignment View"
      //   iconColor="white"
      //   backgroundColor="#1a73e8"
      //   iconSize="30px"
      //   titleColor="#1a73e8"
      //   titleFontSize="34px"
      // />
      //     </DialogTitle>
      //     <DialogContent>
      //     {coverDetails ? (
      //       <CoverDetails coverDetails={coverDetails}/>
      //       ) : (
      //           <p>No cover details available.</p>
      //       )}
      //   {selectedRow?.assignment_id?.question_id?.length > 0 ? (
      //         selectedRow.assignment_id.question_id.map((question, index) => (
      //           <Box key={question._id} mb={2}>
      //             <Typography variant="h6">
      //               <strong>Q{index + 1}:</strong> <span dangerouslySetInnerHTML={{ __html: question.question_title }} />
      //             </Typography>
                
      //             <RenderMedia mediaArray={question.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.docs} type="pdf" baseURL={baseURL} />
      //       <div  style={{marginLeft:'5%'}} dangerouslySetInnerHTML={{ __html: question.answer_key.description }}></div>
      //       <RenderMedia mediaArray={question.answer_key.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.answer_key.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.answer_key.docs} type="pdf" baseURL={baseURL} />
      //       <div  style={{marginLeft:'5%'}} dangerouslySetInnerHTML={{ __html: question.markscheme.description }}></div>
      //        <RenderMedia mediaArray={question.markscheme.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.markscheme.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={question.markscheme.docs} type="pdf" baseURL={baseURL} />
                   
                 
      //             {question.subquestions?.map((subquestion, subIndex) => (
      //               <Box key={subquestion._id} ml={2}>
      //                 <Typography variant="subtitle1">
      //                   <strong>{String.fromCharCode(97 + subIndex)}:</strong> <span dangerouslySetInnerHTML={{ __html: subquestion.title }} />
      //                 </Typography>
      //                 <RenderMedia mediaArray={subquestion.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.docs} type="pdf" baseURL={baseURL} />
                   

      // <div style={{marginLeft:'4%'}} dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}></div>
      // <RenderMedia mediaArray={subquestion.answer_key.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.answer_key.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
    

      // <div style={{marginLeft:'4%'}} dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}></div>
      //       <RenderMedia mediaArray={subquestion.markscheme.images} type="image" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.markscheme.videos} type="video" baseURL={baseURL} />
      //       <RenderMedia mediaArray={subquestion.markscheme.docs} type="pdf" baseURL={baseURL} />
     
         
      //                 {subquestion.subchildquestions?.map((subchildquestion, subChildIndex) => (
      //                   <Box key={subchildquestion._id} ml={4}>
      //                     <Typography variant="body2">
      //                       <strong>{toRoman(subChildIndex + 1)}:</strong> <span dangerouslySetInnerHTML={{ __html: subchildquestion.title }} />
      //                     </Typography>
      //                     <RenderMedia mediaArray={subchildquestion.images} type="image" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.videos} type="video" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.docs} type="pdf" baseURL={baseURL} />
                          
      //               <div  style={{marginLeft:'5%'}} dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}></div>
      //                     <RenderMedia mediaArray={subchildquestion.answer_key.images} type="image" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.answer_key.videos} type="video" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                  

                    
      //               <div  style={{marginLeft:'5%'}} dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}></div>
      //               <RenderMedia mediaArray={subchildquestion.markscheme.images} type="image" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.markscheme.videos} type="video" baseURL={baseURL} />
      //                     <RenderMedia mediaArray={subchildquestion.markscheme.docs} type="pdf" baseURL={baseURL} />
                   
      //                   </Box>
      //                 ))}
      //               </Box>
      //             ))}
      //           </Box>
      //         ))
      //       ) : (
      //         <Typography>No Questions Available</Typography>
      //       )}
      //     </DialogContent>
      //     <DialogActions>
      //       <Button onClick={handleCloseModal} color="primary">Close</Button>
      //     </DialogActions>
      //   </Dialog>
//       </Container>
  
//   );
// };

import React, { useState, useEffect } from "react";
import { MdAssignmentReturned } from "react-icons/md";
import { RiSlideshowView } from "react-icons/ri";
import { SlPrinter } from "react-icons/sl";
import DataTable from "react-data-table-component";

import { useSelector } from "react-redux";
// import AssignmentDialogView from "./AssignmentDialogView";
// import PrintPage from "./PrintPage";
import { Api } from "../../Api/Api";
import PrintPage from "./PrintPage";
import AssignmentDialogView from "./AssignmentDialogView";

const SharedAssignmentList = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [coverDetails, setCoverDetails] = useState(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const userResponse = useSelector((state) => state.idSlice?.userResponse);

  useEffect(() => {
    Api.post("/studentdashboard/get-student-sharedassignment", {
      student_id: userResponse?._id,
    })
      .then((response) => {
        if (response.data.status === "success") {
          setTeachers(response.data.data.result[0]?.teachers || []);
        }
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userResponse]);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setCoverDetails(assignment.cover_details);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssignment(null);
  };

  const handlePrintAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setCoverDetails(assignment.cover_details);
    setOpenPrintDialog(true);
  };

  const selectedTeacher = teachers[selectedTab];
  const teacherAssignments =
    selectedTeacher?.assignments?.map((assignment) => ({
      teacher_name: selectedTeacher.teacher_id?.name || "Unknown",
      subject: assignment.cover_details?.subject_id || "No subject",
      assignment,
    })) || [];

  const columns = [
    {
      name: "Name",
      selector: (row) => row.teacher_name,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-4">
          <button
            onClick={() => handleView(row.assignment)}
            className="flex items-center gap-2 bg-[#1a73e8] text-white px-3 py-2 rounded hover:bg-[#001a4f] transition-colors"
            title="View Assignment"
          >
            <RiSlideshowView className="text-xl" />
            <span>View</span>
          </button>
          <button
            onClick={() => handlePrintAssignment(row.assignment)}
            className="flex items-center gap-2 bg-[#1a73e8] text-white px-3 py-2 rounded hover:bg-[#001a4f] transition-colors"
            title="Print Assignment"
          >
            <SlPrinter className="text-xl" />
            <span>Print</span>
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1a73e8",
        color: "#fff",
        fontWeight: "bold",
      },
    },
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Teacher List Tabs */}
      <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Teacher List</h2>
        <div className="flex flex-col gap-2">
          {teachers.map((teacher, index) => (
            <button
              key={teacher.teacher_id?._id || index}
              onClick={() => handleTabChange(index)}
              className={`px-4 py-3 text-left rounded transition-colors ${
                selectedTab === index
                  ? "bg-[#1a73e8] text-white"
                  : "hover:bg-[#1a73e8] hover:text-white"
              }`}
            >
              {teacher.teacher_id?.name || "Unnamed"}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Data Table of Assignments for Selected Teacher */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <div className="bg-[#1a73e8] p-3 rounded-full mr-4">
            <MdAssignmentReturned className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a73e8]">Assignments List</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={teacherAssignments}
            customStyles={customStyles}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            noHeader
          />
        )}
      </div>

      {openModal && (
        <AssignmentDialogView
          open={openModal}
          handleClose={handleCloseModal}
          assignment={selectedAssignment}
          coverDetails={coverDetails}
        />
      )}

      {openPrintDialog && (
        <PrintPage
          open={openPrintDialog}
          handleClose={() => setOpenPrintDialog(false)}
          assignment={selectedAssignment}
          coverDetails={coverDetails}
        />
      )} 
    </div>
  );
};

export default SharedAssignmentList;
