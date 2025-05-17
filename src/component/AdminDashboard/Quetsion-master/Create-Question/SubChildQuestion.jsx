import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaVideo, FaImage, FaFilePdf, FaEye, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubChildQuestionView from './SubChildQuestionView';
import { useCreateSubChildQuestionMutation, useDeleteSubChildQuestionMutation, useGetQuestionQuery, useUpdateSubChildQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';

import LineSelectorWithMarks from './NumberOfLineSelector';
import ModelAnswer from './ModelAnswer';
import { setSubChildQuestionId } from '../../../store/all-Id-Slice/IdSlice';
import EditorFile from './MianQues/EditorFile';
import Loader from '../../Routing/Loader';

const SubChildQuestion = ({ label, onClose, subQuestiopnsavedData, setShowSubButtonGroup }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  const [answerKeyContent, setAnswerKeyContent] = useState('');
  const [markSchemeContent, setMarkSchemeContent] = useState('');
  const [savedData, setSavedData] = useState(null);
  const [isDisplayCardOpen, setIsDisplayCardOpen] = useState(false);
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [subSubQuestionsButtons, setSubSubQuestionsButtons] = useState(false);
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
  const [subQuestions, setSubQuestions] = useState([]);
  const [subQuestionsHide, setSubQuestionsHide] = useState(true);
  const [questionId, setQuestionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modelAnswerContent, setModelAnswerContent] = useState('');
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const [marks, setMarks] = useState('');
  const [createQuestion] = useCreateSubChildQuestionMutation();
  const [updateQuestion] = useUpdateSubChildQuestionMutation();
  const [deleteQuestion] = useDeleteSubChildQuestionMutation();
  const [numberOfLines, setNumberOfLines] = useState('');
  const [selectedAnswerType, setSelectedAnswerType] = useState('answerKey');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const previewId = useSelector((state) => state.idSlice.previewId);
  const { data: questionData } = useGetQuestionQuery(questionId, {
    skip: !isEditing || typeof questionId !== 'string',
  });
  const subQuestionId = subQuestiopnsavedData?.question?.id;

  useEffect(() => {
    if (isEditing && questionData) {
      setEditorContent(questionData.title || '');
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

  const handleNumberOfLinesChange = (event) => setNumberOfLines(event.target.value);
  const handlePreviewOpen = () => setIsPreviewOpen(true);
  const handleMarksChange = (event) => setMarks(event.target.value);

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
    if (subQuestionId) {
      const formData = new FormData();
      formData.append('title', editorContent);
      formData.append('question_id', previewId);
      formData.append('subquestion_id', subQuestionId);
      formData.append('criteria', "Yes");
      formData.append('marks', marks);
      formData.append('answer_line', numberOfLines);

      uploadedImages.forEach((image) => formData.append('images', image));
      uploadedVideos.forEach((video) => formData.append('videos', video));
      uploadedPdfs.forEach((pdf) => formData.append('docs', pdf));

      formData.append('answer_key[description]', answerKeyContent);
      answerKeyImages.forEach((image) => formData.append('answer_key[images]', image));
      answerKeyVideos.forEach((video) => formData.append('answer_key[videos]', video));
      answerKeyPdfs.forEach((pdf) => formData.append('answer_key[docs]', pdf));

      formData.append('markscheme[description]', markSchemeContent);
      markSchemeImages.forEach((image) => formData.append('markscheme[images]', image));
      markSchemeVideos.forEach((video) => formData.append('markscheme[videos]', video));
      markSchemePdfs.forEach((pdf) => formData.append('markscheme[docs]', pdf));

      formData.append('answer_model[description]', modelAnswerContent);
      modelAnswerImages.forEach((image) => formData.append('answer_model[images]', image));
      modelAnswerVideos.forEach((video) => formData.append('answer_model[videos]', video));
      modelAnswerPdfs.forEach((pdf) => formData.append('answer_model[docs]', pdf));

      const questionId = isEditing ? savedData?.question?.id : null;
      if (!questionId && isEditing) {
        console.error('Invalid questionId for editing.');
        return;
      }

      try {
        const response = isEditing
          ? await updateQuestion({ questionId, formData }).unwrap()
          : await createQuestion(formData).unwrap();

        const savedDataview = response.data;
        setSavedData(savedDataview);
        dispatch(setSubChildQuestionId(savedDataview?.question?.id));
        setIsDisplayCardOpen(true);
        setSubSubQuestionsButtons(true);
        setSubQuestionsHide(false);
        setShowSubButtonGroup(false);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!savedData?.question?.id) {
      console.error('No subChildQuestionId provided for deletion.');
      return;
    }

    setLoading(true);
    try {
      await deleteQuestion(savedData?.question?.id).unwrap();
      toast.success('Question deleted successfully!');
      setIsDisplayCardOpen(false);
      setSubQuestions([]);
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete the question. Please try again.');
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

  return (
    <div className="mt-20 cursor-pointer text-blue-600">
      {subQuestionsHide && (
        <div className="p-8 border border-gray-300 rounded-lg shadow-sm">
          <div className="flex justify-between items-center w-full mb-4">
            <span className="font-bold">({label})</span>
            <button
              onClick={onClose}
              className="p-2 bg-white text-red-500 border border-red-500 rounded-full hover:bg-red-50"
            >
              <FaTimes />
            </button>
          </div>

          <div className="w-full mb-6">
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
            
            <div className="flex justify-between items-center my-4">
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById('image').click()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                  title="Insert Image"
                >
                  <FaImage className="text-sm" />
                </button>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange('image', e, 'main')}
                />

                <button
                  onClick={() => document.getElementById('video').click()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                  title="Insert Video"
                >
                  <FaVideo className="text-sm" />
                </button>
                <input
                  type="file"
                  id="video"
                  className="hidden"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange('video', e, 'main')}
                />

                <button
                  onClick={() => document.getElementById('pdf').click()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                  title="Insert PDF"
                >
                  <FaFilePdf className="text-sm" />
                </button>
                <input
                  type="file"
                  id="pdf"
                  className="hidden"
                  accept="application/pdf"
                  multiple
                  onChange={(e) => handleFileChange('pdf', e, 'main')}
                />
              </div>

              <button
                onClick={handlePreviewOpen}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                title="Preview"
              >
                <FaEye className="text-sm" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="w-full md:w-1/2 relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Uploaded ${index}`}
                        className="w-full h-auto rounded"
                      />
                      <button
                        onClick={() => removeFile('image', index, 'main')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedVideos.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {uploadedVideos.map((video, index) => (
                    <div key={index} className="w-full md:w-1/2 relative">
                      <video
                        src={URL.createObjectURL(video)}
                        controls
                        className="w-full h-auto rounded"
                      />
                      <button
                        onClick={() => removeFile('video', index, 'main')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedPdfs.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {uploadedPdfs.map((pdf, index) => (
                    <div key={index} className="w-full md:w-1/2 relative border border-gray-300 rounded">
                      <iframe
                        src={URL.createObjectURL(pdf)}
                        className="w-full h-96 rounded"
                        frameBorder="0"
                      />
                      <button
                        onClick={() => removeFile('pdf', index, 'main')}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="answerKeyToggle"
              checked={showAnswerKeyEditor}
              onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
              className="mr-2"
            />
            <label htmlFor="answerKeyToggle" className="text-gray-700">
              Add Answer Type
            </label>
          </div>

          {showAnswerKeyEditor && (
            <>
              <div className="w-full mb-4">
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
                  <h4 className="text-lg font-semibold mb-2">Answer Key</h4>
                  <ModelAnswer
                    editorContent={answerKeyContent}
                    setEditorContent={setAnswerKeyContent}
                    images={answerKeyImages}
                    videos={answerKeyVideos}
                    pdfs={answerKeyPdfs}
                    handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                    removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                  />
                  <h4 className="text-lg font-semibold mb-2 mt-4">Model Answer</h4>
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
            </>
          )}

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="markSchemeToggle"
              checked={showMarkSchemeEditor}
              onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
              className="mr-2"
            />
            <label htmlFor="markSchemeToggle" className="text-gray-700">
              Add Mark Scheme
            </label>
          </div>

          {showMarkSchemeEditor && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2 text-center">Mark Scheme Editor</h4>
              <EditorFile
                content={markSchemeContent}
                onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
              />
              
              <div className="flex justify-between items-center my-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => document.getElementById('markImage').click()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                    title="Insert Image"
                  >
                    <FaImage className="text-sm" />
                  </button>
                  <input
                    type="file"
                    id="markImage"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange('image', e, 'markScheme')}
                  />

                  <button
                    onClick={() => document.getElementById('markVideo').click()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                    title="Insert Video"
                  >
                    <FaVideo className="text-sm" />
                  </button>
                  <input
                    type="file"
                    id="markVideo"
                    className="hidden"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileChange('video', e, 'markScheme')}
                  />

                  <button
                    onClick={() => document.getElementById('markPdf').click()}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center border border-black"
                    title="Insert PDF"
                  >
                    <FaFilePdf className="text-sm" />
                  </button>
                  <input
                    type="file"
                    id="markPdf"
                    className="hidden"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFileChange('pdf', e, 'markScheme')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {markSchemeImages.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {markSchemeImages.map((image, index) => (
                      <div key={index} className="w-full md:w-1/3 relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Mark Scheme Image ${index}`}
                          className="w-full h-auto rounded"
                        />
                        <button
                          onClick={() => removeFile('image', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {markSchemeVideos.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {markSchemeVideos.map((video, index) => (
                      <div key={index} className="w-full md:w-1/3 relative">
                        <video
                          src={URL.createObjectURL(video)}
                          controls
                          className="w-full h-auto rounded"
                        />
                        <button
                          onClick={() => removeFile('video', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {markSchemePdfs.length > 0 && (
                  <div className="flex flex-wrap gap-4">
                    {markSchemePdfs.map((pdf, index) => (
                      <div key={index} className="w-full md:w-1/3 relative">
                        <iframe
                          src={URL.createObjectURL(pdf)}
                          className="w-full h-96 rounded"
                          frameBorder="0"
                        />
                        <button
                          onClick={() => removeFile('pdf', index, 'markScheme')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'Update Question' : 'Save Question'}
            </button>
          </div>
          
          {loading && <Loader />}
          <ToastContainer />
        </div>
      )}

      {isDisplayCardOpen && (
        <SubChildQuestionView
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          savedData={savedData}
          label={label}
        />
      )}
    </div>
  );
};

export default SubChildQuestion;

