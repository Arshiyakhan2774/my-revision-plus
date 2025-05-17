import { useState, useEffect, Fragment, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { FcSearch } from 'react-icons/fc';
import { ImFileExcel } from 'react-icons/im';
import { FaLaptop } from 'react-icons/fa';
import { AiOutlineFundView } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteAttendanceMutation, useFetchScheduleQuery, useTeacherDetailsForStudentQuery } from '../../Services/Attendance/AttendanceApi';
import { useGetUserTeacherQuery } from '../../Services/UserMangae/UserMangeSlice';
import ScrollUpComponent from '../../utilities/ScroolupComponent';
import IconWithTitle from '../../utilities/IconsTittle';
import { Api } from '../../Api/Api';
import { setStudentDetaId } from '../../store/all-Id-Slice/IdSlice';





const StudentFilter = () => {
  const [selectedValue, setSelectedValue] = useState('10');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [studentIdSingle, setStudentIdSingle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [subjectId, setSubjectId] = useState(null);
  const [subjectLevelId, setSubjectLevelId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userResponse = useSelector((state) => state.idSlice?.userResponse); 
  const { data: attendanceData, isLoading, error, refetch } = useTeacherDetailsForStudentQuery(userResponse?._id); 
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const { data: teacherData } = useGetUserTeacherQuery();
  const { data } = useFetchScheduleQuery();

  const teachers = useMemo(() => teacherData?.data?.teacher || [], [teacherData]);
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
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacher) {
        setLoading(true);
        try {
          const response = await Api.get(`/onlineclass/list/${selectedTeacher}`);
          const subjectMappingsData = response.data.data.onlineclass.subjectmapping;
          setSubjectMappings(subjectMappingsData);
          const allStudents = subjectMappingsData.flatMap((mapping) =>
            mapping.subjects.flatMap((subject) =>
              subject.students.map((student) => ({
                student_id: student.student_id,
                name: student.name,
                board_info: student.board_info,
                subject_info: subject,
                subjectlevel_id: mapping.subjectlevel_id,
                subject_level_name: mapping.subject_level_name,
              }))
            )
          );
          setStudents(allStudents);  
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedTeacher]); 

  const openDeleteDialog = (attendanceId) => {
    setAttendanceToDelete(attendanceId);
    setDeleteDialogOpen(true);
  };

  const handleStoreIds = (row) => {
    const teacherId = row.teacher?.id || row.teacher?._id || null;
    const studentId = row.student?.id || row.student?._id || null;
    const boardId = row.board?.id || row.board?._id || null;
    const subjectId = row.subject?.id || row.subject?._id || null;
    const subjectLevelId = row.subjectlevel?.id || row.subjectlevel?._id || null;
  
    if (!teacherId) {
      console.error("Teacher ID is missing:", row);
    }
  
    setTeacherId(teacherId);
    setStudentId(studentId);
    setBoardId(boardId);
    setSubjectId(subjectId);
    setSubjectLevelId(subjectLevelId);
  };

  const handleGoToClassDetail = async () => {
    if (!teacherId || !studentId) {
      console.error("Missing required IDs for navigation.");
      return;
    }
  
    try {
      const response = await Api.post('/attendance/filter', {
        teacher_id: teacherId,
        student_id: studentId,
        board_id: boardId,
        subject_id: subjectId,
      });
  
      if (response.data.data.attendance) {
        dispatch(setStudentDetaId(response.data.data.attendance));
        navigate(`/student-details-by-student/${userResponse?._id}/${studentId}`);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleDeleteAttendance = async () => {
    if (attendanceToDelete) {
      try {
        await deleteAttendance(attendanceToDelete).unwrap();
        refetch();
        setDeleteSuccessDialogOpen(true); 
      } catch (error) {
        console.error("Error deleting attendance", error);
      } finally {
        setDeleteDialogOpen(false);
        setAttendanceToDelete(null);
      }
    }
  };

  const columns = [
    { 
      name: 'Teacher Name', 
      selector: row => row.teacher?.name || '', 
      sortable: true, 
      width: "17%" 
    },
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
      name: 'Subjectlevel Name', 
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
            onClick={() => {
              handleStoreIds(row); 
              handleGoToClassDetail();
            }}
            className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-custom-primary transition-colors mr-2"
          >
            <FaLaptop className="inline-block text-xl" />
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

      <div className="p-5">
        <IconWithTitle
          icon={AiOutlineFundView}
          title="Attendance List"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4 border-b pb-4">
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
          
          <CSVLink data={exportData} filename={"attendance_list.csv"}>
            <button className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-custom-primary transition-colors">
              <ImFileExcel className="text-xl" />
              Export to CSV
            </button>
          </CSVLink>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredAttendance}
          customStyles={customStyles}
          pagination
          paginationPerPage={parseInt(selectedValue, 10)}
          paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
          highlightOnHover
          striped
        />
        
        <div className="text-start mt-6 text-gray-500">
          COPYRIGHT © 2024 My Revision+, All rights Reserved
        </div>
        
      
     
        <ScrollUpComponent/>
        
        {attendanceList?.length === 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
  
  );
};

export default StudentFilter;