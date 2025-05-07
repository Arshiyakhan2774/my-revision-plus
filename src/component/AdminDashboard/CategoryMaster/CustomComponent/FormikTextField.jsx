import React from 'react';
import { Field, useField } from 'formik';

const FormikTextField = ({ name, label, inputClassName, ...props }) => {
  const [field, meta] = useField(name);

  // Combine the default classes with any additional classes passed via inputClassName
  const baseClasses = `w-full h-9 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 ${
    meta.touched && meta.error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  }`;

  const combinedClasses = inputClassName ? `${baseClasses} ${inputClassName}` : baseClasses;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={name}
        className={combinedClasses}
      />
      {meta.touched && meta.error && (
        <div className="mt-1 text-sm text-red-600">{meta.error}</div>
      )}
    </div>
  );
};

export default FormikTextField;