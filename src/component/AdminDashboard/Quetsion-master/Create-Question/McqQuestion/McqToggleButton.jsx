import { Box, FormControlLabel, IconButton, Switch, Tooltip } from '@mui/material';
import { useState } from 'react';
import { IoImagesSharp } from 'react-icons/io5';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { FaRegFilePdf } from 'react-icons/fa';
import EditorFile from '../../../Assignment-master/CreateAssignment/EditorFile'; // Assuming you have this component
import DeleteIcon from '@mui/icons-material/Delete'; // To delete files

  
  const McqToggleButton = ({ label, onClose,answerKeyPdfs,setAnswerKeyPdfs,markSchemeImages,markSchemePdfs,setMarkSchemePdfs,markSchemeVideos,setMarkSchemeVideos,iconButtonStyle,answerKeyVideos,setAnswerKeyVideos,answerKeyContent,answerKeyImages, setAnswerKeyImages ,markSchemeContent, setMarkSchemeContent, setMarkSchemeImages,setAnswerKeyContent, }) => {
  const [activeToggle, setActiveToggle] = useState('editor');
  const [editorContent, setEditorContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [showAnswerKeyEditor, setShowAnswerKeyEditor] = useState(false);
  const [showMarkSchemeEditor, setShowMarkSchemeEditor] = useState(false);
  // const [answerKeyContent, setAnswerKeyContent] = useState('');
  // const [markSchemeContent, setMarkSchemeContent] = useState('');
  // const [answerKeyImages, setAnswerKeyImages] = useState([]);
  // const [answerKeyVideos, setAnswerKeyVideos] = useState([]);
  // const [answerKeyPdfs, setAnswerKeyPdfs] = useState([]);
  // const [markSchemeImages, setMarkSchemeImages] = useState([]);
  // const [markSchemeVideos, setMarkSchemeVideos] = useState([]);
  // const [markSchemePdfs, setMarkSchemePdfs] = useState([]);

 

  const handleToggleChange = (event, newToggle) => {
    setActiveToggle(newToggle);
  };

  const handleFileChange = (type, event, editorType) => {
    const files = event.target.files;
    switch (type) {
      case 'image':
        if (editorType === 'answerKey') {
          setAnswerKeyImages([...answerKeyImages, ...files]);
        } else if (editorType === 'markScheme') {
          setMarkSchemeImages([...markSchemeImages, ...files]);
        }
        break;
      case 'video':
        if (editorType === 'answerKey') {
          setAnswerKeyVideos([...answerKeyVideos, ...files]);
        } else if (editorType === 'markScheme') {
          setMarkSchemeVideos([...markSchemeVideos, ...files]);
        }
        break;
      case 'pdf':
        if (editorType === 'answerKey') {
          setAnswerKeyPdfs([...answerKeyPdfs, ...files]);
        } else if (editorType === 'markScheme') {
          setMarkSchemePdfs([...markSchemePdfs, ...files]);
        }
        break;
      default:
        break;
    }
    console.log(`Uploaded ${type}:`, files);
  };

  const removeFile = (type, index, editorType) => {
    switch (type) {
      case 'image':
        if (editorType === 'answerKey') {
          const newImages = [...answerKeyImages];
          newImages.splice(index, 1);
          setAnswerKeyImages(newImages);
        } else if (editorType === 'markScheme') {
          const newImages = [...markSchemeImages];
          newImages.splice(index, 1);
          setMarkSchemeImages(newImages);
        }
        break;
      case 'video':
        if (editorType === 'answerKey') {
          const newVideos = [...answerKeyVideos];
          newVideos.splice(index, 1);
          setAnswerKeyVideos(newVideos);
        } else if (editorType === 'markScheme') {
          const newVideos = [...markSchemeVideos];
          newVideos.splice(index, 1);
          setMarkSchemeVideos(newVideos);
        }
        break;
      case 'pdf':
        if (editorType === 'answerKey') {
          const newPdfs = [...answerKeyPdfs];
          newPdfs.splice(index, 1);
          setAnswerKeyPdfs(newPdfs);
        } else if (editorType === 'markScheme') {
          const newPdfs = [...markSchemePdfs];
          newPdfs.splice(index, 1);
          setMarkSchemePdfs(newPdfs);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={showAnswerKeyEditor}
            onChange={() => setShowAnswerKeyEditor(!showAnswerKeyEditor)}
          />
        }
        label="Add Answer Key"
      />
      {showAnswerKeyEditor && (
        <div style={{ textAlign: 'center' }}>
          <EditorFile
            content={answerKeyContent}
            onEditorChange={(newContent) => setAnswerKeyContent(newContent)}
          />

          <Box className="flex flex-row justify-between mb-2 mt-4">
            <Box className="flex flex-row">
              <Tooltip title="Insert Image" arrow>
                <IconButton onClick={() => document.getElementById('answerImage').click()} sx={iconButtonStyle}>
                  <IoImagesSharp />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="answerImage"
                style={{ display: 'none' }}
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange('image', e, 'answerKey')}
              />
              <Tooltip title="Insert Video" arrow>
                <IconButton onClick={() => document.getElementById('answerVideo').click()} sx={iconButtonStyle}>
                  <MdOutlineOndemandVideo />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="answerVideo"
                style={{ display: 'none' }}
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange('video', e, 'answerKey')}
              />
              <Tooltip title="Insert PDF" arrow>
                <IconButton onClick={() => document.getElementById('answerPdf').click()} sx={iconButtonStyle}>
                  <FaRegFilePdf />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="answerPdf"
                style={{ display: 'none' }}
                accept="application/pdf"
                multiple
                onChange={(e) => handleFileChange('pdf', e, 'answerKey')}
              />
            </Box>
          </Box>

          <Box className="flex flex-col mt-4">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {answerKeyImages.map((image, index) => {
                if (!(image instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(image);
                return (
                  <div key={index} style={{ width: '30%', margin: '1%' }}>
                    <img src={objectURL} alt={`Answer Key Image ${index}`} style={{ width: '100%', height: 'auto' }} />
                    <IconButton onClick={() => removeFile('image', index, 'answerKey')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {answerKeyVideos.map((video, index) => {
                if (!(video instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(video);
                return (
                  <div key={index} style={{ width: '30%', margin: '1%' }}>
                    <video src={objectURL} controls style={{ width: '100%', height: 'auto' }} />
                    <IconButton onClick={() => removeFile('video', index, 'answerKey')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {answerKeyPdfs.map((pdf, index) => {
                if (!(pdf instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(pdf);
                return (
                  <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <iframe src={objectURL} style={{ width: '100%', height: '500px' }} frameBorder="0" />
                    <IconButton onClick={() => removeFile('pdf', index, 'answerKey')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
          </Box>
        </div>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={showMarkSchemeEditor}
            onChange={() => setShowMarkSchemeEditor(!showMarkSchemeEditor)}
          />
        }
        label="Add TeacherExplanation"
      />
      {showMarkSchemeEditor && (
        <div style={{ textAlign: 'center' }}>
          <EditorFile
            content={markSchemeContent}
            onEditorChange={(newContent) => setMarkSchemeContent(newContent)}
          />

          <Box className="flex flex-row justify-between mb-2 mt-4">
            <Box className="flex flex-row">
              <Tooltip title="Insert Image" arrow>
                <IconButton onClick={() => document.getElementById('markImage').click()} sx={iconButtonStyle}>
                  <IoImagesSharp />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="markImage"
                style={{ display: 'none' }}
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange('image', e, 'markScheme')}
              />
              <Tooltip title="Insert Video" arrow>
                <IconButton onClick={() => document.getElementById('markVideo').click()} sx={iconButtonStyle}>
                  <MdOutlineOndemandVideo />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="markVideo"
                style={{ display: 'none' }}
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange('video', e, 'markScheme')}
              />
              <Tooltip title="Insert PDF" arrow>
                <IconButton onClick={() => document.getElementById('markPdf').click()} sx={iconButtonStyle}>
                  <FaRegFilePdf />
                </IconButton>
              </Tooltip>
              <input
                type="file"
                id="markPdf"
                style={{ display: 'none' }}
                accept="application/pdf"
                multiple
                onChange={(e) => handleFileChange('pdf', e, 'markScheme')}
              />
            </Box>
          </Box>

          <Box className="flex flex-col mt-4">
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {markSchemeImages.map((image, index) => {
                if (!(image instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(image);
                return (
                  <div key={index} style={{ width: '30%', margin: '1%' }}>
                    <img src={objectURL} alt={`Mark Scheme Image ${index}`} style={{ width: '100%', height: 'auto' }} />
                    <IconButton onClick={() => removeFile('image', index, 'markScheme')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {markSchemeVideos.map((video, index) => {
                if (!(video instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(video);
                return (
                  <div key={index} style={{ width: '30%', margin: '1%' }}>
                    <video src={objectURL} controls style={{ width: '100%', height: 'auto' }} />
                    <IconButton onClick={() => removeFile('video', index, 'markScheme')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {markSchemePdfs.map((pdf, index) => {
                if (!(pdf instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(pdf);
                return (
                  <div key={index} style={{ width: '48%', margin: '1%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <iframe src={objectURL} style={{ width: '100%', height: '500px' }} frameBorder="0" />
                    <IconButton onClick={() => removeFile('pdf', index, 'markScheme')}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              })}
            </div>
          </Box>
        </div>
      )}
    </div>
  );
};

export default McqToggleButton;
