import { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GiLaptop } from "react-icons/gi";
import { toast, ToastContainer } from "react-toastify";
import { FcSearch } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import { useGetUserTeacherQuery } from "../../Services/UserMangae/UserMangeSlice";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";
import { useGetOnlineClassesQuery } from "../../Services/OnlineClasses/OnlineClassesApi";

const ScheduleOnlineClass = () => {
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [students, setStudents] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [classDetails, setClassDetails] = useState("");
  const [meetingType, setMeetingType] = useState("InstaVc");
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [searchTerm, setSearchTerm] = useState("");  
  const [classType, setClassType] = useState("regular");
  const [demoStudentName, setDemoStudentName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTeacherSearch, setShowTeacherSearch] = useState(false);
  const searchRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetOnlineClassesQuery();
  // Error states
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
    endTime: "",
    classType: "",
    demoStudentName: ""
  });

  const { data: teacherData } = useGetUserTeacherQuery();
  const teacherList = teacherData?.data?.teacher || [];
  
  const filteredTeachers = teacherList.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowTeacherSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
;
  
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacherId) {
        try {
          const response = await Api.get(`/onlineclass/list/${selectedTeacherId}`);
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
  }, [selectedTeacherId]);


  const validateForm = () => {
    let valid = true;
    const newErrors = {
      meetingType: "",
      teacher: "",
      subject: "",
      student: "",
      classDetails: "",
      startTime: "",
      endTime: "",
      classType: "",
      demoStudentName: ""
    };

    if (!meetingType) {
      newErrors.meetingType = "Meeting type is required";
      valid = false;
    }
    if (!selectedTeacherId) {
      newErrors.teacher = "Teacher is required";
      valid = false;
    }
    if (!selectedSubject) {
      newErrors.subject = "Subject is required";
      valid = false;
    }
    
    if (classType === "regular" && !selectedStudentId) {
      newErrors.student = "Student is required";
      valid = false;
    }
    
    if (classType === "demo" && !demoStudentName) {
      newErrors.demoStudentName = "Student name is required";
      valid = false;
    }
 
    if (!selectedStartTime) {
      newErrors.startTime = "Start time is required";
      valid = false;
    }
    if (!selectedEndTime) {
      newErrors.endTime = "End time is required";
      valid = false;
    } else if (selectedStartTime && selectedEndTime && selectedEndTime <= selectedStartTime) {
      newErrors.endTime = "End time must be after start time";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
  
    const studentId = classType === "demo" ? "demo-" + demoStudentName.replace(/\s+/g, '-').toLowerCase() : selectedStudentId;
    const studentName = classType === "demo" ? demoStudentName : selectedStudents.find(s => s.student_id === selectedStudentId)?.name || "";
  
    const payload = {
      host_id: selectedTeacherId,
      student_id: studentId,
      student_name: studentName,
      subject_id: selectedSubject,
      class_details: classDetails,
      meeting_id: "783453724573",
      calendar: [
        {
          start_time: selectedStartTime?.toISOString(),
          end_time: selectedEndTime?.toISOString(),
        },
      ],
      meet_type: meetingType,
      class_type: classType
    };
  
    try {
      const response = await Api.post("onlineclass/create", payload);
      
      if (response.data?.status === "success") {
        toast.success("✅ Online Class Scheduled Successfully");
  
        refetch()
        setClassDetails("");
        setMeetingType("");
        setSelectedEndTime("");
        setSelectedStartTime("");
        setSelectedStudentId("");
        setSelectedSubject("");
        setSelectedTeacherId("");
        setSelectedTimezone("");
        setClassType("regular");
        setDemoStudentName("");
      } else {
        toast.error("Something went wrong! Try again.");
      }
    } catch (error) {
      console.error("Error scheduling class:", error);
      toast.error(error.response?.data?.message || "❌ Failed to schedule class");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const selectedStudents = students?.find((sub) => sub.subject_id === selectedSubject)?.students || [];
  
  return (

      <div className="w-full p-6">
        <div className="  ">
          <IconWithTitle
            icon={GiLaptop}
            title="Create Online Classes"
            iconColor="white"
            backgroundColor="#1a73e8"
            iconSize="30px"
            titleColor="#1a73e8"
            titleFontSize="34px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Class Medium Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Classes Medium</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={meetingType}
                onChange={(e) => {
                  setMeetingType(e.target.value);
                  setErrors({...errors, meetingType: ""});
                }}
              >
                <option value="Meet">Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="InstaVc">Insta VC</option>
              </select>
              {errors.meetingType && <p className="text-red-500 text-xs mt-1">{errors.meetingType}</p>}
            </div>

            {/* Class Type Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={classType}
                onChange={(e) => {
                  setClassType(e.target.value);
                  setErrors({...errors, classType: ""});
                }}
              >
                <option value="regular">Default</option>
                <option value="demo">Demo</option>
              </select>
              {errors.classType && <p className="text-red-500 text-xs mt-1">{errors.classType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teacher Search */}
            <div className="relative" ref={searchRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowTeacherSearch(true)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FcSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Teacher Suggestions */}
              {showTeacherSearch && filteredTeachers.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedTeacherId(teacher._id);
                        setSearchTerm(teacher.name);
                        setShowTeacherSearch(false);
                      }}
                    >
                      {teacher.name}
                    </div>
                  ))}
                </div>
              )}
              {errors.teacher && <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>}
            </div>

            {/* Subject Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setErrors({...errors, subject: ""});
                }}
                disabled={!selectedTeacherId}
              >
                <option value="">Select Subject</option>
                {students?.length > 0 ? (
                  students?.map((subject) => (
                    <option key={subject.subject_id} value={subject.subject_id}>
                      {subject.subject_name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {selectedTeacherId ? "No subjects available" : "Select teacher first"}
                  </option>
                )}
              </select>
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>

            {/* Student Select or Demo Student Name */}
            {classType === "regular" ? (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setErrors({...errors, student: ""});
                  }}
                  disabled={!selectedSubject}
                >
                  <option value="">Select Student</option>
                  {selectedStudents.length > 0 ? (
                    selectedStudents.map((student) => (
                      <option key={student.student_id} value={student.student_id}>
                        {student.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {selectedSubject ? "No students available" : "Select subject first"}
                    </option>
                  )}
                </select>
                {errors.student && <p className="text-red-500 text-xs mt-1">{errors.student}</p>}
              </div>
            ) : (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={demoStudentName}
                  onChange={(e) => {
                    setDemoStudentName(e.target.value);
                    setErrors({...errors, demoStudentName: ""});
                  }}
                  placeholder="Enter student name for demo class"
                />
                {errors.demoStudentName && <p className="text-red-500 text-xs mt-1">{errors.demoStudentName}</p>}
              </div>
            )}

            {/* Class Details */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Details</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={classDetails}
                onChange={(e) => {
                  setClassDetails(e.target.value);
                  setErrors({...errors, classDetails: ""});
                }}
                placeholder="Class Details (Ex:- Math Class)"
              />
              {errors.classDetails && <p className="text-red-500 text-xs mt-1">{errors.classDetails}</p>}
            </div>

            {/* Start Time */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select start time"
              />
              {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
            </div>

            {/* End Time */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Select end time"
              />
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>

  );
};

export default ScheduleOnlineClass;