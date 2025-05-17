// import { useEffect, useState } from 'react';
// import { FaEdit, FaTrash, FaVideo, FaChevronDown } from 'react-icons/fa';

// const SubChildQuestionView = ({ savedData, handleEdit, handleDelete, label }) => {
//     const [open, setOpen] = useState(false);
//     const [selectedImage, setSelectedImage] = useState('');
//     const [selectedVideo, setSelectedVideo] = useState('');
//     const [showAnswerKey, setShowAnswerKey] = useState(false);
//     const [showMarkScheme, setShowMarkScheme] = useState(false);
//     const [showModelAnswer, setShowModelAnswer] = useState(false);

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
//         script.async = true;
//         document.body.appendChild(script);
    
//         script.onload = () => {
//             if (window.Wiris) {
//                 window.Wiris.config.saveMode = 'xml';
//                 console.log('Wiris saveMode set to XML.');
//             }
//         };
    
//         return () => {
//             document.body.removeChild(script); 
//         };
//     }, [savedData]);

//     const handleOpen = (media, type) => {
//         if (type === 'image') {
//             setSelectedImage(`${API_URL_Images}${media}`);
//         } else if (type === 'video') {
//             setSelectedVideo(`${API_URL_Videos}${media}`);
//         }
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         setSelectedImage('');
//         setSelectedVideo('');
//     };

//     const renderMedia = (mediaArray, type) => {
//         if (!mediaArray || mediaArray.length === 0) return null;

//         return (
//             <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
//                 {mediaArray.map((media, index) => (
//                     <div key={index} className="w-full max-w-[600px] mb-4">
//                         {type === 'image' && (
//                             <img
//                                 src={`${API_URL_Images}${media}`}
//                                 alt={`media-${index}`}
//                                 className="w-full h-auto"
//                             />
//                         )}
//                         {type === 'video' && (
//                             <video controls className="w-full h-auto">
//                                 <source src={media} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                             </video>
//                         )}
//                         {type === 'pdf' && (
//                             <embed
//                                 src={`${API_URL_PDF}${media}`}
//                                 type="application/pdf"
//                                 className="w-full h-[500px]"
//                             />
//                         )}
//                     </div>
//                 ))} 
//             </div>
//         );
//     };
  
//     return (
//         <div className="max-w-xxl flex justify-center items-center">
//             <div className="w-full mb-4 p-3 block text-base whitespace-normal overflow-wrap-break-word word-break-all hyphens-auto border rounded-lg shadow-sm">
//                 <div className="p-2">
//                     <div className="flex justify-between items-center border-b border-gray-300 p-2">
//                         <div className="flex flex-row items-center">
//                             {savedData?.question?.videos?.length > 0 && savedData.question.videos.map((video, index) => (
//                                 <div key={index} title={`Video ${index + 1}`} className="tooltip">
//                                     <button 
//                                         onClick={() => handleOpen(video, 'video')} 
//                                         className="w-9 h-9 flex items-center justify-center rounded-full bg-[#24ECB1] text-white mr-2"
//                                     >
//                                         <FaVideo className="text-sm" />
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex items-center">
//                             <div title="Edit" className="tooltip">
//                                 <button 
//                                     onClick={handleEdit} 
//                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
//                                 >
//                                     <FaEdit className="text-sm" />
//                                 </button>
//                             </div>
//                             <div title="Delete" className="tooltip">
//                                 <button 
//                                     onClick={handleDelete} 
//                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF7A7A] text-white"
//                                 >
//                                     <FaTrash className="text-sm" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="mb-3 mt-5 text-left font-almarai">
//                         <div className="flex justify-end">
//                             <p className="text-base">
//                                 Marks: <strong>[{savedData?.question?.marks || 'N/A'}]</strong>
//                             </p>
//                         </div>
//                         <div className="flex text-xl">
//                             <span className="mr-8">({label})</span>
//                             <div dangerouslySetInnerHTML={{ __html: savedData?.question?.title || 'No Title' }} />
//                         </div>
//                     </div>
                    
//                     <div className="flex flex-wrap justify-center">
//                         <div className="w-[48%] h-auto m-2 relative flex items-center">
//                             <img
//                                 src={selectedImage}
//                                 className="w-full h-auto cursor-pointer"
//                             /> 
//                         </div>
//                     </div>
                    
//                     {savedData?.question?.images?.length > 0 && renderMedia(savedData.question.images, 'image')}
//                     {savedData?.question?.docs?.length > 0 && renderMedia(savedData.question.docs, 'pdf')}

//                     {savedData.question?.answer_key?.description && (
//                         <button
//                             className="flex justify-start items-center w-[15%] text-left normal-case"
//                             onClick={() => setShowAnswerKey(prev => !prev)}
//                         >
//                             {showAnswerKey ? '' : 'Answer-Key'}
//                             <FaChevronDown className="ml-1" />
//                         </button>
//                     )}
                    
