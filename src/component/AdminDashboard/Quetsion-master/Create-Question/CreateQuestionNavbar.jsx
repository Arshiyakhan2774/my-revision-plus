import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AiOutlineArrowLeft,
  AiOutlineCheck,
  AiOutlineFileText,
  AiOutlineUpload,
  AiOutlineEye,
  AiOutlineBarChart,
  AiOutlineSend
} from 'react-icons/ai';
import { Api } from '../../../Api/Api';
import FinalPreviwe from './FinalPreviwe';
import AddCreateQuestion from './AddButtonStyle';

const CreateQuestionNavbar = () => {
  const [showUploadComponent, setShowUploadComponent] = useState(false);
  const [question1, setQuestion1] = useState(false);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedData1, setSavedData1] = useState(null);
  const [error, setError] = useState(null);
  const previewId = useSelector((state) => state.idSlice.previewId);
  const navigate = useNavigate();

  const refetch = async () => {
    if (previewId) {
      try {
        setLoading(true);
        const response = await Api.get(`questions/fullquestion/${previewId}`);
        setSavedData1(response.data.data);
      } catch (error) {
        setError('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    }
  };
  const togglePreview = () => {
    setQuestion1(prev => !prev);
    if (!question1) {
      refetch();
    }
  };

  useEffect(() => {
    if (previewId) refetch();
  }, [previewId]);

  const handleClick = () => setPublished(!published);
  const handleBack = () => navigate(-1);
  const toggleUploadComponent = () => setShowUploadComponent(!showUploadComponent);
 

  return (
    <Fragment>
      <header className="bg-custom-primary h-16 fixed w-full z-10 p-0 ml-[-17px] mt-[-20px]">
        <div className="flex items-center h-full px-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="rounded-full p-2 border border-white mr-4 hover:bg-white hover:text-[#003087] transition-colors duration-200"
            title="Back"
          >
            <AiOutlineArrowLeft className="h-6 w-6 text-white" />
          </button>

          {/* Navigation Links */}
          <nav className="flex-1 flex justify-center space-x-4">
            <Link to="/DisplayQuestion" className="flex items-center text-white hover:text-black px-3 py-2 rounded-md transition-colors duration-200" title="Create">
              <AiOutlineFileText className="h-5 w-5 mr-1" />
              <span>Create</span>
            </Link>

            <Link to="/track" className="flex items-center text-white hover:text-black px-3 py-2 rounded-md transition-colors duration-200" title="Track">
              <AiOutlineBarChart className="h-5 w-5 mr-1" />
              <span>Track</span>
            </Link>

            <Link to="/send" className="flex items-center text-white hover:text-black px-3 py-2 rounded-md transition-colors duration-200" title="Send">
              <AiOutlineSend className="h-5 w-5 mr-1" />
              <span>Send</span>
            </Link>

            <Link to="/assess" className="flex items-center text-white hover:text-black px-3 py-2 rounded-md transition-colors duration-200" title="Assess">
              <AiOutlineBarChart className="h-5 w-5 mr-1" />
              <span>Assess</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Draft/Published Toggle */}
            <button
              onClick={handleClick}
              className="rounded-full p-2 border-2 border-white hover:bg-white hover:text-[#003087] transition-colors duration-200"
              title={published ? "Published" : "Draft"}
            >
              {published ? (
                <AiOutlineCheck className="h-5 w-5 text-white" />
              ) : (
                <AiOutlineUpload className="h-5 w-5 text-white" />
              )}
            </button>

            {/* Preview Button */}
            <button
              onClick={togglePreview}
              className="rounded-full p-2 border-2 border-white hover:bg-white hover:text-[#003087] transition-colors duration-200"
              title="Preview"
            >
              <AiOutlineEye className="h-5 w-5 text-white" />
            </button>

            {/* Upload Button */}
            <button
              onClick={toggleUploadComponent}
              className="rounded-full p-2 border-2 border-white hover:bg-white hover:text-[#003087] transition-colors duration-200"
              title="Upload"
            >
              <AiOutlineUpload className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Preview Modal */}
      <FinalPreviwe
        open={question1}
        onClose={togglePreview}
        loading={loading}
        savedData1={savedData1}
        error={error}
      />
    
    </Fragment>
  );
};

export default CreateQuestionNavbar;
