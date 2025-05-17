import PropTypes from 'prop-types';

const RowButton = ({ onAddStatement }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4">
      <div className="relative group">
        <button
          onClick={onAddStatement}
          className="flex items-center justify-center gap-2 px-5 py-2 text-white font-bold rounded-full border border-black bg-custom-primary shadow-md hover:bg-[#0d6efd] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
          title="Add Statement"
        >
          <span className="flex items-center justify-center w-8 h-8 border border-black rounded-full bg-white text-black">
            {/* Plus icon using pure Tailwind */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </span>
          Add Statement
        </button>
        {/* Custom tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          Add Statement
          <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-gray-800 transform -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
};

RowButton.propTypes = {
  onAddStatement: PropTypes.func.isRequired,
  onAddSubquestion: PropTypes.func.isRequired,
};

export default RowButton;
