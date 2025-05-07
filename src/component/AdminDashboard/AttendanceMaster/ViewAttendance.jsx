import { useState, useEffect, Fragment, useMemo } from 'react';
import { AiOutlineFundView } from "react-icons/ai";

import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { FaLaptop } from "react-icons/fa";
import { FcSearch } from 'react-icons/fc';
import { ImFileExcel } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { useAttendanceQuery, useDeleteAttendanceMutation, useFetchScheduleQuery } from '../../Services/Attendance/AttendanceApi';
import { useGetUserTeacherQuery } from '../../Services/UserMangae/UserMangeSlice';
import { Api } from '../../Api/Api';
import { setAttendanceData } from '../../store/Random/StudentSlice';
import ProgressLoader from '../../utilities/LoaderProgress';
import IconWithTitle from '../../utilities/IconsTittle';
import DeleteConfirmation from '../../utilities/DeleteConfirmation';
import { toast } from 'react-toastify';
import ScrollUpComponent from '../../utilities/ScroolupComponent';
import StudentDetails from './StudentDetails';
import EditAttendance from './EditAttendanceModal';


const ViewAttendance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [studentIdSingle, setStudentIdSingle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const { data: teacherData } = useGetUserTeacherQuery();
  const teachers = useMemo(() => teacherData?.data?.teacher || [], [teacherData]);
  const { data } = useFetchScheduleQuery();
  const { data: attendanceData, refetch, isLoading, error } = useAttendanceQuery();
  const attendanceList = attendanceData?.data || [];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) { // Stop at 90% until API completes
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isLoading]);
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

  // const openDeleteDialog = (attendanceId) => {
  //   setAttendanceToDelete(attendanceId);
  //   setDeleteDialogOpen(true);
  // };

  const handleStoreIds = (row) => {
    const teacherId = row.teacher?.id || row.teacher?._id || null;
    const studentId = row.student?.id || row.student?._id || null;
    const boardId = row.board?.id || row.board?._id || null;
    const subjectId = row.subject?.id || row.subject?._id || null;
    const subjectLevelId = row.subjectlevel?.id || row.subjectlevel?._id || null;
  
    if (!teacherId || !studentId) {
      console.error("Missing required IDs:", row);
      return null;
    }
  
    return { teacherId, studentId, boardId, subjectId, subjectLevelId };
  };

  const handleGoToClassDetail = async (teacherId, studentId, boardId, subjectId) => {
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
        dispatch(setAttendanceData(response.data.data.attendance));
        navigate(`/student-details/${teacherId}`);
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
      toast.success("The attendance entry has been successfully deleted")
      } catch (error) {
        console.error("Error deleting attendance", error);
        toast.error("Error deleting attendance", error)
      } finally {
        setDeleteDialogOpen(false);
        setAttendanceToDelete(null);
      }
    }
  };

  const columns = [
    { name: 'Teacher Name', selector: row => row.teacher?.name || '', sortable: true,  },
    { name: 'Student Name', selector: row => row.student?.name || '', sortable: true,  },
    { name: 'Board Name', selector: row => row.board?.board_prog_name || '', sortable: true, },
    { name: 'Subject Name', selector: row => row.subject?.subject_name || '', sortable: true,  },
    { name: 'Subjectlevel Name', selector: row => row.subjectlevel?.subject_level_name || '', sortable: true,  },
    { name: 'Total Hours', selector: row => row.total_hours || '0', sortable: true,  },
    {
      name: 'Actions',
      cell: row => (
        <Fragment>
          <button
            className="bg-custom-primary text-white px-3 py-1 rounded mr-2 hover:bg-blue-800"
            onClick={() => {
              const ids = handleStoreIds(row);
              if (ids) {
                handleGoToClassDetail(
                  ids.teacherId, 
                  ids.studentId, 
                  ids.boardId, 
                  ids.subjectId
                );
              }
            }}
          >
            <FaLaptop className="inline-block" size={16} />
          </button>
        </Fragment>
      ),
      
    }
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
   
     
        <Fragment>
          
          <div className="container mx-auto px-4 py-6">
            <div className="">
              <IconWithTitle
                icon={AiOutlineFundView}
                title="Attendance List"
                iconColor="white"
                backgroundColor="#00246B"
                iconSize="30px"
                titleColor="#00246B"
                titleFontSize="34px"
              />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Filter by Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
                </div>
                
                <CSVLink 
                  data={exportData} 
                  filename={"attendance_list.csv"} 
                  className="inline-block"
                >
                  <button className="bg-custom-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 flex items-center gap-2">
                    <ImFileExcel size={20} />
                    Export to CSV
                  </button>
                </CSVLink>
              </div>
              
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={filteredAttendance}
                  customStyles={customStyles}
                  pagination
                  paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                  highlightOnHover
                  striped
                />
              </div>
              
              <div className="text-start mt-6 text-gray-500">
                COPYRIGHT © 2024 My Revision+, All rights Reserved
              </div>
            </div>
          </div>

          <DeleteConfirmation
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeleteAttendance}
            userName="this attendance entry"
          />
          
      
          
          {selectedAttendance && (
            <EditAttendance
              open={!!selectedAttendance}
              onClose={() => setSelectedAttendance(null)}
              attendanceData={selectedAttendance}
              refetch={refetch}
            />
          )}
          
          <ScrollUpComponent/>
          
          {attendanceList?.length === 0 && (
            <div className="w-full bg-gray-200 h-1">
              <div className="bg-blue-500 h-1 animate-pulse"></div>
            </div>
          )}
          
          {studentIdSingle && (
            <StudentDetails studentId={studentIdSingle} attendanceData={attendanceData} refetch={refetch}/>
          )}
        </Fragment>
  

  );
};

export default ViewAttendance;