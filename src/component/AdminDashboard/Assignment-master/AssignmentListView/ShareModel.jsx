import { useEffect, useMemo, useState } from 'react';
import { FaShareSquare, FaTimes, FaSearch, FaShare } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserTeacherQuery } from '../../../Services/UserMangae/UserMangeSlice';
import { Api } from '../../../Api/Api';
import IconWithTitle from '../../../utilities/IconsTittle';

const ShareModel = ({ open, onClose, onShare, selectedQuestionText }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const { data: teacherData, isLoading, error, refetch } = useGetUserTeacherQuery();
  const teachers = useMemo(() => teacherData?.data?.teacher || [], [teacherData]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacher) {
        try {
          const response = await Api.get(`/onlineclass/list/${selectedTeacher}`);
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
  }, [selectedTeacher]);
 
  const handleTeacherChange = (event) => {
    const teacherId = event.target.value;
    console.log("Selected Teacher ID:", teacherId);
    setSelectedTeacher(teacherId);
  };

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
        teacher_id: selectedTeacher,
      });
  
      if (response?.data?.status === "success") {
        toast.success('Assignment shared successfully!');
        refetch();
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

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes className="text-xl" />
        </button>

        <IconWithTitle
          icon={FaShareSquare}
          title="Share Assignment"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />

        <div className="mb-4 w-full">
          <label className="block bg-white px-1 -mt-3 ml-2 text-sm text-gray-500 absolute">Select Teacher</label>
          <select
            value={selectedTeacher}
            onChange={handleTeacherChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="" disabled>Search Teacher</option>
            {filteredTeachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="max-h-48 overflow-y-auto">
          {students.length > 0 && (
            <div className="py-1">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedStudents.length === students.length}
                  onChange={() => {
                    if (selectedStudents.length === students.length) {
                      setSelectedStudents([]);
                    } else {
                      setSelectedStudents(students.map(student => student.student_id));
                    }
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>Select All</span>
              </label>
            </div>
          )}

          {filteredStudents?.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student.student_id} className="py-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.student_id)}
                    onChange={() => handleStudentSelection(student.student_id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span>{student.name}</span>
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No students available.</p>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-blue-700 text-white bg-custom-primary hover:bg-blue-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleShare}
            className="flex items-center px-4 py-2 rounded-md text-white bg-custom-primary hover:bg-blue-800 transition-colors"
          >
            <FaShare className="mr-2" />
            Share
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ShareModel;