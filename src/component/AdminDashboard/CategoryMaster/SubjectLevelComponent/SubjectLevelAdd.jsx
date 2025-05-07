import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BoardCustom from '../CustomComponent/BoardCustom';
import SubjectCustom from '../CustomComponent/SubjectCustom';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';
import { useSaveSubjectLevelMutation } from '../../../Services/Category/SubjectApi';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';



const SubjectLevelAdd = ({ selectedBoard, handleBoardChange, goToNextTab }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectLevelName, setSubjectLevelName] = useState('');
  const [saveSubjectLevel] = useSaveSubjectLevelMutation();
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    
    const normalizedSubjectLevelName = subjectLevelName.trim().replace(/\s+/g, ' ').toLowerCase();

    const isDuplicate = categories?.categories
      ?.find(category => category._id === selectedBoard)
      ?.subjects.find(subject => subject._id === selectedSubject)
      ?.subjectlevels.some(level => 
        level.subject_level_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedSubjectLevelName
      );

    if (isDuplicate) {
      toast.error('This Subject Level already exists!');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveSubjectLevel({ selectedBoard, selectedSubject, subjectLevelName }).unwrap();
      toast.success('SubjectLevel created successfully!');
      setIsSubmitting(true);
      setSelectedSubject('');
      setSubjectLevelName('');
      await refetch();
    } catch (error) {
      toast.error(error,'Error adding subject level');
    } finally {
      setIsSubmitting(false);
      goToNextTab();
    }
  };

  const getInputLabel = (label) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (label) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        default: return label;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (label) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        default: return label;
      }
    }
    return label;
  };

  return (
    <div className="w-full max-w-full px-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 mt-4">
              <BoardCustom selectedBoard={selectedBoard} setSelectedBoard={handleBoardChange} />
            </div>
            
            <div className="col-span-1 mt-4">
              <SubjectCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                getInputLabel={getInputLabel}
              />
            </div>
            
            <div className="col-span-1 mt-4">
             
                <label htmlFor="subjectLevel" className="mb-1 text-sm font-medium text-gray-700">
                  {getInputLabel("Subject Level")}
                </label>
                <input
                  id="subjectLevel"
                  type="text"
                  required
                  className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={subjectLevelName}
                  onChange={(e) => setSubjectLevelName(e.target.value)}
                />
            
            </div>
            
            <div className="col-span-3 flex justify-between mt-4">
              <BackButton/>
              <AddButton
                      type="submit" 
                      label="Add Subject" 
                      disabled={isSubmitting}
                    />
                 
            </div>
          </div>
        </div>
      </form>
      
      <ToastContainer />
    
    </div>
  );
};

export default SubjectLevelAdd;