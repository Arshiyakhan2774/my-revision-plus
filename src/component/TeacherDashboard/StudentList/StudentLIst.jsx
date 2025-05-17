import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import { ImFileExcel } from "react-icons/im";
import { PiStudentLight } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import { FcSearch } from "react-icons/fc";
import { FiChevronLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Api } from "../../Api/Api";
import ScrollUpComponent from "../../utilities/ScroolupComponent";
import IconWithTitle from "../../utilities/IconsTittle";

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#1a73e8",
      color: "#fff",
      textAlign: "center",
      fontWeight: "bold",
    },
  },
  rows: {
    style: {
      textAlign: "center",
    },
  },
};

const StudentList = () => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const userResponse = useSelector(state => state.idSlice.userResponse?._id || state.idSlice.userResponse);

  const transformData = (users) => {
    return users.map((user) => ({
      studentName: user.student_info?.name || 'N/A',
      board: user.board_info?.board_prog_name || 'Not specified',
      subject: user.subject_info?.subject_name || 'Unknown',
      details: `Taught by ${user.teacher_info?.name || 'Unknown teacher'}`,
    }));
  };

  useEffect(() => {
    const abortController = new AbortController();
    const cacheKey = `students-${userResponse}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          setStudentData(JSON.parse(cachedData));
          return;
        }

        const response = await Api.get(`/users/user-by-teacher/${userResponse}`, {
          signal: abortController.signal
        });

        const transformedData = transformData(response.data.data.user);
        localStorage.setItem(cacheKey, JSON.stringify(transformedData));
        setStudentData(transformedData);
      } catch (error) {
        if (!abortController.signal.aborted) {
          setError("Failed to fetch student data. Please try again later.");
          console.error("Error fetching student data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userResponse) fetchData();

    return () => {
      abortController.abort();
    };
  }, [userResponse]);

  const handleDetailsClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const filteredData = studentData.filter(
    (row) =>
      row.studentName.toLowerCase().includes(filterText.toLowerCase()) ||
      row.board.toLowerCase().includes(filterText.toLowerCase()) ||
      row.subject.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    { name: "Student Name", selector: (row) => row.studentName, sortable: true },
    { name: "Board", selector: (row) => row.board, sortable: true },
    { name: "Subject", selector: (row) => row.subject, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="bg-[#1a73e8] hover:bg-[#001A4A] text-white px-4 py-2 rounded text-sm transition-colors"
          onClick={() => handleDetailsClick(row)}
        >
          View Details
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  return (
    <div className="container w-full ">
      <div className="p-6">
        <IconWithTitle
          icon={PiStudentLight}
          title="Student List"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-3 pr-10 py-2 border border-gray-300 rounded w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FcSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl" />
          </div>
          
          <CSVLink
            data={studentData}
            filename="student_list.csv"
            className="no-underline"
          >
            <button className="bg-[#1a73e8] hover:bg-[#001A4A] text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <ImFileExcel className="text-xl" />
              Export to CSV
            </button>
          </CSVLink>
        </div>

        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">{error}</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            customStyles={customStyles}
            pagination
            highlightOnHover
          />
        )}

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <IconWithTitle
                  icon={GrSchedules}
                  title="Student Details"
                  iconColor="white"
                  backgroundColor="#1a73e8"
                  iconSize="30px"
                  titleColor="#1a73e8"
                  titleFontSize="34px"
                />
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              {selectedRow && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <p className="text-[#1a73e8] font-bold">
                    <span className="font-semibold">Student:</span> {selectedRow.studentName}
                  </p>
                  <p className="text-[#1a73e8] font-bold">
                    <span className="font-semibold">Board:</span> {selectedRow.board}
                  </p>
                  <p className="text-[#1a73e8] font-bold">
                    <span className="font-semibold">Subject:</span> {selectedRow.subject}
                  </p>
                  <p className="text-[#1a73e8] font-bold">
                    <span className="font-semibold">Details:</span> {selectedRow.details}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <ScrollUpComponent />
        <div className="mt-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiChevronLeft className="mr-1" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;