import React, { Fragment, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
import { FcSearch } from "react-icons/fc";
import { PiStudentLight } from "react-icons/pi";
import { ImFileExcel } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import DataTable from "react-data-table-component";
import { useDeleteAttendanceMutation } from "../../Services/Attendance/AttendanceApi";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";
import EditAttendance from "../../AdminDashboard/AttendanceMaster/EditAttendanceModal";
import DeleteConfirmation from "../../utilities/DeleteConfirmation";

const TeacherViewAttendance = (refetch) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [emailSuccessDialogOpen, setEmailSuccessDialogOpen] = useState(false);
  const [confirmSendDialogOpen, setConfirmSendDialogOpen] = useState(false);
  
  const studentDetaId = useSelector((state) => state.idSlice.studentDetaId); 
  const attendancedata = studentDetaId;

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  if (!attendancedata) {
    return <div className="p-4 text-center">No attendance data available</div>;
  }

  const teacherName = attendancedata[0]?.schedule_id?.teacher_id?.name || "N/A";
  const studentName = attendancedata[0]?.schedule_id?.student_id?.name || "N/A";
  const teacherID = attendancedata[0]?.schedule_id?.teacher_id || "N/A";
  const studentID = attendancedata[0]?.schedule_id?.student_id || "N/A";
  const boardID = attendancedata[0]?.schedule_id?.board_id || "N/A";
  const subjectID = attendancedata[0]?.schedule_id?.subject_id || "N/A";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDeleteAttendance = async () => {
    if (attendanceToDelete) {
      try {
        await deleteAttendance(attendanceToDelete).unwrap();
        refetch();
       toast.success("The attendance entry has been successfully deleted.")
      } catch (error) {
        console.error("Error deleting attendance", error);
        toast.error("Error deleting attendance", error)
      } finally {
        setDeleteDialogOpen(false);
     
      }
    }
  };

  const handleSendEmailReport = async () => {
    setConfirmSendDialogOpen(false);
    if (!teacherID || !studentID || !selectedMonth || !selectedYear) {
      toast.error("Please select month and year for the report");
      return;
    }

    try {
      const response = await Api.post('/attendance/filter', {
        teacher_id: teacherID._id || teacherID,
        student_id: studentID._id || studentID,
        board_id: boardID._id || boardID,
        subject_id: subjectID._id || subjectID,
        month: selectedMonth,
        year: selectedYear,
        mail_sent: "true"
      });

      if (response.data.message && response.data.message.includes("sent successfully")) {
        toast.success(response.data.message);
        setEmailSuccessDialogOpen(true);
      } else {
        toast.error("Failed to send email report");
      }
    } catch (error) {
      console.error("Error sending email report:", error);
      toast.error(error.response?.data?.message || "Error sending email report");
    }
  };

  const handleSendButtonClick = () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select month and year for the report");
      return;
    }
    setConfirmSendDialogOpen(true);
  };

  const openDeleteDialog = (attendanceId) => {
    setAttendanceToDelete(attendanceId);
    setDeleteDialogOpen(true);
  };

  useEffect(() => {
    let filtered = attendancedata;
  
    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((item) => {
        const dateParts = item.attendance_date.split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        return month === selectedMonth && year === String(selectedYear);
      });
    }
  
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        return (
          (item.aim?.toLowerCase() || '').includes(searchLower) ||
          (item.topic?.toLowerCase() || '').includes(searchLower)
        );
      });
    }
  
    setFilteredData(filtered);
  }, [selectedMonth, selectedYear, searchText, attendancedata]);

  const exportData = attendancedata.map((item) => ({
    TeacherName: item.schedule_id?.teacher_id?.name || "N/A",
    Date: new Date(item.attendance_date).toLocaleDateString("en-GB"),
    StartTime: item.start_time || "N/A",
    EndTime: item.end_time || "N/A",
    TotalHours: item.total_hours || "N/A",
    Aim: item.aim || "N/A",
    Topic: item.topic || "N/A",
    AssignmentDescription: item.assignment_description || "N/A",
    AssignmentStatus: item.assignment_provide || "N/A",
  }));

  const formatTimeString = (timeStr) => {
    if (!timeStr) return "N/A";
    const time = new Date(`2000-01-01T${timeStr}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      sortable: true,
    },
    {
      name: "Start Time",
      selector: (row) => formatTimeString(row.start_time),
      sortable: true,
    },
    {
      name: "End Time", 
      selector: (row) => formatTimeString(row.end_time),
      sortable: true,
    },
    {
      name: "Total Hours",
      selector: (row) => row.total_hours || "N/A",
      sortable: true,
    },
    {
      name: "Aim",
      selector: (row) => row.aim || "N/A",
      sortable: true,
    },
    {
      name: "Topic",
      selector: (row) => row.topic || "N/A",
      sortable: true,
    },
    {
      name: "Assignment Description",
      selector: (row) => row.assignment_description || "",
      sortable: true,
    },
    {
      name: "Assignment Status",
      selector: (row) => row.assignment_provide || "N/A",
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <Fragment>
          <button 
            className="text-red-500 hover:text-red-700 p-1"
            onClick={() => openDeleteDialog(row._id)}
          >
            <RiDeleteBin6Line className="text-xl" />
          </button>
          <button 
            className="text-blue-500 hover:text-blue-700 p-1 ml-2"
            onClick={() => setSelectedAttendance(row)}
          >
            <CiEdit className="text-xl" />
          </button>
        </Fragment>
      ),
      width: "20%",
    },
  ];

  const totalHours = attendancedata.reduce((acc, curr) => {
    const hours = parseFloat(curr.total_hours) || 0;
    return acc + hours;
  }, 0);

  return (
    <div className="max-w-full mx-4 xl:mx-8">
      <IconWithTitle
        icon={PiStudentLight}
        title={`${studentName}'s Monthly Academic Performance`}
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Teacher Name:</span> {attendancedata[0]?.schedule_id?.teacher_id?.name || "N/A"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Subject:</span> {attendancedata[0]?.schedule_id?.subject_id?.subject_name || "N/A"}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Board:</span> {attendancedata[0]?.schedule_id?.board_id?.board_prog_name || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Center:</span> {attendancedata[0]?.schedule_id?.center || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total Hours:</span> {totalHours.toFixed(2)} hours
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search by Name or Topic"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FcSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />
          </div>
          <CSVLink 
            data={exportData} 
            filename={"attendance_list.csv"} 
            className="flex items-center justify-center gap-2 bg-custom-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
          >
            <ImFileExcel className="text-xl" />
            Export
          </CSVLink>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-40">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-32">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleSendButtonClick}
            disabled={!selectedMonth || !selectedYear}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${!selectedMonth || !selectedYear ? 'bg-gray-400 cursor-not-allowed' : 'bg-custom-primary hover:bg-blue-800'} text-white transition-colors`}
          >
            <MdSend className="text-xl" />
            Send Report
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={filteredData}
          noDataComponent={
            <div className="text-center py-8 text-gray-500">
              {selectedMonth && selectedYear 
                ? `📅 No classes recorded for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                : "No attendance records found"}
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#1a73e8",
                color: "#fff",
                fontWeight: "bold",
              },
            },
          }}
        />
      </div>

      {/* Confirmation Dialog */}
      {confirmSendDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Send Email</h3>
            <p className="mb-6">
              Are you sure you want to send the attendance report for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmSendDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmailReport}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {emailSuccessDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-green-600">Report Sent Successfully</h3>
            <p className="mb-6">
              The monthly attendance report has been sent successfully.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setEmailSuccessDialogOpen(false)}
                className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
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
    </div>
  );
};



export default TeacherViewAttendance