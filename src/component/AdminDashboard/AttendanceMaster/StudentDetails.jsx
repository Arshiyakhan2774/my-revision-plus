import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { toast, ToastContainer } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { PiStudentLight } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmation from "../../utilities/DeleteConfirmation";
import { useDeleteAttendanceMutation } from "../../Services/Attendance/AttendanceApi";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";
import ScrollUpComponent from "../../utilities/ScroolupComponent";
import EditAttendance from "./EditAttendanceModal";

const StudentDetails = ({refetch}) => {
  const [attendancedata, setAttendanceData] = useState(
    useSelector((state) => state.student.attendancedata)
  );
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const dispatch = useDispatch();
  const [deleteAttendance, { isLoading: isDeleting }] = useDeleteAttendanceMutation();
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const months = useMemo(() => [...Array(12)].map((_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  })), []);

  const years = useMemo(() => 
    Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i), 
    []
  );

  const { teacherID, studentID, boardID, subjectID, studentName } = useMemo(() => ({
    teacherID: attendancedata?.[0]?.schedule_id?.teacher_id || "N/A",
    studentID: attendancedata?.[0]?.schedule_id?.student_id || "N/A",
    boardID: attendancedata?.[0]?.schedule_id?.board_id || "N/A",
    subjectID: attendancedata?.[0]?.schedule_id?.subject_id || "N/A",
    studentName: attendancedata?.[0]?.schedule_id?.student_id?.name || "N/A"
  }), [attendancedata]);

  const handleSearch = (e) => setSearchText(e.target.value.toLowerCase());

  const formatTimeString = (timeStr) => {
    if (!timeStr) return "N/A";
    try {
      const time = new Date(`2000-01-01T${timeStr}`);
      return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return "Invalid Time";
    }
  };

  const handleSendEmailReport = async () => {
    if (!selectedMonth || !selectedYear) {
      toast.error("Please select both month and year");
      return;
    }

    setIsSendingEmail(true);
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

      if (response.data?.message?.includes("sent successfully")) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data?.message || "Failed to send email");
      }
    } catch (err) {
      console.error("Email sending error:", err);
      toast.error(err.response?.data?.message || "Error sending email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const openDeleteDialog = (id) => {
    setAttendanceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAttendance = async () => {
    if (!attendanceToDelete) return;
    
    try {
      await deleteAttendance(attendanceToDelete).unwrap();
      const updated = attendancedata.filter(a => a._id !== attendanceToDelete);
      setAttendanceData(updated);
      toast.success("Attendance deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.data?.message || "Delete failed");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    let filtered = attendancedata || [];
    if (selectedMonth && selectedYear) {
      filtered = filtered.filter(({ attendance_date }) => {
        try {
          const [year, month] = attendance_date?.split("-") || [];
          return month === selectedMonth && year === String(selectedYear);
        } catch {
          return false;
        }
      });
    }
    if (searchText) {
      filtered = filtered.filter(item =>
        (item.aim || "").toLowerCase().includes(searchText) ||
        (item.topic || "").toLowerCase().includes(searchText)
      );
    }
    setFilteredData(filtered);
  }, [searchText, selectedMonth, selectedYear, attendancedata]);

  const exportData = useMemo(() => {
    return (attendancedata || []).map(item => ({
      Teacher: item.schedule_id?.teacher_id?.name || "N/A",
      Date: item.attendance_date ? 
        new Date(item.attendance_date).toLocaleDateString("en-GB") : "N/A",
      Start: item.start_time || "N/A",
      End: item.end_time || "N/A",
      Hours: item.total_hours || "N/A",
      Aim: Array.isArray(item.aim) ? item.aim.join(', ') : item.aim || "N/A",
      Topic: item.topic || "N/A",
      Assignment: item.assignment_description || "N/A",
      Status: item.assignment_provide || "N/A"
    }));
  }, [attendancedata]);

  const columns = useMemo(() => [
    { 
      name: "Teacher", 
      selector: row => row.schedule_id?.teacher_id?.name || "N/A", 
      sortable: true 
    },
    { 
      name: "Date", 
      selector: row => new Date(row.attendance_date).toLocaleDateString("en-GB"), 
      sortable: true 
    },
    { 
      name: "Start", 
      selector: row => formatTimeString(row.start_time), 
      sortable: true 
    },
    { 
      name: "End", 
      selector: row => formatTimeString(row.end_time), 
      sortable: true 
    },
    { 
      name: "Hours", 
      selector: row => row.total_hours || "N/A", 
      sortable: true 
    },
    { 
      name: "Aim", 
      selector: row => row.aim || "N/A", 
      sortable: true 
    },
    // { 
    //   name: "Topic", 
    //   selector: row => row.topic || "N/A", 
    //   sortable: true 
    // },
    // { 
    //   name: "Assignment", 
    //   selector: row => row.assignment_description || "", 
    //   sortable: true 
    // },
    // { 
    //   name: "Status", 
    //   selector: row => row.assignment_provide || "N/A", 
    //   sortable: true 
    // },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex gap-2">
          <button 
            className="text-red-600 hover:text-red-800" 
            onClick={() => openDeleteDialog(row._id)}
            disabled={isDeleting}
          >
            <RiDeleteBin6Line size={20} />
          </button>
          <button 
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setSelectedAttendance(row)}
          >
            <CiEdit size={20} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ], [isDeleting]);

  return (
    <Fragment>    
      <div className="px-6 py-4 w-full">
        <IconWithTitle
          icon={PiStudentLight}
          title={`${studentName}'s Monthly Academic Performance`}
          iconColor="white"
          backgroundColor="#00246B"
          iconSize="30px"
          titleColor="#00246B"
          titleFontSize="34px"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <select
            className="p-2 border h-12 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {months.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            className="p-2 border rounded h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <input
            type="text"
            className="p-2 border rounded h-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by aim or topic..."
            value={searchText}
            onChange={handleSearch}
          />

          <div className="flex gap-2 items-center">
            <button 
              onClick={handleSendEmailReport} 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isSendingEmail || !selectedMonth || !selectedYear}
            >
              {isSendingEmail ? 'Sending...' : 'Send Report'}
            </button>
            
            {exportData.length > 0 ? (
              <CSVLink 
                data={exportData} 
                filename={`${studentName.replace(/\s+/g, '_')}_Attendance_Report.csv`}
                className="border border-gray-300  px-4 py-2 rounded hover:bg-gray-100 text-center"
              >
                Export CSV
              </CSVLink>
            ) : (
              <button 
                className="border border-gray-300 px-4 py-2 rounded cursor-not-allowed opacity-50" 
                disabled
                title="No data to export"
              >
                Export CSV
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50, 100]}
            highlightOnHover
            pointerOnHover
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: '#1a73e8',
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: '14px',
                },
              },
              cells: {
                style: {
                  fontSize: '14px',
                },
              },
            }}
            progressPending={isDeleting}
            noDataComponent={<div className="py-8 text-center text-gray-500">No attendance records found</div>}
          />
        </div>

        <DeleteConfirmation
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteAttendance}
          isLoading={isDeleting}
        />
      </div>
      {selectedAttendance && (
          <EditAttendance
            open={!!selectedAttendance}
            onClose={() => setSelectedAttendance(null)}
            attendanceData={selectedAttendance}
            refetch={refetch}
          />
        )}
      <ScrollUpComponent/>
      <ToastContainer position="bottom-right" autoClose={5000} />
    </Fragment>
  );
};

export default StudentDetails;