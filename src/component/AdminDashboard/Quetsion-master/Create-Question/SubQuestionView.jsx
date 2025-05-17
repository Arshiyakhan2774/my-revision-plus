import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaVideo } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from './FinalPreviwe';

const SubQuestionView = ({ subQuestiopnsavedData, label, handleEdit, handleDelete }) => {
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVideo, setSelectedVideo] = useState('');
  const [subquestions, setSubquestions] = useState([]);

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
  }, [subQuestiopnsavedData]);

  const dispatch = useDispatch();
  
  const handleOpen = (media, type) => {
    if (type === 'image') {
      setSelectedImage(`${API_URL_Images}${media}`);
    } else if (type === 'video') {
      setSelectedVideo(`${API_URL_Videos}${media}`);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const renderMedia = (mediaArray, type) => {
    return mediaArray.map((media, index) => {
      if (type === 'image') {
        return (
          <img
            key={index}
            src={`${API_URL_Images}${media}`}
            alt={`Uploaded ${index}`}
            onClick={() => handleOpen(media)}
            className="w-1/2 h-auto mx-4 my-2 cursor-pointer"
          />
        );
      } else if (type === 'video') {
        return (
          <video 
            key={index} 
            controls 
            className="w-1/2 h-auto mx-4 my-2"
          >
            <source src={`${API_URL_Videos}${media}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      } else if (type === 'pdf') {
        return (
          <embed
            key={index}
            src={`${API_URL_PDF}${media}`}
            type="application/pdf"
            className="w-1/2 h-[500px] mx-4 my-2"
          />
        );
      }
      return null;
    });
  };

  const title = subQuestiopnsavedData?.question?.title || 'No Title';

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full mb-4 p-4 border border-gray-300 rounded-lg shadow-sm">
        {/* Header with video buttons and action buttons */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-2">
          <div className="flex flex-wrap gap-2">
            {subQuestiopnsavedData?.question?.videos?.length > 0 && 
              subQuestiopnsavedData.question.videos.map((video, index) => (
                <button
                  key={index}
                  onClick={() => handleOpen(video, 'video')}
                  className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center"
                  title={`Video ${index + 1}`}
                >
                  <FaVideo className="text-sm" />
                </button>
              ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center"
              title="Edit"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={handleDelete}
              className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center"
              title="Delete"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>

        {/* Title and marks */}
        <div className="mt-4 text-left">
          <div className="flex justify-end mb-2">
            <span className="text-gray-700">
              Marks: <strong>[{subQuestiopnsavedData?.question?.marks || 'N/A'}]</strong>
            </span>
          </div>
          
          <div className="flex items-center text-xl">
            <span className="mr-8 ml-4">({label})</span>
            <div dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </div>

        {/* Media display */}
        <div className="flex flex-wrap justify-center my-4">
          {selectedImage && (
            <div className="w-full md:w-1/2 relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto"
              />
            </div>
          )}
          
          {subQuestiopnsavedData?.question?.images?.length > 0 && 
            renderMedia(subQuestiopnsavedData.question.images, 'image')}
          {subQuestiopnsavedData?.question?.videos?.length > 0 && 
            renderMedia(subQuestiopnsavedData.question.videos, 'video')}
          {subQuestiopnsavedData?.question?.docs?.length > 0 && 
            renderMedia(subQuestiopnsavedData.question.docs, 'pdf')}
        </div>

        {/* Answer Key Section */}
        {subQuestiopnsavedData?.question?.answer_key?.description && (
          <div className="mt-4">
            <button
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className="flex items-center text-left w-full md:w-1/5 text-blue-600"
            >
              {showAnswerKey ? '' : 'Answer-Key'}
              {showAnswerKey ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            
            {showAnswerKey && (
              <div className="mt-2">
                 <style jsx global>{`
      .Wirisformula {
        display: inline-block;
        vertical-align: middle;
      }
      .WIRIS_images {
        display: inline !important;
      }
    `}</style>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Answer Key:</h3>
                  {subQuestiopnsavedData?.question?.answer_key?.videos?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subQuestiopnsavedData.question.answer_key.videos.map((video, index) => (
                        <button
                          key={index}
                          onClick={() => handleOpen(video, 'video')}
                          className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center"
                          title={`Answer Key Video ${index + 1}`}
                        >
                          <FaVideo className="text-sm" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div 
                  dangerouslySetInnerHTML={{ __html: subQuestiopnsavedData.question.answer_key.description || 'No Title' }} 
                  className="mt-2"
                />
                
                <div className="flex flex-wrap justify-center my-4">
                  {subQuestiopnsavedData?.question?.answer_key?.images?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_key.images, 'image')}
                  {subQuestiopnsavedData?.question?.answer_key?.videos?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_key.videos, 'video')}
                  {subQuestiopnsavedData?.question?.answer_key?.docs?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_key.docs, 'pdf')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Model Answer Section */}
        {subQuestiopnsavedData?.question?.answer_model?.description && (
          <div className="mt-4">
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="flex items-center text-left w-full md:w-1/5 text-blue-600"
            >
              {showModelAnswer ? '' : 'Model Answer'}
              {showModelAnswer ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            
            {showModelAnswer && (
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Model Answer:</h3>
                  {subQuestiopnsavedData?.question?.answer_model?.videos?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subQuestiopnsavedData.question.answer_model.videos.map((video, index) => (
                        <button
                          key={index}
                          onClick={() => handleOpen(video, 'video')}
                          className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center"
                          title={`Model Answer Video ${index + 1}`}
                        >
                          <FaVideo className="text-sm" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div 
                  dangerouslySetInnerHTML={{ __html: subQuestiopnsavedData.question.answer_model.description || 'No Title' }} 
                  className="mt-2"
                />
                
                <div className="flex flex-wrap justify-center my-4">
                  {subQuestiopnsavedData?.question?.answer_model?.images?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_model.images, 'image')}
                  {subQuestiopnsavedData?.question?.answer_model?.videos?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_model.videos, 'video')}
                  {subQuestiopnsavedData?.question?.answer_model?.docs?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.answer_model.docs, 'pdf')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mark Scheme Section */}
        {subQuestiopnsavedData?.question?.markscheme?.description && (
          <div className="mt-4">
            <button
              onClick={() => setShowMarkScheme(!showMarkScheme)}
              className="flex items-center text-left w-full md:w-1/5 text-blue-600"
            >
              {showMarkScheme ? '' : 'Mark-Scheme'}
              {showMarkScheme ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            
            {showMarkScheme && (
              <div className="mt-2">
                <h3 className="font-semibold">Mark Scheme:</h3>
                <div 
                  dangerouslySetInnerHTML={{ __html: subQuestiopnsavedData.question.markscheme.description || 'No Title' }} 
                  className="mt-2"
                />
                
                <div className="flex flex-wrap justify-center my-4">
                  {subQuestiopnsavedData?.question?.markscheme?.images?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.markscheme.images, 'image')}
                  {subQuestiopnsavedData?.question?.markscheme?.videos?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.markscheme.videos, 'video')}
                  {subQuestiopnsavedData?.question?.markscheme?.docs?.length > 0 && 
                    renderMedia(subQuestiopnsavedData.question.markscheme.docs, 'pdf')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal for media preview */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClose}>
            <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
              {selectedVideo && (
                <video controls className="w-full h-auto">
                  <source src={selectedVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-auto"
                />
              )}
              <button 
                onClick={handleClose}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubQuestionView;


