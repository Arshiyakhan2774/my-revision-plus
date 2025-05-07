import React from 'react';
import { useGetCategoryListQuery } from '../../../Services/Category/CategoryApi';

const SubjectCustom = ({ selectedBoard, selectedSubject, setSelectedSubject, getInputLabel }) => {
    const { data: { data: categories } = {}, error, isLoading } = useGetCategoryListQuery();
    
    if (isLoading) return <p className="text-gray-600">Loading...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    const subjects = categories?.categories?.find(cat => cat._id === selectedBoard)?.subjects || [];

    return (
        <div className="w-full">
            <label htmlFor="subject_id" className="block text-sm font-medium text-gray-700 mb-1">
                {getInputLabel("Subject")}
            </label>
            <select
                id="subject_id"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                disabled={!selectedBoard}
            >
                <option value="">Select {getInputLabel("Subject").toLowerCase()}</option>
                {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                        {subject.subject_name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SubjectCustom;