//                     {showAnswerKey && (
//                         <div className="mt-2">
//                             <div className="flex justify-between">
//                                 <p className="text-left font-almarai">Answer Key:</p>
//                                 {savedData?.question?.answer_key?.videos?.length > 0 && (
//                                     <div className="flex flex-wrap justify-start">
//                                         {savedData.question.answer_key.videos.map((video, index) => (
//                                             <div key={index} title={`Answer Key Video ${index + 1}`} className="tooltip">
//                                                 <button
//                                                     onClick={() => handleOpen(video, 'video')}
//                                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
//                                                 >
//                                                     <FaVideo className="text-sm" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
                          
//                             {savedData?.question?.answer_key?.description && (
//                                 <p className="font-almarai">
//                                     <div dangerouslySetInnerHTML={{ __html: savedData.question.answer_key.description || 'No Title' }} />
//                                 </p>
//                             )}
//                             {savedData?.question?.answer_key?.images?.length > 0 && renderMedia(savedData.question.answer_key.images, 'image')}
//                             {savedData?.question?.answer_key?.docs?.length > 0 && renderMedia(savedData.question.answer_key.docs, 'pdf')}
//                         </div>
//                     )}
                    
//                     {savedData?.question?.answer_model && (
//                         <button
//                             className="flex justify-start items-center w-[15%] text-left normal-case"
//                             onClick={() => setShowModelAnswer(prev => !prev)}
//                         >
//                             {showModelAnswer ? '' : 'Model-Answer'}
//                             <FaChevronDown className="ml-1" />
//                         </button>
//                     )}
                    
//                     {showModelAnswer && (
//                         <div className="mt-2">
//                             <div className="flex justify-between">
//                                 <p className="text-left font-almarai">Model Answer:</p>
//                                 {savedData?.question?.answer_model?.videos?.length > 0 && (
//                                     <div className="flex flex-wrap justify-start">
//                                         {savedData.question.answer_model.videos.map((video, index) => (
//                                             <div key={index} title={`Model Answer Video ${index + 1}`} className="tooltip">
//                                                 <button
//                                                     onClick={() => handleOpen(video, 'video')}
//                                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
//                                                 >
//                                                     <FaVideo className="text-sm" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                             {savedData?.question?.answer_model && (
//                                 <p className="font-almarai">
//                                     <div dangerouslySetInnerHTML={{ __html: savedData.question.answer_model.description || '' }} />
//                                 </p>
//                             )}
//                             {savedData?.question?.answer_model?.images?.length > 0 && renderMedia(savedData.question.answer_model.images, 'image')}
//                             {savedData?.question?.answer_model?.docs?.length > 0 && renderMedia(savedData.question.answer_model.docs, 'pdf')}
//                         </div>
//                     )}
                    
//                     {savedData?.question?.markscheme?.description && (
//                         <button
//                             className="flex justify-start items-center w-[15%] text-left normal-case"
//                             onClick={() => setShowMarkScheme(prev => !prev)}
//                         >
//                             {showMarkScheme ? '' : 'Mark-scheme'}
//                             <FaChevronDown className="ml-1" />
//                         </button>
//                     )}
                    
//                     {showMarkScheme && (
//                         <div className="mt-2">
//                             <div className="flex justify-between">
//                                 <p className="text-left font-almarai">Mark Scheme:</p>
//                                 {savedData?.question?.markscheme?.videos?.length > 0 && (
//                                     <div className="flex flex-wrap justify-start">
//                                         {savedData.question.markscheme.videos.map((video, index) => (
//                                             <div key={index} title={`Mark Scheme Video ${index + 1}`} className="tooltip">
//                                                 <button
//                                                     onClick={() => handleOpen(video, 'video')}
//                                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF923A] text-white mr-2"
//                                                 >
//                                                     <FaVideo className="text-sm" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                             {savedData?.question?.markscheme?.description && (
//                                 <p className="font-almarai">
//                                     <div dangerouslySetInnerHTML={{ __html: savedData.question.markscheme.description || 'No Title' }} />
//                                 </p>
//                             )}
//                             {savedData?.question?.markscheme?.images?.length > 0 && renderMedia(savedData.question.markscheme.images, 'image')}
//                             {savedData?.question?.markscheme?.docs?.length > 0 && renderMedia(savedData.question.markscheme.docs, 'pdf')}
//                         </div>
//                     )}
//                 </div>
//             </div>
            
//             {selectedImage && (
//                 <img
//                     src={selectedImage}
//                     alt="Selected"
//                     className="w-full h-auto"
//                 />
//             )}
            
//             {open && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-[80%] max-w-[800px]">
//                         <button 
//                             onClick={handleClose}
//                             className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//                         >
//                             &times;
//                         </button>
//                         {selectedVideo && (
//                             <video controls className="w-full h-auto">
//                                 <source src={selectedVideo} type="video/mp4" />
//                                 Your browser does not support the video tag.
//                             </video>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SubChildQuestionView;
import React from 'react'

const SubChildQuestionView = () => {
  return (
    <div>SubChildQuestionView</div>
  )
}


export default SubChildQuestionView