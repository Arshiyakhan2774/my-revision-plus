import React, { useEffect, useRef, useState } from 'react';
import '@wiris/mathtype-tinymce5';
import 'tinymce/skins/content/default/content.css';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from '../../Quetsion-master/Create-Question/FinalPreviwe';


import { useNavigate } from 'react-router-dom';
import { useUpdateQuestionMutation } from '../../../Services/CreateQuestion/CreateQuestionApi';
import { Api } from '../../../Api/Api';
import EditorFile from '../../Quetsion-master/Create-Question/MianQues/EditorFile';
import { PiImageFill, PiVideoFill } from 'react-icons/pi';
import { BiFileFind } from 'react-icons/bi';
import { FiDelete } from 'react-icons/fi';
import ModelAnswer from '../../Quetsion-master/Create-Question/ModelAnswer';


;
const MianEditQuestion= () => {
  const editorRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [editorContent, setEditorContent] = useState('');
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  const [answerKeyContent, setAnswerKeyContent] = useState('');
  const [markSchemeContent, setMarkSchemeContent] = useState('');
  const [modelAnswerContent, setModelAnswerContent] = useState('');
 
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [answerModelContent, setAnswerModelContent] = useState('');
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
  
 const [subQuestionsHide, setSubQuestionsHide] = useState(true);
 
  const [marks, setMarks] = useState('');
  const [keepImages, setKeepImages] = useState([]);
  const [keepVideos, setKeepVideos] = useState([]);
  const [keepPdfs, setKeepPdfs] = useState([]);
  const [keepImagesAnawerkey, setKeepImagesAnawerkey] = useState([]);
  const [keepVideosAnawerkey, setKeepVideosAnawerkey] = useState([]);
  const [keepPdfsAnawerkey, setKeepPdfsAnawerkey] = useState([]);
  const [keepImagesMarksheme, setKeepImagesMarksheme] = useState([]);
  const [keepVideosMarksheme, setKeepVideosMarksheme] = useState([]);
  const [keepPdfsMarksheme, setKeepPdfsMarksheme] = useState([]);
  const [keepImagesModelAnswer, setKeepImagesModelAnswer] = useState([]);
  const [keepVideosModelAnswer, setKeepVideosModelAnswer] = useState([]);
  const [keepPdfsModelAnswer, setKeepPdfsModelAnswer] = useState([]);
  const [selectedAnswerType, setSelectedAnswerType] = useState('answerKey');

  const navigate = useNavigate();
   const [updateQuestion] = useUpdateQuestionMutation();
 
   const [questions, setQuestions] = useState([]); 
   const [loading ,setLoading]=useState(false);
   const assignmentSubTopicId = useSelector(state => state.idSlice.assignmentSubTopicId);
   const selectedSubquestionId = useSelector((state) => state.idSlice.selectedSubquestionId);
   const dispatch = useDispatch();
   const API_URL = "http://myrevisionplus.com/api/img/question/";
   const selectedId = useSelector((state) => state.idSlice.selectedId);
  const refetch = async () => {
  setLoading(true);
  try {
    const response = await Api.get(`/questions/fullquestion/${selectedId}`);
    const questionData = response.data.data.questions;

    if (questionData) {
      setQuestions(questionData);
      setEditorContent(questionData.question_title || '');
      setMarks(questionData.marks || '');
      setAnswerKeyContent(questionData.answer_key?.description || '');
      setMarkSchemeContent(questionData.markscheme?.description || '');
      setAnswerModelContent(questionData.answer_model?.description || '')
      
      setKeepImagesAnawerkey(questionData.answer_key?.images ? [questionData.answer_key.images].flat() : []);
      setKeepVideosAnawerkey(questionData.answer_key?.videos ? [questionData.answer_key.videos].flat() : []);
      setKeepPdfsAnawerkey(questionData.answer_key?.docs ? [questionData.answer_key.docs].flat() : []);
      setKeepImagesModelAnswer(questionData.answer_model?.images ? [questionData.answer_model.images].flat() : []);
      setKeepVideosModelAnswer(questionData.answer_model?.videos ? [questionData.answer_model.videos].flat() : []);
      setKeepPdfsModelAnswer(questionData.answer_model?.docs ? [questionData.answer_model.docs].flat() : []);
      setModelAnswerImages(questionData.answer_key?.images ? [questionData.answer_model.images].flat() : []);
      setModelAnswerVideos(questionData.answer_key?.videos ? [questionData.answer_model.videos].flat() : []);
      setModelAnswerPdfs(questionData.answer_key?.docs ? [questionData.answer_model.docs].flat() : []);
      setKeepImagesMarksheme(questionData.markscheme?.images ? [questionData.markscheme.images].flat() : []);
      console.log(questionData.markscheme?.images || [], "markscheme images...................");
      
      setKeepVideosMarksheme(questionData.markscheme?.videos ? [questionData.markscheme.videos].flat() : []);
      setKeepPdfsMarksheme(questionData.markscheme?.docs ? [questionData.markscheme.docs].flat() : []);
      setUploadedImages(questionData.images ? [questionData.images].flat() : []);
      setUploadedVideos(questionData.videos ? [questionData.videos].flat() : []);
      setUploadedPdfs(questionData.docs ? [questionData.docs].flat() : []);
      setAnswerKeyImages(questionData.answer_key?.images ? [questionData.answer_key.images].flat() : []);
      setAnswerKeyVideos(questionData.answer_key?.videos ? [questionData.answer_key.videos].flat() : []);
      setAnswerKeyPdfs(questionData.answer_key?.docs ? [questionData.answer_key.docs].flat() : []);
    
      setKeepImages(questionData.images ? [questionData.images].flat() : []);
      setKeepVideos(questionData.videos ? [questionData.videos].flat() : []);
      setKeepPdfs(questionData.docs ? [questionData.docs].flat() : []);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};
const handleEditorAnswerModelContentChange = (index, newContent) => {
  const updatedEditorContentList = [...answerKeyContent];
  updatedEditorContentList[index] = newContent;
  setAnswerModelContent(updatedEditorContentList);
};

  const iconButtonStyle = {
    color: "white",
    background: "linear-gradient(90deg, #1f90fe,#74b0ec,#c571bd)",
    width: "40px",
    height: "40px",
    marginRight: "8px",
    border: "1px solid black",
  };
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    return () => {
      [...uploadedImages, ...uploadedVideos, ...uploadedPdfs].forEach((file) => {
        if (file instanceof File) URL.revokeObjectURL(file);
      });
    };
  }, [uploadedImages, uploadedVideos, uploadedPdfs]);
  const updateFiles = (setter, files) => setter(prev => [...prev, ...files]);
  const removeFiles = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
  
  const handleFileChange = (type, e, context) => {
    const files = Array.from(e.target.files).filter(file => file instanceof Blob);
    
    if (!files.length) {
      console.error('No valid files selected');
      return;
    }
  
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
      markScheme: {
        image: setMarkSchemeImages,
        video: setMarkSchemeVideos,
        pdf: setMarkSchemePdfs,
      },
      modelAnswer: {
        image: setModelAnswerImages,
        video: setModelAnswerVideos,
        pdf: setModelAnswerPdfs,
      },
    };
  
    const setter = contextMap[context]?.[type];
    if (!setter) {
      console.error(`Setter function is undefined for context: ${context} and type: ${type}`);
      return;
    }
    updateFiles(setter, files);
  };
  
  const removeFile = (type, index, context) => {
    const contextMap = {
        main: {
            image: () => {
                const imageToRemove = uploadedImages[index];
                setUploadedImages(prev => prev.filter((_, i) => i !== index));
                setKeepImages(prev => prev.filter(img => img !== imageToRemove));
            },
            video: () => {
                const videosToRemove = uploadedVideos[index];
                setUploadedVideos(prev => prev.filter((_, i) => i !== index));
                setKeepVideos(prev => prev.filter(img => img !== videosToRemove));
            },
            pdf: () => {
                const docToRemove = uploadedPdfs[index];
                setUploadedPdfs(prev => prev.filter((_, i) => i !== index));
                setKeepPdfs(prev => prev.filter(doc => doc !== docToRemove));
            },
        },
        answerKey: {
            image: () => {
                const imageToRemoveAnswerKey = answerKeyImages[index];
                setAnswerKeyImages(prev => prev.filter((_, i) => i !== index));
                setKeepImagesAnawerkey(prev => prev.filter(img => img !== imageToRemoveAnswerKey));
            },
            video: () => {
                const videoToRemoveAnswerKey = answerKeyVideos[index];
                setAnswerKeyVideos(prev => prev.filter((_, i) => i !== index));
                setKeepVideosAnawerkey(prev => prev.filter(video => video !== videoToRemoveAnswerKey));
            },
            pdf: () => {
                const docToRemoveAnswerKey = answerKeyPdfs[index];
                setAnswerKeyPdfs(prev => prev.filter((_, i) => i !== index));
                setKeepPdfsAnawerkey(prev => prev.filter(doc => doc !== docToRemoveAnswerKey));
            },
        },
       
        modelAnswer: {
          image: () => {
              const imageToRemoveAnswerModel =  modelAnswerImages[index];
              setModelAnswerImages(prev => prev.filter((_, i) => i !== index));
              setKeepImagesModelAnswer(prev => prev.filter(img => img !== imageToRemoveAnswerModel));
          },
          video: () => {
              const videoToRemoveAnswerModel =  modelAnswerVideos[index];
              setModelAnswerVideos(prev => prev.filter((_, i) => i !== index));
              setKeepVideosModelAnswer(prev => prev.filter(video => video !== videoToRemoveAnswerModel));
          },
          pdf: () => {
              const docToRemoveAnswerModel = modelAnswerPdfs[index];
              setModelAnswerPdfs(prev => prev.filter((_, i) => i !== index));
              setKeepPdfsModelAnswer(prev => prev.filter(doc => doc !== docToRemoveAnswerModel));
          },
      },
        markScheme: {
            image: () => {
                const imageToRemoveMarkScheme = markSchemeImages[index];
                setMarkSchemeImages(prev => prev.filter((_, i) => i !== index));
                setKeepImagesMarksheme(prev => prev.filter(img => img !== imageToRemoveMarkScheme));
            },
            video: () => {
                const videoToRemoveMarkScheme = markSchemeVideos[index];
                setMarkSchemeVideos(prev => prev.filter((_, i) => i !== index));
                setKeepVideosMarksheme(prev => prev.filter(video => video !== videoToRemoveMarkScheme));
            },
            pdf: () => {
                const docToRemoveMarkScheme = markSchemePdfs[index];
                setMarkSchemePdfs(prev => prev.filter((_, i) => i !== index));
                setKeepPdfsMarksheme(prev => prev.filter(doc => doc !== docToRemoveMarkScheme));
            },
        },
    };
  
    const removeFunction = contextMap[context]?.[type];
    if (removeFunction) {
        removeFunction();
    }
  };
  
  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };
  const handleSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    
    formData.append('question_title', editorContent);
    formData.append('question_id', selectedId); 
    formData.append('subtopic_id', assignmentSubTopicId);
    formData.append('criteria', "Yes");
    formData.append('marks', marks);
    formData.append('keepImages', JSON.stringify(keepImages));
    formData.append('keepVideos', JSON.stringify(keepVideos)); 
    formData.append('keepDocs', JSON.stringify(keepPdfs));   
    
    uploadedImages.forEach((file) => formData.append('images', file));
    uploadedVideos.forEach((file) => formData.append('videos', file));
    uploadedPdfs.forEach((file) => formData.append('docs', file));
    formData.append('keepAnswerkeyImages', JSON.stringify(keepImagesAnawerkey));
    formData.append('keepAnswerkeyVideos', JSON.stringify(keepVideosAnawerkey));
    formData.append('keepAnswerkeyDocs', JSON.stringify(keepPdfsAnawerkey));
    formData.append('keepAnswerModelImages', JSON.stringify(keepImagesModelAnswer));
    formData.append('keepAnswerModelVideos', JSON.stringify(keepVideosModelAnswer));
    formData.append('keepAnswerModelDocs', JSON.stringify(keepPdfsModelAnswer));
  
   
    formData.append('keepMarkschemeImages', JSON.stringify(keepImagesMarksheme));
    formData.append('keepMarkschemeVideos', JSON.stringify(keepVideosMarksheme));
    formData.append('keepMarkschemeDocs', JSON.stringify(keepPdfsMarksheme));

    formData.append('answer_key_description', answerKeyContent); 
    answerKeyImages.forEach((file) => formData.append('answer_key[images]', file));
    answerKeyVideos.forEach((file) => formData.append('answer_key[videos]', file));
    answerKeyPdfs.forEach((file) => formData.append('answer_key[docs]', file));
    formData.append('answer_model_description', answerModelContent); 
    modelAnswerImages.forEach((file) => formData.append('answer_model[images]', file));
    modelAnswerVideos.forEach((file) => formData.append('answer_model[videos]', file));
    modelAnswerPdfs.forEach((file) => formData.append('answer_model[docs]', file));
    formData.append('markscheme_description',markSchemeContent);
  markSchemeImages.forEach((file) => formData.append('markscheme[images]', file));
    markSchemeVideos.forEach((file) => formData.append('markscheme[videos]', file));
    markSchemePdfs.forEach((file) => formData.append('markscheme[docs]', file));
