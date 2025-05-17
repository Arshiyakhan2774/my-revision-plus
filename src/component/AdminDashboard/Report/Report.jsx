import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineFundView } from "react-icons/ai";
import { FcSearch } from "react-icons/fc";
import { ImFileExcel } from "react-icons/im";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetUserTeacherQuery } from "../../Services/UserMangae/UserMangeSlice";

import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";

const Report = () => {
  // State management
  const [facultyName, setFacultyName] = useState("All");
  const [reportType, setReportType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // API data
  const { data: teacherData } = useGetUserTeacherQuery();
  const teacherList = teacherData?.data?.teacher || [];

  // Constants
  const reportTypes = ["All", "Daily", "Monthly", "Yearly"];
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Data fetching
  useEffect(() => {
    fetchDefaultSummaryData();
  }, []);

  useEffect(() => {
    if (facultyName !== "All" || reportType !== "All" || fromDate || toDate || month || year) {
      switch(tabValue) {
        case 0: fetchSummaryData(); break;
        case 1: fetchDetailsData(); break;
        case 2: fetchSentEmails(); break;
        default: break;
      }
    }
  }, [facultyName, reportType, fromDate, toDate, month, year, tabValue]);

  // Data processing functions
  const normalizeSentEmails = (data) => {
    return data.map(item => ({
      ...item,
      mail_status: item.mail_status?.toLowerCase() === "yes" ? "Yes" : "No"
    }));
  };

  const filteredSentEmails = sentEmails.filter((row) =>
    (row.student_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.teacher_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.mail_status || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDetailsData = detailsData.filter((row) =>
    (row.student_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.teacher_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSummaryData = summaryData.filter((row) =>
    row.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeachers = teacherList.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // API call functions
  const fetchDefaultSummaryData = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const response = await Api.get(`/attendance/list?year=${currentYear}`);
      if (response.data.status === "success") {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching default summary data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      let apiUrl = "/attendance/list?";
      if (facultyName !== "All") apiUrl += `teacher_id=${facultyName}&`;
      
      if (reportType === "Daily") {
        const from = fromDate ? fromDate.toISOString().split('T')[0] : '';
        const to = toDate ? toDate.toISOString().split('T')[0] : '';
        apiUrl += `from_date=${from}&to_date=${to}`;
      } else if (reportType === "Monthly") {
        const formattedMonth = month.toString().padStart(2, '0');
        apiUrl += `month=${formattedMonth}&year=${year}`;
      } else if (reportType === "Yearly") {
        apiUrl += `year=${year}`;
      }

      const response = await Api.get(apiUrl);
      setSummaryData(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setSummaryData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailsData = async () => {
    setLoading(true);
    try {
      const requestBody = {
        teacher_id: facultyName !== "All" ? facultyName : "",
        month: reportType === "Monthly" ? month.toString().padStart(2, '0') : "",
        year: year,
        mail: "no"
      };
      const response = await Api.post("/attendance/reportdetails", requestBody);
      setDetailsData(response.data.status === "success" ? 
        response.data.data?.filteredAttendance || [] : []);
    } catch (error) {
      console.error("Error fetching details data:", error);
      setDetailsData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentEmails = async () => {
    setLoading(true);
    try {
      const requestBody = {
        teacher_id: facultyName !== "All" ? facultyName : "",
        month: reportType === "Monthly" ? month : "",
        year: year,
        mail: "yes"
      };
      const response = await Api.post("/attendance/reportdetails", requestBody);
      if (response.data.status === "success") {
        const sentData = response.data.data?.filteredAttendance?.filter(item => 
          item.mail_status?.toLowerCase() === "yes"
        ) || [];
        setSentEmails(normalizeSentEmails(sentData));
      }
    } catch (error) {
      console.error("Error fetching sent emails:", error);
      setSentEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMail = async (row) => {
    try {
      const requestBody = {
        teacher_id: row.teacher_details?.id || facultyName,
        attendance_id: row._id,
        mail: "yes"
      };
      const response = await Api.post("/attendance/sendmail", requestBody);
      if (response.data.status === "success") {
        fetchSentEmails();
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Handler functions
  const handleGlobalSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };

  const handleFacultyChange = (e) => {
    setFacultyName(e.target.value);
    setFromDate(null);
    setToDate(null);
    setMonth("");
    setYear(new Date().getFullYear().toString());
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleReset = () => {
    setFacultyName("All");
    setReportType("All");
    setSearchQuery("");
    setFromDate(null);
    setToDate(null);
    setMonth("");
    setYear(new Date().getFullYear().toString());
    setSummaryData([]);
    setDetailsData([]);
    fetchDefaultSummaryData();
  };

  // CSV data preparation
  const csvData = summaryData.map(item => ({
    "Faculty Name": item.teacher?.name || "N/A",
    "Student Name": item.student?.name || "N/A",
    "Board/Program": item.board?.board_prog_name || "N/A",
    "Subject/Grade": item.subject?.subject_name || "N/A",
    "Subject Level": item.subjectlevel?.subject_level_name || "N/A",
    "Location": item.location || "N/A",
    "Date": new Date(item.attendance_date).toLocaleDateString(),
    "Total Hours": item.total_hours || "N/A",
    "Topic": item.topic || "N/A",
    "Assignment": item.assignment_description || "N/A"
  }));

  // Table columns configuration
  const summaryColumns = [
    { name: "Faculty Name", selector: row => row.teacher?.name || "N/A", sortable: true },
    { name: "Student Name", selector: row => row.student?.name || "N/A", sortable: true },
    { name: "Board/Program", selector: row => row.board?.board_prog_name || "N/A", sortable: true },
    { name: "Subject / Grade", selector: row => row.subject?.subject_name || "N/A", sortable: true },
    { name: "Subject Level", selector: row => row.subjectlevel?.subject_level_name || "N/A", sortable: true },
    { name: "Location", selector: row => row.location || "N/A", sortable: true },
    { 
      name: "Date", 
      selector: row => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }), 
      sortable: true 
    },
    { name: "Total Hours", selector: row => row.total_hours || "N/A", sortable: true },
    { name: "Topic", selector: row => row.topic || "N/A", sortable: true },
    { name: "Assignment", selector: row => row.assignment_description || "N/A", sortable: true },
  ];

  const detailsColumns = [
    { name: "Teacher", selector: row => row.teacher_details?.name || "N/A", sortable: true },
    { name: "Student", selector: row => row.student_details?.name || "N/A", sortable: true },
    { name: "Board/Program", selector: row => row.board_details?.board_prog_name || "N/A", sortable: true },
    { name: "Subject", selector: row => row.subject_details?.subject_name || "N/A", sortable: true },
    { 
      name: "Date", 
      selector: row => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }), 
      sortable: true 
    },
    { name: "Start Time", selector: row => row.start_time || "N/A", sortable: true },
    { name: "End Time", selector: row => row.end_time || "N/A", sortable: true },
    { name: "Total Hours", selector: row => row.total_hours || "N/A", sortable: true },
    { name: "Topic", selector: row => row.topic || "N/A", sortable: true },
    { name: "Assignment", selector: row => row.assignment_provide || "N/A", sortable: true },
    { name: "Location", selector: row => row.location || "N/A", sortable: true },
    { name: "Center", selector: row => row.schedule_details?.center || "N/A", sortable: true }
  ];

  const sentEmailsColumns = [
    { name: "Teacher", selector: row => row.teacher_details?.name || "N/A", sortable: true },
    { name: "Student", selector: row => row.student_details?.name || "N/A", sortable: true },
    { 
      name: "Date", 
      selector: row => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric'
      }), 
      sortable: true 
    },
    { 
      name: "Mail Status", 
      selector: row => row.mail_status || "N/A", 
      sortable: true,
      cell: row => (
        <span className={row.mail_status?.toLowerCase() === "yes" ? 
          "text-green-500 font-bold" : "text-red-500 font-bold"}>
          {row.mail_status || "N/A"}
        </span>
      )
    },
    {
      name: "Actions",
      cell: row => (
        <button
        onClick={() => {
          setSelectedRow(row);
          setIsModalOpen(true);
        }}
       
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Resend
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  // Table styles
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#1a73e8',
        color: "#fff",
        fontWeight: "bold",
      },
    },
    table: {
      style: {
        width: '100%',
      },
    },
  };

  return (
    <div className="overflow-hidden p-6">
      <IconWithTitle
        icon={AiOutlineFundView}
        title="Report View"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />

      <div className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Faculty Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
            <select
              value={facultyName}
              onChange={handleFacultyChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All</option>
              {filteredTeachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Yearly Report Filters */}
        {reportType === "Yearly" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={handleYearChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Monthly Report Filters */}
        {reportType === "Monthly" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={handleMonthChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={handleYearChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Daily Report Filters */}
        {reportType === "Daily" && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <DatePicker
                selected={fromDate}
                onChange={setFromDate}
                selectsStart
                startDate={fromDate}
                endDate={toDate}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <DatePicker
                selected={toDate}
                onChange={setToDate}
                selectsEnd
                startDate={fromDate}
                endDate={toDate}
                minDate={fromDate}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select end date"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
          <CSVLink 
            data={csvData} 
            filename={"report_data.csv"}
            className="px-4 py-3 bg-custom-primary text-white rounded-md hover:bg-blue-800 transition-colors flex items-center gap-2 justify-center"
          >
            <ImFileExcel className="text-xl" />
            Export to CSV
          </CSVLink>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setTabValue(0)}
          className={`px-4 py-2 font-medium ${tabValue === 0 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Summary
        </button>
        <button
          onClick={() => setTabValue(1)}
          className={`px-4 py-2 font-medium ${tabValue === 1 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Details
        </button>
        <button
          onClick={() => setTabValue(2)}
          className={`px-4 py-2 font-medium ${tabValue === 2 ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sent Emails
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Summary Tab */}
      {!loading && tabValue === 0 && (
        <div className="space-y-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search (Student Name, Teacher Name)"
                value={searchQuery}
                onChange={handleGlobalSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FcSearch className="absolute left-3 top-3 text-xl" />
            </div>
          </div>
          
          <DataTable
            columns={summaryColumns}
            data={filteredSummaryData}
            pagination
            customStyles={customStyles}
          />
        
          {filteredSummaryData.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No data found. Please apply filters.
            </div>
          )}
        </div>
      )}

      {/* Details Tab */}
      {!loading && tabValue === 1 && (
        <div className="space-y-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search (Student Name, Teacher Name)"
                value={searchQuery}
                onChange={handleGlobalSearch}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FcSearch className="absolute left-3 top-3 text-xl" />
            </div>
          </div>
      
          <DataTable
            columns={detailsColumns}
            data={filteredDetailsData}
            pagination
            customStyles={customStyles}
          />
       
          {filteredDetailsData.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No data found. Please apply filters.
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => handleSendMail()}
              className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Send Mail
            </button>
          </div>
        </div>
      )}
{!loading && tabValue === 2 && (
  <div className="space-y-4 w-full">
    <div className="w-full md:w-1/3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search Sent Emails"
          value={searchQuery}
          onChange={handleGlobalSearch}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FcSearch className="absolute left-3 top-3 text-xl" />
      </div>
    </div>

    <div className="w-full overflow-x-auto">
      {filteredSentEmails.length > 0 ? (
        <DataTable
          columns={sentEmailsColumns}
          data={filteredSentEmails}
          pagination
          customStyles={{
            ...customStyles,
            table: {
              style: {
                minWidth: '100%', // Ensures table takes full width
                tableLayout: 'auto' // Allows columns to expand naturally
              }
            },
            cells: {
              style: {
                whiteSpace: 'nowrap', // Prevents text wrapping
                overflow: 'visible', // Shows full content
                textOverflow: 'ellipsis' // Adds ellipsis if needed
              }
            }
          }}
        />
      ) : (
        <div className="text-center py-10 text-gray-500">
          {loading ? 'Loading...' : 'No sent emails found'}
        </div>
      )}
    </div>
  </div>
)}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <h3 className="text-lg font-medium mb-4">Confirm Resend</h3>
      <p className="mb-6">Are you sure you want to resend this email to {selectedRow?.student_details?.name || 'the student'}?</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            handleSendMail(selectedRow);
            setIsModalOpen(false);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Resend
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Report;   