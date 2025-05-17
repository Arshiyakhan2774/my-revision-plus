import { CSVLink } from "react-csv";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { PiChalkboardTeacher } from "react-icons/pi";
import { ImFileExcel } from "react-icons/im";
import { useSelector } from "react-redux";
import { FcSearch } from "react-icons/fc";
import ScrollUpComponent from "../../utilities/ScroolupComponent";
import IconWithTitle from "../../utilities/IconsTittle";
import Backbutton from "../../utilities/BackButrton";
import { Api } from "../../Api/Api";

const customStyles = {
  headRow: {
    style: {
      backgroundColor: "#1a73e8",
      color: "white",
      textAlign: "center",
    },
  },
  rows: {
    style: {
      textAlign: "center",
    },
  },
};

const TeacherList = () => {
  const userResponse = useSelector((state) => state.idSlice.userResponse);
  const userId = userResponse?._id || userResponse;

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterText, setFilterText] = useState("");

  const filteredData = data.filter((row) => {
    return (
      row.teacherName.toLowerCase().includes(filterText.toLowerCase()) ||
      row.board.toLowerCase().includes(filterText.toLowerCase()) ||
      row.subject.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  useEffect(() => {
    if (userId) {
      Api.get(`/studentdashboard/user-by-students/${userId}`)
        .then((response) => {
          const formattedData = response.data?.data?.formattedData || [];
          const transformedData = formattedData.map((teacher) => ({
            teacherName: teacher.teacher_info.name,
            board: teacher.subjects[0]?.board_info.board_prog_name || "N/A",
            subject: teacher.subjects[0]?.subject_info.subject_name || "N/A",
            email: teacher.teacher_info.email || "N/A",
            phone: teacher.teacher_info.phone || "N/A",
            qualifications: teacher.teacher_info.qualifications || "N/A",
          }));
          setData(transformedData);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [userId]);

  const columns = [
    {
      name: "Teacher Name",
      selector: (row) => row.teacherName,
      sortable: true,
    },
    {
      name: "Board/Program",
      selector: (row) => row.board,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          variant="contained"
          sx={{
            backgroundColor: "#1a73e8",
            color: "white",
            "&:hover": {
              backgroundColor: "#001A4A",
            },
          }}
          onClick={() => handleDetailsClick(row)}
          size="small"
        >
          View Profile
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleDetailsClick = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  return (
    <div className="p-5">
      <IconWithTitle
        icon={PiChalkboardTeacher}
        title="My Teachers"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-5 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search teachers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <FcSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl" />
        </div>
        
        <CSVLink
          data={data}
          filename="my_teachers.csv"
          className="flex items-center gap-2 bg-custom-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          <ImFileExcel className="text-xl" />
          Export to CSV
        </CSVLink>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        highlightOnHover
      />

      {/* Teacher Profile Modal */}
      {open && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Teacher Profile</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-lg font-semibold text-blue-800">{selectedRow.teacherName}</p>
                <p className="text-gray-600">{selectedRow.subject} Teacher</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Board/Program</p>
                  <p className="font-medium">{selectedRow.board}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{selectedRow.subject}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedRow.email}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedRow.phone}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Qualifications</p>
                <p className="font-medium">{selectedRow.qualifications}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ScrollUpComponent />
      <div className="mt-4">
        <Backbutton />
      </div>
    </div>
  );
};

export default TeacherList;