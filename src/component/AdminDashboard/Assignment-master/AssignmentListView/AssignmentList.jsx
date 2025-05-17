import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FcSearch } from 'react-icons/fc';
import { MdAssignmentReturned } from 'react-icons/md';
import { SlPrinter, SlShare } from "react-icons/sl";
import { RiFolderSharedFill, RiSlideshowView } from "react-icons/ri";
import { useGetAssignmentListQuery } from '../../../Services/Assignment/AssignmentApi';
import IconWithTitle from '../../../utilities/IconsTittle';
import ScrollUpComponent from '../../../utilities/ScroolupComponent';
import ShareModel from './ShareModel';
import { setSharedAssignment } from '../../../store/all-Id-Slice/IdSlice';
import AssignView from './AssignView'; // Make sure to import AssignView
import PrintDailogue from './PrintDailogue'; // Make sure to import PrintDailogue

const AssignmentList = () => {
  const [selectedQuestionText, setSelectedQuestionText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: AssignmentData } = useGetAssignmentListQuery();
  const assignments = AssignmentData?.data.assignments || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.assignment_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (assignment) => {
    setSelectedQuestionText(assignment.assignment_name);
    setSelectedAssignmentId(assignment._id);
    setOpenDialog(true);
  };

  const handlePrint = (assignment) => {
    setSelectedAssignmentId(assignment._id);
    setShowPrintDialog(true);
  };

  const handleShare = (assignment) => {
    setSelectedQuestionText(assignment._id);
    setOpenShareModal(true);
  };

  const handleSharedAssignment = (assignment) => {
    dispatch(setSharedAssignment(assignment._id)); 
    navigate(`/shared-assignment/${assignment._id}`);
  };

  const handleCloseDialog = () => setOpenDialog(false);
  const handlePrintClose = () => setShowPrintDialog(false);
  const handleSearch = (event) => setSearchQuery(event.target.value);

  const columns = [
    {
      name: 'Assignment Name',
      selector: (row) => row.assignment_name,
      sortable: true,
      center: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => handleView(row)}
            className="bg-custom-primary text-white p-2 rounded hover:bg-blue-800 transition-colors"
            title="View Assignment"
          >
            <RiSlideshowView className="text-xl"/>
          </button>
          <button 
            onClick={() => handlePrint(row)}
            className="bg-custom-primary text-white p-2 rounded hover:bg-blue-800 transition-colors"
            title="Print Assignment"
          >
            <SlPrinter className="text-xl"/>
          </button>
          <button 
            onClick={() => handleShare(row)}
            className="bg-custom-primary text-white p-2 rounded hover:bg-blue-800 transition-colors"
            title="Share Assignment"
          >
            <SlShare className="text-xl"/>
          </button>
          <button 
            onClick={() => handleSharedAssignment(row)}
            className="bg-custom-primary text-white p-2 rounded hover:bg-blue-800 transition-colors"
            title="Shared Assignment"
          >
            <RiFolderSharedFill className="text-xl"/>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      center: true,
      width: "40%"
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
    cells: {
      style: {
        textAlign: 'center',
      },
    },
  };

  return (
    <div className="w-full px-4">
      <IconWithTitle
        icon={MdAssignmentReturned}
        title="Assignment List"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />
      
      <div className="card-header border-b flex justify-between items-center py-4">
        <div className="relative w-full max-w-md mb-4">
          <input
            type="text"
            placeholder="Filter by Name"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-10 pl-3 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
        </div>
        
        <CSVLink 
          data={filteredAssignments} 
          filename={"assignment_list.csv"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Export to CSV
        </CSVLink>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredAssignments}
        customStyles={customStyles}
        pagination
        highlightOnHover
        striped
      />

      <ShareModel 
        open={openShareModal} 
        onClose={() => setOpenShareModal(false)} 
        selectedQuestionText={selectedQuestionText}
      />

      {openDialog && selectedAssignmentId && (
        <AssignView
          openDialog={openDialog}
          selectedQuestionText={selectedQuestionText}
          selectedAssignmentId={selectedAssignmentId}
          handleClose={handleCloseDialog}
          mediaBaseURL="https://myrevisionplus.com/api/img/question"
        />
      )}

      {showPrintDialog && selectedAssignmentId && (
        <PrintDailogue
          open={showPrintDialog}
          onClose={handlePrintClose}
          selectedAssignmentId={selectedAssignmentId}
        />
      )}
      
      <div className="text-start mt-6 text-gray-600">
        COPYRIGHT © 2024 My Revision+, All rights Reserved
      </div>
      <ScrollUpComponent/>
    </div>
  );
};

export default AssignmentList;