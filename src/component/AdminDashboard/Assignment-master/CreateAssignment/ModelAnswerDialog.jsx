import React from 'react';

const ModelAnswerDialog = ({
  open,
  onClose,
  modelAnswerContent,
  activeQuestionIndex,
  renderMedia
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Dialog content */}
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Model Answers for Question {activeQuestionIndex + 1}
            </h2>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {modelAnswerContent?.length > 0 ? (
              modelAnswerContent.map((item, idx) => (
                <div key={idx} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-semibold mb-4">
                    {item.type} {item.identifier}
                  </h3>
                  
                  {item.content.description && (
                    <div 
                      className="prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: item.content.description }} 
                    />
                  )}
                  
                  <div className="space-y-4 mt-4">
                    {renderMedia(item.content.images, 'image')}
                    {renderMedia(item.content.videos, 'video')}
                    {renderMedia(item.content.docs, 'pdf')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No model answers available for this question.</p>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelAnswerDialog;