import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from '../../Quetsion-master/Create-Question/FinalPreviwe';
import { useDeleteSubQuestionMutation, useUpdateSubQuestionMutation } from "../../../Services/CreateQuestion/CreateQuestionApi";
import { Api } from "../../../Api/Api";
import EditorFile from "../../Quetsion-master/Create-Question/MianQues/EditorFile";
import { ImImage } from "react-icons/im";
import { BiImage, BiVideo } from "react-icons/bi";
import { GrVideo } from "react-icons/gr";
import { FiDelete } from "react-icons/fi";
import { PiDnaFill } from "react-icons/pi";


const SubquestionEdit = () => {
  const [subQuestions, setSubQuestions] = useState([]);
  const [marksList, setMarksList] = useState([]);
  const [editorContentList, setEditorContentList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [answerKeyContent, setAnswerKeyContent] = useState("");
  const [answerKeyImages, setAnswerKeyImages] = useState([]);
  const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  const [loading ,setLoading]=useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  const [markSchemeContent, setMarkSchemeContent] = useState("");
  const [markSchemeImages, setMarkSchemeImages] = useState([]);
  const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  const [markSchemePdfs, setMarkSchemePdfs] = useState([]);
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
  const [answerModelContent, setAnswerModelContent] = useState(' ');
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const API_URL = "http://myrevisionplus.com/api/img/question/";
  const assignmentSubTopicId = useSelector(state => state.idSlice.assignmentSubTopicId);
  const [updateQuestion] = useUpdateSubQuestionMutation();
  const subQuestionId = "66f27843ed01bf8ca5ecc8cf"; 
  const navigate = useNavigate();
  const [deleteQuestion] = useDeleteSubQuestionMutation();
  const selectedSubquestionId = useSelector((state) => state.idSlice.selectedSubquestionId);
  const selectedId = useSelector((state) => state.idSlice.selectedId);
  console.log(selectedId ,"id for mainquestion")
  console.log(selectedSubquestionId ,"selected sub id .......................")
  const fetchQuestions = async () => {
    try {
      const response = await Api.get(`/questions/fullquestion/${selectedId}`);
     
      const questionData = response?.data?.data?.questions || [];
      
      // Filter the questions based on selected subquestion ID
      const filteredQuestions = questionData.subquestions?.filter(
        (sub) => sub._id === selectedSubquestionId
      ) || [];
    
      // Set subquestions
      setSubQuestions(filteredQuestions);
  
      // Set marks and titles
      setMarksList(filteredQuestions.map((sub) => sub.marks || "0"));
      setEditorContentList(filteredQuestions.map((sub) => sub.title || ""));
  
      // Set uploaded media content based on availability
      setUploadedImages(filteredQuestions.flatMap((sub) => sub.images || []));
      setUploadedVideos(filteredQuestions.flatMap((sub) => sub.videos || []));
      setUploadedPdfs(filteredQuestions.flatMap((sub) => sub.docs || []));
  
      // Keep the original media for further processing or restoration
      setKeepImages(filteredQuestions.flatMap((sub) => sub.images || []));
      setKeepVideos(filteredQuestions.flatMap((sub) => sub.videos || []));
      setKeepPdfs(filteredQuestions.flatMap((sub) => sub.docs || []));
  
      // Set Answer Key data
      setAnswerKeyContent(filteredQuestions.flatMap((sub) => sub.answer_key?.description || ""));
      setAnswerKeyImages(filteredQuestions.flatMap((sub) => sub.answer_key?.images || []));
      setAnswerKeyVideos(filteredQuestions.flatMap((sub) => sub.answer_key?.videos || []));
      setAnswerKeyPdfs(filteredQuestions.flatMap((sub) => sub.answer_key?.docs || []));
      setAnswerModelContent(filteredQuestions.flatMap((sub) => sub.answer_model?.description || ""))
      // Keep Answer Key data
      setKeepImagesAnawerkey(filteredQuestions.flatMap((sub) => sub.answer_key?.images || []));
      setKeepVideosAnawerkey(filteredQuestions.flatMap((sub) => sub.answer_key?.videos || []));
      setKeepPdfsAnawerkey(filteredQuestions.flatMap((sub) => sub.answer_key?.docs || []));
      setKeepImagesModelAnswer(filteredQuestions.flatMap((sub) => sub.answer_model?.images || []));
      setKeepVideosModelAnswer(filteredQuestions.flatMap((sub) => sub.answer_model?.images || []));
      setKeepPdfsModelAnswer(filteredQuestions.flatMap((sub) => sub.answer_model?.images || []));
      setModelAnswerImages(filteredQuestions.flatMap((sub) => sub.answer_model?.modelimages || []));
      setModelAnswerVideos(filteredQuestions.flatMap((sub) => sub.answer_model?.images || []));
      setModelAnswerPdfs(filteredQuestions.flatMap((sub) => sub.answer_model?.images || []));
      setMarkSchemeContent(filteredQuestions.flatMap((sub) => sub.markscheme?.description || ""));
      setMarkSchemeImages(filteredQuestions.flatMap((sub) => sub.markscheme?.images || []));
      setMarkSchemeVideos(filteredQuestions.flatMap((sub) => sub.markscheme?.videos || []));
      setMarkSchemePdfs(filteredQuestions.flatMap((sub) => sub.markscheme?.docs || []));
      
      // Keep Mark Scheme data
      setKeepImagesMarksheme(filteredQuestions.flatMap((sub) => sub.markscheme?.images || []));
      setKeepVideosMarksheme(filteredQuestions.flatMap((sub) => sub.markscheme?.videos || []));
      setKeepPdfsMarksheme(filteredQuestions.flatMap((sub) => sub.markscheme?.docs || []));
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchQuestions();
  }, [showAnswerKeyEditor]);
  

  const handleEditSubQuestion = (index, updatedData) => {
    const updatedSubQuestions = [...subQuestions];
    updatedSubQuestions[index] = updatedData;
    setSubQuestions(updatedSubQuestions);
  };
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
    const setter = contextMap[context]?.[type];
    if (setter) {
      setter((prev) => prev.slice(0, index).concat(prev.slice(index + 1)));
    }
  };

  const handleMarksChange = (index, value) => {
    const updatedMarksList = [...marksList];
    updatedMarksList[index] = value;
    setMarksList(updatedMarksList);
  };

  const handleEditorContentChange = (index, newContent) => {
    const updatedEditorContentList = [...editorContentList];
    updatedEditorContentList[index] = newContent;
    setEditorContentList(updatedEditorContentList);
  };
 
  const handleEditorAnswerKeyContentChange = (index, newContent) => {
    const updatedEditorContentList = [...answerKeyContent];
    updatedEditorContentList[index] = newContent;
    setAnswerKeyContent(updatedEditorContentList);
  };
  const handleEditorAnswerModelContentChange = (index, newContent) => {
    const updatedEditorContentList = [...answerKeyContent];
    updatedEditorContentList[index] = newContent;
    setAnswerModelContent(updatedEditorContentList);
  };
  const handleMarkSchemeEditorContentChange = (index, newContent) => {
    const updatedEditorContentList = [...markSchemeContent];
    updatedEditorContentList[index] = newContent;
    setMarkSchemeContent(updatedEditorContentList);
  };
  const iconButtonStyle = {
    color: "white",
    background: "linear-gradient(90deg, #1f90fe,#74b0ec,#c571bd)",
    width: "40px",
    height: "40px",
    marginRight: "8px",
    border: "1px solid black",
  };
  const handleSubmit = async () => {
    setLoading(true);
  
    const formData = new FormData();

    formData.append('title', editorContentList);
    formData.append('question_id',selectedId ); 
    formData.append('criteria', "Yes");
    formData.append('marks', marksList);
    formData.append('keepImages', JSON.stringify(keepImages));
    formData.append('keepVideos', JSON.stringify(keepVideos)); 
    formData.append('keepDocs', JSON.stringify(keepPdfs));   
    formData.append('keepAnswerkeyImages', JSON.stringify(keepImagesAnawerkey));
    formData.append('keepAnswerkeyVideos', JSON.stringify(keepVideosAnawerkey));
    formData.append('keepAnswerkeyDocs', JSON.stringify(keepPdfsAnawerkey));
    formData.append('keepMarkschemeImages', JSON.stringify(keepImagesMarksheme));
    formData.append('keepMarkschemeVideos', JSON.stringify(keepVideosMarksheme));
    formData.append('keepMarkschemeDocs', JSON.stringify(keepPdfsMarksheme));
    formData.append('keepAnswerModelImages', JSON.stringify(keepImagesModelAnswer));
    formData.append('keepAnswerModelVideos', JSON.stringify(keepVideosModelAnswer));
    formData.append('keepAnswerModelDocs', JSON.stringify(keepPdfsModelAnswer));
   
    uploadedImages.forEach((file) => formData.append('images', file));
    uploadedVideos.forEach((file) => formData.append('videos', file));
    uploadedPdfs.forEach((file) => formData.append('docs', file))
    formData.append('answer_key_description', answerKeyContent); 
    answerKeyImages.forEach((file) => formData.append('answer_key[images]', file));
    answerKeyVideos.forEach((file) => formData.append('answer_key[videos]', file));
    answerKeyPdfs.forEach((file) => formData.append('answer_key[docs]', file));
    formData.append('markscheme_description',markSchemeContent);
  markSchemeImages.forEach((file) => formData.append('markscheme[images]', file));
    markSchemeVideos.forEach((file) => formData.append('markscheme[videos]', file));
    markSchemePdfs.forEach((file) => formData.append('markscheme[docs]', file));
    formData.append('answer_model_description', answerModelContent); 
    modelAnswerImages.forEach((file) => formData.append('answer_model[images]', file));
    modelAnswerVideos.forEach((file) => formData.append('answer_model[videos]', file));
    modelAnswerPdfs.forEach((file) => formData.append('answer_model[docs]', file));
    try {
   
      await updateQuestion({ questionId: selectedSubquestionId, formData }).unwrap();
      navigate(`/create-Assignment/${assignmentSubTopicId}`);

      
    } catch (error) {

      console.error('Error submitting form:', error);
    }
  
    setLoading(false);
  };
  

  return (
    <div className=" text-center w-full mx-auto">
    {subQuestions.map((subQuestion, index) => (
      <div key={index} className=" mb-4 p-4">
        <div className="grid grid-cols-12 gap-4 mt-12 border border-gray-30 p-8">
          {/* Subquestion Marks */}
          <div className="col-span-12 sm:col-span-6 md:col-span-2 ml-auto mb-1.5 flex justify-end items-center">
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={marksList[index] || ""}
              onChange={(e) => handleMarksChange(index, e.target.value)}
            />
          </div>
  
          {/* Subquestion Editor */}
          <div className="col-span-12">
            <EditorFile
              content={editorContentList[index] || ""}
              onEditorChange={(newContent) =>
                handleEditorContentChange(index, newContent)
              }
            />
  
            {/* Upload Buttons */}
            <div className="flex justify-start mb-2 mt-4">
              {['image', 'video', 'pdf'].map((type) => (
                <button
                  key={type}
                  onClick={() => document.getElementById(`main${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                >
                  {type === 'image' ? <ImImage/> : type === 'video' ? <BiVideo /> : <PiDnaFill />}
                </button>
              ))}
              {['image', 'video', 'pdf'].map((type) => (
                <input
                  key={type}
                  type="file"
                  id={`main${type.charAt(0).toUpperCase() + type.slice(1)}`}
                  className="hidden"
                  accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                  multiple
                  onChange={(e) => handleFileChange(type, e, 'main')}
                />
              ))}
            </div>
  
            {/* Uploaded Files Display */}
            {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
              const mediaArray = idx === 0 ? uploadedImages : idx === 1 ? uploadedVideos : uploadedPdfs;
              const isImage = mediaType === 'Images';
  
              return mediaArray.length > 0 ? (
                <div className="flex flex-col mt-4" key={mediaType}>
                  <h6 className="text-lg font-medium mb-2">{mediaType}</h6>
                  <div className="flex flex-wrap">
                    {mediaArray.map((file, fileIndex) => {
                      const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                      const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                      const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
  
                      return (
                        <div key={fileIndex} className="w-[48%] m-[1%]">
                          {isImage ? (
                            <img src={fileUrl} alt={`main ${fileIndex}`} className="w-full rounded-lg" />
                          ) : idx === 1 ? (
                            <video src={fileUrl1} controls className="w-full rounded-lg" />
                          ) : (
                            <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                          )}
                          <button
                            onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'main')}
                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                          >
                            <FiDelete className="mr-1" />
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            })}
  
            {/* Answer Type Section */}
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
                  <div className="text-center">
                    <h4 className="text-lg font-medium">Answer Key Editor</h4>
                    <EditorFile
                      content={answerKeyContent[index] || ""}
                      onEditorChange={(newContent) =>
                        handleEditorAnswerKeyContentChange(index, newContent)
                      }
                    />
  
                    <div className="flex justify-start mb-2 mt-4">
                      {['image', 'video', 'pdf'].map((type) => (
                        <button
                          key={type}
                          onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        >
                          {type === 'image' ? <BiImage /> : type === 'video' ? <GrVideo n /> : <PiDnaFill />}
                        </button>
                      ))}
                      {['image', 'video', 'pdf'].map((type) => (
                        <input
                          key={type}
                          type="file"
                          id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}`}
                          className="hidden"
                          accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                          multiple
                          onChange={(e) => handleFileChange(type, e, 'answerKey')}
                        />
                      ))}
                    </div>
  
                    {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
                      const mediaArray = idx === 0 ? answerKeyImages : idx === 1 ? answerKeyVideos : answerKeyPdfs;
                      const isImage = mediaType === 'Images';
                      
                      return (
                        <div className="flex flex-col mt-4" key={mediaType}>
                          <div className="flex flex-wrap">
                            {mediaArray.length > 0 ? (
                              mediaArray.map((file, fileIndex) => {
                                const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                                const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                                const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
                                
                                return (
                                  <div key={fileIndex} className="w-[48%] m-[1%]">
                                    {isImage ? (
                                      <img src={fileUrl} alt={`Answer Key ${fileIndex}`} className="w-full rounded-lg" />
                                    ) : idx === 1 ? (
                                      <video src={fileUrl1} controls className="w-full rounded-lg" />
                                    ) : (
                                      <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                                    )}
                                    <button
                                      onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'answerKey')}
                                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                                    >
                                      <FiDelete className="mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No {mediaType} Uploaded</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
  
                {selectedAnswerType === 'modelAnswer' && (
                  <>
                    <h4 className="text-lg font-medium">Model Answer</h4>
                    <EditorFile
                      content={answerModelContent[index] || ""}
                      onEditorChange={(newContent) =>
                        handleEditorAnswerModelContentChange(index, newContent)
                      }
                    />
  
                    <div className="flex justify-start mb-2 mt-4">
                      {['image', 'video', 'pdf'].map((type) => (
                        <button
                          key={type}
                          onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        >
                          {type === 'image' ? <BiImage/> : type === 'video' ? <GrVideo  /> : <PiDnaFill />}
                        </button>
                      ))}
                      {['image', 'video', 'pdf'].map((type) => (
                        <input
                          key={type}
                          type="file"
                          id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}`}
                          className="hidden"
                          accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                          multiple
                          onChange={(e) => handleFileChange(type, e, 'modelAnswer')}
                        />
                      ))}
                    </div>
  
                    {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
                      const mediaArray = idx === 0 ? modelAnswerImages : idx === 1 ? modelAnswerVideos : modelAnswerPdfs;
                      const isImage = mediaType === 'Images';
                      
                      return (
                        <div className="flex flex-col mt-4" key={mediaType}>
                          <div className="flex flex-wrap">
                            {mediaArray.length > 0 ? (
                              mediaArray.map((file, fileIndex) => {
                                const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                                const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                                const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
                                
                                return (
                                  <div key={fileIndex} className="w-[48%] m-[1%]">
                                    {isImage ? (
                                      <img src={fileUrl} alt={`Model Answer ${fileIndex}`} className="w-full rounded-lg" />
                                    ) : idx === 1 ? (
                                      <video src={fileUrl1} controls className="w-full rounded-lg" />
                                    ) : (
                                      <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                                    )}
                                    <button
                                      onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'modelAnswer')}
                                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                                    >
                                      <FiDelete className="mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No {mediaType} Uploaded</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
  
                {selectedAnswerType === 'both' && (
                  <>
                    <h4 className="text-lg font-medium">Answer Key Editor</h4>
                    <EditorFile
                      content={answerKeyContent[index] || ""}
                      onEditorChange={(newContent) =>
                        handleEditorAnswerKeyContentChange(index, newContent)
                      }
                    />
  
                    <div className="flex justify-start mb-2 mt-4">
                      {['image', 'video', 'pdf'].map((type) => (
                        <button
                          key={type}
                          onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        >
                          {type === 'image' ? <BiImage /> : type === 'video' ? <GrVideo /> : <PiDnaFill />}
                        </button>
                      ))}
                      {['image', 'video', 'pdf'].map((type) => (
                        <input
                          key={type}
                          type="file"
                          id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}`}
                          className="hidden"
                          accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                          multiple
                          onChange={(e) => handleFileChange(type, e, 'answerKey')}
                        />
                      ))}
                    </div>
  
                    {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
                      const mediaArray = idx === 0 ? answerKeyImages : idx === 1 ? answerKeyVideos : answerKeyPdfs;
                      const isImage = mediaType === 'Images';
                      
                      return (
                        <div className="flex flex-col mt-4" key={mediaType}>
                          <div className="flex flex-wrap">
                            {mediaArray.length > 0 ? (
                              mediaArray.map((file, fileIndex) => {
                                const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                                const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                                const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
                                
                                return (
                                  <div key={fileIndex} className="w-[48%] m-[1%]">
                                    {isImage ? (
                                      <img src={fileUrl} alt={`Answer Key ${fileIndex}`} className="w-full rounded-lg" />
                                    ) : idx === 1 ? (
                                      <video src={fileUrl1} controls className="w-full rounded-lg" />
                                    ) : (
                                      <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                                    )}
                                    <button
                                      onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'answerKey')}
                                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                                    >
                                      <FiDelete className="mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No {mediaType} Uploaded</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
  
                    <h4 className="text-lg font-medium mt-8">Model Answer</h4>
                    <EditorFile
                      content={answerModelContent[index] || ""}
                      onEditorChange={(newContent) =>
                        handleEditorAnswerModelContentChange(index, newContent)
                      }
                    />
  
                    <div className="flex justify-start mb-2 mt-4">
                      {['image', 'video', 'pdf'].map((type) => (
                        <button
                          key={type}
                          onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                          title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        >
                          {type === 'image' ? <BiImage /> : type === 'video' ? <GrVideo /> : <PiDnaFill />}
                        </button>
                      ))}
                      {['image', 'video', 'pdf'].map((type) => (
                        <input
                          key={type}
                          type="file"
                          id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}`}
                          className="hidden"
                          accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                          multiple
                          onChange={(e) => handleFileChange(type, e, 'modelAnswer')}
                        />
                      ))}
                    </div>
  
                    {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
                      const mediaArray = idx === 0 ? modelAnswerImages : idx === 1 ? modelAnswerVideos : modelAnswerPdfs;
                      const isImage = mediaType === 'Images';
                      
                      return (
                        <div className="flex flex-col mt-4" key={mediaType}>
                          <div className="flex flex-wrap">
                            {mediaArray.length > 0 ? (
                              mediaArray.map((file, fileIndex) => {
                                const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                                const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                                const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
                                
                                return (
                                  <div key={fileIndex} className="w-[48%] m-[1%]">
                                    {isImage ? (
                                      <img src={fileUrl} alt={`Model Answer ${fileIndex}`} className="w-full rounded-lg" />
                                    ) : idx === 1 ? (
                                      <video src={fileUrl1} controls className="w-full rounded-lg" />
                                    ) : (
                                      <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                                    )}
                                    <button
                                      onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'modelAnswer')}
                                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                                    >
                                      <FiDelete className="mr-1" />
                                      Remove
                                    </button>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No {mediaType} Uploaded</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
  
            {/* Mark Scheme Section */}
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
                <h4 className="text-lg font-medium">Mark Scheme Editor</h4>
                <EditorFile
                  content={markSchemeContent[index] || ""}
                  onEditorChange={(newContent) =>
                    handleMarkSchemeEditorContentChange(index, newContent)
                  }
                />
  
                <div className="flex justify-start mb-2 mt-4">
                  {['image', 'video', 'pdf'].map((type) => (
                    <button
                      key={type}
                      onClick={() => document.getElementById(`mark${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                      title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                    >
                      {type === 'image' ? <BiImage /> : type === 'video' ? <GrVideo/> : <PiDnaFill />}
                    </button>
                  ))}
                  {['image', 'video', 'pdf'].map((type) => (
                    <input
                      key={type}
                      type="file"
                      id={`mark${type.charAt(0).toUpperCase() + type.slice(1)}`}
                      className="hidden"
                      accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                      multiple
                      onChange={(e) => handleFileChange(type, e, 'markScheme')}
                    />
                  ))}
                </div>
  
                {['Images', 'Videos', 'PDFs'].map((mediaType, idx) => {
                  const mediaArray = idx === 0 ? markSchemeImages : idx === 1 ? markSchemeVideos : markSchemePdfs;
                  const isImage = mediaType === 'Images';
                  
                  return (
                    <div className="flex flex-col mt-4" key={mediaType}>
                      <div className="flex flex-wrap">
                        {mediaArray.length > 0 ? (
                          mediaArray.map((file, fileIndex) => {
                            const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Images}${file}`;
                            const fileUrl1 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_Videos}${file}`;
                            const fileUrl2 = file instanceof File ? URL.createObjectURL(file) : `${API_URL_PDF}${file}`;
                            
                            return (
                              <div key={fileIndex} className="w-[48%] m-[1%]">
                                {isImage ? (
                                  <img src={fileUrl} alt={`Mark Scheme ${fileIndex}`} className="w-full rounded-lg" />
                                ) : idx === 1 ? (
                                  <video src={fileUrl1} controls className="w-full rounded-lg" />
                                ) : (
                                  <iframe src={fileUrl2} className="w-full h-[800px] border border-gray-200 rounded-lg" />
                                )}
                                <button
                                  onClick={() => removeFile(idx === 0 ? 'image' : idx === 1 ? 'video' : 'pdf', fileIndex, 'markScheme')}
                                  className="bg-red-500 text-white px-3 py-1 rounded flex items-center mt-2"
                                >
                                  <FiDelete className="mr-1" />
                                  Remove
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p>No {mediaType} Uploaded</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
  
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Question
          </button>
        </div>
  
        {loading && <Loading />}
        
        {/* Toast/Snackbar would need to be implemented with a toast library */}
        {/* <ToastContainer /> */}
        
        {/* Custom Snackbar implementation */}
        {snackbarOpen && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
            {snackbarMessage}
            <button 
              onClick={() => setSnackbarOpen(false)}
              className="ml-4"
            >
              ×
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
  );
};

export default SubquestionEdit;
