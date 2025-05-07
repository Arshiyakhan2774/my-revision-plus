import { useGetCategoryListQuery } from "../../../Services/Category/CategoryApi";



const SourceCustom = ({ 
  selectedBoard, 
  selectedSubject, 
  selectedSubjectLevel, 
  selectedSource, 
  setSelectedSource, 
  getInputLabel, 

}) => {
  const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();

  // Loading and error handling
  if (isLoading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="w-full">
      <label htmlFor="source_id" className="block text-sm font-medium text-gray-700 mb-1">
        {getInputLabel("Source")}
      </label>
      <select
        id="source_id"
        value={selectedSource}
        onChange={(e) => setSelectedSource(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">Select Source</option>
        {selectedSubjectLevel && categories?.categories
          ?.find(cat => cat._id === selectedBoard)
          ?.subjects?.find(sub => sub._id === selectedSubject)
          ?.subjectlevels?.find(level => level._id === selectedSubjectLevel)
          ?.sources?.map(source => (
            <option key={source._id} value={source._id}>
              {source.source_name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SourceCustom;