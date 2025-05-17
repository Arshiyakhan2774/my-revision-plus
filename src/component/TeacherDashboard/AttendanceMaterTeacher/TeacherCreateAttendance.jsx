import { useState } from 'react';
import { toast } from 'react-toastify';
import { GrTableAdd } from 'react-icons/gr';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Api } from '../../Api/Api';
import { useAttendanceByTeacherQuery, useFetchScheduleByTeacherQuery } from '../../Services/Attendance/AttendanceApi';
import BackButton from '../../utilities/BackButrton';
import ScrollUpComponent from '../../utilities/ScroolupComponent';
import IconWithTitle from '../../utilities/IconsTittle';

const centersList = [
  { id: 1, name: 'GCR' },
  { id: 2, name: 'SPM' },
  { id: 3, name: 'NYC-208 & 209' },
  { id: 4, name: 'NYC 611' },
];

const TeacherCreateAttendance = () => {
  const [formData, setFormData] = useState({
    schedule_id: '',
    aim: [],
    location: '',
    attendance_date: '',
    start_time: '',
    end_time: '',
    total_hours: '',
    topic: '',
    assignment_provide: 'No',
    assignment_description: '',
  });
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [submissionType, setSubmissionType] = useState('single');
  const [csvData, setCsvData] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userResponse = useSelector((state) => state.idSlice?.userResponse);
  const { data } = useFetchScheduleByTeacherQuery(userResponse?._id);
  const schedule = data?.data?.schedule || [];
  const { isLoading, error, refetch } = useAttendanceByTeacherQuery(userResponse?._id);

  const filteredSchedules = schedule.filter((entry) => {
    const fullScheduleText = [
      entry.teacher_id?.name || '',
      entry.student_id?.name || '',
      entry.board_id?.board_prog_name || '',
      entry.subject_id?.subject_name || '',
      entry.subjectlevel_id?.subject_level_name || ''
    ]
      .join(' ')
      .toLowerCase();
    return fullScheduleText.includes(searchTerm.toLowerCase());
  });

  const filteredOptions = filteredSchedules.filter((entry) => {
    const teacherName = entry.teacher_id?.name || "";
    const studentName = entry.student_id?.name || "";
    const boardName = entry.board_id?.board_prog_name || "";
    const subjectName = entry.subject_id?.subject_name || "";
  
    return (
      teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subjectName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'aim') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.isArray(value) ? value : [value],
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
 
  const handleChange1 = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };
  
      if (updatedData.start_time && updatedData.end_time) {
        const start = new Date(`1970-01-01T${updatedData.start_time}`);
        const end = new Date(`1970-01-01T${updatedData.end_time}`);
  
        if (end > start) {
          const diff = (end - start) / (1000 * 60 * 60);
          updatedData.total_hours = diff.toFixed(2);
        } else {
          updatedData.total_hours = "0.00";
        }
      }
  
      return updatedData;
    });
  };

  const timeOptions = [
    "30 mins",
    "45 mins",
    "1 hour",
    "1 hour 15 mins",
    "1 hour 30 mins",
    "1 hour 45 mins",
    "2 hours",
    "2 hours 15 mins",
    "2 hours 30 mins",
    "2 hours 45 mins",
    "3 hours",
    "3 hours 15 mins",
    "3 hours 30 mins",
    "3 hours 45 mins",
    "4 hours",
    "4 hours 15 mins",
    "4 hours 30 mins",
    "4 hours 45 mins",
    "5 hours",
  ];
  const aimOptions = [
    "Concept Building",
    "Practice",
    "Exam Preparation",
    "Paper Discussion"
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();

    let centerValue;
    if (formData.location === 'center') {
      centerValue = selectedCenters.join(',');
    } else {
      centerValue = formData.location; 
    }

    const convertToDecimalHours = (timeString) => {
      if (!timeString) return 0;
      
      const parts = timeString.split(' ');
      let hours = 0;
      let minutes = 0;
      
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === 'hour' || parts[i] === 'hours') {
          hours = parseFloat(parts[i-1]);
        }
        if (parts[i] === 'mins') {
          minutes = parseFloat(parts[i-1]);
        }
      }
      
      return hours + (minutes / 60);
    };
   
    const payload = {
      schedule_id: formData.schedule_id,
      aim: formData.aim.join(','),
      location: centerValue,
      attendance_date: formData.attendance_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      total_hours: convertToDecimalHours(formData.total_hours),
      topic: formData.topic,
      assignment_provide: formData.assignment_provide,
      assignment_description: formData.assignment_description,
    };

    try {
      const response = await Api.post('attendance/create', payload);
      toast.success('Attendance submitted successfully!');
      if (response.status !== 201) {
        throw new Error('Failed to save data');
      }
      refetch();
      console.log('Response:', response.data);
      setFormData({
        schedule_id: '',
        aim: [],
        location: '',
        attendance_date: '',
        start_time: '',
        end_time: '',
        total_hours: '',
        topic: '',
        assignment_provide: 'No',
        assignment_description: '',
      });
      setSelectedCenters([]);
      setCsvData([]);
      setCsvFile(null);
    } catch (error) {
      console.error('Error creating attendance:', error);
      toast.error('Please fill the mandatory fields or fix errors.');
    }
  };

  const handleDropdownChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      total_hours: value,
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const rows = fileContent.split('\n').map((row) => row.split(','));
      const headers = rows[0];
      const data = rows.slice(1).map((row) => {
        let rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });
      setCsvData(data);
    };
    reader.readAsText(file);
  };

  const handleCenterSelection = (centerId) => {
    setSelectedCenters((prevSelected) =>
      prevSelected.includes(centerId)
        ? prevSelected.filter((id) => id !== centerId)
        : [...prevSelected, centerId]
    );
  };

  return (
    <div className="max-w-full mx-4 xl:mx-8">
      <IconWithTitle
        icon={GrTableAdd}
        title="Attendance Submit"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />
    
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <div className="flex justify-end mb-4">
              <Link
                to="/attendance-master"
                className="bg-custom-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Show List
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Schedule</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                  value={formData.schedule_id}
                  onChange={(e) => setFormData({...formData, schedule_id: e.target.value})}
                >
                  <option value="">Select a schedule</option>
                  {filteredOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {`${option.teacher_id?.name || "Unknown Teacher"} / 
                        ${option.student_id?.name || "Unknown Student"} / 
                        ${option.board_id?.board_prog_name || "Unknown Board"} / 
                        ${option.subject_id?.subject_name || "Unknown Subject"}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Aims
  </label>
  
  <div className="relative">
    {/* Container that holds both chips and select */}
    <div className="flex flex-wrap items-center w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      {/* Display selected aims as chips */}
      {formData.aim.map((aim, index) => (
        <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1 mr-2 mb-1">
          {aim}
          <button
            type="button"
            className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
            onClick={() => {
              setFormData(prev => ({
                ...prev,
                aim: prev.aim.filter(item => item !== aim)
              }));
            }}
          >
            ×
          </button>
        </div>
      ))}
      
      {/* The actual select element */}
      <select
        className="flex-grow min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0 py-1 h-[30px]"
        onChange={(e) => {
          if (e.target.value && !formData.aim.includes(e.target.value)) {
            setFormData(prev => ({
              ...prev,
              aim: [...prev.aim, e.target.value]
            }));
          }
          e.target.value = "";
        }}
        value=""
      >
        <option value="" disabled hidden>
          {formData.aim.length === 0 ? "Select aims..." : "Add more..."}
        </option>
        {aimOptions
          .filter(option => !formData.aim.includes(option))
          .map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))
        }
      </select>
    </div>
    
    {/* Dropdown icon - positioned absolutely */}
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
</div>

            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              <div className="flex space-x-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="location"
                    value="home"
                    checked={formData.location === 'home'}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Home</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="location"
                    value="center"
                    checked={formData.location === 'center'}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Center</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-blue-600"
                    name="location"
                    value="online"
                    checked={formData.location === 'online'}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Online</span>
                </label>
              </div>

              {formData.location === 'center' && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Select Center(s)</h3>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {centersList.map((center) => (
                      <label key={center.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox text-blue-600"
                          checked={selectedCenters.includes(center.id)}
                          onChange={() => handleCenterSelection(center.id)}
                        />
                        <span className="ml-2">{center.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Date and Time Section */}
            <div className="mt-6 p-4 border border-gray-300 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <DatePicker
                    selected={formData.attendance_date ? new Date(formData.attendance_date) : null}
                    onChange={(date) => setFormData({...formData, attendance_date: date})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                  />
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                  />
                </div>

                {/* Total Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.total_hours}
                    onChange={handleDropdownChange}
                  >
                    {timeOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Topic and Assignment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Provided</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="assignment_provide"
                    value={formData.assignment_provide}
                    onChange={handleChange}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Assignment Description */}
              {formData.assignment_provide === 'Yes' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Description</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    name="assignment_description"
                    value={formData.assignment_description}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-custom-primary text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
                >
                  Submit Attendance
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-between mt-4">
        <BackButton />
        <ScrollUpComponent/>
      </div>
    </div>
  );
};

export default TeacherCreateAttendance;