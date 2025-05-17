import { useState, useEffect } from "react";
import { RiFolderSharedLine, RiSlideshowView } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import CoverDetails from "./CoverDetails";
import RenderMedia from "./RenderMedia";
import { Api } from "../../../Api/Api";
import IconWithTitle from "../../../utilities/IconsTittle";

const toRoman = (num) => {
  const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  return romanMap[num - 1] || num;
};

const SharedAssignmentComponent = () => {
  const [assignments, setAssignments] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openModal, setOpenModal] = useState(false); 
  const [coverDetails, setCoverDetails] = useState(null);
  const sharedAssignment = useSelector((state) => state.idSlice.sharedAssignment);
  const baseURL = "http://myrevisionplus.com/api/img/question/";

  useEffect(() => {
    if (sharedAssignment) {
      fetchSharedAssignment();
    }
  }, [sharedAssignment]);

  const fetchSharedAssignment = async () => {
    setLoading(true);
    try {
      const response = await Api.post("/assignment/getsharedassignment", {
        assignment_id: sharedAssignment, 
      });

      if (response.data?.data?.assignments) {
        let uniqueAssignments = [];
        let uniquePairs = new Set();

        response.data.data.assignments.forEach((assignment) => {
          const key = `${assignment.assignment_id?._id}-${assignment.student_id?._id}`;
          if (!uniquePairs.has(key)) {
            uniquePairs.add(key);
            uniqueAssignments.push(assignment);
          }
        });
        setAssignments(uniqueAssignments);

        if (uniqueAssignments.length > 0) {
          setCoverDetails(uniqueAssignments[0].assignment_id?.cover_details || null);
        }
      }
    } catch (error) {
      console.error("Error fetching shared assignments:", error);
    }
    setLoading(false);
  };

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { name: "Teacher", selector: (row) => row.teacher_id?.name || "N/A", sortable: true },
    { name: "Student", selector: (row) => row.student_id?.name || "N/A", sortable: true },
    { name: "Email", selector: (row) => row.student_id?.email || "N/A", sortable: true },
    { name: "Duration", selector: (row) => row.assignment_id?.cover_details?.duration || "N/A", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button 
          onClick={() => handleView(row)}
          className="bg-custom-primary text-white p-2 rounded hover:bg-blue-800 transition-colors"
          title="View Assignment"
        >
          <RiSlideshowView className="text-xl" />
        </button>
      ),
    },
  ];

  return (
   
      <div className="w-full px-4">
        <IconWithTitle
          icon={RiFolderSharedLine}
          title="Shared Assignments"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <IconWithTitle
                  icon={MdAssignmentAdd}
                  title="Assignment View"
                  iconColor="white"
                  backgroundColor="#1a73e8"
                  iconSize="30px"
                  titleColor="#1a73e8"
                  titleFontSize="34px"
                />
              </div>
              
              <div className="p-4">
                {coverDetails ? (
                  <CoverDetails coverDetails={coverDetails}/>
                ) : (
                  <p>No cover details available.</p>
                )}
                
                {selectedRow?.assignment_id?.question_id?.length > 0 ? (
                  selectedRow.assignment_id.question_id.map((question, index) => (
                    <div key={question._id} className="mb-4">
                      <h3 className="text-lg font-semibold">
                        <strong>Q{index + 1}:</strong> <span dangerouslySetInnerHTML={{ __html: question.question_title }} />
                      </h3>
                      
                      <RenderMedia mediaArray={question.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.docs} type="pdf" baseURL={baseURL} />
                      
                      <div className="ml-5" dangerouslySetInnerHTML={{ __html: question.answer_key.description }}></div>
                      <RenderMedia mediaArray={question.answer_key.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_key.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_key.docs} type="pdf" baseURL={baseURL} />
                      
                      <div className="ml-5" dangerouslySetInnerHTML={{ __html: question.markscheme.description }}></div>
                      <RenderMedia mediaArray={question.markscheme.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.markscheme.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.markscheme.docs} type="pdf" baseURL={baseURL} />
                      
                      {question.subquestions?.map((subquestion, subIndex) => (
                        <div key={subquestion._id} className="ml-4">
                          <h4 className="text-md font-medium">
                            <strong>{String.fromCharCode(97 + subIndex)}:</strong> <span dangerouslySetInnerHTML={{ __html: subquestion.title }} />
                          </h4>
                          
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
                                  className={`p-2 m-1 rounded-lg border w-[calc(50%-0.5rem)] ${
                                    option.label === subquestion.mcq_options.correct_answer 
                                      ? 'bg-green-100 border-green-300' 
                                      : 'bg-white border-gray-300'
                                  }`}
                                >
                                  <p className="text-sm">
                                    {option.label}: {option.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="ml-4" dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}></div>
                          <RenderMedia mediaArray={subquestion.answer_key.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_key.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                          
                          <div className="ml-4" dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}></div>
                          <RenderMedia mediaArray={subquestion.markscheme.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.markscheme.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.markscheme.docs} type="pdf" baseURL={baseURL} />
                          
                          {subquestion.subchildquestions?.map((subchildquestion, subChildIndex) => (
                            <div key={subchildquestion._id} className="ml-8">
                              <p className="text-sm">
                                <strong>{toRoman(subChildIndex + 1)}:</strong> <span dangerouslySetInnerHTML={{ __html: subchildquestion.title }} />
                              </p>
                              
                              <RenderMedia mediaArray={subchildquestion.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.docs} type="pdf" baseURL={baseURL} />
                              
                              <div className="ml-5" dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}></div>
                              <RenderMedia mediaArray={subchildquestion.answer_key.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_key.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                              
                              <div className="ml-5" dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}></div>
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
                  className="px-4 py-2 bg-custom-primary text-white rounded hover:bg-blue-800 transition-colors"
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

export default SharedAssignmentComponent;