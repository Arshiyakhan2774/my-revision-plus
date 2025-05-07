import React, { useState } from 'react';

import SubjectCustom from '../CustomComponent/SubjectCustom';
import BoardCustom from '../CustomComponent/BoardCustom';
import SubjectLevelCustom from '../CustomComponent/SubjectLevelCustom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';
import { Api } from '../../../Api/Api';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';


const SourceAdd = ({ goToNextTab, selectedBoard, handleBoardChange }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const existingSources = categories?.categories
      .find(cat => cat._id === selectedBoard)
      ?.subjects.find(sub => sub._id === selectedSubject)
      ?.subjectlevels.find(level => level._id === selectedSubjectLevel)
      ?.sources || [];
  
    const normalizedSourceName = selectedSource.trim().replace(/\s+/g, ' ').toLowerCase();
  
    const isDuplicate = existingSources.some(source => 
      source.source_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedSourceName
    );
  
    if (isDuplicate) {
      toast.error('This source already exists. Please enter a different source.');
      return;
    }
  
    try {
      const response = await Api.post('/categorys/source/create', {
        board_id: selectedBoard,
        subject_id: selectedSubject,
        subject_level_id: selectedSubjectLevel,
        source_name: selectedSource,
      });
  
      if (response && response.data && response.data.status === 'success') {
        toast.success('Source created successfully!');
        setSelectedSubject('');
        setSelectedSubjectLevel('');
        setSelectedSource('');
        setIsSubmitting(true)
        goToNextTab();
      } else {
        toast.error('Failed to create the source. Please try again.');
      }
    } catch (error) {
      console.error('Error saving source:', error);
      toast.error('An error occurred while saving the source.');
    }
    refetch();
  };

  const getInputLabel = (label) => {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (label) {
        case 'Subject': return 'Grade';
        case 'Subject Level': return 'Subject';
        default: return label;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (label) {
        case 'Subject': return 'Subject';
        case 'Subject Level': return 'Content';
        case 'Source': return 'SubTopics';
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
              <SubjectLevelCustom
                selectedBoard={selectedBoard}
                selectedSubject={selectedSubject}
                selectedSubjectLevel={selectedSubjectLevel}
                setSelectedSubjectLevel={setSelectedSubjectLevel}
                getInputLabel={getInputLabel}
              />
            </div>
            
            <div className="col-span-1">
              <div className="flex flex-col">
                <label htmlFor="sourceNameID" className="mb-1 text-sm font-medium text-gray-700">
                  {getInputLabel("Source")}
                </label>
                <input
                  id="sourceNameID"
                  type="text"
                  required
                  className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-span-3 flex justify-between mt-4">
              <BackButton />
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

export default SourceAdd;