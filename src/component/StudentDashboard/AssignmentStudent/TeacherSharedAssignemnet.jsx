import { useState, useEffect } from "react";
import { RiFolderSharedLine, RiSlideshowView } from "react-icons/ri";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { MdAssignmentAdd } from "react-icons/md";

import RenderMedia from "../../AdminDashboard/Assignment-master/AssignmentListView/RenderMedia";
import CoverDetails from "../../AdminDashboard/Assignment-master/AssignmentListView/CoverDetails";
import IconWithTitle from "../../utilities/IconsTittle";
import { Api } from "../../Api/Api";


const toRoman = (num) => {
  const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  return romanMap[num - 1] || num;
};

const TeacherSharedAssignment = () => {
  const [assignments, setAssignments] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false); 
  const [coverDetails, setCoverDetails] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const sharedAssignment = useSelector((state) => state.idSlice.sharedAssignment);
  const baseURL = "http://myrevisionplus.com/api/img/question/";
  const userResponse = useSelector((state) => state.idSlice?.userResponse);

  useEffect(() => {
    if (sharedAssignment) {
      fetchSharedAssignment();
    }
  }, [sharedAssignment]);

  const fetchSharedAssignment = async () => {
    setLoading(true);
    try {
      const response = await Api.post("/teacherdashboard/get-teacher-sharedassignment", {
        teacher_id: userResponse._id || "67461b0bad310dfa351faf22",
      });
  
      if (response?.data?.data?.result && Array.isArray(response.data.data.result)) {
        let uniqueAssignments = [];
        let uniquePairs = new Set();
  
        response.data.data.result.forEach((teacher) => {
          if (!teacher.students || !Array.isArray(teacher.students)) return;
  
          teacher.students.forEach((student) => {
            if (!student.assignments || !Array.isArray(student.assignments)) return;
  
            student.assignments.forEach((assignment) => {
              const studentId = student?.student_id?._id;
              const assignmentId = assignment?.cover_details?.students_id;
              const questionIds = assignment?.question_id || [];
              
              if (studentId && assignmentId) {
                const key = `${assignmentId}-${studentId}`;
                if (!uniquePairs.has(key)) {
                  uniquePairs.add(key);
                  uniqueAssignments.push({
                    student_id: studentId,
                    student_name: student?.student_id?.name || "Unknown",
                    student_email: student?.student_id?.email || "N/A",
                    assignment_details: assignment.cover_details || {}, 
                    teacher_name: teacher.teacher_id?.name || "N/A",
                    duration: assignment.cover_details?.duration || "N/A",
                    question_ids: [...questionIds],
                  });
                }
              }
            });
          });
        });
  
        setAssignments(uniqueAssignments);
      }
    } catch (error) {
      console.error("Error fetching shared assignments:", error);
    }
    setLoading(false);
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#00246B',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const handleView = (row) => {
    setSelectedQuestions([...row?.question_ids]);
    setCoverDetails(row.assignment_details);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { 
      name: "Teacher", 
      selector: (row) => row.teacher_name || "N/A", 
      sortable: true 
    },
    { 
      name: "Student", 
      selector: (row) => row.student_name || "N/A", 
      sortable: true 
    },
    { 
      name: "Email", 
      selector: (row) => row.student_email || "N/A", 
      sortable: true 
    },
    { 
      name: "Duration", 
      selector: (row) => row.duration || "N/A", 
      sortable: true 
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          title="View Assignment"
          className="bg-[#00246B] text-white px-3 py-1 rounded hover:bg-[#001a4d] transition-colors"
          onClick={() => handleView(row)}
        >
          <RiSlideshowView size={20} />
        </button>
      ),
    },
  ];

  return (
    <div className="container max-w-full px-4 mx-auto">
      <IconWithTitle
        icon={RiFolderSharedLine}
        title="Shared Assignments"
        iconColor="white"
        backgroundColor="#00246B"
        iconSize="30px"
        titleColor="#00246B"
        titleFontSize="30px"
      />

      <DataTable
        columns={columns}
        data={assignments}
        customStyles={customStyles}
        progressPending={loading}
        pagination
      />

      {/* Assignment View Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <IconWithTitle
                icon={MdAssignmentAdd}
                title="Assignment View"
                iconColor="white"
                backgroundColor="#00246B"
                iconSize="30px"
                titleColor="#00246B"
                titleFontSize="34px"
              />
            </div>
            
            <div className="p-4">
              {coverDetails ? (
                <CoverDetails coverDetails={coverDetails}/>
              ) : (
                <p>No cover details available.</p>
              )}

              {selectedQuestions.length > 0 ? (
                selectedQuestions.map((question, index) => (
                  <div key={question._id} className="mb-4">
                    <h2 className="text-xl font-semibold">
                      <strong>Q{index + 1}:</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: question.question_title }} />
                    </h2>
                    
                    <RenderMedia mediaArray={question.images} type="image" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.videos} type="video" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.docs} type="pdf" baseURL={baseURL} />
                    
                    <div 
                      className="ml-5"
                      dangerouslySetInnerHTML={{ __html: question.answer_key.description }}
                    />
                    
                    <RenderMedia mediaArray={question.answer_key.images} type="image" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.answer_key.videos} type="video" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.answer_key.docs} type="pdf" baseURL={baseURL} />
                    
                    <div 
                      className="ml-5"
                      dangerouslySetInnerHTML={{ __html: question.markscheme.description }}
                    />
                    
                    <RenderMedia mediaArray={question.markscheme.images} type="image" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.markscheme.videos} type="video" baseURL={baseURL} />
                    <RenderMedia mediaArray={question.markscheme.docs} type="pdf" baseURL={baseURL} />

                    {question.subquestions?.map((subquestion, subIndex) => (
                      <div key={subquestion._id} className="ml-4">
                        <h3 className="text-lg font-medium">
                          <strong>{String.fromCharCode(97 + subIndex)}:</strong>{" "}
                          <span dangerouslySetInnerHTML={{ __html: subquestion.title }} />
                        </h3>
                        
                        <RenderMedia mediaArray={subquestion.images} type="image" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.videos} type="video" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.docs} type="pdf" baseURL={baseURL} />
                        
                        {subquestion.mcq_options && (
                          <div className="flex flex-wrap mt-2">
                            {[
                              { label: 'A', value: subquestion.mcq_options.mcq_options_a },
                              { label: 'B', value: subquestion.mcq_options.mcq_options_b },
                              { label: 'C', value: subquestion.mcq_options.mcq_options_c },
                              { label: 'D', value: subquestion.mcq_options.mcq_options_d },
                            ].map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`border rounded-lg p-2 m-1 w-[calc(50%-10px)] ${
                                  option.label === subquestion.mcq_options.correct_answer 
                                    ? 'bg-green-100 border-green-300' 
                                    : 'bg-white border-gray-300'
                                }`}
                              >
                                <p className="text-base">
                                  {option.label}: {option.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div
                          className="ml-4"
                          dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}
                        />
                        
                        <RenderMedia mediaArray={subquestion.answer_key.images} type="image" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.answer_key.videos} type="video" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                        
                        <div
                          className="ml-4"
                          dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}
                        />
                        
                        <RenderMedia mediaArray={subquestion.markscheme.images} type="image" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.markscheme.videos} type="video" baseURL={baseURL} />
                        <RenderMedia mediaArray={subquestion.markscheme.docs} type="pdf" baseURL={baseURL} />

                        {subquestion.subchildquestions?.map((subchildquestion, subChildIndex) => (
                          <div key={subchildquestion._id} className="ml-8">
                            <h4 className="text-base font-normal">
                              <strong>{toRoman(subChildIndex + 1)}:</strong>{" "}
                              <span dangerouslySetInnerHTML={{ __html: subchildquestion.title }} />
                            </h4>
                            
                            <RenderMedia mediaArray={subchildquestion.images} type="image" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.videos} type="video" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.docs} type="pdf" baseURL={baseURL} />
                            
                            <div
                              className="ml-5"
                              dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}
                            />
                            
                            <RenderMedia mediaArray={subchildquestion.answer_key.images} type="image" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.answer_key.videos} type="video" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                            
                            <div
                              className="ml-5"
                              dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}
                            />
                            
                            <RenderMedia mediaArray={subchildquestion.markscheme.images} type="image" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.markscheme.videos} type="video" baseURL={baseURL} />
                            <RenderMedia mediaArray={subchildquestion.markscheme.docs} type="pdf" baseURL={baseURL} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No Questions Available</p>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={handleCloseModal} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSharedAssignment;