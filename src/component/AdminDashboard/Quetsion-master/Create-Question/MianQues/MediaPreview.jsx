import { FcDeleteDatabase } from "react-icons/fc";

const MediaPreview = ({ media, type, onRemove, context }) => {
  if (!(media instanceof Blob)) return null;
  const url = URL.createObjectURL(media);

  return (
    <div className="w-full md:w-[48%] m-1 flex items-center justify-between bg-gray-100 p-2 rounded">
      {type === 'image' && (
        <img src={url} alt={`${context} media`} className="w-full h-auto max-h-60 object-contain" />
      )}
      {type === 'video' && (
        <video src={url} controls className="w-full h-auto max-h-60" />
      )}
      {type === 'pdf' && (
        <iframe src={url} className="w-full h-96" title={`${context} PDF`} />
      )}
      <button 
        onClick={onRemove}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        <FcDeleteDatabase fontSize="small" />
      </button>
    </div>
  );
};

export default MediaPreview;