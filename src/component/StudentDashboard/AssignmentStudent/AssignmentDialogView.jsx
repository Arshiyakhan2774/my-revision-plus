import React, { useEffect } from 'react'
import { MdAssignmentAdd } from 'react-icons/md'
import { RiFolderSharedLine } from 'react-icons/ri'
import IconWithTitle from '../../utilities/IconsTittle'
import CoverDetails from '../../AdminDashboard/Assignment-master/AssignmentListView/CoverDetails'
import RenderMedia from '../../AdminDashboard/Assignment-master/AssignmentListView/RenderMedia'

const baseURL = "http://myrevisionplus.com/api/img/question/"

const toRoman = (num) => {
  const romanMap = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  return romanMap[num - 1] || num;
}

const AssignmentDialogView = ({ open, handleClose, assignment, coverDetails }) => {
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

  return (
    <div>
      <div className="container max-w-full px-4">
        <IconWithTitle
          icon={RiFolderSharedLine}
          title="Shared Assignments"
          iconColor="white"
          backgroundColor="#00246B"
          iconSize="30px"
          titleColor="#00246B"
          titleFontSize="30px"
        />

        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b">
                <IconWithTitle
                  icon={MdAssignmentAdd}
                  title="Assignment View"
                  iconColor="white"
                  backgroundColor="#00246B"
                  iconSize="30px"
                  titleColor="#00246B"
                  titleFontSize="34px"
                />
              </div>
              
              <div className="p-4">
                {coverDetails ? (
                  <CoverDetails coverDetails={coverDetails}/>
                ) : (
                  <p>No cover details available.</p>
                )}

                {assignment?.question_id?.length > 0 ? (
                  assignment.question_id.map((question, index) => (
                    <div key={question._id} className="mb-4">
                      <h2 className="text-xl font-semibold">
                        <strong>Q{index + 1}:</strong>{" "}
                        <span dangerouslySetInnerHTML={{ __html: question.question_title }} />
                      </h2>
                      
                      <RenderMedia mediaArray={question.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.docs} type="pdf" baseURL={baseURL} />
                      
                      <div 
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.answer_model.description }}
                      />
                      
                      <RenderMedia mediaArray={question.answer_model.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_model.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_model.docs} type="pdf" baseURL={baseURL} />
                      
                      <div 
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.answer_key.description }}
                      />
                      
                      <RenderMedia mediaArray={question.answer_key.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_key.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.answer_key.docs} type="pdf" baseURL={baseURL} />
                      
                      <div
                        className="ml-5"
                        dangerouslySetInnerHTML={{ __html: question.markscheme.description }}
                      />
                      
                      <RenderMedia mediaArray={question.markscheme.images} type="image" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.markscheme.videos} type="video" baseURL={baseURL} />
                      <RenderMedia mediaArray={question.markscheme.docs} type="pdf" baseURL={baseURL} />

                      {question.subquestions?.map((subquestion, subIndex) => (
                        <div key={subquestion._id} className="ml-4">
                          <h3 className="text-lg font-medium">
                            <strong>{String.fromCharCode(97 + subIndex)}:</strong>{" "}
                            <span dangerouslySetInnerHTML={{ __html: subquestion.title }} />
                          </h3>
                          
                          <RenderMedia mediaArray={subquestion.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.docs} type="pdf" baseURL={baseURL} />
                          
                          {subquestion.mcq_options && (
                            (() => {
                              const options = [
                                { label: 'A', value: subquestion.mcq_options.mcq_options_a },
                                { label: 'B', value: subquestion.mcq_options.mcq_options_b },
                                { label: 'C', value: subquestion.mcq_options.mcq_options_c },
                                { label: 'D', value: subquestion.mcq_options.mcq_options_d },
                              ];

                              return (
                                <div className="flex flex-wrap mt-2">
                                  {options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`border rounded-lg p-2 m-1 w-[calc(50%-10px)] ${
                                        option.label === subquestion.mcq_options.correct_answer 
                                          ? 'bg-green-100 border-green-300' 
                                          : 'bg-white border-gray-300'
                                      }`}
                                    >
                                      <p className="text-base">
                                        {option.label}: {option.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()
                          )}
                          
                          <div
                            className="ml-4"
                            dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}
                          />
                          
                          <RenderMedia mediaArray={subquestion.answer_model.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_model.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_model.docs} type="pdf" baseURL={baseURL} />
                          
                          <div
                            className="ml-4"
                            dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}
                          />
                          
                          <RenderMedia mediaArray={subquestion.answer_key.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_key.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                          
                          <div
                            className="ml-4"
                            dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}
                          />
                          
                          <RenderMedia mediaArray={subquestion.markscheme.images} type="image" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.markscheme.videos} type="video" baseURL={baseURL} />
                          <RenderMedia mediaArray={subquestion.markscheme.docs} type="pdf" baseURL={baseURL} />

                          {subquestion.subchildquestions?.map((subchildquestion, subChildIndex) => (
                            <div key={subchildquestion._id} className="ml-8">
                              <h4 className="text-base font-normal">
                                <strong>{toRoman(subChildIndex + 1)}:</strong>{" "}
                                <span dangerouslySetInnerHTML={{ __html: subchildquestion.title }} />
                              </h4>
                              
                              <RenderMedia mediaArray={subchildquestion.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.docs} type="pdf" baseURL={baseURL} />
                              
                              <div
                                className="ml-5"
                                dangerouslySetInnerHTML={{ __html: subchildquestion.answer_key.description }}
                              />
                              
                              <RenderMedia mediaArray={subchildquestion.answer_key.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_key.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_key.docs} type="pdf" baseURL={baseURL} />
                              
                              <div
                                className="ml-5"
                                dangerouslySetInnerHTML={{ __html: subchildquestion.answer_model.description }}
                              />
                              
                              <RenderMedia mediaArray={subchildquestion.answer_model.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_model.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.answer_model.docs} type="pdf" baseURL={baseURL} />
                              
                              <div
                                className="ml-5"
                                dangerouslySetInnerHTML={{ __html: subchildquestion.markscheme.description }}
                              />
                              
                              <RenderMedia mediaArray={subchildquestion.markscheme.images} type="image" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.markscheme.videos} type="video" baseURL={baseURL} />
                              <RenderMedia mediaArray={subchildquestion.markscheme.docs} type="pdf" baseURL={baseURL} />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No Questions Available</p>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-end">
                <button 
                  onClick={handleClose} 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentDialogView