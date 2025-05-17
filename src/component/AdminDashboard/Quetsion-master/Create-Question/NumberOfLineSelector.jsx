import React from "react";

const LineSelectorWithMarks = ({
  handleMarksChange,
  numberOfLines,
  marks,
  handleNumberOfLinesChange,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 items-center mt-4">
      {/* Line Selector */}
      <div className="col-span-4 sm:col-span-6 md:col-span-2">
        <div className="relative">
          <label
            htmlFor="line-number-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Lines
          </label>
          <select
            id="line-number-select"
            value={numberOfLines}
            onChange={handleNumberOfLinesChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((line) => (
              <option key={line} value={line}>
                {line} {line === 1 ? "Line" : "Lines"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Field */}
      <div className="col-span-4 sm:col-span-6 md:col-span-2 ml-auto mb-1.5">
        <div className="relative">
          <label
            htmlFor="marks-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Marks
          </label>
          <input
            id="marks-input"
            type="text"
            value={marks}
            onChange={handleMarksChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Display Dashed Lines */}
      <div className="col-span-12">
        <div className="mt-4 p-4 border border-black bg-gray-50 mb-5">
          {[...Array(parseInt(numberOfLines || 0))].map((_, index) => (
            <div
              key={index}
              className="border-b border-dashed border-gray-300 mb-2 h-5"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineSelectorWithMarks;