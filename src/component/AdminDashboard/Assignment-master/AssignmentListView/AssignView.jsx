import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { MdAssignmentAdd, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Api } from '../../../Api/Api';
import CoverDetails from './CoverDetails';


const AssignView = ({ openDialog, handleClose, selectedAssignmentId }) => {
  const [questions, setQuestions] = useState([]);
  const [coverDetails, setCoverDetails] = useState(null);
  const printRef = useRef();
  const API_URL_Images = 'https://myrevisionplus.com/api/img/question/images/';
  const API_URL_PDF = 'https://myrevisionplus.com/api/img/question/pdf/';
  const API_URL_Videos = 'https://myrevisionplus.com/api/img/question/videos/';

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
  }, [questions, openDialog]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await Api.get(`/assignment/assign/${selectedAssignmentId}`);
        const data = response.data;
        console.log('API Response:', data);

        if (data.status === 'success') {
          setCoverDetails(data.data?.questions?.cover_details || null);
          setQuestions(data.data?.questions?.question_id || []);
        } else {
          setCoverDetails(null);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (selectedAssignmentId) fetchQuestions();
  }, [selectedAssignmentId]);

  const toRoman = (num) => {
    const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    return romanMap[num - 1] || num;
  };

  const handleExport = () => {
    const content = printRef.current.innerHTML;
    const blob = htmlDocx.asBlob(`<!DOCTYPE html><html><body>${content}</body></html>`);
    saveAs(blob, 'assignment.docx');
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
                alt={`Image ${index}`}
                className="w-full h-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'fallback-image-url.jpg';
                }}
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
                className="w-full h-[800px] border-none"
                title={`PDF ${index + 1}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!openDialog && 'hidden'}`}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-[90vw] h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="bg-[#1a73e8] p-2 rounded-full mr-2">
              <MdAssignmentAdd className="text-white text-2xl" />
            </div>
            <h2 className="text-[#1a73e8] text-3xl font-bold">Assignment View</h2>
          </div>

          <div className="p-4" ref={printRef}>
            {coverDetails ? (
              <CoverDetails coverDetails={coverDetails} />
            ) : (
              <p className="text-center">No cover details available.</p>
            )}

            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div
                  key={question._id}
                  className="font-calibri p-4 flex items-start justify-start mb-6"
                >
                  <div className="bg-white border border-gray-300 border-l-8 border-l-gray-300 rounded-2xl flex relative w-full">
                    <div className="w-full p-4">
                      <div className="flex items-start">
                        <span className="font-bold mr-2 ml-2">({index + 1})</span>
                        <span className="ml-4">
                          Maximum Marks: <strong>[{question.marks}]</strong>
                        </span>
                      </div>
                      <div
                        className="ml-4 mt-1 w-full"
                        dangerouslySetInnerHTML={{ __html: question.question_title }}
                      />
                      {renderMedia(question.images, 'image')}
                      {renderMedia(question.videos, 'video')}
                      {renderMedia(question.docs, 'pdf')}

                      <div
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.answer_key.description }}
                      />
                      {renderMedia(question.answer_key.images, 'image')}
                      {renderMedia(question.answer_key.videos, 'video')}
                      {renderMedia(question.answer_key.docs, 'pdf')}

                      <div
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.answer_model.description }}
                      />
                      {renderMedia(question.answer_model.images, 'image')}
                      {renderMedia(question.answer_model.videos, 'video')}
                      {renderMedia(question.answer_model.docs, 'pdf')}

                      <div
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.markscheme.description }}
                      />
                      {renderMedia(question.markscheme.images, 'image')}
                      {renderMedia(question.markscheme.videos, 'video')}
                      {renderMedia(question.markscheme.docs, 'pdf')}

                      {question.subquestions?.length > 0 && (
                        <div>
                          {question.subquestions.map((subquestion, subIndex) => (
                            <div
                              key={subquestion._id}
                              className="mb-4 font-calibri text-base"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-bold mr-2 ml-2">
                                  ({String.fromCharCode(97 + subIndex)})
                                </span>
                                <span className="ml-4">
                                  <strong>[{subquestion.marks}]</strong>
                                </span>
                              </div>
                              <div className="ml-4"></div>
                              <div
                                className="ml-4"
                                dangerouslySetInnerHTML={{ __html: subquestion.title }}
                              />
                              {renderMedia(subquestion.images, 'image')}
                              {renderMedia(subquestion.videos, 'video')}
                              {renderMedia(subquestion.docs, 'pdf')}

                              {subquestion.mcq_options && (
                                <div className="flex flex-wrap mt-2">
                                  {[
                                    { label: 'A', value: subquestion.mcq_options.mcq_options_a },
                                    { label: 'B', value: subquestion.mcq_options.mcq_options_b },
                                    { label: 'C', value: subquestion.mcq_options.mcq_options_c },
                                    { label: 'D', value: subquestion.mcq_options.mcq_options_d },
                                  ].map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`border border-gray-400 rounded-lg p-2 m-1 w-[calc(50%-8px)] ${
                                        option.label === subquestion.mcq_options.correct_answer
                                          ? 'bg-green-100'
                                          : 'bg-white'
                                      }`}
                                    >
                                      <p>
                                        {option.label}: {option.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div
                                className="ml-4"
                                dangerouslySetInnerHTML={{
                                  __html: subquestion.answer_key.description,
                                }}
                              />
                              {renderMedia(subquestion.answer_key.images, 'image')}
                              {renderMedia(subquestion.answer_key.videos, 'video')}
                              {renderMedia(subquestion.answer_key.docs, 'pdf')}

                              <div
                                className="ml-4"
                                dangerouslySetInnerHTML={{
                                  __html: subquestion.answer_model.description,
                                }}
                              />
                              {renderMedia(subquestion.answer_model.images, 'image')}
                              {renderMedia(subquestion.answer_model.videos, 'video')}
                              {renderMedia(subquestion.answer_model.docs, 'pdf')}

                              <div
                                className="ml-4"
                                dangerouslySetInnerHTML={{
                                  __html: subquestion.markscheme.description,
                                }}
                              />
                              {renderMedia(subquestion.markscheme.images, 'image')}
                              {renderMedia(subquestion.markscheme.videos, 'video')}
                              {renderMedia(subquestion.markscheme.docs, 'pdf')}

                              {subquestion.subchildquestions?.length > 0 && (
                                <div>
                                  {subquestion.subchildquestions.map(
                                    (subchildquestion, subChildIndex) => (
                                      <div
                                        key={subchildquestion._id}
                                        className="mb-4 font-calibri text-base"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div className="ml-5">
                                            ({toRoman(subChildIndex + 1)})
                                          </div>
                                          <span>
                                            <strong>[{subchildquestion.marks || 'N/A'}]</strong>
                                          </span>
                                        </div>
                                        <div
                                          className="ml-5"
                                          dangerouslySetInnerHTML={{
                                            __html: subchildquestion.title,
                                          }}
                                        />
                                        {renderMedia(subchildquestion.images, 'image')}
                                        {renderMedia(subchildquestion.videos, 'video')}
                                        {renderMedia(subchildquestion.docs, 'pdf')}
                                        <div
                                          className="ml-5"
                                          dangerouslySetInnerHTML={{
                                            __html: subchildquestion.answer_key.description,
                                          }}
                                        />
                                        {renderMedia(subchildquestion.answer_key.images, 'image')}
                                        {renderMedia(subchildquestion.answer_key.videos, 'video')}
                                        {renderMedia(subchildquestion.answer_key.docs, 'pdf')}
                                        <div
                                          className="ml-5"
                                          dangerouslySetInnerHTML={{
                                            __html: subchildquestion.answer_model.description,
                                          }}
                                        />
                                        {renderMedia(subchildquestion.answer_model.images, 'image')}
                                        {renderMedia(subchildquestion.answer_model.videos, 'video')}
                                        {renderMedia(subchildquestion.answer_model.docs, 'pdf')}
                                        <div
                                          className="ml-5"
                                          dangerouslySetInnerHTML={{
                                            __html: subchildquestion.markscheme.description,
                                          }}
                                        />
                                        {renderMedia(subchildquestion.markscheme.images, 'image')}
                                        {renderMedia(subchildquestion.markscheme.videos, 'video')}
                                        {renderMedia(subchildquestion.markscheme.docs, 'pdf')}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h6 className="text-center">No Questions Available</h6>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export to Word
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignView;