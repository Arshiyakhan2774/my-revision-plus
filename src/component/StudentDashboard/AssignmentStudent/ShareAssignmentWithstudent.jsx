import { useEffect, useMemo, useState } from 'react';
import { FaShareFromSquare, FaSearch, FaTimes, FaShare } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconWithTitle from '../../../Utilities/IconsTittle';
import { Api } from '../../../Api/Api';
import { useSelector } from 'react-redux';

const ShareAssignmentWithstudent = ({ open, onClose, onShare, selectedQuestionText }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const userResponse = useSelector((state) => state.idSlice?.userResponse);

  useEffect(() => {
    const fetchStudents = async () => {
      if (userResponse._id) {
        try {
          const response = await Api.get(`/onlineclass/list/${userResponse._id}`);
          const subjectMappingsData = response.data.data.onlineclass.subjectmapping;
          
          const allStudents = subjectMappingsData.flatMap((mapping) =>
            mapping.subjects.flatMap((subject) =>
              subject.students.map((student) => ({
                student_id: student.student_id,
                name: student.name,
                board_info: student.board_info,
                subject_info: subject,
                subjectlevel_id: mapping.subjectlevel_id,
                subject_level_name: mapping.subject_level_name,
              }))
            )
          );
          setStudents(allStudents);
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [userResponse._id]);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleShare = async () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student.');
      return;
    }
  
    try {
      const response = await Api.post('/assignment/createassign', {
        student_id: selectedStudents,
        assignment_id: selectedQuestionText,
        teacher_id: userResponse._id,
      });
  
      if (response?.data?.status === "success") {
        toast.success('Assignment shared successfully!');
        onClose();
      } else if (response?.data?.message === "No new assignments were added; all entries already exist.") {
        toast.warning('Assignment already shared!');
      } else {
        toast.error('Failed to share the assignment.');
      }
    } catch (error) {
      console.error('Error sharing assignment:', error);
  
      if (error.response?.data?.message === "No new assignments were added; all entries already exist.") {
        toast.warning('Assignment already shared!');
      } else {
        toast.error('Failed to share the assignment.');
      }
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allSelected = selectedStudents.length === students.length && students.length > 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${open ? '' : 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <IconWithTitle
            icon={FaShareFromSquare}
            title="Share Assignment"
            iconColor="white"
            backgroundColor="#00246B"
            iconSize="30px"
            titleColor="#00246B"
            titleFontSize="34px"
          />

          <div className="relative mt-4 mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="max-h-80 overflow-y-auto border rounded-lg">
            {students.length > 0 && (
              <div className="p-2 border-b">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={() => {
                      if (allSelected) {
                        setSelectedStudents([]);
                      } else {
                        setSelectedStudents(students.map(student => student.student_id));
                      }
                    }}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Select All</span>
                </label>
              </div>
            )}

            {filteredStudents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <li key={student.student_id} className="p-2 hover:bg-gray-50">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.student_id)}
                        onChange={() => handleStudentSelection(student.student_id)}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{student.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No students available</div>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              <FaShare className="mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ShareAssignmentWithstudent;