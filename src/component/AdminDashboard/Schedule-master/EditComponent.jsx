import React, { useState, useEffect, useMemo, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { RiCalendarScheduleLine } from 'react-icons/ri';
import { FcSearch } from 'react-icons/fc';
import { FaSpinner } from 'react-icons/fa';
import { useFetchScheduleQuery } from '../../Services/Attendance/AttendanceApi';
import { useGetUserTeacherQuery } from '../../Services/UserMangae/UserMangeSlice';
import { useGetCategoryListQuery } from '../../Services/Category/CategoryApi';
import { Api } from '../../Api/Api';
import AddButton from '../../utilities/SaveButton';
import IconWithTitle from '../../utilities/IconsTittle';

const EditScheduleDialog = ({ open, setEditMode, userToEdit }) => {
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [prescribedHours, setPrescribedHours] = useState('');
  const [dayTimes, setDayTimes] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [location, setLocation] = useState('');
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [showTeacherSuggestions, setShowTeacherSuggestions] = useState(false);
  const searchRef = useRef(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const { data: teacherData } = useGetUserTeacherQuery();
  const teachers = useMemo(() => teacherData?.data?.teacher || [], [teacherData]);

  const { data: scheduleData } = useFetchScheduleQuery(userToEdit);
  const schedule = scheduleData?.data?.schedule || [];

  const { data: categoryData } = useGetCategoryListQuery();
  const categories = useMemo(() => categoryData?.data || [], [categoryData]);

  // Filter teachers based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
      setShowTeacherSuggestions(true);
    } else {
      setFilteredTeachers(teachers);
      setShowTeacherSuggestions(false);
    }
  }, [searchTerm, teachers]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowTeacherSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacher) {
        try {
          const response = await Api.get(`/users/user-by-teacher/${selectedTeacher}`);
          setStudents(response.data.data.user);
        } catch (error) {
          console.error(error);
          setStudents([]);
        }
      } else {
        setStudents([]);
      }
    };
  
    fetchStudents();
  }, [selectedTeacher]);

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher._id);
    setSearchTerm(teacher.name);
    setShowTeacherSuggestions(false);
  };

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

  const handleCenterSelection = (centerId) => {
    setSelectedCenters(prev =>
      prev.includes(centerId)
        ? prev.filter(id => id !== centerId)
        : [...prev, centerId]
    );
  };

  const handleEditSubmit = async () => {
    const centerValue = location === 'center' ? selectedCenters.join(',') : location;

    const scheduleData = {
      teacher_id: selectedTeacher,
      student_id: selectedStudent,
      board_id: selectedBoard,
      subject_id: selectedSubject,
      prescribed_hours: prescribedHours,
      calendar: Object.keys(dayTimes).map(day => ({
        days: day,
        start_time: dayTimes[day]?.startTime,
        end_time: dayTimes[day]?.endTime
      })),
      center: centerValue,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    };

    try {
      const response = await Api.patch(`/schedule/${userToEdit}`, scheduleData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Edit Schedule</h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <IconWithTitle
            icon={RiCalendarScheduleLine}
            title="Schedule Edit"
            iconColor="white"
            backgroundColor="#1a73e8"
            iconSize="30px"
            titleColor="#1a73e8"
            titleFontSize="34px"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Teacher Search with Suggestions */}
            <div className="relative" ref={searchRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowTeacherSuggestions(true)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FcSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              {/* Suggestions Dropdown */}
              {showTeacherSuggestions && filteredTeachers.length > 0 && (
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
                onChange={(e) => setSelectedTeacher(e.target.value)}
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
                onChange={(e) => setSelectedStudent(e.target.value)}
                disabled={!selectedTeacher}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select Student</option>
                {students?.length > 0 ? (
                  students?.map(student => (
                    <option key={student._id} value={student._id}>{student.name}</option>
                  ))
                ) : (
                  <option value="" disabled>No students available</option>
                )}
              </select>
            </div>
          </div>

          {/* Board, Subject, and Prescribed Hours */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Board</option>
                {categories?.categories?.map(board => (
                  <option key={board._id} value={board._id}>{board.board_prog_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {(categories?.categories?.find(cat => cat._id === selectedBoard)?.subjects || []).map(subject => (
                  <option key={subject._id} value={subject._id}>{subject.subject_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed Hours</label>
              <input
                type="number"
                value={prescribedHours}
                onChange={(e) => setPrescribedHours(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Days and Times */}
          <div className="border border-gray-300 rounded-lg p-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Schedule Days and Times</h3>
            <div className="space-y-4">
              {daysOfWeek?.map(day => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
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
                      value={dayTimes[day]?.endTime || ''}
                      onChange={(e) => handleDayTimeChange(day, 'endTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Selection */}
          <div className="mt-4">
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

          {/* Centers Selection */}
          {location === 'center' && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Select Center(s)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                {categories?.centers?.map(center => (
                  <label key={center._id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedCenters.includes(center._id)}
                      onChange={() => handleCenterSelection(center._id)}
                    />
                    <span className="ml-2 text-sm text-gray-700">{center.center_name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Start and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          <AddButton onClick={handleEditSubmit} label="Update Schedule" />
        </div>
      </div>
    </div>
  );
};

export default EditScheduleDialog;