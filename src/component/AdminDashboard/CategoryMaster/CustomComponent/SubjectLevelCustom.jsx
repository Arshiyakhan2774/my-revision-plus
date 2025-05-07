import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const SubjectLevelCustom = ({ selectedBoard, selectedSubject, selectedSubjectLevel, setSelectedSubjectLevel, getInputLabel }) => {
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();
  
  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="w-full">
      <label htmlFor="subjectLevelID" className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel("Subject Level")}
      </label>
      <select
        id="subjectLevelID"
        value={selectedSubjectLevel}
        onChange={(e) => setSelectedSubjectLevel(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select Subject Level</option>
        {selectedSubject && categories?.categories.find(category => category?._id === selectedBoard)?.subjects?.find(subject => subject._id === selectedSubject)?.subjectlevels .map(level => (
          <option key={level._id} value={level._id}>
            {level.subject_level_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubjectLevelCustom;