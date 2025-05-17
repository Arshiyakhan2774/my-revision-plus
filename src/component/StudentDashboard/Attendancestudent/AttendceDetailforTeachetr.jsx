import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import { FcSearch } from "react-icons/fc";
import { PiStudentLight } from "react-icons/pi";
import { ImFileExcel } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";
import ScrollUpComponent from "../../utilities/ScroolupComponent";

const AttendanceDetailForTeacher = () => {
  const studentDetaId = useSelector((state) => state.idSlice.studentDetaId); 
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 
  const attendancedata = studentDetaId;
  const teacherName = attendancedata[0]?.schedule_id?.teacher_id?.name || "N/A";
  const studentName = attendancedata[0]?.schedule_id?.student_id?.name || "N/A";

  const teacherID = attendancedata[0]?.schedule_id?.teacher_id || "N/A";
  const studentID = attendancedata[0]?.schedule_id?.student_id || "N/A";
  const boardID = attendancedata[0]?.schedule_id?.board_id || "N/A";
  const subjectID = attendancedata[0]?.schedule_id?.subject_id || "N/A";

  if (!attendancedata) {
    return <div className="p-4 text-center text-gray-600">No attendance data available</div>;
  }

  const handleSendEmail = async () => {
    try {
      const emailData = {
        teacher_id: teacherID,
        student_id: studentID,
        board_id: boardID,
        subject_id: subjectID,
        from_date: fromDate,
        to_date: toDate,
      };

      const response = await Api.post("attendance/filter", emailData);
      toast.success("Email sent successfully!");
      console.log("Email sent:", response);
      setIsDialogOpen(true);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "API request failed.";
      toast.error(`Error: ${errorMessage}`);
      console.error("Error sending email:", error);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); 
  };

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

  const columns = [
    {
      name: "Teacher Name",
      selector: (row) => row.schedule_id?.teacher_id?.name || "N/A",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }),
      sortable: true,
    },
    {
      name: "Start Time",
      selector: (row) => row.start_time || "N/A",
      sortable: true,
    },
    {
      name: "End Time",
      selector: (row) => row.end_time || "N/A",
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
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#1a73e8",
        color: "#fff",
        fontWeight: "bold",
      },
    },
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchText(value);

    const filtered = attendancedata.filter((item) =>
      ["aim", "location", "assignment_provide"]
        .map((key) => item[key]?.toString().toLowerCase())
        .some((field) => field?.includes(value))
    );
    setFilteredData(filtered);
  };

  const handleDateFilter = () => {
    const filtered = attendancedata.filter((item) => {
      const attendanceDate = new Date(item.attendance_date);
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
      return attendanceDate >= startDate && attendanceDate <= endDate;
    });
    setFilteredData(filtered);
  };

  return (
    <div className="p-4 max-w-full">
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
          <p className="text-gray-700 mb-2">Teacher Name: {attendancedata[0]?.schedule_id?.teacher_id?.name || "N/A"}</p>
          <p className="text-gray-700 mb-2">Subject: {attendancedata[0]?.schedule_id?.subject_id?.subject_name || "N/A"}</p>
          <p className="text-gray-700 mb-2">Board: {attendancedata[0]?.schedule_id?.board_id?.board_prog_name || "N/A"}</p>
        </div>

        <div>
          <p className="text-gray-700 mb-2">Center: {attendancedata[0]?.schedule_id?.center || "N/A"}</p>
          <p className="text-gray-700 mb-2">Total Hours: {attendancedata[0]?.total_hours || "N/A"}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by Name or Topic"
            value={searchText}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FcSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />
        </div>

        <CSVLink data={exportData} filename={"attendance_list.csv"}>
          <button className="flex items-center gap-2 bg-custom-primary text-white px-4 py-2 rounded-md hover:bg-custom-primary transition-colors">
            <ImFileExcel className="text-xl" />
            Export
          </button>
        </CSVLink>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="mt-6 border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={filteredData.length ? filteredData : attendancedata}
          customStyles={customStyles}
          pagination
        />
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="bg-green-500 text-white p-4 rounded-t-lg text-center">
              <h3 className="text-lg font-bold">Email Sent</h3>
            </div>
            <div className="p-4 text-center">
              <p className="text-green-500 font-bold">The email has been sent successfully.</p>
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={handleCloseDialog}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
      <ScrollUpComponent />
    </div>
  );
};

export default AttendanceDetailForTeacher;