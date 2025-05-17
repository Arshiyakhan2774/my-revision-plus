import { FaTimes, FaPrint, FaSave } from 'react-icons/fa';
import CoverPageForm from './CoverPageForm';

const CreateFilterData = ({
  toRoman,
  handleSaveAssignment1,
  showAssignmentPreview,
  setShowAssignmentPreview,
  printOptions,
  handleOptionChange,
  filteredQuestions,
  selectedQuestions,
  renderMedia,
  coverLetterDetails,
  assignmentPaperId,
  handleCoverLetterChange,
  subjects,
  handlePrint,
  assignmentBoardId, 
  assignmentSubjectId, 
  categories,
  assignmentSubjectLevelId, 
  assignmentSourceId,
  calculateTotalMarks,
  selectedSubquestions,
  calculateSubquestionMarks,
  selectedSubchildquestions,
}) => {
  
  // Function to find subquestions by their IDs
  const getSelectedSubquestions = () => {
    const subquestions = [];
    
    filteredQuestions.forEach(question => {
      // Check if parent question is selected
      const isParentSelected = selectedQuestions.includes(question._id);
      
      question.subquestions.forEach(subquestion => {
        if (selectedSubquestions.includes(subquestion._id)) {
          subquestions.push({
            ...subquestion,
            parentQuestion: question,
            isParentSelected // Flag to indicate if parent is selected
          });
        }
      });
    });
    
    return subquestions;
  };

  const selectedSubqs = getSelectedSubquestions();

  // Function to get standalone subquestions (those without selected parent)
  const getStandaloneSubquestions = () => {
    return selectedSubqs.filter(subq => !subq.isParentSelected);
  };

  // Function to get subquestions that belong to selected parent questions
  const getChildSubquestions = () => {
    return selectedSubqs.filter(subq => subq.isParentSelected);
  };

  const standaloneSubqs = getStandaloneSubquestions();
  const childSubqs = getChildSubquestions();

  if (!showAssignmentPreview) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Dialog Header */}
        <div className="flex justify-between items-center bg-custom-primary p-4 rounded-t-lg">
          <h2 className="text-white text-xl font-semibold">Selected Questions</h2>
          <button 
            onClick={() => setShowAssignmentPreview(false)} 
            className="text-white p-1 hover:bg-blue-800 rounded"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Dialog Content */}
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
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.coverLetter}
                onChange={handleOptionChange}
                name="coverLetter"
              />
              <span className="ml-2">Cover Page</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={printOptions.lineSpceForAnswer}
                onChange={handleOptionChange}
                name="lineSpceForAnswer"
              />
              <span className="ml-2">Line Space For Answer</span>
            </label>
          </div>

          {printOptions.coverLetter && (
            <CoverPageForm
              coverLetterDetails={coverLetterDetails}
              handleCoverLetterChange={handleCoverLetterChange}
              subjects={subjects} 
              assignmentPaperId={assignmentPaperId}
              assignmentBoardId={assignmentBoardId}
              assignmentSubjectId={assignmentSubjectId}
              categories={categories}
              assignmentSubjectLevelId={assignmentSubjectLevelId} 
              assignmentSourceId={assignmentSourceId}
            />
          )}

          {/* Render selected main questions */}
          {selectedQuestions.length > 0 && filteredQuestions
            .filter(question => selectedQuestions.includes(question._id))
            .map((question, mainIndex) => (
              <div id="printableArea" key={question._id} className="mt-4">
                {printOptions.showQuestion && (
                  <>
                    <div className="flex justify-start mt-4">
                      <span className="font-bold">Que({mainIndex + 1})</span>
                      <span className="ml-2">
                        Maximum Marks: <strong>[{calculateTotalMarks(question)}]</strong>
                      </span>
                    </div>
                    <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.question_title }}></div>
                    {renderMedia(question.images, 'image')}
                    {renderMedia(question.videos, 'video')}
                    {renderMedia(question.docs, 'pdf')}
                  </>
                )}

                {printOptions.lineSpceForAnswer && (
                  <>
                    {[...Array(question.answer_line || 0)].map((_, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="border-b border-dashed border-gray-300 mb-2 h-5"
                      ></div>
                    ))}
                  </>
                )}

                {/* Render subquestions that belong to this main question */}
                {childSubqs
                  .filter(subq => subq.parentQuestion._id === question._id)
                  .map((subquestion, subIndex) => (
                    <div key={subquestion._id} className="mt-4">
                      {printOptions.showQuestion && (
                        <>
                          <div className="flex justify-start">
                            <span className="font-bold">({String.fromCharCode(97 + subIndex)})</span>
                            <span className="ml-2">
                              Marks: <strong>[{calculateSubquestionMarks(subquestion)}]</strong>
                            </span>
                          </div>
                          <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: subquestion.title }}></div>
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
                                  className={`border border-gray-300 rounded-lg p-2 m-1 w-[calc(50%-0.5rem)] ${
                                    option.label === subquestion.mcq_options.correct_answer 
                                      ? 'bg-green-100' 
                                      : 'bg-white'
                                  }`}
                                >
                                  <span>{option.label}: {option.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}

                      {/* Render subchildquestions for this subquestion */}
                      {printOptions.showQuestion && subquestion.subchildquestions.length > 0 && (
                        <div className="ml-5">
                          {subquestion.subchildquestions
                            .filter(subchildquestion => selectedSubchildquestions.includes(subchildquestion._id))
                            .map((subchildquestion, subChildIndex) => (
                              <div key={subchildquestion._id} className="mt-4">
                                {printOptions.showQuestion && (
                                  <>
                                    <div className="flex justify-start">
                                      <span className="font-bold">({toRoman(subChildIndex + 1)})</span>
                                      <span className="ml-2">
                                        Marks: <strong>[{Number(subchildquestion.marks) || 'N/A'}]</strong>
                                      </span>
                                    </div>
                                    <div className="ml-8 text-[16px]" dangerouslySetInnerHTML={{ __html: subchildquestion.title }}></div>
                                    {renderMedia(subchildquestion.images, 'image')}
                                    {renderMedia(subchildquestion.videos, 'video')}
                                    {renderMedia(subchildquestion.docs, 'pdf')}
                                  </>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}

                {printOptions.showAnswerKey && (
                  <>
                    <h3 className="ml-3 mt-4 font-semibold">Answer Key /Answer Model</h3>
                    {question.answer_key.description && (
                      <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.answer_key.description }}></div>
                    )}
                    {renderMedia(question.answer_key.images, 'image')}
                    {renderMedia(question.answer_key.videos, 'video')}
                    {renderMedia(question.answer_key.docs, 'pdf')}
                  </>
                )}

                {printOptions.showMarkScheme && (
                  <>
                    <h3 className="ml-3 mt-4 font-semibold">Mark Scheme</h3>
                    {question.markscheme.description && (
                      <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: question.markscheme.description }}></div>
                    )}
                    {renderMedia(question.markscheme.images, 'image')}
                    {renderMedia(question.markscheme.videos, 'video')}
                    {renderMedia(question.markscheme.docs, 'pdf')}
                  </>
                )}
              </div>
            ))}

          {/* Render standalone subquestions (those without selected parent) */}
          {standaloneSubqs.length > 0 && standaloneSubqs.map((subquestion, index) => (
            <div id="printableArea" key={subquestion._id} className="mt-4">
              {printOptions.showQuestion && (
                <>
                  <div className="flex justify-start">
                    <span className="font-bold">Que({index + 1 + selectedQuestions.length})</span>
                    <span className="ml-2">
                      Marks: <strong>[{calculateSubquestionMarks(subquestion)}]</strong>
                    </span>
                  </div>
                  <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: subquestion.title }}></div>
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
                          className={`border border-gray-300 rounded-lg p-2 m-1 w-[calc(50%-0.5rem)] ${
                            option.label === subquestion.mcq_options.correct_answer 
                              ? 'bg-green-100' 
                              : 'bg-white'
                          }`}
                        >
                          <span>{option.label}: {option.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Render subchildquestions for standalone subquestions */}
              {printOptions.showQuestion && subquestion.subchildquestions.length > 0 && (
                <div className="ml-5">
                  {subquestion.subchildquestions
                    .filter(subchildquestion => selectedSubchildquestions.includes(subchildquestion._id))
                    .map((subchildquestion, subChildIndex) => (
                      <div key={subchildquestion._id} className="mt-4">
                        {printOptions.showQuestion && (
                          <>
                            <div className="flex justify-start">
                              <span className="font-bold">({String.fromCharCode(97 + subChildIndex)})</span>
                              <span className="ml-2">
                                Marks: <strong>[{Number(subchildquestion.marks) || 'N/A'}]</strong>
                              </span>
                            </div>
                            <div className="ml-8 text-[16px]" dangerouslySetInnerHTML={{ __html: subchildquestion.title }}></div>
                            {renderMedia(subchildquestion.images, 'image')}
                            {renderMedia(subchildquestion.videos, 'video')}
                            {renderMedia(subchildquestion.docs, 'pdf')}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {printOptions.lineSpceForAnswer && (
                <>
                  {[...Array(subquestion.answer_line || 0)].map((_, lineIndex) => (
                    <div
                      key={lineIndex}
                      className="border-b border-dashed border-gray-300 mb-2 h-5"
                    ></div>
                  ))}
                </>
              )}

              {printOptions.showAnswerKey && (
                <>
                  <h3 className="ml-3 mt-4 font-semibold">Answer Key:</h3>
                  {subquestion.answer_key.description && (
                    <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: subquestion.answer_key.description }}></div>
                  )}
                  {renderMedia(subquestion.answer_key.images, 'image')}
                  {renderMedia(subquestion.answer_key.videos, 'video')}
                  {renderMedia(subquestion.answer_key.docs, 'pdf')}
                </>
              )}

              {printOptions.showMarkScheme && (
                <>
                  <h3 className="ml-3 mt-4 font-semibold">Mark Scheme:</h3>
                  {subquestion.markscheme.description && (
                    <div className="ml-8 text-[17px]" dangerouslySetInnerHTML={{ __html: subquestion.markscheme.description }}></div>
                  )}
                  {renderMedia(subquestion.markscheme.images, 'image')}
                  {renderMedia(subquestion.markscheme.videos, 'video')}
                  {renderMedia(subquestion.markscheme.docs, 'pdf')}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Dialog Footer */}
        <div className="bg-gray-100 px-4 py-3 flex justify-end space-x-2">
          <button
            onClick={() => setShowAssignmentPreview(false)}
            className="px-4 py-2 bg-custom-primary text-white rounded hover:bg-blue-800 flex items-center"
          >
            <FaTimes className="mr-2" />
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-custom-primary text-white rounded hover:bg-blue-800 flex items-center"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
          <button
            onClick={handleSaveAssignment1}
            className="px-4 py-2 bg-custom-primary text-white rounded hover:bg-blue-800 flex items-center"
          >
            <FaSave className="mr-2" />
            Save Assignment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFilterData;