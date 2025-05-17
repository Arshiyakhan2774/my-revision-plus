
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL_Images, API_URL_PDF, API_URL_Videos } from '../../Quetsion-master/Create-Question/FinalPreviwe';
import { useEffect, useState } from "react";
import { useUpdateSubChildQuestionMutation } from "../../../Services/CreateQuestion/CreateQuestionApi";
import { Api } from "../../../Api/Api";
import EditorFile from "../../Quetsion-master/Create-Question/MianQues/EditorFile";
import { FaRegFilePdf } from "react-icons/fa6";
import { ImImage } from "react-icons/im";
import { GrVideo } from "react-icons/gr";


const SubchildQuestionEdit = () => {
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
  const [subChildQuestions ,setSubChildQuestions]=useState([]);
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
  const [answerModelContent, setAnswerModelContent] = useState('');
  const [modelAnswerImages, setModelAnswerImages] = useState([]);
  const [modelAnswerVideos, setModelAnswerVideos] = useState([]);
  const [modelAnswerPdfs, setModelAnswerPdfs] = useState([]);
  const API_URL = "http://myrevisionplus.com/api/img/question/";
  const assignmentSubTopicId = useSelector(state => state.idSlice.assignmentSubTopicId);
  const [updateQuestion] = useUpdateSubChildQuestionMutation();
  const navigate = useNavigate();
  const selectedSubquestionId = useSelector((state) => state.idSlice.selectedSubquestionId);
  const selectedSubChildquestionId = useSelector((state) => state.idSlice.selectedSubChildquestionId);
  const selectedId = useSelector((state) => state.idSlice.selectedId);
  
  const fetchQuestions = async () => {
    try {
      const response = await Api.get(`/questions/fullquestion/${selectedId}`);
      
  
      const questionData = response?.data?.data?.questions || [];
  
      // Filter the main subquestion by its ID
      const filteredQuestions = questionData.subquestions?.filter(
        (sub) => sub._id === selectedSubquestionId
      ) || [];
  
      // Now filter the subchildquestions by the SubchildquestionId
      const filteredSubChildQuestions = filteredQuestions.flatMap((sub) =>
        sub.subchildquestions ? sub.subchildquestions.filter(
          (subchild) => subchild._id === selectedSubChildquestionId
        ) : []
      );
  
      if (filteredSubChildQuestions.length > 0) {
        const subchild = filteredSubChildQuestions[0]; // Assuming you want the first matching subchild question
  
        // Set editor and media content for the matched subchild question
        setEditorContentList([subchild.title || ""]);
        setMarksList([subchild.marks || "0"]);
  
        // Set uploaded media content for the matched subchild question using flatMap
        setUploadedImages(subchild.images ? [subchild.images].flat() : []);
        setUploadedVideos(subchild.videos ? [subchild.videos].flat() : []);
        setUploadedPdfs(subchild.docs ? [subchild.docs].flat() : []);
        setKeepImages(subchild.images ? [subchild.images].flat() : []);
        setKeepVideos(subchild.videos ? [subchild.videos].flat() : []);
        setKeepPdfs(subchild.docs ? [subchild.docs].flat() : []);
  
        // Set Answer Key data using flatMap
        setAnswerKeyContent([subchild.answer_key?.description || ""]);
        setAnswerKeyImages(subchild.answer_key?.images ? [subchild.answer_key.images].flat() : []);
        setAnswerKeyVideos(subchild.answer_key?.videos ? [subchild.answer_key.videos].flat() : []);
        setAnswerKeyPdfs(subchild.answer_key?.docs ? [subchild.answer_key.docs].flat() : []);
        setAnswerModelContent([subchild.answer_model?.description || ""])
        setKeepImagesAnawerkey(subchild.answer_key?.images ? [subchild.answer_key.images].flat() : []);
        setKeepVideosAnawerkey(subchild.answer_key?.videos ? [subchild.answer_key.videos].flat() : []);
        setKeepPdfsAnawerkey(subchild.answer_key?.docs ? [subchild.answer_key.docs].flat() : []);
        setKeepImagesMarksheme(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : [])
        setKeepImagesModelAnswer(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setKeepVideosModelAnswer(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setKeepPdfsModelAnswer(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setModelAnswerImages(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setModelAnswerVideos(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setModelAnswerPdfs(subchild.answer_model?.images ? [subchild.answer_model.images].flat() : []);
        setKeepVideosMarksheme(subchild.markscheme?.videos ? [subchild.markscheme.videos].flat() : []);
        setKeepPdfsMarksheme(subchild.markscheme?.docs ? [subchild.markscheme.docs].flat() : []);
        setMarkSchemeContent([subchild.markscheme?.description || ""]);
        setMarkSchemeImages(subchild.markscheme?.images ? [subchild.markscheme.images].flat() : []);
        setMarkSchemeVideos(subchild.markscheme?.videos ? [subchild.markscheme.videos].flat() : []);
        setMarkSchemePdfs(subchild.markscheme?.docs ? [subchild.markscheme.docs].flat() : []);
        
        setSubChildQuestions(filteredSubChildQuestions);
      } else {
        console.error("No subchild question found for the given SubchildquestionId");
      }
  
      // Set the filtered subquestion data (in case it's used elsewhere)
      setSubQuestions(filteredQuestions);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchQuestions();
  }, []);
  
  

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
  const handleMarkSchemeEditorContentChange = (index, newContent) => {
    const updatedEditorContentList = [...markSchemeContent];
    updatedEditorContentList[index] = newContent;
    setMarkSchemeContent(updatedEditorContentList);
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
  const handleSubmit = async () => {
    setLoading(true);
  
    const formData = new FormData();
  
  
    // Append base question details
    formData.append('title', editorContentList);
    formData.append('question_id', selectedId);
    formData.append('subquestion_id', selectedSubquestionId);
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
   
  
    subQuestions.forEach((subQuestion, index) => {
      formData.append(`subquestions[${index}][title]`, subQuestion.title);
      formData.append(`subquestions[${index}][marks]`, subQuestion.marks);
  
      
      if (subQuestion.subchildquestions) {
        subQuestion.subchildquestions.forEach((subchild, subchildIndex) => {
          formData.append(`subquestions[${index}][subchildquestions][${subchildIndex}][title]`, subchild.title);
          formData.append(`subquestions[${index}][subchildquestions][${subchildIndex}][marks]`, subchild.marks);
        });
      }
    });
    const appendFiles = (fieldName, existingFiles, newFiles) => {
      const allFiles = [...(existingFiles || []), ...(newFiles || [])];
      allFiles.forEach((file) => {
        formData.append(fieldName, file);
      });
    };
    appendFiles('images', subQuestions.images, uploadedImages);
    appendFiles('videos', subQuestions.videos, uploadedVideos);
    appendFiles('docs', subQuestions.docs, uploadedPdfs);
 
    formData.append('answer_key_description', answerKeyContent);
    appendFiles('answer_key[images]', subQuestions.answer_key?.images, answerKeyImages);
    appendFiles('answer_key[videos]', subQuestions.answer_key?.videos, answerKeyVideos);
    appendFiles('answer_key[docs]', subQuestions.answer_key?.docs, answerKeyPdfs);
    formData.append('answer_model_description', answerModelContent);
    appendFiles('answer_model[images]', subQuestions.answer_model?.images, modelAnswerImages);
    appendFiles('answer_model[videos]', subQuestions.answer_model?.videos, modelAnswerVideos);
    appendFiles('answer_model[docs]', subQuestions.answer_model?.docs, modelAnswerPdfs);
  
    formData.append('markscheme_description', markSchemeContent);
    appendFiles('markscheme[images]', subQuestions.markscheme?.images, markSchemeImages);
    appendFiles('markscheme[videos]', subQuestions.markscheme?.videos, markSchemeVideos);
    appendFiles('markscheme[docs]', subQuestions.markscheme?.docs, markSchemePdfs);
  
    try {
      await updateQuestion({ questionId: selectedSubChildquestionId, formData }).unwrap();
      navigate(`/create-Assignment/${assignmentSubTopicId}`);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
    setLoading(false);
  };
  
  return (
   <div className="text-center w-[100%] mx-auto">
          {subChildQuestions.map((subQuestion, index) => (
            <div key={index} className="p-4 mb-4  ">
              <div className="grid grid-cols-12 gap-4 mt-8">
                {/* Subquestion Marks */}
                <div className="col-span-12 sm:col-span-6 md:col-span-2 ml-auto mb-1.5 flex justify-end items-center">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
                    <input
                      type="text"
                      value={marksList[index] || ""}
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
    
                {/* Subquestion Editor */}
                <div className="col-span-12">
                  <EditorFile
                    content={editorContentList[index] || ""}
                    onEditorChange={(newContent) => handleEditorContentChange(index, newContent)}
                  />
    
                  {/* Upload Buttons */}
                  <div className="flex justify-start mb-2 mt-4 space-x-2">
                    {['image', 'video', 'pdf'].map((type) => (
                      <div key={type} className="relative group">
                        <button 
                          onClick={() => document.getElementById(`main${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                          className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                          aria-label={`Insert ${type}`}
                        >
                          {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                           type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                           <FaRegFilePdf className="w-5 h-5" />}
                        </button>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                          <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                          </div>
                        </div>
                        <input
                          type="file"
                          id={`main${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                          className="hidden"
                          accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                          multiple
                          onChange={(e) => handleFileChange(type, e, 'main')}
                        />
                      </div>
                    ))}
                  </div>
    
                  {/* Uploaded Files Display */}
                  {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                    const mediaArray = mediaIndex === 0 ? uploadedImages : 
                                      mediaIndex === 1 ? uploadedVideos : uploadedPdfs;
                    const isImage = mediaType === 'Images';
    
                    return mediaArray.length > 0 && (
                      <div key={mediaType} className="mt-4">
                        <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                        <div className="flex flex-wrap -mx-1">
                          {mediaArray.map((file, fileIndex) => {
                            const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                           mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                           mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                           `${API_URL_PDF}${file}`;
                            
                            return (
                              <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                <div className="relative group">
                                  {isImage ? (
                                    <img 
                                      src={fileUrl} 
                                      alt={`main ${fileIndex}`} 
                                      className="w-full rounded-lg"
                                    />
                                  ) : mediaIndex === 1 ? (
                                    <video 
                                      src={fileUrl} 
                                      controls 
                                      className="w-full rounded-lg"
                                    />
                                  ) : (
                                    <iframe 
                                      src={fileUrl} 
                                      className="w-full h-96 border rounded-lg"
                                      frameBorder="0"
                                    />
                                  )}
                                  <button
                                    onClick={() => removeFile(
                                      mediaIndex === 0 ? 'image' : 
                                      mediaIndex === 1 ? 'video' : 'pdf', 
                                      fileIndex, 
                                      'main'
                                    )}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <FiDelete className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
    
                  {/* Answer Type Toggle */}
                  <div className="flex items-center mt-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showAnswerKeyEditor}
                        onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Add Answer Type</span>
                    </label>
                  </div>
    
                  {showAnswerKeyEditor && (
                    <>
                      {/* Answer Type Selector */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Answer Type</label>
                        <select
                          value={selectedAnswerType}
                          onChange={(e) => setSelectedAnswerType(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="answerKey">Answer Key</option>
                          <option value="modelAnswer">Model Answer</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
    
                      {/* Answer Key Editor */}
                      {selectedAnswerType === 'answerKey' && (
                        <div className="text-center">
                          <h4 className="text-lg font-medium mb-2">Answer Key Editor</h4>
                          <EditorFile
                            content={answerKeyContent[index] || ""}
                            onEditorChange={(newContent) => handleEditorAnswerKeyContentChange(index, newContent)}
                          />
    
                          {/* Answer Key File Upload */}
                          <div className="flex justify-start mb-2 mt-4 space-x-2">
                            {['image', 'video', 'pdf'].map((type) => (
                              <div key={type} className="relative group">
                                <button 
                                  onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                >
                                  {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                                   type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                                   <FaRegFilePdf className="w-5 h-5" />}
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                  <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                                  className="hidden"
                                  accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                                  multiple
                                  onChange={(e) => handleFileChange(type, e, 'answerKey')}
                                />
                              </div>
                            ))}
                          </div>
    
                          {/* Answer Key Files Display */}
                          {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                            const mediaArray = mediaIndex === 0 ? answerKeyImages : 
                                              mediaIndex === 1 ? answerKeyVideos : answerKeyPdfs;
                            const isImage = mediaType === 'Images';
    
                            return mediaArray.length > 0 && (
                              <div key={mediaType} className="mt-4">
                                <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                                <div className="flex flex-wrap -mx-1">
                                  {mediaArray.map((file, fileIndex) => {
                                    const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                                   mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                                   mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                                   `${API_URL_PDF}${file}`;
                                    
                                    return (
                                      <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                        <div className="relative group">
                                          {isImage ? (
                                            <img 
                                              src={fileUrl} 
                                              alt={`Answer Key ${fileIndex}`} 
                                              className="w-full rounded-lg"
                                            />
                                          ) : mediaIndex === 1 ? (
                                            <video 
                                              src={fileUrl} 
                                              controls 
                                              className="w-full rounded-lg"
                                            />
                                          ) : (
                                            <iframe 
                                              src={fileUrl} 
                                              className="w-full h-96 border rounded-lg"
                                              frameBorder="0"
                                            />
                                          )}
                                          <button
                                            onClick={() => removeFile(
                                              mediaIndex === 0 ? 'image' : 
                                              mediaIndex === 1 ? 'video' : 'pdf', 
                                              fileIndex, 
                                              'answerKey'
                                            )}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <FiDelete className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
    
                      {/* Model Answer Editor */}
                      {selectedAnswerType === 'modelAnswer' && (
                        <div className="text-center">
                          <h4 className="text-lg font-medium mb-2">Model Answer</h4>
                          <EditorFile
                            content={answerModelContent[index] || ""}
                            onEditorChange={(newContent) => handleEditorAnswerModelContentChange(index, newContent)}
                          />
    
                          {/* Model Answer File Upload */}
                          <div className="flex justify-start mb-2 mt-4 space-x-2">
                            {['image', 'video', 'pdf'].map((type) => (
                              <div key={type} className="relative group">
                                <button 
                                  onClick={() => document.getElementById(`model${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                >
                                  {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                                   type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                                   <FaRegFilePdf className="w-5 h-5" />}
                                </button>
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                  <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                                  </div>
                                </div>
                                <input
                                  type="file"
                                  id={`model${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                                  className="hidden"
                                  accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                                  multiple
                                  onChange={(e) => handleFileChange(type, e, 'modelAnswer')}
                                />
                              </div>
                            ))}
                          </div>
    
                          {/* Model Answer Files Display */}
                          {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                            const mediaArray = mediaIndex === 0 ? modelAnswerImages : 
                                              mediaIndex === 1 ? modelAnswerVideos : modelAnswerPdfs;
                            const isImage = mediaType === 'Images';
    
                            return mediaArray.length > 0 && (
                              <div key={mediaType} className="mt-4">
                                <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                                <div className="flex flex-wrap -mx-1">
                                  {mediaArray.map((file, fileIndex) => {
                                    const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                                   mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                                   mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                                   `${API_URL_PDF}${file}`;
                                    
                                    return (
                                      <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                        <div className="relative group">
                                          {isImage ? (
                                            <img 
                                              src={fileUrl} 
                                              alt={`Model Answer ${fileIndex}`} 
                                              className="w-full rounded-lg"
                                            />
                                          ) : mediaIndex === 1 ? (
                                            <video 
                                              src={fileUrl} 
                                              controls 
                                              className="w-full rounded-lg"
                                            />
                                          ) : (
                                            <iframe 
                                              src={fileUrl} 
                                              className="w-full h-96 border rounded-lg"
                                              frameBorder="0"
                                            />
                                          )}
                                          <button
                                            onClick={() => removeFile(
                                              mediaIndex === 0 ? 'image' : 
                                              mediaIndex === 1 ? 'video' : 'pdf', 
                                              fileIndex, 
                                              'modelAnswer'
                                            )}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <FiDelete className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
    
                      {/* Both Answer Types */}
                      {selectedAnswerType === 'both' && (
                        <>
                          <div className="text-center mb-8">
                            <h4 className="text-lg font-medium mb-2">Answer Key Editor</h4>
                            <EditorFile
                              content={answerKeyContent[index] || ""}
                              onEditorChange={(newContent) => handleEditorAnswerKeyContentChange(index, newContent)}
                            />
    
                            {/* Answer Key File Upload */}
                            <div className="flex justify-start mb-2 mt-4 space-x-2">
                              {['image', 'video', 'pdf'].map((type) => (
                                <div key={type} className="relative group">
                                  <button 
                                    onClick={() => document.getElementById(`bothAnswer${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                  >
                                    {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                                     type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                                     <FaRegFilePdf className="w-5 h-5" />}
                                  </button>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                      Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    id={`bothAnswer${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                                    className="hidden"
                                    accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                                    multiple
                                    onChange={(e) => handleFileChange(type, e, 'answerKey')}
                                  />
                                </div>
                              ))}
                            </div>
    
                            {/* Answer Key Files Display */}
                            {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                              const mediaArray = mediaIndex === 0 ? answerKeyImages : 
                                                mediaIndex === 1 ? answerKeyVideos : answerKeyPdfs;
                              const isImage = mediaType === 'Images';
    
                              return mediaArray.length > 0 && (
                                <div key={mediaType} className="mt-4">
                                  <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                                  <div className="flex flex-wrap -mx-1">
                                    {mediaArray.map((file, fileIndex) => {
                                      const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                                     mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                                     mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                                     `${API_URL_PDF}${file}`;
                                      
                                      return (
                                        <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                          <div className="relative group">
                                            {isImage ? (
                                              <img 
                                                src={fileUrl} 
                                                alt={`Answer Key ${fileIndex}`} 
                                                className="w-full rounded-lg"
                                              />
                                            ) : mediaIndex === 1 ? (
                                              <video 
                                                src={fileUrl} 
                                                controls 
                                                className="w-full rounded-lg"
                                              />
                                            ) : (
                                              <iframe 
                                                src={fileUrl} 
                                                className="w-full h-96 border rounded-lg"
                                                frameBorder="0"
                                              />
                                            )}
                                            <button
                                              onClick={() => removeFile(
                                                mediaIndex === 0 ? 'image' : 
                                                mediaIndex === 1 ? 'video' : 'pdf', 
                                                fileIndex, 
                                                'answerKey'
                                              )}
                                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <FiDelete className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
    
                          <div className="text-center">
                            <h4 className="text-lg font-medium mb-2">Model Answer</h4>
                            <EditorFile
                              content={answerModelContent[index] || ""}
                              onEditorChange={(newContent) => handleEditorAnswerModelContentChange(index, newContent)}
                            />
    
                            {/* Model Answer File Upload */}
                            <div className="flex justify-start mb-2 mt-4 space-x-2">
                              {['image', 'video', 'pdf'].map((type) => (
                                <div key={type} className="relative group">
                                  <button 
                                    onClick={() => document.getElementById(`bothModel${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                                    className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                  >
                                    {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                                     type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                                     <FaRegFilePdf className="w-5 h-5" />}
                                  </button>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                    <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                      Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                                    </div>
                                  </div>
                                  <input
                                    type="file"
                                    id={`bothModel${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                                    className="hidden"
                                    accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                                    multiple
                                    onChange={(e) => handleFileChange(type, e, 'modelAnswer')}
                                  />
                                </div>
                              ))}
                            </div>
    
                            {/* Model Answer Files Display */}
                            {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                              const mediaArray = mediaIndex === 0 ? modelAnswerImages : 
                                              mediaIndex === 1 ? modelAnswerVideos : modelAnswerPdfs;
                              const isImage = mediaType === 'Images';
    
                              return mediaArray.length > 0 && (
                                <div key={mediaType} className="mt-4">
                                  <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                                  <div className="flex flex-wrap -mx-1">
                                    {mediaArray.map((file, fileIndex) => {
                                      const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                                     mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                                     mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                                     `${API_URL_PDF}${file}`;
                                      
                                      return (
                                        <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                          <div className="relative group">
                                            {isImage ? (
                                              <img 
                                                src={fileUrl} 
                                                alt={`Model Answer ${fileIndex}`} 
                                                className="w-full rounded-lg"
                                              />
                                            ) : mediaIndex === 1 ? (
                                              <video 
                                                src={fileUrl} 
                                                controls 
                                                className="w-full rounded-lg"
                                              />
                                            ) : (
                                              <iframe 
                                                src={fileUrl} 
                                                className="w-full h-96 border rounded-lg"
                                                frameBorder="0"
                                              />
                                            )}
                                            <button
                                              onClick={() => removeFile(
                                                mediaIndex === 0 ? 'image' : 
                                                mediaIndex === 1 ? 'video' : 'pdf', 
                                                fileIndex, 
                                                'modelAnswer'
                                              )}
                                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <FiDelete className="w-4 h-4" />
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </>
                  )}
    
                  {/* Mark Scheme Toggle */}
                  <div className="flex items-center mt-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showMarkSchemeEditor}
                        onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">Add Mark Scheme</span>
                    </label>
                  </div>
    
                  {showMarkSchemeEditor && (
                    <div className="text-center">
                      <h4 className="text-lg font-medium mb-2">Mark Scheme Editor</h4>
                      <EditorFile
                        content={markSchemeContent[index] || ""}
                        onEditorChange={(newContent) => handleMarkSchemeEditorContentChange(index, newContent)}
                      />
    
                      {/* Mark Scheme File Upload */}
                      <div className="flex justify-start mb-2 mt-4 space-x-2">
                        {['image', 'video', 'pdf'].map((type) => (
                          <div key={type} className="relative group">
                            <button 
                              onClick={() => document.getElementById(`mark${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`).click()}
                              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                              {type === 'image' ? <ImImage className="w-5 h-5" /> : 
                               type === 'video' ? <GrVideo className="w-5 h-5" /> : 
                               <FaRegFilePdf className="w-5 h-5" />}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                              <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                Insert {type.charAt(0).toUpperCase() + type.slice(1)}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-0 border-t-2 border-black"></div>
                              </div>
                            </div>
                            <input
                              type="file"
                              id={`mark${type.charAt(0).toUpperCase() + type.slice(1)}-${index}`}
                              className="hidden"
                              accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
                              multiple
                              onChange={(e) => handleFileChange(type, e, 'markScheme')}
                            />
                          </div>
                        ))}
                      </div>
    
                      {/* Mark Scheme Files Display */}
                      {['Images', 'Videos', 'PDFs'].map((mediaType, mediaIndex) => {
                        const mediaArray = mediaIndex === 0 ? markSchemeImages : 
                                          mediaIndex === 1 ? markSchemeVideos : markSchemePdfs;
                        const isImage = mediaType === 'Images';
    
                        return mediaArray.length > 0 && (
                          <div key={mediaType} className="mt-4">
                            <h4 className="text-sm font-medium mb-2 text-left">{mediaType}</h4>
                            <div className="flex flex-wrap -mx-1">
                              {mediaArray.map((file, fileIndex) => {
                                const fileUrl = file instanceof File ? URL.createObjectURL(file) : 
                                               mediaIndex === 0 ? `${API_URL_Images}${file}` :
                                               mediaIndex === 1 ? `${API_URL_Videos}${file}` : 
                                               `${API_URL_PDF}${file}`;
                                
                                return (
                                  <div key={fileIndex} className="w-full sm:w-1/2 px-1 mb-2">
                                    <div className="relative group">
                                      {isImage ? (
                                        <img 
                                          src={fileUrl} 
                                          alt={`Mark Scheme ${fileIndex}`} 
                                          className="w-full rounded-lg"
                                        />
                                      ) : mediaIndex === 1 ? (
                                        <video 
                                          src={fileUrl} 
                                          controls 
                                          className="w-full rounded-lg"
                                        />
                                      ) : (
                                        <iframe 
                                          src={fileUrl} 
                                          className="w-full h-96 border rounded-lg"
                                          frameBorder="0"
                                        />
                                      )}
                                      <button
                                        onClick={() => removeFile(
                                          mediaIndex === 0 ? 'image' : 
                                          mediaIndex === 1 ? 'video' : 'pdf', 
                                          fileIndex, 
                                          'markScheme'
                                        )}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <FiDelete className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Question
                </button>
              </div>
    
              {loading && (
                <div className="mt-4">
                  {/* Loading spinner */}
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };
 


export default SubchildQuestionEdit