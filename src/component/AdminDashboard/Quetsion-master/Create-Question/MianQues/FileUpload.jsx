import { IoImagesSharp } from "react-icons/io5";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { FaRegFilePdf } from "react-icons/fa";

const FileUploadButton = ({ type, context, onChange, tooltip }) => {
  const fileTypes = {
    image: { 
      accept: 'image/*', 
      id: 'image',
      icon: <IoImagesSharp className="text-base" />
    },
    video: { 
      accept: 'video/*', 
      id: 'video',
      icon: <MdOutlineOndemandVideo className="text-base" />
    },
    pdf: { 
      accept: 'application/pdf', 
      id: 'pdf',
      icon: <FaRegFilePdf className="text-base" />
    }
  };

  return (
    <div className="group relative inline-block">
      <button
        onClick={() => document.getElementById(`${context}${fileTypes[type].id}`).click()}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 via-blue-300 to-purple-300 text-white border border-black mr-2 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {fileTypes[type].icon}
        <input
          type="file"
          id={`${context}${fileTypes[type].id}`}
          className="hidden"
          accept={fileTypes[type].accept}
          multiple
          onChange={onChange}
        />
      </button>
      
      {/* Custom Tooltip */}
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-1">
        {tooltip}
        <div className="absolute w-2 h-2 bg-gray-800 rotate-45 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default FileUploadButton;