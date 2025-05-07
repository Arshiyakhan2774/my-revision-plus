import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaChalkboardTeacher } from "react-icons/fa";
import { FcSearch } from 'react-icons/fc';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from '../../../Api/Api';
import { useGetUserTeacherQuery } from '../../../Services/UserMangae/UserMangeSlice';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';
import SearchableDropdown from './SearchAbleDropDown';

const AddMapping = ({ refetch }) => {
  // State management
  const [formData, setFormData] = useState({
    teacher: '',
    board: '',
    subject: '',
    subjectLevel: ''
  });
  

  // API data
  const { data: teachersList } = useGetUserTeacherQuery();
  const { data: { data: categories } = {} } = useGetCategoryListQuery();

  // Derived values
  const teachers = teachersList?.data?.teacher || [];
  // const filteredTeachers = teachers.filter(teacher =>
  //   teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const currentBoard = categories?.categories.find(cat => cat._id === formData.board);
  const currentSubject = currentBoard?.subjects.find(sub => sub._id === formData.subject);

  // Helper functions
  const getTabLabel = (originalLabel) => {
    if (formData.board === '665fffe9e02ec586b271fba2') {
      switch (originalLabel) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        default: return originalLabel;
      }
    } else if (formData.board === '671f5e5bfd4c6a25ad4bb527') {
      switch (originalLabel) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        default: return originalLabel;
      }
    }
    return originalLabel;
  };

  // Event handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'board' && { subject: '', subjectLevel: '' }),
      ...(field === 'subject' && { subjectLevel: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.teacher || !formData.board || !formData.subject || 
        (formData.board === '665fffe9e02ec586b271fba2' && !formData.subjectLevel)) {
      toast.error('Please select all fields');
      return;
    }
  
    try {
      await Api.post('/questions/subjectmapping', {
        teacher_id: formData.teacher,
        board_id: formData.board,
        subject_id: formData.subject,
        subjectlevel_id: formData.subjectLevel
      });
  
      toast.success('Teacher subject mapping added successfully!');
      refetch();
      setFormData(prev => ({ ...prev, subject: '', subjectLevel: '' }));
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full p-4">
   
      <div className="flex items-center justify-center mt-10">
        <div className="bg-[#1a73e8] rounded-full p-3 mr-4">
          <FaChalkboardTeacher className="text-white text-3xl" />
        </div>
        <h1 className="text-[#1a73e8] text-3xl font-bold">Teacher Mapping List</h1>
      </div>
    
      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Teacher Select */}
          <SearchableDropdown
  label={getTabLabel("Teacher")}
  options={teachers.map(t => ({ label: t.name, value: t._id }))}
  value={formData.teacher}
  onChange={(val) => handleChange('teacher', val)}
  placeholder="Search or select teacher"
/>

          {/* Board Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {getTabLabel("Board")}
            </label>
            <select
              value={formData.board}
              onChange={(e) => handleChange('board', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Board</option>
              {categories?.categories.map(board => (
                <option key={board._id} value={board._id}>
                  {board.board_prog_name}
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
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              disabled={!formData.board}
              className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select {getTabLabel("Subject")}</option>
              {currentBoard?.subjects?.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Level Select (Conditional) */}
          {formData.board === '665fffe9e02ec586b271fba2' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getTabLabel("Subject Level")}
              </label>
              <select
                value={formData.subjectLevel}
                onChange={(e) => handleChange('subjectLevel', e.target.value)}
                disabled={!formData.subject}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select {getTabLabel("Subject Level")}</option>
                {currentSubject?.subjectlevels?.map(level => (
                  <option key={level._id} value={level._id}>
                    {level.subject_level_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <BackButton />
          <AddButton type="submit" label="Add Student" />
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddMapping;