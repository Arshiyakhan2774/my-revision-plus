import React from 'react';
import { Box, IconButton, Tooltip, Typography, Button } from '@mui/material';
import { Image as ImageIcon, VideoLibrary as VideoIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditorFile from './EditorFile'; 

const  AnswekeyModelAnswer = ({
  content,
  onContentChange,
  images,
  videos,
  pdfs,
  onFileChange,
  onFileRemove,
  API_URL_Images,
  API_URL_Videos,
  API_URL_PDF,
}) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Answer Key Editor</h4>
      <EditorFile content={content} onEditorChange={onContentChange} />

      <Box className="flex flex-row justify-start mb-2 mt-4">
        {['image', 'video', 'pdf'].map((type) => (
          <Tooltip key={type} title={`Insert ${type.charAt(0).toUpperCase() + type.slice(1)}`} arrow>
            <IconButton onClick={() => document.getElementById(`answer${type.charAt(0).toUpperCase() + type.slice(1)}`).click()}>
              {type === 'image' ? <ImageIcon /> : type === 'video' ? <VideoIcon /> : <PdfIcon />}
            </IconButton>
          </Tooltip>
        ))}
        {['image', 'video', 'pdf'].map((type) => (
          <input
            key={type}
            type="file"
            id={`answer${type.charAt(0).toUpperCase() + type.slice(1)}`}
            style={{ display: 'none' }}
            accept={type === 'pdf' ? 'application/pdf' : `${type}/*`}
            multiple
            onChange={(e) => onFileChange(type, e)}
          />
        ))}
      </Box>

      {['Images', 'Videos', 'PDFs'].map((mediaType, index) => {
        const mediaArray = index === 0 ? images : index === 1 ? videos : pdfs;
        const isImage = mediaType === 'Images';
        return (
          <Box className="flex flex-col mt-4" key={mediaType}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {mediaArray.length > 0 ? (
                mediaArray.map((file, fileIndex) => {
                  const fileUrl = file instanceof File ? URL.createObjectURL(file) : `${index === 0 ? API_URL_Images : index === 1 ? API_URL_Videos : API_URL_PDF}${file}`;
                  return (
                    <div key={fileIndex} style={{ width: '48%', margin: '1%' }}>
                      {isImage ? (
                        <img src={fileUrl} alt={`Answer Key ${fileIndex}`} style={{ width: '100%', borderRadius: '8px' }} />
                      ) : index === 1 ? (
                        <video src={fileUrl} controls style={{ width: '100%', borderRadius: '8px' }} />
                      ) : (
                        <iframe src={fileUrl} style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px' }} />
                      )}
                      <Button onClick={() => onFileRemove(index === 0 ? 'image' : index === 1 ? 'video' : 'pdf', fileIndex)} variant="contained" color="secondary" startIcon={<DeleteIcon />}>
                        Remove
                      </Button>
                    </div>
                  );
                })
              ) : (
                <Typography>No {mediaType} Uploaded</Typography>
              )}
            </div>
          </Box>
        );
      })}
    </div>
  );
};


export default AnswekeyModelAnswer