
import React, { useEffect, useState } from 'react';

import { ImPrinter } from 'react-icons/im';
import { RiCloseLine } from 'react-icons/ri';
import { AiOutlinePrinter } from 'react-icons/ai';
import qrCode from "../../../assets/qr-test.png"
import IconWithTitle from '../../utilities/IconsTittle';
import CoverDetails from '../../AdminDashboard/Assignment-master/AssignmentListView/CoverDetails';
import RenderMedia from '../../AdminDashboard/Assignment-master/AssignmentListView/RenderMedia';

const toRoman = (num) => {
    const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
    return romanMap[num - 1] || num;
  }
const PrintPage = ({ open, handleClose,  assignment,coverDetails }) => {
    const [printFormat, setPrintFormat] = useState('pdf'); 
    const [loading, setLoading] = useState(true); 
    const [printOptions, setPrintOptions] = useState({
      showQuestion: true,
      showAnswerKey: true,
      showMarkScheme: true,
      coverLetter:true,
    });
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
        script.async = true;
        document.body.appendChild(script);
    
        script.onload = () => {
          console.log('Wiris script loaded.');
          if (window.Wiris) {
            window.Wiris.config.saveMode = 'xml';
          }
        };
    
        return () => {
          document.body.removeChild(script);
        };
      }, [assignment]);
    const handleOptionChange = (event) => {
        const { name, checked } = event.target;
        setPrintOptions((prevState) => ({
          ...prevState,
          [name]: checked,
        }));
      };
      const handlePrint = () => {
        console.log("handlePrint called");
      
        // Open a new print window
        const printWindow = window.open('', 'IB Global Academy');
        if (!printWindow) {
          console.error("Popup was blocked. Please allow popups and try again.");
          return;
        }
      
        // Build base HTML
        let printContent = `
          <html>
            <head>
              <title>--IB Global Academy--</title>
              <style>
                body {
                  font-family: Calibri, sans-serif;
                  font-size: 18px
                }
                h2, h3, h4 {
                  font-size: 19px;
                }
                @page { padding: 40px; }
                .no-break { page-break-inside: avoid; }
                .page-break { page-break-before: always; padding-top: 30px; }
                .question { page-break-inside: avoid; padding: 5px; }
                .marks { display: flex; justify-content: end; font-weight: bold; }
                .details-container { border: 1px solid black; padding: 5px; }
                .details-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 2px;
                }
                .details-grid p {
                  margin: 2px;
                  padding-bottom: 6px;
                  font-weight: bold;
                  font-size: 17px;
                }
                .details-grid input {
                  width: 100%;
                  border: none;
                  border-bottom: 1px solid black;
                  margin-top: 5px;
                  padding: 5px 0;
                  font-size: 30px;
                }
                .cover-letter-container { margin-top: 5px; height: 97vh; }
                .name-input { width: 90%; font-size: 16px; padding: 8px; box-sizing: border-box; }
                .print-header img { width: 100px; height: auto; }
              </style>
            </head>
            <body>
        `;
      
        // Cover letter section
        if (printOptions.coverLetter && coverDetails) {
          printContent += `
            <div class="page-break details-container cover-letter-container">
              <nav style="background-color: #f8f9fa; display: flex; flex-direction: row; border-bottom: 10px solid #002b4f; padding: 5px; align-items: center;">

                  <h5 style="color: black; margin-left: 8px;">My Revision<sup style="color: blue;">+</sup></h5>
                </span>
              </nav>
              <div>
                <p>Name: <input type="text" class="name-input" placeholder="" /></p>
                <div class="details-grid" style="border: 1px solid black;">
                  <p>Level: ${coverDetails.level || 'N/A'}</p>
                  <p>Grade: ${coverDetails.grade || 'N/A'}</p>
                  <p>Subject: ${coverDetails.subjectName || 'N/A'}</p>
                  <p>Date: ${coverDetails.date || 'N/A'}</p>
                  <p>Duration: ${coverDetails.duration || 'N/A'}</p>
                  <p>Component: ${coverDetails.component || 'N/A'}</p>
                  <p>Total Marks: ${coverDetails.totalMarks || 'N/A'}</p>
                  <p>Topic Name: ${coverDetails.topicName || 'N/A'}</p>
                  <p>Test Type: ${coverDetails.testType || 'N/A'}</p>
                </div>
              </div>
              <div>
                <h3>Cover Letter Instructions</h3>
                <p>• Write your name in the boxes above.<br>
                • Do not open this examination paper until instructed to do so.<br>
               • A graphic display calculator is required for this paper.<br>
                • Answer all questions.<br>
               • All numerical answers should be given exactly or correct to three significant figures.<br>
                • A copy of the formula booklet is required.<br>
                • Maximum marks: [110 marks].</p>
                <div style="text-align: center; margin-top:5px;">
                  <img src="${qrCode || ''}" id="qrCodeImage" alt="QR Code" width="128" height="128" />
                </div>
                <p style="text-align: center;">Please scan the above code and give a valuable Google review</p>
                <div style="display: flex; justify-content: space-between; margin: 10px;">
                  <div>
                    <p>Call/WhatsApp: 9971017569 | 9312411928</p>
                  </div>
                  <div>
                    <p>Visit: https://www.ibglobalacademy.org/</p>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          console.log("Cover letter details missing or disabled.");
        }
      
        // Render questions section
        if (printOptions.showQuestion && assignment && assignment.question_id?.length > 0) {
          assignment.question_id.forEach((question, index) => {
            printContent += `
              <div class="question" style="margin-top:-20px">
                <div style="display: flex; align-items: left; gap: 5px;">
                  <span><h2 style="font-weight: bold;">${index + 1}. </h2></span>
                  <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                    [Maximum Marks: ${question.marks || 'N/A'}]
                  </span>
                </div>
                <div style="margin-top: -25px; padding: 0 10px; margin-left:-15px">
                  ${question.question_title || '<p>No question title available.</p>'}
                </div>
                ${RenderMedia(question.images, 'image') || ''}
                ${RenderMedia(question.docs, 'pdf') || ''}
            `;
            // Render subquestions if available
            if (question.subquestions && question.subquestions.length > 0) {
              question.subquestions.forEach((subquestion, subIndex) => {
                const marks = subquestion.marks || '';
                printContent += `
                  <div style="margin-top: -10px; padding: 0 10px;">
                    <div class="marks">
                      <span> [${marks}]</span>
                    </div>
                    <div style="display: flex; margin-top: -15px;">
                      <span style="margin-right: 40px;">(${String.fromCharCode(97 + subIndex)})</span>
                      <span style="margin-left:-36px">${subquestion.title || ''}</span>
                    </div>
                    ${RenderMedia(subquestion.images, 'image') || ''}
                    ${RenderMedia(subquestion.docs, 'pdf') || ''}
                  </div>
                `
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
                  };
                if (subquestion.subchildquestions && subquestion.subchildquestions.length > 0) {
                  subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                    const marksChild = Number(subchildquestion.marks) || '';
                    printContent += `
                      <div style="margin-left: 40px; margin-top: -35px; padding: 0 10px;">
                        <div class="marks">
                          <span style="margin-top: 10px;"> [${marksChild}]</span>
                        </div>
                        <div style="display: flex; gap: 1px;">
                          <span style="margin-right: 5px;"><p>(${toRoman(subChildIndex + 1)})</p></span>
                          <span style="margin-left:-5px">${subchildquestion.title || ''}</span>
                        </div>
                        ${RenderMedia(subchildquestion.images, 'image') || ''}
                        ${RenderMedia(subchildquestion.docs, 'pdf') || ''}
                      </div>
                    `;
                  });
                }
              });
            }
            const numberOfLines = 5;
            printContent += `
              <div class="question" style="margin-top: 16px; padding: 26px; border: 1px solid #000; background-color: #f9f9f9; margin-bottom: 40px;">
                ${[...Array(parseInt(numberOfLines || 0))]
                  .map(() => `<div style="border-bottom: 1px dashed #ccc; margin-bottom: 8px; height: 20px;"></div>`)
                  .join('')}
              </div>
              </div>
            `;
          });
        } else {
          printContent += `<p>No questions available.</p>`;
        }
      
        // Render Mark Scheme section if enabled
        if (printOptions.showMarkScheme && assignment && assignment.question_id?.length > 0) {
          printContent += `<div class="page-break"><h2>Mark Scheme</h2>`;
          assignment.question_id.forEach((question, index) => {
            if (question.markscheme) {
              printContent += `
                <div>
                  <div style="display: flex; gap: 5px;">
                    <span><h2 style="font-weight: bold;">${index + 1}. </h2></span>
                    <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                      ${question.markscheme.description || ''}
                    </span>
                  </div>
                  ${RenderMedia(question.markscheme.images, 'image') || ''}
                  ${RenderMedia(question.markscheme.docs, 'pdf') || ''}
                  <br style="margin-top: 10px; margin-bottom: 10px;"/>
                </div>
              `;
            }
            if (question.subquestions) {
              question.subquestions.forEach((subquestion, subIndex) => {
                if (subquestion.markscheme) {
                  printContent += `
                    <div style="margin-left: 20px; padding: 0 10px;">
                      <div style="display: flex; gap: 5px;">
                        <span><h2 style="font-weight: bold;">${String.fromCharCode(97 + subIndex)}. </h2></span>
                        <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                          ${subquestion.markscheme.description || ''}
                        </span>
                      </div>
                      ${RenderMedia(subquestion.markscheme.images, 'image') || ''}
                      ${RenderMedia(subquestion.markscheme.docs, 'pdf') || ''}
                      <br style="margin-top: 10px; margin-bottom: 10px;"/>
                    </div>
                  `;
                }
                if (subquestion.subchildquestions) {
                  subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                    if (subchildquestion.markscheme) {
                      printContent += `
                        <div style="margin-left: 40px; padding: 0 10px;">
                          <div>
                            (${toRoman(subChildIndex + 1)}) ${subchildquestion.markscheme.description || ''}
                          </div>
                          ${RenderMedia(subchildquestion.markscheme.images, 'image') || ''}
                          ${RenderMedia(subchildquestion.markscheme.docs, 'pdf') || ''}
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
      
        // Render Answer Key section if enabled
        if (printOptions.showAnswerKey && assignment && assignment.question_id?.length > 0) {
          printContent += `<div class="page-break"><h2>Answer Key</h2>`;
          assignment.question_id.forEach((question, index) => {
            if (question.answer_key) {
              printContent += `
                <div>
                  <div style="display: flex; gap: 5px;">
                    <span><h2 style="font-weight: bold;">${index + 1}.</h2></span>
                    <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                      ${question.answer_key.description || ''}
                    </span>
                  </div>
                  ${RenderMedia(question.answer_key.images, 'image') || ''}
                  ${RenderMedia(question.answer_key.docs, 'pdf') || ''}
                  <br style="margin-top: 10px; margin-bottom: 10px;"/>
                </div>
              `;
            }
            if (question.subquestions) {
              question.subquestions.forEach((subquestion, subIndex) => {
                if (subquestion.answer_key) {
                  printContent += `
                    <div style="margin-left: 20px;">
                      <div style="display: flex; gap: 5px;">
                        <span><h2 style="font-weight: bold;">${String.fromCharCode(97 + subIndex)}.</h2></span>
                        <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                          ${subquestion.answer_key.description || ''}
                        </span>
                      </div>
                      ${RenderMedia(subquestion.answer_key.images, 'image') || ''}
                      ${RenderMedia(subquestion.answer_key.docs, 'pdf') || ''}
                      <br style="margin-top: 10px; margin-bottom: 10px;"/>
                    </div>
                  `;
                }
                if (subquestion.subchildquestions) {
                  subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                    if (subchildquestion.answer_key) {
                      printContent += `
                        <div style="margin-left: 40px;">
                          <div style="display: flex; gap: 5px;">
                            <span><h2 style="font-weight: bold;">${toRoman(subChildIndex + 1)}.</h2></span>
                            <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                              ${subchildquestion.answer_key.description || ''}
                            </span>
                          </div>
                          ${RenderMedia(subchildquestion.answer_key.images, 'image') || ''}
                          ${RenderMedia(subchildquestion.answer_key.docs, 'pdf') || ''}
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
        if (printOptions.showAnswerKey && assignment && assignment.question_id?.length > 0) {
            printContent += `<div class="page-break"><h2>Answer Key</h2>`;
            assignment.question_id.forEach((question, index) => {
              if (question.answer_model) {
                printContent += `
                  <div>
                    <div style="display: flex; gap: 5px;">
                      <span><h2 style="font-weight: bold;">${index + 1}.</h2></span>
                      <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                        ${question.answer_answer_model.description || ''}
                      </span>
                    </div>
                    ${RenderMedia(question.answer_answer_model.images, 'image') || ''}
                    ${RenderMedia(question.answer_answer_model.docs, 'pdf') || ''}
                    <br style="margin-top: 10px; margin-bottom: 10px;"/>
                  </div>
                `;
              }
              if (question.subquestions) {
                question.subquestions.forEach((subquestion, subIndex) => {
                  if (subquestion.answer_answer_model) {
                    printContent += `
                      <div style="margin-left: 20px;">
                        <div style="display: flex; gap: 5px;">
                          <span><h2 style="font-weight: bold;">${String.fromCharCode(97 + subIndex)}.</h2></span>
                          <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                            ${subquestion.answer_answer_model.description || ''}
                          </span>
                        </div>
                        ${RenderMedia(subquestion.answer_answer_model.images, 'image') || ''}
                        ${RenderMedia(subquestion.answer_answer_model.docs, 'pdf') || ''}
                        <br style="margin-top: 10px; margin-bottom: 10px;"/>
                      </div>
                    `;
                  }
                  if (subquestion.subchildquestions) {
                    subquestion.subchildquestions.forEach((subchildquestion, subChildIndex) => {
                      if (subchildquestion.answer_answer_model) {
                        printContent += `
                          <div style="margin-left: 40px;">
                            <div style="display: flex; gap: 5px;">
                              <span><h2 style="font-weight: bold;">${toRoman(subChildIndex + 1)}.</h2></span>
                              <span style="margin-top: 15px; font-weight: bold; margin-left: 15px">
                                ${subchildquestion.answer_answer_model.description || ''}
                              </span>
                            </div>
                            ${RenderMedia(subchildquestion.answer_answer_model.images, 'image') || ''}
                            ${RenderMedia(subchildquestion.answer_answer_model.docs, 'pdf') || ''}
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
        printContent += `</body></html>`;
      
        console.log("Print content generated:", printContent);
      
        // Optional: update page numbers if needed
        const updatePageNumbers = () => {
          const pages = printWindow.document.querySelectorAll(".content > .details-container");
          pages.forEach((page, index) => {
            const pageNumbers = printWindow.document.querySelectorAll(".page-number");
            pageNumbers.forEach((number) => {
              number.textContent = index + 1;
            });
          });
        };
        printWindow.document.addEventListener("DOMContentLoaded", updatePageNumbers);
      
        // Write the content to the new window and trigger print
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();
      
        // Append external script if needed (e.g., WIRIS plugins)
        const wirisScript = printWindow.document.createElement('script');
        wirisScript.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
        wirisScript.async = true;
        const initiatePrintWithDelay = () => {
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 1000);
        };
        wirisScript.onload = () => {
          initiatePrintWithDelay();
        };
        printWindow.document.head.appendChild(wirisScript);
      
        const qrCodeImage = printWindow.document.getElementById('qrCodeImage');
        if (qrCodeImage) {
          qrCodeImage.onload = () => initiatePrintWithDelay();
          qrCodeImage.onerror = () => initiatePrintWithDelay();
        } else {
          setTimeout(() => initiatePrintWithDelay(), 1000);
        }
      };
      
      
      
  return (
   
      
        <div
          className={`fixed inset-0 z-50 overflow-y-auto ${open ? 'block' : 'hidden'}`}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={handleClose}
            ></div>
    
            {/* Modal container */}
            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
              {/* Header */}
              <div className="flex justify-between items-center bg-[#00246B] p-4">
                <IconWithTitle
                  icon={ImPrinter}
                  title="Print"
                  iconColor="white"
                  backgroundColor="#00246B"
                  iconSize="30px"
                  titleColor="#FFFFFF"
                  titleFontSize="24px"
                />
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <RiCloseLine size={24} />
                </button>
              </div>
    
              {/* Content */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Print options checkboxes */}
                <div className="ml-5 mt-5 p-3 bg-white">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={printOptions.showQuestion}
                      onChange={handleOptionChange}
                      name="showQuestion"
                      className="form-checkbox h-5 w-5 text-[#00246B]"
                    />
                    <span className="ml-2">Question</span>
                  </label>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={printOptions.showAnswerKey}
                      onChange={handleOptionChange}
                      name="showAnswerKey"
                      className="form-checkbox h-5 w-5 text-[#00246B]"
                    />
                    <span className="ml-2">Answer Key</span>
                  </label>
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={printOptions.showMarkScheme}
                      onChange={handleOptionChange}
                      name="showMarkScheme"
                      className="form-checkbox h-5 w-5 text-[#00246B]"
                    />
                    <span className="ml-2">Mark Scheme</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={printOptions.coverLetter}
                      onChange={handleOptionChange}
                      name="coverLetter"
                      className="form-checkbox h-5 w-5 text-[#00246B]"
                    />
                    <span className="ml-2">Cover Page</span>
                  </label>
                </div>
    
                {/* Assignment content */}
                <div className="mt-5">
                  {printOptions.coverLetter && (
                    <CoverDetails coverDetails={coverDetails} />
                  )}
    
                  {assignment?.question_id?.length > 0 ? (
                    assignment.question_id.map((question, index) => (
                      <div key={question.id} className="mt-5 max-w-7xl mx-auto">
                        <div className="bg-white shadow-md rounded-2xl p-4 border-l-8 border-gray-300">
                          {printOptions.showQuestion && (
                            <>
                              <h3 className="text-xl font-bold mb-3">
                                <b>Question {index + 1}</b>
                              </h3>
                              <span className="mr-2 ml-2 font-bold">
                                {`(${index + 1})`}
                              </span>
                              <span className="ml-4">
                                Maximum Marks: <strong>[{question.marks}]</strong>
                              </span>
                              <div
                                className="ml-3 mt-1 w-full"
                                dangerouslySetInnerHTML={{ __html: question.question_title }}
                              />
                              {RenderMedia(question.images, 'image')}
                              {RenderMedia(question.videos, 'video')}
                              {RenderMedia(question.docs, 'pdf')}
                            </>
                          )}
    
                          {printOptions.showAnswerKey && (
                            <>
                              <p className="ml-3">Answer Key</p>
                              {question.answer_key.description && (
                                <div
                                  className="ml-8 text-[17px]"
                                  dangerouslySetInnerHTML={{ __html: question.answer_key.description }}
                                ></div>
                              )}
                              {RenderMedia(question.answer_key.images, 'image')}
                              {RenderMedia(question.answer_key.videos, 'video')}
                              {RenderMedia(question.answer_key.docs, 'pdf')}
                            </>
                          )}
    
                          {printOptions.showAnswerKey && (
                            <>
                              <p className="ml-3">Answer Model</p>
                              {question.answer_model.description && (
                                <div
                                  className="ml-8 text-[17px]"
                                  dangerouslySetInnerHTML={{ __html: question.answer_model.description }}
                                ></div>
                              )}
                              {RenderMedia(question.answer_model.images, 'image')}
                              {RenderMedia(question.answer_model.videos, 'video')}
                              {RenderMedia(question.answer_model.docs, 'pdf')}
                            </>
                          )}
    
                          {printOptions.showMarkScheme && (
                            <>
                              <p className="ml-3">Mark Scheme</p>
                              {question.markscheme.description && (
                                <div
                                  className="ml-8 text-[17px]"
                                  dangerouslySetInnerHTML={{ __html: question.markscheme.description }}
                                ></div>
                              )}
                              {RenderMedia(question.markscheme.images, 'image')}
                              {RenderMedia(question.markscheme.videos, 'video')}
                              {RenderMedia(question.markscheme.docs, 'pdf')}
                            </>
                          )}
    
                          {printOptions.showQuestion && question.subquestions?.length > 0 && (
                            <div>
                              {question.subquestions.map((subquestion, subIndex) => (
                                <div key={subquestion._id} className="mb-3 font-calibri text-base">
                                  {printOptions.showQuestion && (
                                    <>
                                      <span className="mr-2 ml-2 font-bold">
                                        {`(${String.fromCharCode(97 + subIndex)})`}
                                      </span>
                                      <div className="ml-auto text-right inline-block">
                                        <span className="ml-4">
                                          <strong>[{subquestion.marks}]</strong>
                                        </span>
                                      </div>
                                      <div
                                        className="ml-4"
                                        dangerouslySetInnerHTML={{ __html: subquestion.title }}
                                      />
                                      {RenderMedia(subquestion.images, 'image')}
                                      {RenderMedia(subquestion.videos, 'video')}
                                      {RenderMedia(subquestion.docs, 'pdf')}
    
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
                                              className={`border border-gray-400 rounded-lg p-3 m-1 w-[calc(50%-8px)] ${
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
                                    </>
                                  )}
    
                                  {printOptions.showAnswerKey && (
                                    <>
                                      <p className="ml-4">Answer Key:</p>
                                      {subquestion.answer_key.description && (
                                        <div
                                          className="ml-10 text-[16px]"
                                          dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}
                                        ></div>
                                      )}
                                      {RenderMedia(subquestion.answer_key.images, 'image')}
                                      {RenderMedia(subquestion.answer_key.videos, 'video')}
                                      {RenderMedia(subquestion.answer_key.docs, 'pdf')}
                                    </>
                                  )}
    
                                  {printOptions.showAnswerKey && (
                                    <>
                                      <p className="ml-4">Answer Model:</p>
                                      {subquestion.answer_model.description && (
                                        <div
                                          className="ml-10 text-[16px]"
                                          dangerouslySetInnerHTML={{ __html: subquestion.answer_model.description }}
                                        ></div>
                                      )}
                                      {RenderMedia(subquestion.answer_model.images, 'image')}
                                      {RenderMedia(subquestion.answer_model.videos, 'video')}
                                      {RenderMedia(subquestion.answer_model.docs, 'pdf')}
                                    </>
                                  )}
    
                                  {printOptions.showQuestion && printOptions.showMarkScheme && (
                                    <>
                                      <p className="ml-4">Mark Scheme:</p>
                                      {subquestion.markscheme.description && (
                                        <div
                                          className="ml-10 text-[16px]"
                                          dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}
                                        ></div>
                                      )}
                                      {RenderMedia(subquestion.markscheme.images, 'image')}
                                      {RenderMedia(subquestion.markscheme.videos, 'video')}
                                      {RenderMedia(subquestion.markscheme.docs, 'pdf')}
                                    </>
                                  )}
    
                                  {subquestion.subchildquestions?.length > 0 && (
                                    <div>
                                      {subquestion.subchildquestions.map((subchildquestion, subChildIndex) => (
                                        <div key={subchildquestion._id} className="mb-3 font-calibri text-base">
                                          <div className="ml-5">{`(${toRoman(subChildIndex + 1)})`}</div>
                                          {printOptions.showQuestion && (
                                            <>
                                              <div className="ml-auto text-right inline-block">
                                                <span>
                                                  <strong>[{subchildquestion.marks || 'N/A'}]</strong>
                                                </span>
                                              </div>
                                              <div
                                                className="ml-5"
                                                dangerouslySetInnerHTML={{ __html: subchildquestion.title }}
                                              />
                                              {RenderMedia(subchildquestion.images, 'image')}
                                              {RenderMedia(subchildquestion.videos, 'video')}
                                              {RenderMedia(subchildquestion.docs, 'pdf')}
                                            </>
                                          )}
    
                                          {printOptions.showAnswerKey && (
                                            <>
                                              <p className="ml-5">Answer Key:</p>
                                              {subchildquestion.answer_key.description && (
                                                <div
                                                  className="ml-14 text-[16px]"
                                                  dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}
                                                ></div>
                                              )}
                                              {RenderMedia(subchildquestion.answer_key.images, 'image')}
                                              {RenderMedia(subchildquestion.answer_key.videos, 'video')}
                                              {RenderMedia(subchildquestion.answer_key.docs, 'pdf')}
                                            </>
                                          )}
    
                                          {printOptions.showAnswerKey && (
                                            <>
                                              <p className="ml-5">Answer Model:</p>
                                              {subchildquestion.answer_model.description && (
                                                <div
                                                  className="ml-14 text-[16px]"
                                                  dangerouslySetInnerHTML={{ __html: subchildquestion.answer_model.description }}
                                                ></div>
                                              )}
                                              {RenderMedia(subchildquestion.answer_model.images, 'image')}
                                              {RenderMedia(subchildquestion.answer_model.videos, 'video')}
                                              {RenderMedia(subchildquestion.answer_model.docs, 'pdf')}
                                            </>
                                          )}
    
                                          {printOptions.showMarkScheme && (
                                            <>
                                              <p className="ml-5">Mark Scheme:</p>
                                              {subchildquestion.markscheme.description && (
                                                <div
                                                  className="ml-14 text-[16px]"
                                                  dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}
                                                ></div>
                                              )}
                                              {RenderMedia(subchildquestion.markscheme.images, 'image')}
                                              {RenderMedia(subchildquestion.markscheme.videos, 'video')}
                                              {RenderMedia(subchildquestion.markscheme.docs, 'pdf')}
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
                    ))
                  ) : (
                    <p>No Questions Available</p>
                  )}
                </div>
              </div>
    
              {/* Footer buttons */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handlePrint}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    printFormat === 'print'
                      ? 'bg-[#00246B] text-white'
                      : 'border border-[#00246B] text-[#00246B]'
                  }`}
                >
                  <AiOutlinePrinter className="mr-2" />
                  Print
                </button>
                <button
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
   
export default PrintPage