import { useState, } from "react";
import { PiStudentLight } from "react-icons/pi";
import { FcSearch } from "react-icons/fc";
import { useGetTeacherMappingByIdQuery, useGetUserQuery, useGetUserTeacherQuery } from "../../../Services/UserMangae/UserMangeSlice";
import { Api } from "../../../Api/Api";
import IconWithTitle from "../../../utilities/IconsTittle";
import BackButton from "../../../utilities/BackButrton";
import SearchableDropdown from "../TeacherMap/SearchAbleDropDown";


const StudentMappingAdd = ({ refetch }) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState(""); 
  const [selectedSubjectId, setSelectedSubjectId] = useState(""); 
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');

 
  const { data: teacherData } = useGetUserTeacherQuery();
  const teacherList = teacherData?.data?.teacher || [];

  const { data: studentData } = useGetUserQuery(); 
  const students = studentData?.data?.user || [];

  const { data: teacherMappingData } = useGetTeacherMappingByIdQuery(selectedTeacherId, {
    skip: !selectedTeacherId,
  });

  const boards = teacherMappingData?.data?.result?.map(item => ({
    id: item.board_info._id,
    name: item.board_info.board_prog_name,
  })) || [];

  const subjects = teacherMappingData?.data?.result?.map(item => ({
    id: item.subject_info._id,
    name: item.subject_info.subject_name,
  })) || [];
  
  const subjectlevel = teacherMappingData?.data?.result
    ?.filter(item => item.subjectlevel_info)
    ?.map(item => ({
      id: item.subjectlevel_info._id,
      name: item.subjectlevel_info.subject_level_name,
    })) || [];

  const handleSubjectLevelChange = (event) => setSelectedSubjectLevel(event.target.value);
  
  function getTabLabel(originalLabel) {
    if (selectedBoardId === '665fffe9e02ec586b271fba2') {
      switch (originalLabel) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        default: return originalLabel;
      }
    } else if (selectedBoardId === '671f5e5bfd4c6a25ad4bb527') {
      switch (originalLabel) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        default: return originalLabel;
      }
    }
    return originalLabel;
  }

 


  const handleAddMapping = async () => {
    if (!selectedTeacherId || !selectedStudentId || !selectedBoardId || !selectedSubjectId) {
      setError("Please select a teacher, student, board, and subject.");
      return;
    }

    try {
      await Api.post("/users/create-teacher-student-map", {
        teacher_id: selectedTeacherId,
        student_id: selectedStudentId,
        board_id: selectedBoardId, 
        subject_id: selectedSubjectId, 
        subjectlevel_id: selectedSubjectLevel,
      });

      setSelectedStudentId('');
      setSelectedTeacherId('');
      setSelectedBoardId('');
      setSelectedSubjectId('');
      setSelectedSubjectLevel('')
      refetch();
      setError(null);
      setSuccessMessage("Mapping added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to add mapping. Please try again.");
      }
    }
  };



  return (
    <div className="w-full ">
       <div className="mt-4 mb-4  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Select */}
          <div className="relative">
          <SearchableDropdown
            label="Teacher"
            options={teacherList.map(t => ({ 
              label: t.name, 
              value: t._id 
            }))}
            value={selectedTeacherId}
            onChange={(val) => setSelectedTeacherId(val)}
            placeholder="Search or select teacher"
          />
        </div>

          {/* Student Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          {/* Board Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Board</label>
            <select
              value={selectedBoardId}
              onChange={(e) => setSelectedBoardId(e.target.value)}
              disabled={!selectedTeacherId}
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="" disabled>Select board</option>
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getTabLabel("Subject")}
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={!selectedBoardId}
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
            >
              <option value="" disabled>Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject Level (Conditional) */}
        {selectedBoardId === '665fffe9e02ec586b271fba2' && (
          <div className="mt-4 md:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getTabLabel("Subject Level")}
            </label>
            <select
              value={selectedSubjectLevel}
              onChange={handleSubjectLevelChange}
              className="w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Select level</option>
              {subjectlevel.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
        <BackButton />
          <button
            onClick={handleAddMapping}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Mapping
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMappingAdd;