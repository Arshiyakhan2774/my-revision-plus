import React from 'react';

const DeleteComponent = ({
  deleteDialogOpen,
  deleteSuccessDialogOpen,
  selectedQuestionToDelete,
  handleDeleteDialogClose,
  handleDeleteSuccessDialogClose,
  handleDeleteQuestion
}) => {
  return (
    <>
      {/* Confirm Delete Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Delete Question</h2>
            <p className="text-gray-700">
              Are you sure you want to delete question&nbsp;
              <span className="font-medium text-black">
                {selectedQuestionToDelete?.question_title}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleDeleteDialogClose}
                className="px-4 py-2 border border-gray-400 text-gray-700 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuestion(selectedQuestionToDelete?._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {deleteSuccessDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">Delete Successful</h2>
            <p className="text-gray-700">
              Question&nbsp;
              <span className="font-medium text-black">
                {selectedQuestionToDelete?.question_title}
              </span>{' '}
              was deleted successfully.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleDeleteSuccessDialogClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteComponent;
