import React from "react";
import { FcSearch } from "react-icons/fc";
import { ImFileExcel } from "react-icons/im";
import { CSVLink } from "react-csv";

const SearchAndExport = ({ searchQuery, setSearchQuery, exportData, fileName }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Filter by Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
          aria-label="Search"
        />
        <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
      </div>
      <CSVLink 
        data={exportData} 
        filename={fileName} 
        className="inline-flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 transition-colors"
        aria-label="Export to CSV"
      >
        <ImFileExcel className="mr-2 text-xl" />
        Export
      </CSVLink>
    </div>
  );
};

export default SearchAndExport;