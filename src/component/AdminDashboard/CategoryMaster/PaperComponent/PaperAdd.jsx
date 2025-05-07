import { useState } from 'react';
import SubjectCustom from '../CustomComponent/SubjectCustom';
import SubjectLevelCustom from '../CustomComponent/SubjectLevelCustom';
import SourceCustom from '../CustomComponent/SourceCustom';
import BoardCustom from '../CustomComponent/BoardCustom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { Api } from '../../../Api/Api';
import AddButton from '../../../utilities/SaveButton';
import BackButton from '../../../utilities/BackButrton';

const PaperAdd = ({ goToNextTab, selectedBoard, handleBoardChange }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedPaper, setSelectedPaper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categories || !categories.categories) {
      toast.error("Categories data is not available.");
      return;
    }
    
    const existingPapers =
      categories?.categories
        ?.find((cat) => cat._id === selectedBoard)
        ?.subjects?.find((sub) => sub._id === selectedSubject)
        ?.subjectlevels?.find((level) => level._id === selectedSubjectLevel)
        ?.sources?.find((source) => source._id === selectedSource)
        ?.papers || [];
    
    const normalizedPaperName = selectedPaper.trim().replace(/\s+/g, ' ').toLowerCase();
    
    const isDuplicate = existingPapers.some(
      (paper) => paper.paper_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedPaperName
    );
    
    if (isDuplicate) {
      toast.error("This paper name already exists. Please enter a unique name.");
      return;
    }
    
    try {
      const response = await Api.post('/categorys/paper/create', {
        board_id: selectedBoard,
        subject_id: selectedSubject,
        subject_level_id: selectedSubjectLevel,
        source_id: selectedSource,
        paper_name: selectedPaper,
      });

      if (response && response.data && response.data.status === 'success') {
        toast.success('Paper created successfully!');
        setIsSubmitting(true);
        setSelectedSubject('');
        setSelectedSubjectLevel('');
        setSelectedSource('');
        setSelectedPaper('');
        goToNextTab();
        refetch();
      } else {
        toast.error('Failed to create the paper. Please try again.');
      }
    } catch (error) {
      toast.error(error,'An error occurred while saving the paper.');
    }
  };

  const getInputLabel = (label) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (label) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        case "Source": return "Source";
        case "Paper": return "Topic";
        default: return label;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (label) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        case "Source": return "Source";
        case "Paper": return "SubTopics";
        default: return label;
      }
    }
    return label;
  };
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1">
              <BoardCustom 
                selectedBoard={selectedBoard} 
                setSelectedBoard={handleBoardChange} 
              />
            </div>
            <div className="col-span-1">
              <SubjectCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                getInputLabel={getInputLabel}
              />
            </div>
            <div className="col-span-1">
              <SubjectLevelCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                selectedSubjectLevel={selectedSubjectLevel}
                setSelectedSubjectLevel={setSelectedSubjectLevel}
                getInputLabel={getInputLabel}
              />
            </div>
            <div className="col-span-1">
              <SourceCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                selectedSubjectLevel={selectedSubjectLevel}
                selectedSource={selectedSource}
                setSelectedSource={setSelectedSource}
                getInputLabel={getInputLabel}
                refetch={refetch}
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="paper_name" className="block text-sm font-medium text-gray-700 mb-1">
                {getInputLabel("Paper")}
              </label>
              <input
                type="text"
                id="paper_name"
                name="paper_name"
                required
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <BackButton/>
            <AddButton
                      type="submit" 
                      label="Add Subject" 
                      disabled={isSubmitting}
                    />
          </div>
        </div>
      </form>
      <ToastContainer />
   
    </div>
  );
};

export default PaperAdd;