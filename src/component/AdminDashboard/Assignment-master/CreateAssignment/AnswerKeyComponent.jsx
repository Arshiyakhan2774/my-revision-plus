import React from 'react';

const AnswerKeyDialog = ({
  open,
  onClose,
  answerKeyContent,
  activeQuestionIndex,
  renderMedia
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {/* Modal wrapper */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">
            Answer Keys for Question {activeQuestionIndex + 1}
          </h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-6">
          {answerKeyContent?.length > 0 ? (
            answerKeyContent.map((item, idx) => (
              <div key={idx} className="mb-6 last:mb-0">
                <h4 className="text-lg font-semibold mb-3">
                  {item.type} {item.identifier}
                </h4>

                {item.content.description && (
                  <div
                    className="prose prose-sm max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: item.content.description }}
                  />
                )}

                <div className="space-y-4">
                  {renderMedia(item.content.images, 'image')}
                  {renderMedia(item.content.videos, 'video')}
                  {renderMedia(item.content.docs, 'pdf')}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No answer keys available for this question.</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerKeyDialog;
