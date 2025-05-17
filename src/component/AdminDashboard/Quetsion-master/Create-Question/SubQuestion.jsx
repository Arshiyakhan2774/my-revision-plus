import { useEffect, useRef, useState } from 'react';
import { FaEye, FaImage, FaVideo, FaFilePdf, FaTrash, FaTimes, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import '@wiris/mathtype-tinymce5';
import 'tinymce/skins/content/default/content.css';
import { useCreateSubQuestionMutation, useDeleteSubQuestionMutation, useGetQuestionQuery, useUpdateSubQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';

import SubChildQuestion from './SubChildQuestion';
import SubChildQuestionButtonGroup from './SubChildQuestionButtonGroup';
import AddButtonStyle from './AddButtonStyle';
import SubQuestionView from './SubQuestionView';

import LineSelectorWithMarks from './NumberOfLineSelector';
import ModelAnswer from './ModelAnswer';
import { setSubQuestionId } from '../../../store/all-Id-Slice/IdSlice';
import EditorFile from './MianQues/EditorFile';
import Loader from '../../Routing/Loader';

const SubQuestion = ({ label, onClose, setShowButtonGroup }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedAnswerType, setSelectedAnswerType] = useState('answerKey');
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  const [answerKeyContent, setAnswerKeyContent] = useState('');
  const [markSchemeContent, setMarkSchemeContent] = useState('');
  const [subQuestiopnsavedData, setSubQuestiopnsavedData] = useState(null);
  const [isDisplayCardOpen, setIsDisplayCardOpen] = useState(true);
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [subSubQuestionsButtons, setSubSubQuestionsButtons] = useState(false);
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
  const [subChildQuestions, setSubChildQuestions] = useState([]);
  const [subQuestionsHide, setSubQuestionsHide] = useState(true);
  const [showSubButtonGroup, setShowSubButtonGroup] = useState(false);
  const [lonngQuestion, setLonngQuestion] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createQuestion] = useCreateSubQuestionMutation();
  const [updateQuestion] = useUpdateSubQuestionMutation();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [marks, setMarks] = useState('');
  const [modelAnswerContent, setModelAnswerContent] = useState('');
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const [deleteQuestion] = useDeleteSubQuestionMutation();
  const [numberOfLines, setNumberOfLines] = useState('');
  const previewId = useSelector((state) => state.idSlice.previewId);
  const subQuestionId = useSelector((state) => state.idSlice.subQuestionId);
  const { data: { data: questionData } = {}, } = useGetQuestionQuery(questionId, {
    skip: !isEditing || typeof questionId !== 'string',
  });
  const dispatch = useDispatch();
  const editorRef = useRef(null);

  useEffect(() => {
    if (isEditing && questionData) {
      setEditorContent(questionData.question_title || '');
      setUploadedImages(questionData.images || []);
      setUploadedVideos(questionData.videos || []);
      setUploadedPdfs(questionData.docs || []);
      setAnswerKeyContent(questionData.answer_key?.description || '');
      setAnswerKeyImages(questionData.answer_key?.images || []);
      setAnswerKeyVideos(questionData.answer_key?.videos || []);
      setAnswerKeyPdfs(questionData.answer_key?.docs || []);
      setMarkSchemeContent(questionData.markscheme?.description || '');
      setMarkSchemeImages(questionData.markscheme?.images || []);
      setMarkSchemeVideos(questionData.markscheme?.videos || []);
      setMarkSchemePdfs(questionData.markscheme?.docs || []);
      setModelAnswerContent(questionData.answer_model?.description || '');
      setModelAnswerImages(questionData.answer_model?.images || []);
      setModelAnswerVideos(questionData.answer_model?.videos || []);
      setModelAnswerPdfs(questionData.answer_model?.docs || []);
    }
  }, [isEditing, questionData]);

  const romanNumerals = [
    "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
    "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
    "XXXI", "XXXII", "XXXIII", "XXXIV", "XXXV", "XXXVI", "XXXVII", "XXXVIII", "XXXIX", "XL",
    "XLI", "XLII", "XLIII", "XLIV", "XLV", "XLVI", "XLVII", "XLVIII", "XLIX", "L",
    "LI", "LII"
  ].map(numeral => numeral.toLowerCase());

  const handleNumberOfLinesChange = (event) => setNumberOfLines(event.target.value);
  const handleMarksChange = (event) => setMarks(event.target.value);

  const handleLongQuestion = () => {
    if (subChildQuestions.length < 52) {
      let newLabel = romanNumerals[subChildQuestions.length];
      setSubChildQuestions([...subChildQuestions, { label: newLabel, text: '' }]);
    }
    setLonngQuestion(true);
  };

  const handleCloseSubQuestion = (index) => {
    setSubChildQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubSubQuestionButton = () => {
    setShowSubButtonGroup(!showSubButtonGroup);
  };

  const handlePreviewOpen = () => {
    setIsPreviewOpen(true);
  };

  const toggleSubQuestion = () => {
    setShowSubButtonGroup(true);
  };

  const updateFiles = (setter, files) => setter(prev => [...prev, ...files]);
  const removeFiles = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const handleFileChange = (type, e, context) => {
    const files = Array.from(e.target.files);
    const contextMap = {
      main: {
        image: setUploadedImages,
        video: setUploadedVideos,
        pdf: setUploadedPdfs,
      },
      answerKey: {
        image: setAnswerKeyImages,
        video: setAnswerKeyVideos,
        pdf: setAnswerKeyPdfs,
      },
      modelAnswer: {
        image: setModelAnswerImages,
        video: setModelAnswerVideos,
        pdf: setModelAnswerPdfs,
      },
      markScheme: {
        image: setMarkSchemeImages,
        video: setMarkSchemeVideos,
        pdf: setMarkSchemePdfs,
      },
    };
    const setter = contextMap[context]?.[type];
    if (setter) updateFiles(setter, files);
  };

  const removeFile = (type, index, context) => {
    const contextMap = {
      main: {
        image: setUploadedImages,
        video: setUploadedVideos,
        pdf: setUploadedPdfs,
      },
      answerKey: {
        image: setAnswerKeyImages,
        video: setAnswerKeyVideos,
        pdf: setAnswerKeyPdfs,
      },
      modelAnswer: {
        image: setModelAnswerImages,
        video: setModelAnswerVideos,
        pdf: setModelAnswerPdfs,
      },
      markScheme: {
        image: setMarkSchemeImages,
        video: setMarkSchemeVideos,
        pdf: setMarkSchemePdfs,
      },
    };
    const setter = contextMap[context]?.[type];
    if (setter) removeFiles(setter, index);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!previewId) {
      console.error('Preview ID is required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', editorContent || '');
    formData.append('question_id', previewId);
    formData.append('criteria', "Yes");
    formData.append('marks', marks);
    formData.append('answer_line', numberOfLines);
    uploadedImages.forEach((image) => formData.append('images', image));
    uploadedVideos.forEach((video) => formData.append('videos', video));
    uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));
    formData.append('answer_key[description]', answerKeyContent || '');
    answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
    answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
    answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));
    formData.append('markscheme[description]', markSchemeContent || '');
    markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
    markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
    markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));
    formData.append('answer_model[description]', modelAnswerContent);
    modelAnswerImages.forEach((image) => formData.append('answer_model[images]', image));
    modelAnswerVideos.forEach((video) => formData.append('answer_model[videos]', video));
    modelAnswerPdfs.forEach((pdf) => formData.append('answer_model[docs]', pdf));

    const questionId = isEditing ? subQuestiopnsavedData?.question?.id : null;

    if (isEditing && !questionId) {
      console.error('Invalid questionId for editing.');
      setLoading(false);
      return;
    }

    try {
      const response = isEditing
        ? await updateQuestion({ questionId, formData }).unwrap()
        : await createQuestion(formData).unwrap();

      const savedData = response.data;
      if (!savedData) throw new Error('No data returned from API');
      
      setSubQuestiopnsavedData(savedData);
      dispatch(setSubQuestionId(savedData?.question?.id));
      setSubSubQuestionsButtons(true);
      setSubQuestionsHide(false);
      setIsDisplayCardOpen(true);
      setShowButtonGroup(false);
      setSnackbarMessage('Question saved successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    setQuestionId(id);
    setSubQuestionsHide(true);
    setIsDisplayCardOpen(false);
  };

  const handleDelete = async () => {
    if (!subQuestionId) {
      console.error('No subQuestionId provided for deletion.');
      return;
    }

    setLoading(true);
    try {
      await deleteQuestion(subQuestionId).unwrap();
      setSnackbarMessage('Question deleted successfully');
      setSnackbarOpen(true);
      setIsDisplayCardOpen(false);
      setSubSubQuestionsButtons(false);
      setSubChildQuestions([]);
    } catch (error) {
      console.error('Error deleting question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 cursor-pointer">
      {subQuestionsHide && (
        <div className="border rounded-lg p-8 bg-white shadow-sm">
          <div className="flex justify-between items-center w-full mb-4">
            <span className="font-bold">({label})</span>
            <button
              onClick={onClose}
              className="border border-red-500 text-red-500 rounded-full p-1 hover:bg-red-50 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <LineSelectorWithMarks
            handleMarksChange={handleMarksChange}
            numberOfLines={numberOfLines}
            marks={marks}
            handleNumberOfLinesChange={handleNumberOfLinesChange}
          />

          <EditorFile
            content={editorContent}
            onEditorChange={(newContent) => setEditorContent(newContent)}
          />

          <div className="flex justify-between mb-4 mt-4">
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange('image', e, 'main')}
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <FaImage className="text-sm" />
                </button>
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  id="video"
                  className="hidden"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange('video', e, 'main')}
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <FaVideo className="text-sm" />
                </button>
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  id="pdf"
                  className="hidden"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => handleFileChange('pdf', e, 'main')}
                />
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <FaFilePdf className="text-sm" />
                </button>
              </label>
            </div>
            <button
              onClick={handlePreviewOpen}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            >
              <FaEye className="text-sm" />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="w-[48%] relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index}`}
                    className="w-full h-auto rounded"
                  />
                  <button
                    onClick={() => removeFile('image', index, 'main')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {uploadedVideos.map((video, index) => (
                <div key={index} className="w-[48%] relative">
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    className="w-full h-auto rounded"
                  />
                  <button
                    onClick={() => removeFile('video', index, 'main')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {uploadedPdfs.map((pdf, index) => (
                <div key={index} className="w-[48%] border border-gray-300 rounded relative">
                  <iframe
                    src={URL.createObjectURL(pdf)}
                    className="w-full h-96"
                    frameBorder="0"
                  />
                  <button
                    onClick={() => removeFile('pdf', index, 'main')}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAnswerKeyEditor}
                onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Add Answer Type</span>
            </label>

            {showAnswerKeyEditor && (
              <div className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Select Answer Type</label>
                  <select
                    value={selectedAnswerType}
                    onChange={(e) => setSelectedAnswerType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="answerKey">Answer Key</option>
                    <option value="modelAnswer">Model Answer</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {selectedAnswerType === 'answerKey' && (
                  <ModelAnswer
                    editorContent={answerKeyContent}
                    setEditorContent={setAnswerKeyContent}
                    images={answerKeyImages}
                    videos={answerKeyVideos}
                    pdfs={answerKeyPdfs}
                    handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                    removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                  />
                )}

                {selectedAnswerType === 'modelAnswer' && (
                  <ModelAnswer
                    editorContent={modelAnswerContent}
                    setEditorContent={setModelAnswerContent}
                    images={modelAnswerImages}
                    videos={modelAnswerVideos}
                    pdfs={modelAnswerPdfs}
                    handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
                    removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
                  />
                )}

                {selectedAnswerType === 'both' && (
                  <>
                    <h4 className="text-lg font-semibold mt-4">Answer Key</h4>
                    <ModelAnswer
                      editorContent={answerKeyContent}
                      setEditorContent={setAnswerKeyContent}
                      images={answerKeyImages}
                      videos={answerKeyVideos}
                      pdfs={answerKeyPdfs}
                      handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                      removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                    />
                    <h4 className="text-lg font-semibold mt-4">Model Answer</h4>
                    <ModelAnswer
                      editorContent={modelAnswerContent}
                      setEditorContent={setModelAnswerContent}
                      images={modelAnswerImages}
                      videos={modelAnswerVideos}
                      pdfs={modelAnswerPdfs}
                      handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
                      removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
                    />
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showMarkSchemeEditor}
                onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Add Mark Scheme</span>
            </label>

            {showMarkSchemeEditor && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-4">Mark Scheme Editor</h4>
                <EditorFile
                  content={markSchemeContent}
                  onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
                />
                <div className="flex gap-2 mt-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      id="markImage"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange('image', e, 'markScheme')}
                    />
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaImage className="text-sm" />
                    </button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      id="markVideo"
                      className="hidden"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleFileChange('video', e, 'markScheme')}
                    />
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaVideo className="text-sm" />
                    </button>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      id="markPdf"
                      className="hidden"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => handleFileChange('pdf', e, 'markScheme')}
                    />
                    <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      <FaFilePdf className="text-sm" />
                    </button>
                  </label>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-4">
                    {markSchemeImages.map((image, index) => (
                      <div key={index} className="w-[30%] relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Mark Scheme Image ${index}`}
                          className="w-full h-auto rounded"
                        />
                        <button
                          onClick={() => removeFile('image', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {markSchemeVideos.map((video, index) => (
                      <div key={index} className="w-[30%] relative">
                        <video
                          src={URL.createObjectURL(video)}
                          controls
                          className="w-full h-auto rounded"
                        />
                        <button
                          onClick={() => removeFile('video', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    {markSchemePdfs.map((pdf, index) => (
                      <div key={index} className="w-[30%] relative">
                        <iframe
                          src={URL.createObjectURL(pdf)}
                          className="w-full h-96"
                          frameBorder="0"
                        />
                        <button
                          onClick={() => removeFile('pdf', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
          </div>

          {loading && <Loader />}
        </div>
      )}

      {isDisplayCardOpen && subQuestiopnsavedData && (
        <SubQuestionView
          onClose={() => setIsDisplayCardOpen(false)}
          subQuestiopnsavedData={subQuestiopnsavedData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          label={label}
        />
      )}

      {subSubQuestionsButtons && (
        <AddButtonStyle
          onClick={handleSubSubQuestionButton}
          title="Add Sub-Question"
          buttonText="Sub Sub-Question"
          iconType="add"
          onClose={() => setSubSubQuestionsButtons(false)}
        />
      )}

      {showSubButtonGroup && (
        <SubChildQuestionButtonGroup
          onClick={toggleSubQuestion}
          onClose={handleCloseSubQuestion}
          handleLongQuestion={handleLongQuestion}
          handleCloseSubQuestion={handleCloseSubQuestion}
          subChildQuestions={subChildQuestions}
          label={subChildQuestions.map(q => q.label)}
          lonngQuestion={lonngQuestion}
          subQuestiopnsavedData={subQuestiopnsavedData}
        />
      )}

      {lonngQuestion && subChildQuestions.map((subChildQuestion, index) => (
        <SubChildQuestion
          key={index}
          label={subChildQuestion.label}
          setShowSubButtonGroup={setShowSubButtonGroup}
          onClose={() => handleCloseSubQuestion(index)}
          setSubChildQuestions={setSubChildQuestions}
          subQuestiopnsavedData={subQuestiopnsavedData}
        />
      ))}
    </div>
  );
};

export default SubQuestion;
