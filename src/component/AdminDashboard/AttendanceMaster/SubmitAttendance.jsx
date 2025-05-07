import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GrTableAdd } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { useFetchScheduleQuery } from '../../Services/Attendance/AttendanceApi';
import { Api } from '../../Api/Api';
import IconWithTitle from '../../utilities/IconsTittle';

const centersList = [
  { id: "GCR", name: 'GCR' },
  { id: "SPM", name: 'SPM' },
  { id: "NYC-208 & 209", name: 'NYC-208 & 209' },
  { id: "NYC-611", name: 'NYC 611' },
];

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
];

const aimOptions = [
  "Concept Building",
  "Practice",
  "Exam Preparation",
  "Paper Discussion"
];

const SubmitAttendance = () => {
  const [formData, setFormData] = useState({
    schedule_id: '',
    aim: [],
    location: '',
    attendance_date: null,
    start_time: '',
    end_time: '',
    total_hours: '',
    topic: '',
    assignment_provide: 'No',
    assignment_description: '',
  });
  
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, error: scheduleError, isLoading } = useFetchScheduleQuery();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (scheduleError) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
      <p>Error loading schedules: {scheduleError.message}</p>
    </div>
  );

  const schedule = data?.data?.schedule || [];

  const filteredSchedules = schedule.filter(entry => {
    const searchText = `${entry.teacher_id?.name || ''} ${entry.student_id?.name || ''} ${entry.board_id?.board_prog_name || ''} ${entry.subject_id?.subject_name || ''}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.schedule_id || !formData.attendance_date || !formData.start_time || !formData.end_time) {
        throw new Error('Please fill all mandatory fields');
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

      const centerValue = formData.location === 'center' 
        ? selectedCenters.join(',') 
        : formData.location;

      const formattedDate = formData.attendance_date 
        ? new Date(formData.attendance_date).toISOString().split('T')[0]
        : '';

      const payload = {
        schedule_id: formData.schedule_id,
        aim: formData.aim.join(','),
        location: centerValue,
        attendance_date: formattedDate,
        start_time: formData.start_time,
        end_time: formData.end_time,
        total_hours: convertToDecimalHours(formData.total_hours),
        topic: formData.topic,
        assignment_provide: formData.assignment_provide,
        assignment_description: formData.assignment_description,
      };

      const response = await Api.post('attendance/create', payload);
      
      if (response.status !== 201) {
        throw new Error(response.data?.message || 'Failed to save data');
      }

      toast.success('Attendance submitted successfully!');
      navigate("/attendance-view");
      
      setFormData({
        schedule_id: '',
        aim: [],
        location: '',
        attendance_date: null,
        start_time: '',
        end_time: '',
        total_hours: '',
        topic: '',
        assignment_provide: 'No',
        assignment_description: '',
      });
      setSelectedCenters([]);
    } catch (error) {
      console.error('Error creating attendance:', error);
      toast.error(error.message || 'An error occurred while submitting attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      attendance_date: date
    }));
  };



  const handleCenterSelection = (centerId) => {
    setSelectedCenters(prev => 
      prev.includes(centerId) 
        ? prev.filter(id => id !== centerId) 
        : [...prev, centerId]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto">
      <div className='flex justify-center'>
      <IconWithTitle
      icon={GrTableAdd }
      title="Attendance Submit"
      iconColor="white"
      backgroundColor="#00246B"
      iconSize="30px"
      titleColor="#00246B"
      titleFontSize="34px"
    />
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmit}>
        
          
         

    
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
  {/* Search and Select Schedule */}
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Search and Select Schedule
    </label>
    
    <div className="relative">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
        placeholder="Search schedule..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {isDropdownOpen && filteredSchedules.length > 0 && (
      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        {filteredSchedules.map(option => (
          <div
            key={option._id}
            className={`cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${
              formData.schedule_id === option._id ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              setFormData({...formData, schedule_id: option._id});
              setSearchTerm(
                `${option.teacher_id?.name || "Unknown"} / ${option.student_id?.name || "Unknown"} / ${option.board_id?.board_prog_name || ""} / ${option.subject_id?.subject_name || ""}`
              );
              setIsDropdownOpen(false);
            }}
          >
            <span className="block truncate">
              {`${option.teacher_id?.name || "Unknown"} / ${option.student_id?.name || "Unknown"} / ${option.board_id?.board_prog_name || ""} / ${option.subject_id?.subject_name || ""}`}
            </span>
            {formData.schedule_id === option._id && (
              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Select Aims */}
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
          {/* Location Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Location</h3>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  name="location"
                  value="home"
                  checked={formData.location === 'home'}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Home</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select Center(s)</h3>
                <div className="flex flex-wrap gap-4">
                  {centersList.map(center => (
                    <label key={center.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedCenters.includes(center.name)}
                        onChange={() => handleCenterSelection(center.name)}
                      />
                      <span className="ml-2">{center.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Date and Time Section */}
          <div className="mb-8 p-6 border border-gray-200 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                <DatePicker
                  selected={formData.attendance_date}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select date"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  step="300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  step="300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.total_hours}
                  onChange={(e) => setFormData({...formData, total_hours: e.target.value})}
                >
                  <option value="">Select duration</option>
                  {timeOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Provided</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="assignment_provide"
                  value={formData.assignment_provide}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>

            {formData.assignment_provide === 'Yes' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  name="assignment_description"
                  value={formData.assignment_description}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Attendance'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default SubmitAttendance;