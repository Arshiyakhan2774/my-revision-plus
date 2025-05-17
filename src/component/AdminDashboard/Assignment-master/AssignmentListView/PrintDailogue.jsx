import { useState, useEffect } from 'react';
import { AiOutlinePrinter } from 'react-icons/ai';

import qrCode from "../../../../assets/qr-test.png";
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from '../../Quetsion-master/Create-Question/FinalPreviwe';
import { ImPrinter } from 'react-icons/im';
import { RiCloseLine } from 'react-icons/ri';
import { Api } from '../../../Api/Api';

const PrintDailogue = ({ open, onClose, selectedAssignmentId }) => {
  const [questions, setQuestions] = useState([]);
  const [coverDetails, setCoverDetails] = useState(null);
  const [printOptions, setPrintOptions] = useState({
    showQuestion: true,
    showAnswerKey: true,
    showMarkScheme: true,
    coverLetter: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);  
      try {
        const response = await Api.get(`/assignment/assign/${selectedAssignmentId}`);
        const data = response.data;
        
        if (data.status === 'success') {
          setCoverDetails(data.data?.questions?.cover_details || null);
          setQuestions(data.data?.questions?.question_id || []);
        } else {
          setCoverDetails(null);
          setQuestions([]);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
  
    if (selectedAssignmentId) {
      fetchQuestions();
    }
  }, [selectedAssignmentId]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Wiris) {
        window.Wiris.config.saveMode = 'xml';
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [questions]);

  const handleOptionChange = (event) => {
    const { name, checked } = event.target;
    setPrintOptions(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const toRoman = (num) => {
    const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    return romanMap[num - 1] || num;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to use the print feature.');
      return;
    }

    let printContent = `
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            body { font-family: Calibri, sans-serif; font-size: 16px; }
            h2, h3, h4 { font-size: 17px; }
            .no-break { page-break-inside: avoid; }
            .page-break { page-break-before: always; }
            .marks { display: flex; justify-content: end; font-weight: bold; }
            img { max-width: 100%; height: auto; }
            .details-container { border: 1px solid black; padding: 15px; margin-top: 20px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .details-grid p { margin: 0; padding-bottom: 6px; font-weight: bold; font-size: 17px; }
            .details-grid input { width: 100%; border: none; border-bottom: 1px solid black; margin-top: 5px; padding: 5px 0; font-size: 26px; }
            .cover-letter-container { height: 94vh; padding: 30px; }
            .name-input { width: 300px; font-size: 16px; padding: 8px; box-sizing: border-box; }
          </style>
        </head>
        <body>
    `;

    if (printOptions.coverLetter) {
      printContent += `   
        <div>
          <div class="page-break details-container cover-letter-container">
            <nav style="background-color: #f8f9fa; display: flex; flex-direction: row; border-bottom: 10px solid #002b4f; padding: 5px; align-items: center;">
              <span class="pro-sidebar-logo ml-8" style="display: flex; align-items: center;">
                <div>M</div>
                <h5 style="color: black; margin-left: 8px;">My Revision<sup style="color: blue;">+</sup></h5>
              </span>
            </nav>
            <div style="margin-top: 20px;">
              <p>Name: <input type="text" class="name-input" placeholder="" /></p>
              <div class="details-grid" style="border: 1px solid black; padding:10px">
                <p>Level: ${coverDetails?.level || 'N/A'}</p>
                <p>Grade: ${coverDetails?.grade || 'N/A'}</p>
                <p>Subject: ${coverDetails?.subjectName || 'N/A'}</p>
                <p>Date: ${coverDetails?.date || 'N/A'}</p>
                <p>Duration: ${coverDetails?.duration || 'N/A'}</p>
                <p>Component: ${coverDetails?.component || 'N/A'}</p>
                <p>Total Marks: ${coverDetails?.totalMarks || 'N/A'}</p>
                <p>Topic Name: ${coverDetails?.topicName || 'N/A'}</p>
                <p>Test Type: ${coverDetails?.testType || 'N/A'}</p>
              </div>
            </div>
            <div style="margin-top: 20px;">
              <h3>Cover Letter Instructions</h3>
              <p>• Write your name in the boxes above.<br>
              <p>• Do not open this examination paper until instructed to do so.</p>
              <p>• A graphic display calculator is required for this paper.</p>
              <p>• Answer all questions.</p>
              <p>• Unless otherwise stated in the questions, all numerical answers should be given exactly or correct to three significant figures.</p>
              <p>• A clean copy of the mathematics: Application and Interpretation formula booklet is required for this paper.</p>
              <p>• The maximum marks for this examination paper is [110 marks].</p>
              <div style="text-align: center; margin-top:5px;">
                <img src="${qrCode}" id="qrCodeImage" alt="QR Code" width="128" height="128" />
              </div>
              <p style="text-align: center;">Please scan the above code and give a valuable Google review</p>
              <div style="display: flex; justify-content: space-between; margin: 10px; margin-bottom: 15px">
                <div>
                  <p>Just Call or WhatsApp on:</p>
                  <p>9971017569 | 9312411928</p>
                </div>
                <div>
                  <p>For more info, visit:</p>
                  <p>https://www.ibglobalacademy.org/</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }  

    if (printOptions.showQuestion) {
      questions.forEach((question, index) => {
        printContent += `
          <div>
            <div style="display: flex; align-items: left; gap: 5px;">
              <span><h2>(${index + 1})</h2></span>
              <span style="margin-top:15px">Maximum Marks:[${question.marks}]</span>
            </div>
            <div style="margin-top:-15px">${question.question_title}</div>
            ${renderMediaForPrint(question.images, 'image')}
            ${renderMediaForPrint(question.docs, 'pdf')}
            <br style="margin-top: 10px; margin-bottom: 10px;"/> 
        `;
   
        if (question.subquestions?.length > 0) {
          question.subquestions.forEach((subquestion, subIndex) => {
            printContent += `
              <div style="margin-left: 20px; margin-top: -10px;">
                <div class="marks">
                  <span> [${subquestion.marks}] </span>
                </div>
                <div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 1px; margin-top: -15px;">
                  <span style="margin-right:2px;"><p>(${String.fromCharCode(97 + subIndex)})</p></span>
                  <span style="margin-top: -2px">${subquestion.title}</span>
                </div>
                ${renderMediaForPrint(subquestion.images, 'image')}
                ${renderMediaForPrint(subquestion.docs, 'pdf')}
                <br style="margin-top: 10px; margin-bottom: 10px;"/> 
              </div>
            `;

            if (subquestion.mcq_options) {
              const options = [
                { label: 'A', value: subquestion.mcq_options.mcq_options_a },
                { label: 'B', value: subquestion.mcq_options.mcq_options_b },
                { label: 'C', value: subquestion.mcq_options.mcq_options_c },
                { label: 'D', value: subquestion.mcq_options.mcq_options_d },
              ];
        
              printContent += `
                <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">
                  ${options.map((option, optIndex) => `
                    <div
                      style="
                        background-color: ${option.label === subquestion.mcq_options.correct_answer ? 'lightgreen' : 'white'};
                        border: 1px solid grey;
                        border-radius: 8px;
                        padding: 10px;
                        margin: 5px;
                        width: calc(50% - 10px);
                      "
                    >
                      <span>${option.label}: ${option.value}</span>
                    </div>
                  `).join('')}
                </div>
              `;
            }

            if (subquestion.subchildquestions?.length > 0) {
              subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                printContent += `
                  <div style="margin-left: 40px; margin-top: -35px;">
                    <div class="marks">
                      <span> [${Number(subchildquestion.marks) || 'N/A'}]</span>
                    </div>
                    <div style="display: flex; align-items: flex-start; gap: 5px; margin-top: -5px;">
                      <span style="margin-right: 5px;"><p>(${toRoman(subChildIndex + 1)})</p></span>
                      <span>${subchildquestion.title}</span>
                    </div>
                    ${renderMediaForPrint(subchildquestion.images, 'image')}
                    ${renderMediaForPrint(subchildquestion.docs, 'pdf')}
                    <br style="margin-top: 10px; margin-bottom: 10px;"/>
                  </div>
                `;
              });
            }
          });
        }
        printContent += `</div>`; 
      });
    }

    if (printOptions.showMarkScheme) {
      printContent += `<div class="no-break"><h2>Mark Scheme</h2>`;
      questions.forEach((question, index) => {
        if (question.markscheme) {
          printContent += `
            <div>
              <div>Question (${index + 1}) Mark Scheme:</div>
              <div>${question.markscheme.description || ''}</div>
              ${renderMediaForPrint(question.markscheme.images, 'image')}
              ${renderMediaForPrint(question.markscheme.docs, 'pdf')}
              <br style="margin-top: 10px; margin-bottom: 10px;"/> 
            </div>
          `;
        }
  
        if (question.subquestions) {
          question.subquestions.forEach((subquestion, subIndex) => {
            if (subquestion.markscheme) {
              printContent += `
                <div style="margin-left: 20px;">
                  <div>(${String.fromCharCode(97 + subIndex)}) Mark Scheme:</div>
                  <p>${subquestion.markscheme.description || ''}</p>
                  ${renderMediaForPrint(subquestion.markscheme.images, 'image')}
                  ${renderMediaForPrint(subquestion.markscheme.docs, 'pdf')}
                  <br style="margin-top: 10px; margin-bottom: 10px;"/> 
                </div>
              `;
            }
  
            if (subquestion.subchildquestions) {
              subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                if (subchildquestion.markscheme) {
                  printContent += `
                    <div style="margin-left: 40px;">
                      <div>(${toRoman(subChildIndex + 1)}) Mark Scheme: ${subchildquestion.markscheme.description || ''}</div>
                      ${renderMediaForPrint(subchildquestion.markscheme.images, 'image')}
                      ${renderMediaForPrint(subchildquestion.markscheme.docs, 'pdf')}
                      <br style="margin-top: 10px; margin-bottom: 10px;"/>
                    </div>
                  `;
                }
              });
            }
          });
        }
      });
      printContent += `</div>`; 
    }
    
    if (printOptions.showAnswerKey) {
      printContent += `<div class="no-break"><h2>Answer Key</h2>`;
      questions.forEach((question, index) => {
        printContent += `
            <div>
              <div>Question (${index + 1}) Mark Scheme:</div>
              <div>${question.answer_key?.description || ''}</div>
              ${renderMediaForPrint(question.answer_key?.images, 'image')}
              ${renderMediaForPrint(question.answer_key?.docs, 'pdf')}
              <br style="margin-top: 10px; margin-bottom: 10px;"/>
            </div>
        `;

        if (question.subquestions) {
          question.subquestions.forEach((subquestion, subIndex) => {
            if (subquestion.answer_key) {
              printContent += `
                <div style="margin-left: 20px;">
                  <div>(${String.fromCharCode(97 + subIndex)}) Answer Key:</div>
                  <div>${subquestion.answer_key.description || ''}</div>
                  ${renderMediaForPrint(subquestion.answer_key.images, 'image')}
                  ${renderMediaForPrint(subquestion.answer_key.docs, 'pdf')}
                  <br style="margin-top: 10px; margin-bottom: 10px;"/>
                </div>
              `;
            }
        
            if (subquestion.subchildquestions) {
              subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                if (subchildquestion.answer_key) {
                  printContent += `
                    <div style="margin-left: 40px;">
                      <div>(${toRoman(subChildIndex + 1)}) Answer Key:</div>
                      <div>${subchildquestion.answer_key.description || ''}</div>
                      ${renderMediaForPrint(subchildquestion.answer_key.images, 'image')}
                      ${renderMediaForPrint(subchildquestion.answer_key.docs, 'pdf')}
                      <br style="margin-top: 10px; margin-bottom: 10px;"/>
                    </div>
                  `;
                }
              });
            }
          });
        }
      });
      printContent += `</div>`;
    }

    printContent += `
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Add Wiris script to print window
    const wirisScript = printWindow.document.createElement('script');
    wirisScript.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    wirisScript.async = true;
    
    const initiatePrint = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 2000);
    };

    wirisScript.onload = initiatePrint;
    printWindow.document.head.appendChild(wirisScript);

    // Fallback in case script doesn't load
    setTimeout(initiatePrint, 3000);
  };

  const renderMediaForPrint = (mediaArray, type) => {
    if (!mediaArray || mediaArray.length === 0) return '';
  
    return mediaArray.map((media, index) => {
      const mediaUrl = `${API_URL_Images}${media}`;
      if (type === 'image') {
        return `<img src="${mediaUrl}" alt="Image ${index + 1}" style="max-width: 100%; height: auto;" />`;
      } else if (type === 'pdf') {
        return `
          <div>
            <embed src="${mediaUrl}" type="application/pdf" width="100%" height="600px" />
            <br />
            <a href="${mediaUrl}" download="document.pdf" style="display: inline-block; margin-top: 10px; text-decoration: none; color: blue;">
              Download PDF
            </a>
          </div>
        `;
      }
      return '';
    }).join('');
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center bg-custom-primary p-4 rounded-t-lg">
          <div className="flex items-center">
            <ImPrinter className="text-white text-2xl mr-2" />
            <h2 className="text-white text-xl font-semibold">Print</h2>
          </div>
          <button onClick={onClose} className="text-white p-1">
            <RiCloseLine size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="ml-5 mt-5 p-2 bg-white">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.showQuestion}
                onChange={handleOptionChange}
                name="showQuestion"
              />
              <span className="ml-2">Question</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.showAnswerKey}
                onChange={handleOptionChange}
                name="showAnswerKey"
              />
              <span className="ml-2">Answer Key</span>
            </label>
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.showMarkScheme}
                onChange={handleOptionChange}
                name="showMarkScheme"
              />
              <span className="ml-2">Mark Scheme</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.coverLetter}
                onChange={handleOptionChange}
                name="coverLetter"
              />
              <span className="ml-2">Cover Page</span>
            </label>
          </div>

          <div className="mt-5">
            {loading ? (
              <p>Loading questions...</p>
            ) : (
              <>
                {printOptions.coverLetter && (
                  <div className="border border-gray-300 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-bold mb-2">Cover Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <p><span className="font-bold">Level:</span> {coverDetails?.level || 'N/A'}</p>
                      <p><span className="font-bold">Grade:</span> {coverDetails?.grade || 'N/A'}</p>
                      <p><span className="font-bold">Subject:</span> {coverDetails?.subjectName || 'N/A'}</p>
                      <p><span className="font-bold">Date:</span> {coverDetails?.date || 'N/A'}</p>
                      <p><span className="font-bold">Duration:</span> {coverDetails?.duration || 'N/A'}</p>
                      <p><span className="font-bold">Component:</span> {coverDetails?.component || 'N/A'}</p>
                      <p><span className="font-bold">Total Marks:</span> {coverDetails?.totalMarks || 'N/A'}</p>
                      <p><span className="font-bold">Topic Name:</span> {coverDetails?.topicName || 'N/A'}</p>
                      <p><span className="font-bold">Test Type:</span> {coverDetails?.testType || 'N/A'}</p>
                    </div>
                  </div>
                )}

                {questions.map((question, index) => (
                  <div key={question.id} className="mt-5">
                    <div className="bg-white shadow-md rounded-lg p-4">
                      {printOptions.showQuestion && (
                        <>
                          <h2 className="text-xl font-bold mb-2">Question {index + 1}</h2>
                          <div className="flex items-start">
                            <span className="font-bold mr-2">({index + 1})</span>
                            <span className="ml-4">Maximum Marks: <strong>[{question.marks}]</strong></span>
                          </div>
                          <div className="mt-1 ml-8" dangerouslySetInnerHTML={{ __html: question.question_title }} />
                          {renderMedia(question.images, 'image')}
                          {renderMedia(question.videos, 'video')}
                          {renderMedia(question.docs, 'pdf')}
                        </>
                      )}

                      {printOptions.showAnswerKey && question.answer_key && (
                        <>
                          <h3 className="ml-4 mt-4">Answer Key</h3>
                          {question.answer_key.description && (
                            <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.answer_key.description }} />
                          )}
                          {renderMedia(question.answer_key.images, 'image')}
                          {renderMedia(question.answer_key.videos, 'video')}
                          {renderMedia(question.answer_key.docs, 'pdf')}
                        </>
                      )}

                      {printOptions.showAnswerKey && question.answer_model && (
                        <>
                          <h3 className="ml-4 mt-4">Answer Model</h3>
                          {question.answer_model.description && (
                            <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.answer_model.description }} />
                          )}
                          {renderMedia(question.answer_model.images, 'image')}
                          {renderMedia(question.answer_model.videos, 'video')}
                          {renderMedia(question.answer_model.docs, 'pdf')}
                        </>
                      )}

                      {printOptions.showMarkScheme && question.markscheme && (
                        <>
                          <h3 className="ml-4 mt-4">Mark Scheme</h3>
                          {question.markscheme.description && (
                            <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.markscheme.description }} />
                          )}
                          {renderMedia(question.markscheme.images, 'image')}
                          {renderMedia(question.markscheme.videos, 'video')}
                          {renderMedia(question.markscheme.docs, 'pdf')}
                        </>
                      )}

                      {printOptions.showQuestion && question.subquestions?.length > 0 && (
                        <div className="mt-4">
                          {question.subquestions.map((subquestion, subIndex) => (
                            <div key={subquestion._id} className="mb-4 font-calibri text-base">
                              {printOptions.showQuestion && (
                                <>
                                  <div className="flex items-start">
                                    <span className="font-bold mr-2">({String.fromCharCode(97 + subIndex)})</span>
                                    <div className="ml-auto">
                                      <strong>[{subquestion.marks}]</strong>
                                    </div>
                                  </div>
                                  <div className="ml-4" dangerouslySetInnerHTML={{ __html: subquestion.title }} />
                                  {renderMedia(subquestion.images, 'image')}
                                  {renderMedia(subquestion.videos, 'video')}
                                  {renderMedia(subquestion.docs, 'pdf')}
                                </>
                              )}

                              {printOptions.showAnswerKey && subquestion.answer_key && (
                                <>
                                  <h4 className="ml-6 mt-2">Answer Key:</h4>
                                  {subquestion.answer_key.description && (
                                    <div className="ml-10 text-[16px]" dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }} />
                                  )}
                                  {renderMedia(subquestion.answer_key.images, 'image')}
                                  {renderMedia(subquestion.answer_key.videos, 'video')}
                                  {renderMedia(subquestion.answer_key.docs, 'pdf')}
                                </>
                              )}

                              {printOptions.showAnswerKey && subquestion.answer_model && (
                                <>
                                  <h4 className="ml-6 mt-2">Answer Model:</h4>
                                  {subquestion.answer_model.description && (
                                    <div className="ml-10 text-[16px]" dangerouslySetInnerHTML={{ __html: subquestion.answer_model.description }} />
                                  )}
                                  {renderMedia(subquestion.answer_model.images, 'image')}
                                  {renderMedia(subquestion.answer_model.videos, 'video')}
                                  {renderMedia(subquestion.answer_model.docs, 'pdf')}
                                </>
                              )}

                              {printOptions.showMarkScheme && subquestion.markscheme && (
                                <>
                                  <h4 className="ml-6 mt-2">Mark Scheme:</h4>
                                  {subquestion.markscheme.description && (
                                    <div className="ml-10 text-[16px]" dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }} />
                                  )}
                                  {renderMedia(subquestion.markscheme.images, 'image')}
                                  {renderMedia(subquestion.markscheme.videos, 'video')}
                                  {renderMedia(subquestion.markscheme.docs, 'pdf')}
                                </>
                              )}

                              {subquestion.subchildquestions?.length > 0 && (
                                <div className="ml-6">
                                  {subquestion.subchildquestions.map((subchildquestion, subChildIndex) => (
                                    <div key={subchildquestion._id} className="mb-4">
                                      {printOptions.showQuestion && (
                                        <>
                                          <div className="ml-4">({toRoman(subChildIndex + 1)})</div>
                                          <div className="flex justify-end">
                                            <strong>[{subchildquestion.marks || 'N/A'}]</strong>
                                          </div>
                                          <div className="ml-6" dangerouslySetInnerHTML={{ __html: subchildquestion.title }} />
                                          {renderMedia(subchildquestion.images, 'image')}
                                          {renderMedia(subchildquestion.videos, 'video')}
                                          {renderMedia(subchildquestion.docs, 'pdf')}
                                        </>
                                      )}

                                      {printOptions.showAnswerKey && subchildquestion.answer_key && (
                                        <>
                                          <h5 className="ml-8 mt-2">Answer Key:</h5>
                                          {subchildquestion.answer_key.description && (
                                            <div className="ml-12 text-[16px]" dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }} />
                                          )}
                                          {renderMedia(subchildquestion.answer_key.images, 'image')}
                                          {renderMedia(subchildquestion.answer_key.videos, 'video')}
                                          {renderMedia(subchildquestion.answer_key.docs, 'pdf')}
                                        </>
                                      )}

                                      {printOptions.showAnswerKey && subchildquestion.answer_model && (
                                        <>
                                          <h5 className="ml-8 mt-2">Answer Model:</h5>
                                          {subchildquestion.answer_model.description && (
                                            <div className="ml-12 text-[16px]" dangerouslySetInnerHTML={{ __html: subchildquestion.answer_model.description }} />
                                          )}
                                          {renderMedia(subchildquestion.answer_model.images, 'image')}
                                          {renderMedia(subchildquestion.answer_model.videos, 'video')}
                                          {renderMedia(subchildquestion.answer_model.docs, 'pdf')}
                                        </>
                                      )}

                                      {printOptions.showMarkScheme && subchildquestion.markscheme && (
                                        <>
                                          <h5 className="ml-8 mt-2">Mark Scheme:</h5>
                                          {subchildquestion.markscheme.description && (
                                            <div className="ml-12 text-[16px]" dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }} />
                                          )}
                                          {renderMedia(subchildquestion.markscheme.images, 'image')}
                                          {renderMedia(subchildquestion.markscheme.videos, 'video')}
                                          {renderMedia(subchildquestion.markscheme.docs, 'pdf')}
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
              true ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
            }`}
          >
            <AiOutlinePrinter className="mr-2" />
            Print
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintDailogue;