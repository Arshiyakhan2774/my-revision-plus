import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { ImFileExcel } from 'react-icons/im';
import { FcSearch } from 'react-icons/fc';
import { MdRebaseEdit } from 'react-icons/md';
import BackButton from '../../utilities/BackButrton';
import AddButton from '../../utilities/SaveButton';
import IconWithTitle from '../../utilities/IconsTittle';


const EditUserTypeModules = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const data = [
    {
      id: 1,
      module: 'User Manage',
      subModules: [
        {
          id: 1.1,
          name: 'Teacher/Admin List',
          actions: [
            { name: 'Edit User', admin: true, teacher: true, student: false, contentDeveloper: false },
            { name: 'Delete User', admin: true, teacher: false, student: false, contentDeveloper: false },
            { name: 'Update Password', admin: true, teacher: true, student: false, contentDeveloper: false },
            { name: 'View Profile', admin: true, teacher: true, student: true, contentDeveloper: false },
            { name: 'Add Teacher/Admin', admin: true, teacher: false, student: false, contentDeveloper: false },
          ],
        },
        {
          id: 1.2,
          name: 'Student List',
          actions: [
            { name: 'Edit User', admin: true, teacher: true, student: false, contentDeveloper: false },
            { name: 'Delete User', admin: true, teacher: false, student: false, contentDeveloper: false },
            { name: 'Update Password', admin: true, teacher: true, student: false, contentDeveloper: false },
            { name: 'View Profile', admin: true, teacher: true, student: true, contentDeveloper: false },
            { name: 'Add Student/Parent', admin: true, teacher: false, student: false, contentDeveloper: false },
          ],
        },
      ],
    },
    {
      id: 2,
      module: 'Category Master',
      subModules: [
        {
          id: 2.1,
          name: 'Create Category',
          actions: [
            { name: 'Add Subject', admin: true, teacher: false, student: false, contentDeveloper: true },
            { name: 'Add Subject Level', admin: true, teacher: false, student: false, contentDeveloper: true },
            { name: 'Add Source', admin: true, teacher: false, student: false, contentDeveloper: true },
            { name: 'Add Paper', admin: true, teacher: false, student: false, contentDeveloper: true },
            { name: 'Add Topic', admin: true, teacher: false, student: false, contentDeveloper: true },
            { name: 'Add Subtopic', admin: true, teacher: false, student: false, contentDeveloper: true },
          ],
        },
        {
          id: 2.2,
          name: 'View Category',
          actions: [
            { name: 'View/Edit/Delete Subject', admin: true, teacher: true, student: false, contentDeveloper: true },
            { name: 'View/Edit/Delete Subject Level', admin: true, teacher: true, student: false, contentDeveloper: true },
            { name: 'View/Edit/Delete Source', admin: true, teacher: true, student: false, contentDeveloper: true },
            { name: 'View/Edit/Delete Paper', admin: true, teacher: true, student: false, contentDeveloper: true },
            { name: 'View/Edit/Delete Topic', admin: true, teacher: true, student: false, contentDeveloper: true },
            { name: 'View/Edit/Delete Subtopic', admin: true, teacher: true, student: false, contentDeveloper: true },
          ],
        },
      ],
    },
  ];

  const filteredData = data.filter(item =>
    item.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCheckbox = (checked) => (
    <span className={checked ? 'text-green-500' : 'text-red-500'}>
      {checked ? '✅' : '❌'}
    </span>
  );

  const columns = [
    {
      name: 'Module Name',
      selector: row => row.module,
      sortable: true,
      cell: row => <strong className="font-semibold">{row.module}</strong>,
      width: '200px',
    },
    {
      name: 'Sub-Modules',
      cell: row => (
        <div className="border-r border-gray-200">
          {row.subModules?.map(subModule => (
            <div key={subModule.id} className="py-2 border-b border-gray-200">
              <strong>{subModule.name}</strong>
              {subModule.actions?.map((action, index) => (
                <div key={index} className="py-1 ml-4">
                  {action.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      name: 'Admin',
      cell: row => (
        <div className="border-r border-gray-200">
          {row.subModules?.map(subModule => (
            <div key={subModule.id} className="py-2 border-b border-gray-200">
              {subModule.actions?.map((action, index) => (
                <div key={index} className="py-1 ml-4">
                  {renderCheckbox(action.admin)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
      width: '100px',
    },
    {
      name: 'Teacher',
      cell: row => (
        <div className="border-r border-gray-200">
          {row.subModules?.map(subModule => (
            <div key={subModule.id} className="py-2 border-b border-gray-200">
              {subModule.actions?.map((action, index) => (
                <div key={index} className="py-1 ml-4">
                  {renderCheckbox(action.teacher)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
      width: '100px',
    },
    {
      name: 'Student',
      cell: row => (
        <div className="border-r border-gray-200">
          {row.subModules?.map(subModule => (
            <div key={subModule.id} className="py-2 border-b border-gray-200">
              {subModule.actions?.map((action, index) => (
                <div key={index} className="py-1 ml-4">
                  {renderCheckbox(action.student)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
      width: '100px',
    },
    {
      name: 'Content Developer',
      cell: row => (
        <div>
          {row.subModules?.map(subModule => (
            <div key={subModule.id} className="py-2 border-b border-gray-200">
              {subModule.actions?.map((action, index) => (
                <div key={index} className="py-1 ml-4">
                  {renderCheckbox(action.contentDeveloper)}
                </div>
              ))}
            </div>
          ))}
        </div>
      ),
      width: '150px',
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        padding: '0',
      },
    },
  };

  return (
  
      <div className="w-full p-6">
        <IconWithTitle
          icon={MdRebaseEdit}
          title="UserType"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />

        <div className="flex flex-wrap justify-between items-center pb-4 mb-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Filter by Module Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <FcSearch className="absolute left-3 top-3 text-xl" />
          </div>

          <CSVLink
            data={filteredData}
            filename="user_type_modules.csv"
            className="bg-custom-primary text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-800 transition-colors"
          >
            <ImFileExcel className="text-xl" />
            Export to CSV
          </CSVLink>
        </div>

       
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            pagination
            highlightOnHover
            striped
            noHeader
          />
        

        <div className="flex justify-between mt-4">
          <BackButton/>
          <AddButton label="Save" />
        </div>
      </div>
   
  );
};

export default EditUserTypeModules;