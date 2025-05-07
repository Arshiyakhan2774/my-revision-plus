import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, MenuItem, Select, FormControl, InputLabel, Container, Card, CardContent, Tabs, Tab, Box, Grid, TextField } from "@mui/material";
import LayoutPage from "../../../Utilities/LayoutPage";
import IconWithTitle from "../../../Utilities/IconsTittle";
import { AiOutlineFundView } from "react-icons/ai";
import { FcSearch } from "react-icons/fc";
import { ImFileExcel } from "react-icons/im";
import { CSVLink } from "react-csv";
import { Api } from "../../../Api/Api";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useGetUserTeacherQuery } from "../../../Services/UserMangae/UserMangeSlice";

const Report = ({ isSidebarClosed }) => {
  const [facultyName, setFacultyName] = useState("All");
  const [reportType, setReportType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [summaryData, setSummaryData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { data: teacherData } = useGetUserTeacherQuery();
  const teacherList = teacherData?.data?.teacher || [];

  // Fetch default data for the current year on component mount
  useEffect(() => {
    fetchDefaultSummaryData();
  }, []);

  // Fetch data when filters are applied
  useEffect(() => {
    if (facultyName !== "All" || reportType !== "All" || fromDate || toDate || month || year) {
      if (tabValue === 0) {
        fetchSummaryData();
      } else if (tabValue === 1) {
        fetchDetailsData();
      }
    }
  }, [facultyName, reportType, fromDate, toDate, month, year, tabValue]);

  const fetchDefaultSummaryData = async () => {
    setLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      const response = await Api.get(`/attendance/list?year=${currentYear}`);
      console.log("Default Summary API Response:", response.data);

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

      // Add teacher_id if selected
      if (facultyName !== "All") {
        apiUrl += `teacher_id=${facultyName}&`;
      }

      // Add filters based on report type
      if (reportType === "Daily") {
        apiUrl += `from_date=${fromDate}&to_date=${toDate}`;
      } else if (reportType === "Monthly") {
        apiUrl += `month=${month}&year=${year}`;
      } else if (reportType === "Yearly") {
        apiUrl += `year=${year}`;
      }

      console.log("Summary API URL:", apiUrl);

      const response = await Api.get(apiUrl);
      console.log("Summary API Response:", response.data);

      if (response.data.status === "success") {
        setSummaryData(response.data.data);
      } else {
        console.error("API returned an error:", response.data.message);
        setSummaryData([]);
      }
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
    // Prepare request body for POST request
    const requestBody = {
      teacher_id: facultyName !== "All" ? facultyName : "",
      month: reportType === "Monthly" ? month : "",
      year: year,
      mail: "no"
    };

    const response = await Api.post("/attendance/reportdetails", requestBody);
    console.log("Details API Response:", response.data);

    if (response.data.status === "success") {
      // Access the filteredAttendance array from the response
      const filteredAttendance = response.data.data?.filteredAttendance || [];
      setDetailsData(filteredAttendance);
    } else {
      console.error("API returned an error:", response.data.message);
      setDetailsData([]);
    }
  } catch (error) {
    console.error("Error fetching details data:", error);
    setDetailsData([]);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  if (facultyName !== "All" || reportType !== "All" || fromDate || toDate || month || year) {
    switch(tabValue) {
      case 0: 
        fetchSummaryData();
        break;
      case 1:
        fetchDetailsData();
        break;
      case 2:
        fetchSentEmails();
        break;
      default:
        break;
    }
  }
}, [facultyName, reportType, fromDate, toDate, month, year, tabValue]);

// 2. Add separate fetch function for Sent Emails
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
      const sentData = response.data.data?.filteredAttendance?.filter(item => item.mail_status === "Yes") || [];
      setSentEmails(sentData);
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

  const handleReportTypeChange = (value) => {
    setReportType(value);
    if (value === "Daily") {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleFacultyChange = (e) => {
    setFacultyName(e.target.value);
    setFromDate("");
    setToDate("");
    setMonth("");
    setYear(new Date().getFullYear().toString());
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };


 
  
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

  const summaryColumns = [
    { name: "Faculty Name", selector: (row) => row.teacher?.name || "N/A", sortable: true, filterable: true },
    { name: "Student Name", selector: (row) => row.student?.name || "N/A", sortable: true, filterable: true },
    { name: "Board/Program", selector: (row) => row.board?.board_prog_name || "N/A", sortable: true, filterable: true },
    { name: "Subject / Grade", selector: (row) => row.subject?.subject_name || "N/A", sortable: true, filterable: true },
   
    { name: "Subject / Subject Level", selector: (row) => row.subjectlevel?.subject_level_name || "N/A", sortable: true, filterable: true },
    { name: "Location", selector: (row) => row.location || "N/A", sortable: true, filterable: true },
    { name: "Date", selector: (row) => new Date(row.attendance_date).toLocaleDateString('en-GB', {
      day: '2-digit',
    month: 'long',
     year: 'numeric',
    }), sortable: true, filterable: true },
    { name: "Total Hours", selector: (row) => row.total_hours || "N/A", sortable: true, filterable: true },
    { name: "Topic", selector: (row) => row.topic || "N/A", sortable: true, filterable: true },
    { name: "Assignment", selector: (row) => row.assignment_description || "N/A", sortable: true, filterable: true },
  ];

  const detailsColumns = [
    { 
      name: "Teacher Name", 
      selector: (row) => row.teacher_details?.name || "N/A", 
      sortable: true 
    },
    { 
      name: "Student Name", 
      selector: (row) => row.student_details?.name || "N/A", 
      sortable: true 
    },
    { 
      name: "Board/Program", 
      selector: (row) => row.board_details?.board_prog_name || "N/A", 
      sortable: true 
    },
    { 
      name: "Subject", 
      selector: (row) => row.subject_details?.subject_name || "N/A", 
      sortable: true 
    },
    { 
      name: "Date", 
      selector: (row) => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit',
      month: 'long',
       year: 'numeric',
      }), 
      sortable: true 
    },
    { 
      name: "Start Time", 
      selector: (row) => row.start_time || "N/A", 
      sortable: true 
    },
    { 
      name: "End Time", 
      selector: (row) => row.end_time || "N/A", 
      sortable: true 
    },
    { 
      name: "Total Hours", 
      selector: (row) => row.total_hours || "N/A", 
      sortable: true 
    },
    { 
      name: "Topic", 
      selector: (row) => row.topic || "N/A", 
      sortable: true 
    },
    { 
      name: "Assignment Provided", 
      selector: (row) => row.assignment_provide || "N/A", 
      sortable: true 
    },
    { 
      name: "Location", 
      selector: (row) => row.location || "N/A", 
      sortable: true 
    },
    { 
      name: "Center", 
      selector: (row) => row.schedule_details?.center || "N/A", 
      sortable: true 
    }
  ];
  
  const filteredDetailsData = detailsData.filter((row) =>
    (row.student_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.teacher_details?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleGlobalSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredSummaryData = summaryData.filter((row) =>
    row.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  
  const filteredTeachers = teacherList.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sentEmailsColumns = [
    { 
      name: "Teacher", 
      selector: (row) => row.teacher_details?.name || "N/A", 
      sortable: true 
    },
    { 
      name: "Student", 
      selector: (row) => row.student_details?.name || "N/A", 
      sortable: true 
    },
    { 
      name: "Date", 
      selector: (row) => new Date(row.attendance_date).toLocaleDateString('en-GB', {
        day: '2-digit',
      month: 'long',
       year: 'numeric',
      }), 
      sortable: true 
    },
    { 
      name: "Mail Status", 
      selector: (row) => row.mail_status || "N/A", 
      sortable: true,
      cell: (row) => (
        <span style={{ 
          color: row.mail_status === "Yes" ? "green" : "red",
          fontWeight: "bold"
        }}>
          {row.mail_status || "N/A"}
        </span>
      )
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (window.confirm("Are you sure you want to resend this email?")) {
              handleSendMail(row);
            }
          }}
        >
          Resend
        </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const handleReset = () => {
    setFacultyName("All");
    setReportType("All");
    setSearchQuery("");
    setFromDate("");
    setToDate("");
    setMonth("");
    setYear(new Date().getFullYear().toString());
    setSummaryData([]);
    setDetailsData([]);
    fetchDefaultSummaryData();
  };
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
  
  return (
    <LayoutPage isSidebarClosed={isSidebarClosed}>
      <Container maxWidth="xxl">
        <Card>
          <CardContent>
            <IconWithTitle
              icon={AiOutlineFundView}
              title="Report View"
              iconColor="white"
              backgroundColor="#00246B"
              iconSize="30px"
              titleColor="#00246B"
              titleFontSize="34px"
            />

            <div style={{ marginBottom: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Faculty</InputLabel>
                    <Select
                      value={facultyName}
                      onChange={handleFacultyChange}
                      label="Faculty"
                      sx={{ height: "56px" }}
                    >
                      {filteredTeachers.map((teacher) => (
                        <MenuItem key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={reportType}
                      onChange={(e) => handleReportTypeChange(e.target.value)}
                      label="Report Type"
                      sx={{ height: "56px" }}
                    >
                      {reportTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {reportType === "Yearly" && (
                <Box mt={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year}
                          onChange={handleYearChange}
                          label="Year"
                          sx={{ height: "56px" }}
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
              {reportType === "Monthly" && (
                <Box mt={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={month}
                          onChange={handleMonthChange}
                          label="Month"
                          sx={{ height: "56px" }}
                        >
                          {months.map((month) => (
                            <MenuItem key={month.value} value={month.value}>
                              {month.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                          value={year}
                          onChange={handleYearChange}
                          label="Year"
                          sx={{ height: "56px" }}
                        >
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Daily Calendar */}
              {reportType === "Daily" && (
                <Box mt={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={6}>
                      <Flatpickr
                        value={fromDate}
                        options={{ dateFormat: "Y-m-d" }}
                        onChange={(date) => setFromDate(date[0].toISOString().split("T")[0])}
                        render={({ defaultValue, ...props }, ref) => (
                          <TextField
                            fullWidth
                            label="From Date"
                            {...props}
                            inputRef={ref}
                            InputProps={{ sx: { height: "56px" } }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={6}>
                      <Flatpickr
                        value={toDate}
                        options={{ dateFormat: "Y-m-d" }}
                        onChange={(date) => setToDate(date[0].toISOString().split("T")[0])}
                        render={({ defaultValue, ...props }, ref) => (
                          <TextField
                            fullWidth
                            label="To Date"
                            {...props}
                            inputRef={ref}
                            InputProps={{ sx: { height: "56px" } }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Reset Button */}
              <Box mt={4}>
                <Grid container spacing={2} justifyContent="flex-end" alignItems="center">
                  <Grid item xs={12} sm={4} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ backgroundColor: "#00246B", color: "white", height: "56px" }}
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </Grid>

                  {/* Export Button */}
                  <Grid item xs={12} sm={4} md={2}>
                  <CSVLink 
  data={csvData} 
  filename={"report_data.csv"}
  style={{ textDecoration: "none" }}
>

</CSVLink>
                  </Grid>
                </Grid>
              </Box>
            </div>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ marginBottom: "10px" }}>
              <Tab label="Summary" />
              <Tab label="Details" />
              <Tab label="Sent Emails" />
            </Tabs>

            {/* DataTable */}
            {tabValue === 0 && (
              <>
                <DataTable
                  columns={summaryColumns}
                  data={filteredSummaryData}
                  pagination
                  customStyles={customStyles}
                  progressPending={loading}
                  subHeader
                  subHeaderComponent={
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "300px" }}> 
                      <TextField
                        fullWidth
                        label="Search (Student Name, Teacher Name)"
                        value={searchQuery}
                        onChange={handleGlobalSearch}
                        InputProps={{
                          startAdornment: <FcSearch style={{ marginRight: "8px" }} />,
                        }}
                      />
                    </Grid>
                  }
                />
                {!loading && filteredSummaryData.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    No data found. Please apply filters.
                  </div>
                )}
              </>
            )}

            {tabValue === 1 && (
              <>
                <DataTable
                  columns={detailsColumns}
                  data={filteredDetailsData}
                  pagination
                  customStyles={customStyles}
                  progressPending={loading}
                  subHeader
                  subHeaderComponent={
                    <Grid item xs={12} sm={6} md={4} sx={{ width: "300px" }}>
                      <TextField
                        fullWidth
                        label="Search (Student Name, Teacher Name)"
                        value={searchQuery}
                        onChange={handleGlobalSearch}
                        InputProps={{
                          startAdornment: <FcSearch style={{ marginRight: "8px" }} />,
                        }}
                      />
                    </Grid> 
                  }
                />
                {!loading && filteredDetailsData.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    No data found. Please apply filters.
                  </div>
                )}
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#00246B", color: "white" }}
                    onClick={handleSendMail}
                  >
                    Send Mail
                  </Button>
                </Box>
              </>
            )}
        {tabValue === 2 && (
  <>
    <DataTable
      columns={sentEmailsColumns}
      data={sentEmails}
      pagination
      customStyles={customStyles}
      progressPending={loading}
      subHeader
      subHeaderComponent={
        <Grid item xs={12} sm={6} md={4} sx={{ width: "300px" }}>
          <TextField
            fullWidth
            label="Search Sent Emails"
            value={searchQuery}
            onChange={handleGlobalSearch}
            InputProps={{
              startAdornment: <FcSearch style={{ marginRight: "8px" }} />,
            }}
          />
        </Grid>
      }
    />
    {!loading && sentEmails.length === 0 && (
      <div style={{ textAlign: "center", padding: "20px" }}>
        No sent emails found. Please apply filters.
      </div>
    )}
  </>
)}
          </CardContent>
        </Card>
      </Container>
    </LayoutPage>
  );
};

const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#00246B",
      color: "#fff",
      fontWeight: "bold",
    },
  },
};

export default Report;