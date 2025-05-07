import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const PaperCustom = ({ 
  selectedBoard, 
  selectedSubject, 
  selectedSubjectLevel, 
  selectedSource, 
  selectedPaper, 
  setSelectedPaper, 
  getInputLabel 
}) => {
  const { data: { data: categories } = {}, error, isLoading} = useGetCategoryListQuery();

  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="w-full">
      <label htmlFor="paperID" className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel("Paper")}
      </label>
      <select
        id="paperID"
        name="paperID"
        value={selectedPaper}
        onChange={(e) => setSelectedPaper(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select Paper</option>
        {selectedSource && categories?.categories
          .find(cat => cat._id === selectedBoard)
          ?.subjects?.find(sub => sub._id === selectedSubject)
          ?.subjectlevels?.find(level => level._id === selectedSubjectLevel)
          ?.sources?.find(source => source._id === selectedSource)
          ?.papers?.map(paper => (
            <option key={paper._id} value={paper._id}>
              {paper.paper_name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default PaperCustom;