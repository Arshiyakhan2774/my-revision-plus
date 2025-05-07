import { AiOutlineArrowUp } from "react-icons/ai";

const ScrollUpComponent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-[1000] p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      title="Scroll to Top"
    >
      <AiOutlineArrowUp className="text-[24px] text-[#1a73e8]" />
    </button>
  );
};

export default ScrollUpComponent;