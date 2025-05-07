


const AddButton = ({ onClick, label, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-custom-primary text-white px-4 py-2 rounded ${className}`}
    >
      {label}
    </button>
  );
};

export default AddButton;
