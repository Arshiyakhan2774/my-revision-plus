import { useState } from 'react';
import MediaPreview from './MediaPreview';
import EditorFile from './EditorFile';
import { FaRegFilePdf } from 'react-icons/fa6';
import { MdExpandMore, MdOutlineOndemandVideo } from 'react-icons/md';
import { IoImagesSharp } from 'react-icons/io5';
import FileUploadButton from './FileUpload';

const AnswerTypeSection = ({ 
  type, 
  content, 
  setContent, 
  images, 
  videos, 
  pdfs, 
  handleFileChange, 
  removeFile 
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6 border  p-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-medium">
          {type === 'answerKey' ? 'Answer Key' : 
           type === 'modelAnswer' ? 'Model Answer' : 
           'Mark Scheme'}
        </h3>
        <MdExpandMore className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="mt-4">
          
          <EditorFile
            content={content} 
            onEditorChange={setContent} 
          />
          
          <div className="flex mt-4 space-x-2">
            <FileUploadButton
              type="image"
              context={type}
              onChange={(e) => handleFileChange('image', e, type)}
              icon={<IoImagesSharp className="text-lg"/>}
              tooltip="Insert Image"
            />
            <FileUploadButton
              type="video"
              context={type}
              onChange={(e) => handleFileChange('video', e, type)}
              icon={<MdOutlineOndemandVideo className="text-lg"/>}
              tooltip="Insert Video"
            />
            <FileUploadButton
              type="pdf"
              context={type}
              onChange={(e) => handleFileChange('pdf', e, type)}
              icon={<FaRegFilePdf className="text-lg"/>}
              tooltip="Insert PDF"
            />
          </div>

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Images</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {images.map((img, index) => (
                  <MediaPreview
                    key={`${type}-img-${index}`}
                    media={img}
                    type="image"
                    onRemove={() => removeFile('image', index, type)}
                    context={type}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Videos Preview */}
          {videos.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Videos</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {videos.map((video, index) => (
                  <MediaPreview
                    key={`${type}-video-${index}`}
                    media={video}
                    type="video"
                    onRemove={() => removeFile('video', index, type)}
                    context={type}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PDFs Preview */}
          {pdfs.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">PDFs</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {pdfs.map((pdf, index) => (
                  <MediaPreview
                    key={`${type}-pdf-${index}`}
                    media={pdf}
                    type="pdf"
                    onRemove={() => removeFile('pdf', index, type)}
                    context={type}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnswerTypeSection;