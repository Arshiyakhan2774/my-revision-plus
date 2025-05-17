import { useState, Fragment } from 'react';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineFundView } from "react-icons/ai";
import { FaLaptop } from "react-icons/fa";
import { FcSearch } from 'react-icons/fc';
import { ImFileExcel } from 'react-icons/im';
import DataTable from 'react-data-table-component';
import { useAttendanceByTeacherQuery, useDeleteAttendanceMutation } from '../../Services/Attendance/AttendanceApi';
import { Api } from '../../Api/Api';
import { setStudentDetaId } from '../../store/all-Id-Slice/IdSlice';
import Loader from '../../AdminDashboard/Routing/Loader';
import IconWithTitle from '../../utilities/IconsTittle';
import ScrollUpComponent from '../../utilities/ScroolupComponent';



const AttendanceViweByTeacher = () => {
  const [searchQuery, setSearchQuery] = useState('');
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userResponse = useSelector((state) => state.idSlice?.userResponse); 
  const { data: attendanceData, isLoading, error, refetch } = useAttendanceByTeacherQuery(userResponse?._id); 
  

  const [studentId, setStudentId] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [subjectId, setSubjectId] = useState(null);
  const [subjectLevelId, setSubjectLevelId] = useState(null);

  const attendanceList = attendanceData?.data || [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAttendance = attendanceList.filter((attendance) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      attendance.aim?.toLowerCase().includes(searchLower) ||
      attendance.topic?.toLowerCase().includes(searchLower) ||
      attendance.teacher?.name?.toLowerCase().includes(searchLower) ||
      attendance.teacher?.email?.toLowerCase().includes(searchLower) ||
      attendance.student?.name?.toLowerCase().includes(searchLower) ||
      attendance.student?.email?.toLowerCase().includes(searchLower) ||
      attendance.board?.board_prog_name?.toLowerCase().includes(searchLower) ||
      attendance.subject?.subject_name?.toLowerCase().includes(searchLower) ||
      new Date(attendance.attendance_date).toLocaleDateString().includes(searchQuery) ||
      String(attendance.total_hours).includes(searchQuery) ||
      attendance.location?.toLowerCase().includes(searchLower) ||
      attendance.assignment_description?.toLowerCase().includes(searchLower)
    );
  });



  const handleStoreIds = (row) => {
    const teacherId = row.teacher?.id || row.teacher?._id || null;
    const studentId = row.student?.id || row.student?._id || null;
    const boardId = row.board?.id || row.board?._id || null;
    const subjectId = row.subject?.id || row.subject?._id || null;
    const subjectLevelId = row.subjectlevel?.id || row.subjectlevel?._id || null;
  
    setStudentId(studentId);
    setBoardId(boardId);
    setSubjectId(subjectId);
    setSubjectLevelId(subjectLevelId);
  };

  const handleGoToClassDetail = async () => {
    if (!userResponse._id || !studentId) {
      console.error("Missing required IDs for navigation.");
      return;
    }
  
    try {
      const response = await Api.post('/attendance/filter', {
        teacher_id: userResponse._id,
        student_id: studentId,
        board_id: boardId,
        subject_id: subjectId,
      });
  
      if (response.data.data.attendance) {
        dispatch(setStudentDetaId(response.data.data.attendance));
        navigate(`/attendance-master/student-details-by-teacher/${userResponse?._id}/${studentId}`);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };


  const columns = [
    {
      name: 'Student Name',
      selector: row => row.student?.name || '',
      sortable: true,
      width: "17%"
    },
    {
      name: 'Board Name',
      selector: row => row.board?.board_prog_name || '',
      sortable: true,
      width: "12%"
    },
    {
      name: 'Subject Name',
      selector: row => row.subject?.subject_name || '',
      sortable: true,
      width: "17%"
    },
    {
      name: 'Subject Level',
      selector: row => row.subjectlevel?.subject_level_name || '',
      sortable: true,
      width: "17%"
    },
    {
      name: 'Total Hours',
      selector: row => row.total_hours || '0',
      sortable: true,
      width: "15%"
    },
    {
      name: 'Actions',
      cell: row => (
        <Fragment>
          <button
            className="bg-custom-primary  text-white p-2 rounded hover:bg-blue-800 transition-colors"
            onClick={() => {
              handleStoreIds(row); 
              handleGoToClassDetail();
            }}
          >
            <FaLaptop className="text-xl" />
          </button>
        </Fragment>
      ),
      width: "20%",
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
  };

  const exportData = attendanceList.map(attendance => ({
    teacher_name: attendance.teacher?.name || 'N/A',
    student_name: attendance.student?.name || 'N/A',
    board_name: attendance.board?.board_prog_name || 'N/A',
    subject_name: attendance.subject?.subject_name || 'N/A',
    subject_level: attendance.subjectlevel?.subject_level_name || 'N/A',
    location: attendance.location || 'N/A',
    attendance_date: new Date(attendance.attendance_date).toLocaleDateString(),
    total_hours: attendance.total_hours || 'N/A',
    topic_name: attendance.topic || 'N/A',
    assignment_description: attendance.assignment_description || 'N/A',
  }));

  return (
  
      <div className="w-full ">
        <IconWithTitle
          icon={AiOutlineFundView}
          title="Attendance List"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />
        
        <div className="w-full p-6 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Filter by Name"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FcSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />
            </div>
            
            <CSVLink 
              data={exportData} 
              filename={"attendance_list.csv"} 
              className="flex items-center gap-2 bg-custom-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <ImFileExcel className="text-xl" />
              Export to CSV
            </CSVLink>
          </div>

          <DataTable
            columns={columns}
            data={filteredAttendance}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
            highlightOnHover
            striped
            noDataComponent={
              <div className="text-center py-8 text-gray-500">
                No attendance records found
              </div>
            }
          />
        </div>

        <div className="text-start mt-6 text-gray-500">
          COPYRIGHT © 2024 My Revision+, All rights Reserved
        </div>


        
        
        <ScrollUpComponent/>
      </div>
    
  );
};


export default AttendanceViweByTeacher