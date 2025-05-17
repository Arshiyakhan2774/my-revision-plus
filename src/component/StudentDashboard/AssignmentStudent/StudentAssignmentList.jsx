import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { FcSearch } from 'react-icons/fc';
import { MdAssignmentReturned } from 'react-icons/md';
import { SlPrinter, SlShare } from "react-icons/sl";
import { RiFolderSharedFill, RiSlideshowView } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetTeacherAssignmentListViewQuery } from '../../Services/Assignment/AssignmentApi';
import { setSharedAssignment } from '../../store/all-Id-Slice/IdSlice';
import IconWithTitle from '../../utilities/IconsTittle';
import ShareAssignmentWithstudent from './ShareAssignmentWithstudent';
import AssignView from '../../AdminDashboard/Assignment-master/AssignmentListView/AssignView';
import PrintDailogue from '../../AdminDashboard/Assignment-master/AssignmentListView/PrintDailogue';
// import AssignView from '../../AdminDashboard/Assignment-master/AssignmentListView/AssignView';
// import PrintDailogue from '../../AdminDashboard/Assignment-master/AssignmentListView/PrintDailogue';


const StudentAssignmentList = () => {
  const [selectedQuestionText, setSelectedQuestionText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userResponse = useSelector((state) => state.idSlice?.userResponse);
  const { data: AssignmentData } = useGetTeacherAssignmentListViewQuery(userResponse._id);
  const assignments = AssignmentData?.data || [];
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

  const handleShare = (assignmentName) => {
    setSelectedQuestionText(assignmentName._id);
    setOpenShareModal(true);
  };

  const handleSharedAssignment = (assignment) => {
    dispatch(setSharedAssignment(assignment._id)); 
    navigate(`/shared-assignment-teacher/${assignment._id}`);
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
            title="View Assignment"
            className="bg-[#00246B] text-white p-2 rounded hover:bg-[#001a4d] transition-colors"
            onClick={() => handleView(row)}
          >
            <RiSlideshowView size={20} />
          </button>
          <button 
            title="Print Assignment"
            className="bg-[#00246B] text-white p-2 rounded hover:bg-[#001a4d] transition-colors"
            onClick={() => handlePrint(row)}
          >
            <SlPrinter size={20} />
          </button>
          <button 
            title="Share Assignment"
            className="bg-[#00246B] text-white p-2 rounded hover:bg-[#001a4d] transition-colors"
            onClick={() => handleShare(row)}
          >
            <SlShare size={20} />
          </button>
          <button 
            title="Shared Assignment"
            className="bg-[#00246B] text-white p-2 rounded hover:bg-[#001a4d] transition-colors"
            onClick={() => handleSharedAssignment(row)}
          >
            <RiFolderSharedFill size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: true,
      width: "40%"
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#00246B',
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };
 
  return (
    <div className="container max-w-full px-4">
      <IconWithTitle
        icon={MdAssignmentReturned}
        title="Assignment List"
        iconColor="white"
        backgroundColor="#00246B"
        iconSize="30px"
        titleColor="#00246B"
        titleFontSize="34px"
      />
      
      <div className="card-header border-b flex justify-between items-center mb-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Filter by Name"
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-10 pl-3 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
        </div>
        
        <CSVLink data={filteredAssignments} filename={"schedule_list.csv"}>
          <button className="bg-[#00246B] text-white px-4 py-2 rounded hover:bg-[#001a4d] transition-colors">
            Export to CSV
          </button>
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

      <ShareAssignmentWithstudent
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
      )}  <PrintDailogue
        open={showPrintDialog}
        onClose={handlePrintClose}
        selectedAssignmentId={selectedAssignmentId}
      /> 
      
      <div className="text-left mt-6">COPYRIGHT © 2024 My Revision+, All rights Reserved</div>
    </div>
  );
};

export default StudentAssignmentList;