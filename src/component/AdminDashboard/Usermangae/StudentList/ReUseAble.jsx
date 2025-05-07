import React from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { ImFileExcel } from "react-icons/im";
import { FcSearch } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { MdOutlineAddCircleOutline } from "react-icons/md";

const ReUseAble = ({ 
  data, 
  columns, 
  exportFilename = "export.csv", 
  filterPlaceholder = "Filter by Name", 
  title, 
  IconComponent,
  addButtonLink = "/add-student",
  addButtonText = "Add User"
}) => {
  const [filterText, setFilterText] = React.useState('');
  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  const csvHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Expire Date', key: 'expire_date' },
    { label: 'User Type', key: 'usertype_id.name' },
  ];

  const csvData = filteredData.map(item => ({
    name: item.name || 'N/A',
    email: item.email || 'N/A',
    expire_date: item.expire_date ? new Date(item.expire_date).toLocaleDateString() : 'N/A',
    usertype_id: item.usertype_id?.name || 'N/A',
  }));

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#1a73e8',
        },
      },
    },
  };

  return (
    <div className="w-full  px-4 py-10">
      {/* Header */}
      <div className="flex justify-center items-center mt-2">
        {IconComponent && (
          <div className="rounded-full bg-[#1a73e8] p-3 mr-4">
            <IconComponent className="text-white text-3xl" />
          </div>
        )}
        <h1 className="text-[#1a73e8] text-3xl font-semibold">{title}</h1>
      </div>

      {/* Search and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder={filterPlaceholder}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-72"
          />
          <FcSearch className="absolute right-3 top-3 text-xl" />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto justify-end">
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={exportFilename}
            className="flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-[#0056b3] transition-colors whitespace-nowrap"
          >
            <ImFileExcel className="text-xl mr-2" />
            Export
          </CSVLink>
          
          <Link 
            to={addButtonLink} 
            className="flex items-center px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-[#0056b3] transition-colors whitespace-nowrap"
          >
            <MdOutlineAddCircleOutline className="text-xl mr-2" />
            {addButtonText}
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-200  overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          selectableRows
          customStyles={customStyles}
          onRowClicked={(row) => console.log(row)}
          highlightOnHover
        />
      </div>

      {/* Footer */}
      <div className="text-start mt-6 text-gray-600">
        COPYRIGHT © 2024 My Revision+, All rights Reserved
      </div>
    </div>
  );
};

export default ReUseAble;