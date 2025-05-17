import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FcSearch } from "react-icons/fc";
import { GiLaptop } from "react-icons/gi";
import { FiChevronLeft } from "react-icons/fi";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";

const OnlineTeacherClassesSchedule = () => {
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [students, setStudents] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [meetingName, setMeetingName] = useState("");
  const [classDetails, setClassDetails] = useState("");
  const [meetingType, setMeetingType] = useState("InstaVc");
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const userResponse = useSelector(state => state.idSlice.userResponse);
  
  const [errors, setErrors] = useState({
    meetingType: "",
    teacher: "",
    subject: "",
    student: "",
    classDetails: "",
    meetingName: "",
    timezone: "",
    country: "",
    startTime: "",
    endTime: ""
  });

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };
  
  useEffect(() => {
    if (selectedTimezone) {
      const momentTimezone = moment.tz(selectedTimezone);
      console.log(momentTimezone.format());
    }
  }, [selectedTimezone]);
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (userResponse._id) {
        try {
          const response = await Api.get(`/onlineclass/list/${userResponse._id}`);
          const subjectMappings = response.data.data.onlineclass.subjectmapping || [];
          const subjects = subjectMappings.flatMap((level) => level.subjects);
          setStudents(subjects); 
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setStudents([]); 
        }
      } else {
        setStudents([]); 
      }
    };
    fetchStudents();
  }, [userResponse._id]);
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      host_id: userResponse._id,
      student_id: selectedStudentId,
      subject_id: selectedSubject, 
      class_details: classDetails,
      meeting_id: "783453724573", 
      utc: selectedTimezone,
      country_name: selectedCountry.valu,
      calendar: [{
        start_time: selectedStartTime?.toISOString(), 
        end_time: selectedEndTime?.toISOString(), 
      }],
      meet_type: meetingType, 
    };
    
    try {
      const response = await Api.post("onlineclass/create", payload);
      toast.success("Online Class Scheduled Successfully");
      console.log("Class Scheduled Successfully:", response.data);
      
      // Reset form
      setClassDetails("");
      setMeetingName("");
      setMeetingType("");
      setSelectedEndTime("");
      setSelectedStartTime("");
      setSelectedStudentId("");
      setSelectedSubject("");
      setSelectedTeacherId("");
    } catch (error) {
      console.error("Error scheduling class:", error.response?.data || error.message || error);
      toast.error("Failed to schedule class");
    }
  };
  
  const selectedStudents = students?.find((sub) => sub.subject_id === selectedSubject)?.students || [];

  return (
    <div className="container w-full  px-4 py-5 ">
      <div className=" p-6 mt-5">
        <IconWithTitle
          icon={GiLaptop}
          title="Create Online Classes"
          iconColor="white"
          backgroundColor="#1a73e8"
          iconSize="30px"
          titleColor="#1a73e8"
          titleFontSize="34px"
        />
        
        <div className="flex justify-end mb-4">
          <Link
            to="/online-classes-view-list"
            className="bg-[#1a73e8] hover:bg-[#001b50] text-white px-4 py-2 rounded transition-colors"
          >
            Show List
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meeting Type */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Classes Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            >
              <option value="Meet">Meet</option>
              <option value="Zoom">Zoom</option>
              <option value="InstaVc">Insta Vc</option>
            </select>
          </div>

          {/* Subject */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Subject
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {students?.length > 0 ? (
                students.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No subjects available</option>
              )}
            </select>
          </div>

          {/* Student */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Student
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {selectedStudents.length > 0 ? (
                selectedStudents.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No students available</option>
              )}
            </select>
          </div>

          {/* Class Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Details
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Class Details (Ex:- Math Class)"
              value={classDetails}
              onChange={(e) => {
                setClassDetails(e.target.value);
                setErrors({...errors, classDetails: ""});
              }}
            />
            {errors.classDetails && (
              <p className="mt-1 text-sm text-red-600">{errors.classDetails}</p>
            )}
          </div>

          {/* Start Time */}
          <div className="mb-3 mt-2">
            <label className=" w-[] block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <DatePicker
              selected={selectedStartTime}
              onChange={(date) => {
                setSelectedStartTime(date);
                setErrors({...errors, startTime: ""});
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
            )}
          </div>

          {/* End Time */}
          <div className="mb-3">
            <label className=" w-full block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <DatePicker
              selected={selectedEndTime}
              onChange={(date) => {
                setSelectedEndTime(date);
                setErrors({...errors, endTime: ""});
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              minDate={selectedStartTime || new Date()}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            <FiChevronLeft className="mr-1" />
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#1a73e8] hover:bg-[#001b50] text-white px-4 py-2 rounded transition-colors"
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OnlineTeacherClassesSchedule;