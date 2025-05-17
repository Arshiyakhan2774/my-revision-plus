import React from "react";

const RenderMedia = ({ mediaArray, type, baseURL }) => {
  if (!mediaArray || mediaArray.length === 0) return null;

  return (
    <div className="flex flex-row flex-wrap gap-2 mt-2 justify-center">
      {mediaArray.map((media, index) => (
        <div 
          key={index} 
          className="w-full max-w-[600px] mb-4"
        >
          {type === "image" && (
            <img
              src={`${baseURL}/images/${media}`}
              alt={`Image ${index}`}
              className="w-full h-auto"
              onError={(e) => (e.target.src = "fallback-image-url.jpg")}
            />
          )}
          {type === "video" && (
            <video controls className="w-full h-auto">
              <source src={`${baseURL}/videos/${media}`} type="video/mp4" />
            </video>
          )}
          {type === "pdf" && (
            <embed
              src={`${baseURL}/pdf/${media}`}
              className="w-full h-[800px] border-none"
              title={`PDF ${index + 1}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default RenderMedia;