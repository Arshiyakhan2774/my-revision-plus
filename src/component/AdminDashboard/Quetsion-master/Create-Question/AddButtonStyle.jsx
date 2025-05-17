import { CiCircleMore } from "react-icons/ci";
import { PiPlus } from "react-icons/pi";


const AddButtonStyle = ({ onClick, title, buttonText, iconType }) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'add':
        return <PiPlus className="text-base" />;
      case 'assignment':
        return <CiCircleMore className="text-base" />;
      default:
        return <PiPlus className="text-base" />;
    }
  };

  return (
    <div className="group relative p-14" title={title} >
      <button
        onClick={onClick}
        className="mt-5 text-white bg-custom-primary rounded-full py-1 px-5 border border-black bg-shadow-md font-bold normal-case transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-[#0d6efd] hover:scale-105 hover:shadow-lg"
      >
        <span className="flex items-center justify-center w-8 h-8 border border-black rounded-full bg-white text-black">
          {renderIcon()}
        </span>
        {buttonText}
      </button>
      <div className="absolute hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2 mb-2">
        {title}
        <div className="absolute w-2 h-2 bg-gray-800 rotate-45 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default AddButtonStyle;