import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import BoardCustom from '../CustomComponent/BoardCustom';
import FormikTextField from '../CustomComponent/FormikTextField';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetCategoryListQuery, useSaveSubjectMutation } from '../../../Services/Category/CategoryApi';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';

const SubjectAdd = ({ goToNextTab }) => {
  const [selectedBoard, setSelectedBoard] = useState('');
  const { data: { data: categories } = {}, refetch } = useGetCategoryListQuery();
  const [saveSubject] = useSaveSubjectMutation();

  const initialValues = {
    subjectName: '',
  };

  const validationSchema = Yup.object({
    subjectName: Yup.string().required('Subject name is required'),
  });

  const handleSubmit = async (values) => {
    if (!selectedBoard) {
      toast.error("Please select a board.");
      return;
    }
    
    const existingSubjects = categories?.categories
      .find(board => board._id === selectedBoard)?.subjects || [];
    
    const normalizedSubjectName = values.subjectName.trim().replace(/\s+/g, ' ').toLowerCase();
    
    const isDuplicate = existingSubjects.some(subject => 
      subject.subject_name.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedSubjectName
    );
    
    if (isDuplicate) {
      toast.error("Subject already exists in the selected board.");
      return;
    }
    
    try {
      await saveSubject({
        selectedBoard,
        subjectName: values.subjectName,
      }).unwrap();
    
      setSelectedBoard('');
      toast.success('Subject created successfully!');
      refetch();
    
      if (goToNextTab) goToNextTab();
    } catch (error) {
      console.error('Error adding subject:', error);
    
      if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error('Error creating subject. Please try again.');
      }
    }
  };

  const getLabel = () => {
    if (selectedBoard === '665fffe9e02ec586b271fba1') return "Subject Name";
    if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') return "Subject Name";
    if (selectedBoard === '665fffe9e02ec586b271fba2') return "Grade";
    return "Subject Name";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <div className="h-12 flex flex-col">
                    <BoardCustom 
                      selectedBoard={selectedBoard} 
                      setSelectedBoard={setSelectedBoard} 
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <FormikTextField
                    name="subjectName"
                    label={getLabel()}
                    value={values.subjectName} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    inputClassName=" text-base" 
                  />
                </div>

                <div className="col-span-2 flex flex-col sm:flex-row justify-between gap-4 mt-6">
                  <div className="w-full sm:w-auto">
                    <BackButton className="w-full sm:w-auto" />
                  </div>
                  <div className="w-full sm:w-auto">
                    <AddButton 
                      type="submit" 
                      label="Add Subject" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <ScrollUpComponent />
    </div>
  );
};

export default SubjectAdd;