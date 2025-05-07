


const BackButton = ({ onClick = () => window.history.back(), label = 'Back', className = '' }) => {
  return (
    <button
      variant="outlined"
      onClick={onClick}
      className={`bg-custom-primary text-white px-4 py-2 rounded ${className}`}
    >
      {label}
    </button>
  );
};

export default BackButton;
