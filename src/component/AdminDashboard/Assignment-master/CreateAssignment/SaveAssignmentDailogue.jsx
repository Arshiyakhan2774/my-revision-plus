const SaveAssignmentDailogue = ({ 
  saveAssignmentDialogOpen, 
  setSaveAssignmentDialogOpen, 
  assignmentName, 
  setAssignmentName, 
  handleSaveAssignment 
}) => {
  if (!saveAssignmentDialogOpen) return null;

  return (
    <>
      {/* Background overlay - must come first */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setSaveAssignmentDialogOpen(false)}
      />
      
      {/* Dialog container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dialog panel */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Dialog header */}
          <div className="bg-[#1a73e8] text-white p-4 text-center rounded-t-lg">
            <h3 className="text-lg font-medium">Save Assignment</h3>
          </div>
          
          {/* Dialog content */}
          <div className="p-5 border-b border-gray-200">
            <div className="mb-4">
              <label htmlFor="assignment-name" className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Name
              </label>
              <input
                id="assignment-name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8]"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          {/* Dialog footer */}
          <div className="px-4 py-3 bg-gray-50 flex justify-center space-x-3 rounded-b-lg">
            <button
              onClick={() => setSaveAssignmentDialogOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAssignment}
              disabled={!assignmentName.trim()}
              className={`px-4 py-2 bg-[#1a73e8] text-white rounded-md hover:bg-[#001A4A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a73e8] ${
                !assignmentName.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaveAssignmentDailogue;