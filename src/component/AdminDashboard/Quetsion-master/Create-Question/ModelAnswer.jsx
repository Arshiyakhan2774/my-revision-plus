import React from 'react';
import { IoImagesSharp } from 'react-icons/io5';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { FaRegFilePdf, FaTrash } from 'react-icons/fa';
import EditorFile from './MianQues/EditorFile';

const ModelAnswer = ({
  editorContent,
  setEditorContent,
  images = [],
  videos = [],
  pdfs = [],
  handleFileChange,
  removeFile,
}) => {
  return (
    <div className="text-center">
      <style jsx global>{`
        /* Fix Wiris formula container styles */
        .WirisformulaContainer {
          display: inline-block;
          vertical-align: middle;
          margin: 0 2px;
        }
        
        /* Fix Wiris formula styles */
        .Wirisformula {
          color: inherit;
          background: transparent;
        }
        
        /* Fix TinyMCE editor container */
        .tox-tinymce {
          border-radius: 0.375rem !important;
          border: 1px solid #e2e8f0 !important;
        }
        
        /* Fix editor content area */
        .tox-editor-container {
          background-color: white !important;
        }
      `}</style>
      <EditorFile
        content={editorContent}
        onEditorChange={(newContent) => setEditorContent(newContent)}
        wirisConfig={{
          imagesPath: '/node_modules/@wiris/mathtype-tinymce5/wirisplugin-iframe.html',
          saveMode: 'xml'
        }}
      />
      
      <div className="flex justify-between my-4">
        <div className="flex gap-2">
          {/* Image Upload Button with Tooltip */}
          <div className="relative group">
            <label className="bg-gradient-to-r from-blue-500 via-blue-300 to-purple-400 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-black">
              <input
                type="file"
                id={`answerImage-${editorContent}`}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange('image', e)}
              />
              <IoImagesSharp className="text-lg" />
            </label>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Insert Image
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-black border-opacity-100"></div>
              </div>
            </div>
          </div>

          {/* Video Upload Button with Tooltip */}
          <div className="relative group">
            <label className="bg-gradient-to-r from-blue-500 via-blue-300 to-purple-400 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-black">
              <input
                type="file"
                id={`answerVideo-${editorContent}`}
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => handleFileChange('video', e)}
              />
              <MdOutlineOndemandVideo className="text-lg" />
            </label>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Insert Video
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-black border-opacity-100"></div>
              </div>
            </div>
          </div>

          {/* PDF Upload Button with Tooltip */}
          <div className="relative group">
            <label className="bg-gradient-to-r from-blue-500 via-blue-300 to-purple-400 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border border-black">
              <input
                type="file"
                id={`answerPdf-${editorContent}`}
                className="hidden"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFileChange('pdf', e)}
              />
              <FaRegFilePdf className="text-lg" />
            </label>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Insert PDF
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-black border-opacity-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display inserted files */}
      <div className="mt-6 space-y-6">
        {images.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Images</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((file, index) => {
                if (!(file instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative group">
                    <img 
                      src={objectURL} 
                      alt={`Inserted ${index}`} 
                      className="w-full h-auto rounded"
                    />
                    <button
                      onClick={() => removeFile('image', index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Videos</h4>
            <div className="grid grid-cols-1 gap-4">
              {videos.map((file, index) => {
                if (!(file instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative group">
                    <video 
                      src={objectURL} 
                      controls 
                      className="w-full h-auto rounded"
                    />
                    <button
                      onClick={() => removeFile('video', index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {pdfs.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">PDFs</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pdfs.map((file, index) => {
                if (!(file instanceof Blob)) return null;
                const objectURL = URL.createObjectURL(file);
                return (
                  <div key={index} className="border border-gray-300 rounded-lg p-2">
                    <iframe 
                      src={objectURL} 
                      className="w-full h-96" 
                      frameBorder="0"
                    />
                    <div className="text-center mt-2">
                      <button
                        onClick={() => removeFile('pdf', index)}
                        className="bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelAnswer;