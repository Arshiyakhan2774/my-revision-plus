import { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaVideo, FaChevronDown } from 'react-icons/fa';
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from './FinalPreviwe';
import { toast } from 'react-toastify';

const MainQuestionView = ({ savedData, handleEdit, handleDelete }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Wiris) {
        window.Wiris.config.saveMode = 'xml';
        console.log('Wiris saveMode set to XML.');
      }
    };

    return () => {
      document.body.removeChild(script); 
    };
  }, []);

  // Debug: Check the incoming data structure
  useEffect(() => {
    console.log('Saved Data in MainQuestionView:', savedData);
    if (!savedData) {
      toast.warning('No data received in MainQuestionView');
    }
  }, [savedData]);

  const handleOpen = (media, type) => {
    if (type === 'image') {
      setSelectedImage(`${API_URL_Images}${media}`);
    } else if (type === 'video') {
      setSelectedVideo(`${API_URL_Videos}${media}`);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage('');
    setSelectedVideo('');
  };

  const renderMedia = (mediaArray, type) => {
    if (!mediaArray || mediaArray.length === 0) return null;

    return (
      <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
        {mediaArray.map((media, index) => (
          <div key={index} className="w-full max-w-[600px] mb-4">
            {type === 'image' && (
              <img
                src={`${API_URL_Images}${media}`}
                alt={`media-${index}`}
                className="w-full h-auto cursor-pointer"
                onClick={() => handleOpen(media, 'image')}
              />
            )}
            {type === 'video' && (
              <video controls className="w-full h-auto">
                <source src={`${API_URL_Videos}${media}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {type === 'pdf' && (
              <embed 
                src={`${API_URL_PDF}${media}`}
                type="application/pdf"
                className="w-full h-[600px]"
              />
            )}
          </div>
        ))} 
      </div>
    );
  };

  // Safely access nested data with proper fallbacks
  const questionData = savedData?.question || savedData || {};
  const answerKey = questionData?.answer_key || {};
  const modelAnswer = questionData?.answer_model || {};
  const markScheme = questionData?.markscheme || {};

  if (!savedData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No question data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-full flex justify-center items-center">
      <div className="w-full mt-20 mb-4 p-8 border shadow-sm">
        {/* Header with action buttons */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-300">
          <div className="flex flex-row items-center">
            {questionData?.videos?.length > 0 && questionData.videos.map((video, index) => (
              <div key={index} className="tooltip" data-tip={`Video ${index + 1}`}>
                <button 
                  onClick={() => handleOpen(video, 'video')}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#24ECB1] text-white mr-2"
                >
                  <FaVideo className="text-sm" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center">
            <div className="tooltip" data-tip="Edit">
              <button 
                onClick={handleEdit}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
              >
                <FaEdit className="text-sm" />
              </button>
            </div>
            <div className="tooltip" data-tip="Delete">
              <button 
                onClick={handleDelete}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF7A7A] text-white"
              >
                <FaTrashAlt className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Question content */}
        <div className="mt-5 text-left">
          <div className="ml-auto text-left">
            <p>
              <span className="mr-7"><strong>1. </strong></span>
              Maximum Marks: <strong>[{questionData?.marks || 'N/A'}]</strong>
            </p>
          </div>
          <div className="flex text-xl">
            <div 
              className="ml-10" 
              dangerouslySetInnerHTML={{ 
                __html: questionData?.question_title || 'No question title available' 
              }} 
            />
          </div>
        </div>

        {/* Media display */}
        {questionData?.images?.length > 0 && renderMedia(questionData.images, 'image')}
        {questionData?.docs?.length > 0 && renderMedia(questionData.docs, 'pdf')}

        {/* Answer Key Section */}
        {(answerKey.description || answerKey.images?.length > 0 || answerKey.videos?.length > 0 || answerKey.docs?.length > 0) && (
          <>
            <button
              className="flex justify-start items-center w-[15%] text-left mt-4"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
            >
              {showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}
              <FaChevronDown className={`ml-1 transition-transform ${showAnswerKey ? 'transform rotate-180' : ''}`} />
            </button>
            {showAnswerKey && (
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="text-left font-semibold">Answer Key:</p>
                  {answerKey?.videos?.length > 0 && (
                    <div className="flex flex-wrap justify-start">
                      {answerKey.videos.map((video, index) => (
                        <div key={index} className="tooltip" data-tip={`Answer Key Video ${index + 1}`}>
                          <button
                            onClick={() => handleOpen(video, 'video')}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
                          >
                            <FaVideo className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {answerKey.description && (
                  <div 
                    className="mt-2"
                    dangerouslySetInnerHTML={{ __html: answerKey.description }} 
                  />
                )}
                {answerKey?.images?.length > 0 && renderMedia(answerKey.images, 'image')}
                {answerKey?.docs?.length > 0 && renderMedia(answerKey.docs, 'pdf')}
              </div>
            )}
          </>
        )}

        {/* Model Answer Section */}
        {(modelAnswer.description || modelAnswer.images?.length > 0 || modelAnswer.videos?.length > 0 || modelAnswer.docs?.length > 0) && (
          <>
            <button
              className="flex justify-start items-center w-[15%] text-left mt-4"
              onClick={() => setShowModelAnswer(!showModelAnswer)}
            >
              {showModelAnswer ? 'Hide Model Answer' : 'Show Model Answer'}
              <FaChevronDown className={`ml-1 transition-transform ${showModelAnswer ? 'transform rotate-180' : ''}`} />
            </button>
            {showModelAnswer && (
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="text-left font-semibold">Model Answer:</p>
                  {modelAnswer?.videos?.length > 0 && (
                    <div className="flex flex-wrap justify-start">
                      {modelAnswer.videos.map((video, index) => (
                        <div key={index} className="tooltip" data-tip={`Model Answer Video ${index + 1}`}>
                          <button
                            onClick={() => handleOpen(video, 'video')}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
                          >
                            <FaVideo className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {modelAnswer.description && (
                  <div 
                    className="mt-2"
                    dangerouslySetInnerHTML={{ __html: modelAnswer.description }} 
                  />
                )}
                {modelAnswer?.images?.length > 0 && renderMedia(modelAnswer.images, 'image')}
                {modelAnswer?.docs?.length > 0 && renderMedia(modelAnswer.docs, 'pdf')}
              </div>
            )}
          </>
        )}

        {/* Mark Scheme Section */}
        {(markScheme.description || markScheme.images?.length > 0 || markScheme.videos?.length > 0 || markScheme.docs?.length > 0) && (
          <>
            <button
              className="flex justify-start items-center w-[15%] text-left mt-4"
              onClick={() => setShowMarkScheme(!showMarkScheme)}
            >
              {showMarkScheme ? 'Hide Mark Scheme' : 'Show Mark Scheme'}
              <FaChevronDown className={`ml-1 transition-transform ${showMarkScheme ? 'transform rotate-180' : ''}`} />
            </button>
            {showMarkScheme && (
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="text-left font-semibold">Mark Scheme:</p>
                  {markScheme?.videos?.length > 0 && (
                    <div className="flex flex-wrap justify-start">
                      {markScheme.videos.map((video, index) => (
                        <div key={index} className="tooltip" data-tip={`Mark Scheme Video ${index + 1}`}>
                          <button
                            onClick={() => handleOpen(video, 'video')}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
                          >
                            <FaVideo className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {markScheme.description && (
                  <div 
                    className="mt-2"
                    dangerouslySetInnerHTML={{ __html: markScheme.description }} 
                  />
                )}
                {markScheme?.images?.length > 0 && renderMedia(markScheme.images, 'image')}
                {markScheme?.docs?.length > 0 && renderMedia(markScheme.docs, 'pdf')}
              </div>
            )}
          </>
        )}

        {/* Media Modal */}
        {open && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleClose}
          >
            <div 
              className="bg-white p-4 rounded-lg w-4/5 max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={handleClose}
              >
                ✕
              </button>
              {selectedVideo && (
                <video controls className="w-full h-auto" autoPlay>
                  <source src={selectedVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainQuestionView;