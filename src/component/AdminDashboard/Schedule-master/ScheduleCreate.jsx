import { useEffect, useMemo, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';

import { GrSchedules } from 'react-icons/gr';

import 'react-toastify/dist/ReactToastify.css';
import { FcSearch } from 'react-icons/fc';
import { FaSpinner } from 'react-icons/fa';
import { useGetUserTeacherQuery } from '../../Services/UserMangae/UserMangeSlice';
import { useGetCategoryListQuery } from '../../Services/Category/CategoryApi';
import { Api } from '../../Api/Api';
import IconWithTitle from '../../utilities/IconsTittle';
import BackButton from '../../utilities/BackButrton';
import ScrollUpComponent from '../../utilities/ScroolupComponent';

const centersList = [
  { id: 'GCR', name: 'GCR ' },
  { id: 'SPM ', name: 'SPM ' },
  { id: 'NYC-208 & 209', name: 'NYC-208 & 209' },
  { id: ' NYC 611', name: ' NYC 611' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ScheduleCreate = ({ isSidebarClosed }) => {
  const [location, setLocation] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [prescribedhours, setPrescribehours] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedSubjectLevel, setSelectedSubjectLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [subjectMappings, setSubjectMappings] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dayTimes, setDayTimes] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { startTime: '12:00', endTime: '12:00' };
      return acc;
    }, {})
  );
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const searchRef = useRef(null);



  const { data: teacherData, isLoading, error, refetch } = useGetUserTeacherQuery();
  const teachers = useMemo(() => teacherData?.data?.teacher || [], [teacherData]);

  const { data: categoryData } = useGetCategoryListQuery();
  const categories = useMemo(() => categoryData?.data || [], [categoryData]);
    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setShowSuggestions(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
  
    // Filter teachers based on search term
    useEffect(() => {
      if (searchTerm.length > 0) {
        const filtered = teachers.filter(teacher =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTeachers(filtered);
        setShowSuggestions(true);
      } else {
        setFilteredTeachers(teachers);
        setShowSuggestions(false);
      }
    }, [searchTerm, teachers]);
  
    const handleTeacherSelect = (teacher) => {
      setSelectedTeacher(teacher._id);
      setSearchTerm(teacher.name);
      setShowSuggestions(false);
    };
  const handleTeacherChange = (event) => {
    setSelectedTeacher(event.target.value);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacher) {
        setLoading(true);
        try {
          const response = await Api.get(`/onlineclass/list/${selectedTeacher}`);
          const subjectMappingsData = response.data.data.onlineclass.subjectmapping;
          
          setSubjectMappings(subjectMappingsData);  

          const allStudents = subjectMappingsData.flatMap((mapping) =>
            mapping.subjects.flatMap((subject) =>
              subject.students.map((student) => ({
                student_id: student.student_id,
                name: student.name,
                board_info: student.board_info,
                subject_info: subject,
                subjectlevel_id: mapping.subjectlevel_id,
                subject_level_name: mapping.subject_level_name,
              }))
            )
          );
          setStudents(allStudents);
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
        } finally {
          setLoading(false);
        }
      } else {
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedTeacher]);

  const handleDayTimeChange = (day, field, value) => {
    setDayTimes(prevState => ({
      ...prevState,
      [day]: {
        ...prevState[day],
        [field]: value,
      },
    }));
  };

  const handleDaySelection = (day) => {
    setSelectedDays(prevSelectedDays =>
      prevSelectedDays.includes(day)
        ? prevSelectedDays.filter(selectedDay => selectedDay !== day)
        : [...prevSelectedDays, day]
    );
  };

  function getTabLabel(originalLabel) {
    if (selectedBoard === '665fffe9e02ec586b271fba2') {
      switch (originalLabel) {
        case "Subject": return "Grade";
        case "Subject Level": return "Subject";
        default: return originalLabel;
      }
    } else if (selectedBoard === '671f5e5bfd4c6a25ad4bb527') {
      switch (originalLabel) {
        case "Subject": return "Subject";
        case "Subject Level": return "Content";
        default: return originalLabel;
      }
    }
    return originalLabel;
  }

  const handleSubjectLevelChange = (event) => setSelectedSubjectLevel(event.target.value);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let centerValue;
    if (location === 'center') {
      centerValue = selectedCenters.join(','); 
    } else {
      centerValue = location; 
    }
    const calendar = selectedDays.map(day => ({
      days: day,
      start_time: dayTimes[day].startTime,
      end_time: dayTimes[day].endTime,
    }));
    const scheduleData = {
      teacher_id: selectedTeacher,
      student_id: selectedStudent,
      board_id: selectedBoard,
      subject_id: selectedSubject,
      subjectlevel_id: selectedSubjectLevel,
      prescribed_hours: prescribedhours,
      calendar,
      center: centerValue,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    };
    
    try {
      const response = await Api.post(`/schedule/create`, scheduleData);
      if (response.status >= 200 && response.status < 300) {
        toast.success('Schedule created successfully!');
        // Reset form
        setSelectedTeacher('');
        setSelectedStudent('');
        setSelectedBoard('');
        setSelectedSubject('');
        setSelectedSubjectLevel('');
        setPrescribehours(0);
        setSelectedDays([]);
        setStartDate(new Date());
        setEndDate(new Date());
        setSelectedCenters([]);
        setLocation('home');
      } else {
        toast.error('Failed to create the schedule. Please try again.');
      }
    } catch (error) {
      console.error('Error creating schedule:', error.response?.data || error.message);
      toast.error('Error creating schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   
        <div className="w-full  px-4">
          <div className=" p-6 mt-6">
            <div className="p-4">
              <IconWithTitle
                icon={GrSchedules}
                title="Schedule Submit"
                iconColor="white"
                backgroundColor="#1a73e8"
                iconSize="30px"
                titleColor="#1a73e8"
                titleFontSize="34px"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teacher Select with Search */}
                {/* Teacher Search with Suggestions */}
              <div className="relative mb-4" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teacher
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FcSearch className="absolute left-3 top-3 text-gray-400" />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredTeachers.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredTeachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleTeacherSelect(teacher)}
                      >
                        {teacher.name}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden select for form submission */}
                <select
                  name="teacher_id"
                  value={selectedTeacher}
                  onChange={handleTeacherChange}
                  className="hidden"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

                {/* Student Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => {
                      setSelectedStudent(e.target.value);
                      setSelectedBoard("");
                      setSelectedSubject("");
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {loading ? (
                      <option value="">Loading students...</option>
                    ) : students.length > 0 ? (
                      students.map((student) => (
                        <option key={student.student_id} value={student.student_id}>
                          {student.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No students available</option>
                    )}
                  </select>
                </div>

                {/* Board Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
                  <select
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    disabled={!selectedStudent}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Board</option>
                    {students?.length > 0 && selectedStudent ? (
                      students
                        .filter((student) => student.student_id === selectedStudent)
                        .flatMap((student) => student.board_info ? [student.board_info] : [])
                        .map((boardInfo) => (
                          <option key={boardInfo._id} value={boardInfo._id}>
                            {boardInfo.board_prog_name || 'Unknown Board'}
                          </option>
                        ))
                    ) : (
                      <option value="">No boards available</option>
                    )}
                  </select>
                </div>

                {/* Subject Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{getTabLabel("Subject")}</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={!selectedBoard}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select {getTabLabel("Subject")}</option>
                    {students?.length > 0 && selectedBoard ? (
                      students
                        .filter((student) => student.student_id === selectedStudent)
                        .flatMap((student) => student.subject_info || [])
                        .filter((subject) =>
                          subject.students.some(
                            (student) => student.board_info?._id === selectedBoard
                          )
                        )
                        .map((subject) => (
                          <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.subject_name}
                          </option>
                        ))
                    ) : (
                      <option value="">No subjects available</option>
                    )}
                  </select>
                </div>

                {/* Subject Level (Conditional) */}
                {selectedBoard === "665fffe9e02ec586b271fba2" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Level</label>
                    <select
                      value={selectedSubjectLevel}
                      onChange={(e) => setSelectedSubjectLevel(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Subject Level</option>
                      {subjectMappings.length > 0
                        ? subjectMappings
                            .filter((mapping) =>
                              mapping.subjects.some(
                                (subject) => subject.subject_id === selectedSubject
                              )
                            )
                            .map((mapping) => (
                              <option key={mapping.subjectlevel_id} value={mapping.subjectlevel_id}>
                                {mapping.subject_level_name}
                              </option>
                            ))
                        : (
                          <option value="">No subject levels available</option>
                        )}
                    </select>
                  </div>
                )}

                {/* Prescribed Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed Hours</label>
                  <input
                    type="number"
                    value={prescribedhours}
                    onChange={(e) => setPrescribehours(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Days and Times Section */}
              <div className="border border-gray-300 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-medium mb-4">Schedule Days and Times</h3>
                <div className="space-y-4">
                  {daysOfWeek.map(day => (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          checked={selectedDays.includes(day)}
                          onChange={() => handleDaySelection(day)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-900">
                          {day}
                        </label>
                      </div>
                      <div>
                        <label htmlFor={`start-${day}`} className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                          type="time"
                          id={`start-${day}`}
                          value={dayTimes[day]?.startTime || ''}
                          onChange={(e) => handleDayTimeChange(day, 'startTime', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor={`end-${day}`} className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                          type="time"
                          id={`end-${day}`}
                          value={dayTimes[day].endTime}
                          onChange={(e) => handleDayTimeChange(day, 'endTime', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Radio Buttons */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Location</h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      value="home"
                      checked={location === 'home'}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Home</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      value="center"
                      checked={location === 'center'}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Center</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      value="Online"
                      checked={location === 'Online'}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <span className="ml-2 text-sm text-gray-700">Online</span>
                  </label>
                </div>
              </div>

              {/* Centers Checkboxes (Conditional) */}
              {location === 'center' && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Center</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {centersList.map(center => (
                      <label key={center.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={selectedCenters.includes(center.name)}
                          onChange={(e) => {
                            const updatedCenters = e.target.checked
                              ? [...selectedCenters, center.name]
                              : selectedCenters.filter(c => c !== center.name);
                            setSelectedCenters(updatedCenters);
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{center.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Date Range</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between mt-8">
                <BackButton/>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Schedule'
                  )}
                </button>
              </div>
            </div>
          </div>
          <ScrollUpComponent/>
          <ToastContainer />
        </div>
  
  );
};

export default ScheduleCreate;