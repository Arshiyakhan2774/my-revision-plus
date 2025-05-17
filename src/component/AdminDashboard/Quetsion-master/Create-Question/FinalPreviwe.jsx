import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { AiOutlineArrowLeft, AiOutlineCheck, AiOutlineFileText, 
         AiOutlineUpload, AiOutlineEye, AiOutlineBarChart, AiOutlineSend } from 'react-icons/ai';
import Loader from '../../Routing/Loader';
import { CgClose } from 'react-icons/cg';



export const API_URL_Images = 'https://myrevisionplus.com/api/img/question/images/';
export const API_URL_PDF = 'https://myrevisionplus.com/api/img/question/pdf/';
export const API_URL_Videos = 'https://myrevisionplus.com/api/img/question/videos/';

const FinalPreview = ({ onClose, open, savedData1, loading, error }) => {
  const [openModal, setOpenModal] = useState(null);
  const [openModal1, setOpenModal1] = useState(null);
  const navigate = useNavigate();

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
  }, [savedData1, openModal, openModal1]);

  const handleOpenModal = (type, index) => {
    setOpenModal(`${type}-${index}`);
  };

  const handleOpenModal1 = (type) => {
    setOpenModal1(type);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleCloseModal1 = () => {
    setOpenModal1(null);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderMedia = (mediaArray, type) => {
    if (!mediaArray || mediaArray.length === 0) return null;

    return (
      <div className="flex flex-row flex-wrap gap-4 mt-4 justify-center">
        {mediaArray.map((media, index) => (
          <div key={index} className="w-full max-w-[600px] mb-4">
            {type === 'image' && (
              <img
                src={`${API_URL_Images}${media}`}
                alt={`media-${index}`}
                className="w-full h-auto rounded-lg shadow-md"
                loading="lazy"
              />
            )}
            {type === 'video' && (
              <video controls className="w-full h-auto rounded-lg shadow-md">
                <source src={`${API_URL_Videos}${media}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {type === 'pdf' && (
              <embed
                src={`${API_URL_PDF}${media}`}
                type="application/pdf"
                className="w-full h-[800px] rounded-lg shadow-md"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSubchildquestions = (subchildquestions) => {
    if (!subchildquestions || subchildquestions.length === 0) return null;

    return (
      <div className="text-left w-full p-6 mt-1 space-y-6">
        {subchildquestions.map((subchildquestion, index) => (
          <div key={subchildquestion._id || index} className="mb-6 p-4 ">
            <div className="ml-auto text-right mb-2">
              <p className="font-semibold">[{subchildquestion.marks || 'N/A'}]</p>
            </div>
            <div className="flex justify-start">
              <p className="font-bold mr-4">
                ({['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'][index] || ''})
              </p>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subchildquestion.title || 'No title available.' }} 
              />
            </div>
            {subchildquestion.images && renderMedia(subchildquestion.images, 'image')}
            {subchildquestion.videos && renderMedia(subchildquestion.videos, 'video')}
            {subchildquestion.docs && renderMedia(subchildquestion.docs, 'pdf')}
            {subchildquestion.answer_key && (
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                  onClick={() => handleOpenModal('subchildAnswerKey', index)}
                >
                  Answer Key
                </button>
                {subchildquestion.answer_model && (
                  <button
                    className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                    onClick={() => handleOpenModal('subchildAnswerModel', index)}
                  >
                    Model Answer
                  </button>
                )}
                {subchildquestion?.markscheme && (
                  <button
                    className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                    onClick={() => handleOpenModal('subchildMarkScheme', index)}
                  >
                    Mark Scheme
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSubquestions = (subquestions) => {
    if (!subquestions || subquestions.length === 0) return null;

    return (
      <div className="text-left w-full p-6 space-y-6">
        {subquestions.map((subquestion, index) => {
          const options = subquestion.mcq_options
            ? [
                { label: 'A', value: subquestion.mcq_options.mcq_options_a },
                { label: 'B', value: subquestion.mcq_options.mcq_options_b },
                { label: 'C', value: subquestion.mcq_options.mcq_options_c },
                { label: 'D', value: subquestion.mcq_options.mcq_options_d },
              ]
            : [];

          return (
            <div key={index} className="mb-6 p-4 ">
              <div className="ml-auto text-right mb-2">
                <p className="font-semibold">[{subquestion.marks || 'N/A'}]</p>
              </div>
              <div className="flex justify-start">
                <p className="font-bold mr-4">
                  ({String.fromCharCode(97 + index)})
                </p>
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: subquestion.title || 'No title available.' }} 
                />
              </div>
              <div>
                {subquestion.images && renderMedia(subquestion.images, 'image')}
                {subquestion.videos && renderMedia(subquestion.videos, 'video')}
                {subquestion.docs && renderMedia(subquestion.docs, 'pdf')}

                {options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg border ${
                          option.label === subquestion.mcq_options.correct_answer
                            ? 'bg-green-100 border-green-300'
                            : 'bg-white'
                        }`}
                      >
                        <p className="font-medium">
                          {option.label}: <span dangerouslySetInnerHTML={{ __html: option.value }} />
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {subquestion.answer_key && (
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                      onClick={() => handleOpenModal('subAnswerKey', index)}
                    >
                      Answer Key
                    </button>
                    {subquestion.answer_model && (
                      <button
                        className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                        onClick={() => handleOpenModal('subAnswerModel', index)}
                      >
                        Model Answer
                      </button>
                    )}
                    {subquestion.markscheme && (
                      <button
                        className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                        onClick={() => handleOpenModal('subMarkScheme', index)}
                      >
                        Mark Scheme
                      </button>
                    )}
                  </div>
                )}

                {subquestion.subchildquestions && renderSubchildquestions(subquestion.subchildquestions)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal container */}
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10 transform transition-all">
          {/* Modal header */}
          <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
            <h3 className="text-xl font-semibold text-gray-800">Question Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <CgClose className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader/>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center py-8">{error}</p>
            ) : (
              <>
                <div className="mb-6 p-6 border rounded-lg">
                  <div className="text-left mb-4">
                    <p className="text-lg font-semibold">
                      <span className="mr-4">1.</span>
                      Maximum Marks: <span className="font-bold">[{savedData1?.questions?.marks || 'N/A'}]</span>
                    </p>
                  </div>
                  <div className="prose max-w-none text-xl font-bold mb-4">
                    <div dangerouslySetInnerHTML={{ __html: savedData1?.questions?.question_title || 'No Title' }} />
                  </div>
                  
                  {savedData1?.questions?.numberOfLine &&
                    [...Array(savedData1.questions.numberOfLines)].map((_, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="border-b border-dashed border-gray-300 mb-2 h-5"
                      ></div>
                    ))
                  }
                  
                  {savedData1?.questions?.images && renderMedia(savedData1.questions.images, 'image')}
                  {savedData1?.questions?.videos && renderMedia(savedData1.questions.videos, 'video')}
                  {savedData1?.questions?.docs && renderMedia(savedData1.questions.docs, 'pdf')}
                  {savedData1?.questions?.subquestions && renderSubquestions(savedData1.questions.subquestions)}
                </div>
                
                <div className="mt-6 flex justify-end gap-4">
                  {savedData1?.questions?.answer_key && (
                    <button
                      className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                      onClick={() => handleOpenModal1('answerKey')}
                    >
                      Answer Key
                    </button>
                  )}
                  {savedData1?.questions?.answer_model && (
                    <button
                      className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                      onClick={() => handleOpenModal1('answerModel')}
                    >
                      Model Answer
                    </button>
                  )}
                  {savedData1?.questions?.markscheme && (
                    <button
                      className="bg-custom-primary text-white rounded-full px-6 py-2 hover:bg-blue-800 transition-colors"
                      onClick={() => handleOpenModal1('markScheme')}
                    >
                      Mark Scheme
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Answer Key Modal */}
      {openModal1 === 'answerKey' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
                <h3 className="text-xl font-semibold text-gray-800">Answer Key</h3>
                <button
                  onClick={handleCloseModal1}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CgClose className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: savedData1?.questions?.answer_key?.description || 'No description available.' }} />
                {savedData1?.questions?.answer_key?.images && renderMedia(savedData1.questions.answer_key.images, 'image')}
                {savedData1?.questions?.answer_key?.videos && renderMedia(savedData1.questions.answer_key.videos, 'video')}
                {savedData1?.questions?.answer_key?.docs && (
                  <div className="w-full">
                    {renderMedia(savedData1.questions.answer_key.docs, 'pdf')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Answer Modal */}
      {openModal1 === 'answerModel' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
                <h3 className="text-xl font-semibold text-gray-800">Model Answer</h3>
                <button
                  onClick={handleCloseModal1}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CgClose className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: savedData1?.questions?.answer_model?.description || 'No description available.' }} />
                {savedData1?.questions?.answer_model?.images && renderMedia(savedData1.questions.answer_model.images, 'image')}
                {savedData1?.questions?.answer_model?.videos && renderMedia(savedData1.questions.answer_model.videos, 'video')}
                {savedData1?.questions?.answer_model?.docs && (
                  <div className="w-full">
                    {renderMedia(savedData1.questions.answer_model.docs, 'pdf')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark Scheme Modal */}
      {openModal1 === 'markScheme' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
                <h3 className="text-xl font-semibold text-gray-800">Mark Scheme</h3>
                <button
                  onClick={handleCloseModal1}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <CgClose className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: savedData1?.questions?.markscheme?.description || 'No description available.' }} />
                {savedData1?.questions?.markscheme?.images && renderMedia(savedData1.questions.markscheme.images, 'image')}
                {savedData1?.questions?.markscheme?.videos && renderMedia(savedData1.questions.markscheme.videos, 'video')}
                {savedData1?.questions?.markscheme?.docs && renderMedia(savedData1.questions.markscheme.docs, 'pdf')}
                <div className="ml-auto text-left mt-4">
                  <p className="font-semibold">Maximum Marks: <span className="font-bold">[{savedData1?.questions?.marks || 'N/A'}]</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Answer Key Modal */}
{openModal1 === 'answerKey' && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal1}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
          <h3 className="text-xl font-semibold text-gray-800">Answer Key</h3>
          <button
            onClick={handleCloseModal1}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CgClose className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: savedData1?.questions?.answer_key?.description || 'No description available.' }} 
          />
          {savedData1?.questions?.answer_key?.images && renderMedia(savedData1.questions.answer_key.images, 'image')}
          {savedData1?.questions?.answer_key?.videos && renderMedia(savedData1.questions.answer_key.videos, 'video')}
          {savedData1?.questions?.answer_key?.docs && (
            <div className="w-full">
              {renderMedia(savedData1.questions.answer_key.docs, 'pdf')}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

{/* Model Answer Modal */}
{openModal1 === 'answerModel' && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal1}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
          <h3 className="text-xl font-semibold text-gray-800">Model Answer</h3>
          <button
            onClick={handleCloseModal1}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CgClose className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: savedData1?.questions?.answer_model?.description || 'No description available.' }} 
          />
          {savedData1?.questions?.answer_model?.images && renderMedia(savedData1.questions.answer_model.images, 'image')}
          {savedData1?.questions?.answer_model?.videos && renderMedia(savedData1.questions.answer_model.videos, 'video')}
          {savedData1?.questions?.answer_model?.docs && (
            <div className="w-full">
              {renderMedia(savedData1.questions.answer_model.docs, 'pdf')}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

{/* Mark Scheme Modal */}
{openModal1 === 'markScheme' && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal1}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
          <h3 className="text-xl font-semibold text-gray-800">Mark Scheme</h3>
          <button
            onClick={handleCloseModal1}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <CgClose className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ __html: savedData1?.questions?.markscheme?.description || 'No description available.' }} 
          />
          {savedData1?.questions?.markscheme?.images && renderMedia(savedData1.questions.markscheme.images, 'image')}
          {savedData1?.questions?.markscheme?.videos && renderMedia(savedData1.questions.markscheme.videos, 'video')}
          {savedData1?.questions?.markscheme?.docs && renderMedia(savedData1.questions.markscheme.docs, 'pdf')}
          <div className="ml-auto text-left mt-4">
            <p className="font-semibold">Maximum Marks: <span className="font-bold">[{savedData1?.questions?.marks || 'N/A'}]</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Subquestion Modals */}
{savedData1?.questions?.subquestions?.map((subquestion, index) => (
  <React.Fragment key={index}>
    {/* Subquestion Answer Key */}
    {openModal === `subAnswerKey-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subquestion Answer Key</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subquestion.answer_key?.description || 'No description available.' }} 
              />
              {subquestion.answer_key?.images && renderMedia(subquestion.answer_key.images, 'image')}
              {subquestion.answer_key?.videos && renderMedia(subquestion.answer_key.videos, 'video')}
              {subquestion.answer_key?.docs && renderMedia(subquestion.answer_key.docs, 'pdf')}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Subquestion Model Answer */}
    {openModal === `subAnswerModel-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subquestion Model Answer</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subquestion.answer_model?.description || 'No description available.' }} 
              />
              {subquestion.answer_model?.images && renderMedia(subquestion.answer_model.images, 'image')}
              {subquestion.answer_model?.videos && renderMedia(subquestion.answer_model.videos, 'video')}
              {subquestion.answer_model?.docs && renderMedia(subquestion.answer_model.docs, 'pdf')}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Subquestion Mark Scheme */}
    {openModal === `subMarkScheme-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subquestion Mark Scheme</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subquestion.markscheme?.description || 'No description available.' }} 
              />
              {subquestion.markscheme?.images && renderMedia(subquestion.markscheme.images, 'image')}
              {subquestion.markscheme?.videos && renderMedia(subquestion.markscheme.videos, 'video')}
              {subquestion.markscheme?.docs && renderMedia(subquestion.markscheme.docs, 'pdf')}
              <div className="ml-auto text-left mt-4">
                <p className="font-semibold">Marks: <span className="font-bold">[{subquestion.marks || 'N/A'}]</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
))}

{/* Subchildquestion Modals */}
{savedData1?.questions?.subquestions?.flatMap(subquestion => subquestion.subchildquestions).map((subchildquestion, index) => (
  <React.Fragment key={index}>
    {/* Subchildquestion Answer Key */}
    {openModal === `subchildAnswerKey-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subchildquestion Answer Key</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key?.description || 'No description available.' }} 
              />
              {subchildquestion.answer_key?.images && renderMedia(subchildquestion.answer_key.images, 'image')}
              {subchildquestion.answer_key?.videos && renderMedia(subchildquestion.answer_key.videos, 'video')}
              {subchildquestion.answer_key?.docs && renderMedia(subchildquestion.answer_key.docs, 'pdf')}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Subchildquestion Model Answer */}
    {openModal === `subchildAnswerModel-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subchildquestion Model Answer</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subchildquestion.answer_model?.description || 'No description available.' }} 
              />
              {subchildquestion.answer_model?.images && renderMedia(subchildquestion.answer_model.images, 'image')}
              {subchildquestion.answer_model?.videos && renderMedia(subchildquestion.answer_model.videos, 'video')}
              {subchildquestion.answer_model?.docs && renderMedia(subchildquestion.answer_model.docs, 'pdf')}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Subchildquestion Mark Scheme */}
    {openModal === `subchildMarkScheme-${index}` && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleCloseModal}></div>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative z-10">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-20">
              <h3 className="text-xl font-semibold text-gray-800">Subchildquestion Mark Scheme</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CgClose className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 w-full overflow-x-hidden">
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme?.description || 'No description available.' }} 
              />
              {subchildquestion.markscheme?.images && (
                <div className="w-full">
                  {renderMedia(subchildquestion.markscheme.images, 'image')}
                </div>
              )}
              {subchildquestion.markscheme?.videos && (
                <div className="w-full">
                  {renderMedia(subchildquestion.markscheme.videos, 'video')}
                </div>
              )}
              {subchildquestion.markscheme?.docs && (
                <div className="w-full">
                  {renderMedia(subchildquestion.markscheme.docs, 'pdf')}
                </div>
              )}
              <div className="ml-auto text-left mt-4">
                <p className="font-semibold">Marks: <span className="font-bold">[{subchildquestion.marks || 'N/A'}]</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
))}
    </div>
  );
};

export default FinalPreview;