console.log(formData,"formdata")
       for (const pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }
    try {
      await updateQuestion({ questionId: selectedId, formData }).unwrap();
      navigate(`/create-Assignment/${assignmentSubTopicId}`);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
<div className=" mb-4 text-center w-full">
  {subQuestionsHide && (
    <div className="p-8">
      <div className="grid grid-cols-12 gap-4 mt-8">
        <div className="col-span-12 md:col-span-10 lg:col-span-10.2 w-full ">
          <div className="ml-auto mb-1.5 sm:col-span-6 md:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={marks}
              onChange={handleMarksChange}
            />
          </div>
          
          <EditorFile
            content={editorContent}
            onEditorChange={(newContent) => setEditorContent(newContent)}
          />
          
          <div className="flex justify-between mb-2 mt-4">
            <div className="flex">
              <button 
                onClick={() => document.getElementById('image').click()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert Image"
              >
                <PiImageFill />
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
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert Video"
              >
                <PiVideoFill />
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
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert PDF"
              >
                <BiFileFind />
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
          </div>
          
          <div className="flex flex-col mt-4">
            <div className="flex flex-col mt-4">
              <div className="flex flex-wrap">
                {uploadedImages.length > 0 ? uploadedImages.map((image, index) => {
                  const imageUrl = image instanceof File 
                    ? URL.createObjectURL(image) 
                    : `${API_URL_Images}${image}`;
                  return (
                    <div key={index} className="w-[48%] m-[1%]">
                      <img
                        src={imageUrl}
                        alt={`Uploaded ${index}`}
                        className="w-full h-auto rounded-lg"
                      />
                      <button
                        onClick={() => removeFile('image', index, 'main')}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                      >
                        <FiDelete className="mr-1" />
                        Remove
                      </button>
                    </div>
                  );
                }) : (
                  <p>No images uploaded yet.</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap">
              {uploadedVideos.map((video, index) => {
                const videoUrl = video instanceof File 
                  ? URL.createObjectURL(video) 
                  : `${API_URL_Videos}${video}`;
                return (
                  <div key={index} className="w-[48%] m-[1%]">
                    <video controls className="w-full h-auto">
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <button 
                      onClick={() => removeFile('video', index, 'main')}
                      className="text-red-500 p-1"
                    >
                      <FiDelete/>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap">
              {uploadedPdfs.map((pdf, index) => {
                const pdfUrl = pdf instanceof File 
                  ? URL.createObjectURL(pdf)
                  : `${API_URL_PDF}${pdf}`;
                return (
                  <div key={index} className="w-[48%] m-[1%] border border-gray-300 rounded">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[500px]"
                      frameBorder="0"
                      title={`Uploaded PDF ${index}`}
                    />
                    <div className="text-center mt-2.5">
                      <button 
                        onClick={() => removeFile('pdf', index, 'main')}
                        className="text-red-500 p-1"
                      >
                        <FiDelete/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <label className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          checked={showAnswerKeyEditor}
          onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span>Add Answer Type</span>
      </label>
      
      {showAnswerKeyEditor && (
        <>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Answer Type</label>
            <select
              value={selectedAnswerType}
              onChange={(e) => setSelectedAnswerType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
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
              iconButtonStyle="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
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
              iconButtonStyle="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
            />
          )}
          
          {selectedAnswerType === 'both' && (
            <>
              <h4 className="text-lg font-medium mt-4">Answer Key</h4>
              <ModelAnswer
                editorContent={answerKeyContent}
                setEditorContent={setAnswerKeyContent}
                images={answerKeyImages}
                videos={answerKeyVideos}
                pdfs={answerKeyPdfs}
                handleFileChange={(type, e) => handleFileChange(type, e, 'answerKey')}
                removeFile={(type, index) => removeFile(type, index, 'answerKey')}
                iconButtonStyle="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              />
              
              <h4 className="text-lg font-medium mt-4">Model Answer</h4>
              <ModelAnswer
                editorContent={modelAnswerContent}
                setEditorContent={setModelAnswerContent}
                images={modelAnswerImages}
                videos={modelAnswerVideos}
                pdfs={modelAnswerPdfs}
                handleFileChange={(type, e) => handleFileChange(type, e, 'modelAnswer')}
                removeFile={(type, index) => removeFile(type, index, 'modelAnswer')}
                iconButtonStyle="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              />
            </>
          )}
        </>
      )}
      
      <label className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          checked={showMarkSchemeEditor}
          onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <span>Add Mark Scheme</span>
      </label>
      
      {showMarkSchemeEditor && (
        <div className="text-center">
          <EditorFile
            content={markSchemeContent}
            onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
          />
          
          <div className="flex justify-between mb-2 mt-4">
            <div className="flex">
              <button 
                onClick={() => document.getElementById('markImage').click()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert Image"
              >
                <PiImageFill />
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
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert Video"
              >
                <PiVideoFill/>
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
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="Insert PDF"
              >
                <BiFileFind />
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
          
          <div className="flex flex-col mt-4">
            <div className="flex flex-wrap">
              {markSchemeImages.map((image, index) => {
                const imageUrl = image instanceof Blob 
                  ? URL.createObjectURL(image)
                  : `${API_URL_Images}${image}`;
                return (
                  <div key={index} className="w-[30%] m-[1%]">
                    <img
                      src={imageUrl}
                      alt={`Mark Scheme Image ${index}`}
                      className="w-full h-auto"
                    />
                    <button 
                      onClick={() => removeFile('image', index, 'markScheme')}
                      className="text-red-500 p-1"
                    >
                      <FiDelete/>
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap">
              {markSchemeVideos.map((video, index) => {
                const videoUrl = video instanceof Blob 
                  ? URL.createObjectURL(video)
                  : `${API_URL_Videos}${video}`;
                return (
                  <div key={index} className="w-[30%] m-[1%]">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-auto"
                    />
                    <button 
                      onClick={() => removeFile('video', index, 'markScheme')}
                      className="text-red-500 p-1"
                    >
                      <FiDelete />
                    </button>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap">
              {markSchemePdfs.map((pdf, index) => {
                const pdfUrl = pdf instanceof Blob 
                  ? URL.createObjectURL(pdf)
                  : `${API_URL_PDF}${pdf}`;
                return (
                  <div key={index} className="w-[30%] m-[1%]">
                    <iframe
                      src={pdfUrl}
                      className="w-full h-[500px]"
                      frameBorder="0"
                      title={`Mark Scheme PDF ${index}`}
                    />
                    <button 
                      onClick={() => removeFile('pdf', index, 'markScheme')}
                      className="text-red-500 p-1"
                    >
                      <FiDelete />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Question
        </button>
      </div>
      
      {loading && (
        <div>Loading.....................</div>
      )}
    </div>
  )}
</div>
  );
};

export default MianEditQuestion