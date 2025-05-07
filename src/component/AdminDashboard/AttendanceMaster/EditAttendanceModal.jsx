import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FcSearch } from 'react-icons/fc';
import { useFetchScheduleQuery } from '../../Services/Attendance/AttendanceApi';
import { Api } from '../../Api/Api';

const centersList = [
  { id: "GCR", name: 'GCR' },
  { id: "SPM", name: 'SPM' },
  { id: "NYC-208 & 209", name: 'NYC-208 & 209' },
  { id: "NYC-611 ", name: 'NYC 611' },
];

const EditAttendance = ({ attendanceData, onClose, open, refetch }) => {
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
    id: ''
  });
  
  const [selectedCenters, setSelectedCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data } = useFetchScheduleQuery();
  const schedule = data?.data?.schedule || [];
  const searchRef = useRef(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize form data when attendanceData changes
  useEffect(() => {
    if (attendanceData) {
      setFormData({
        ...attendanceData,
        aim: Array.isArray(attendanceData.aim) ? attendanceData.aim : [attendanceData.aim],
        attendance_date: attendanceData.attendance_date ? new Date(attendanceData.attendance_date) : null
      });
      
      if (attendanceData.location === 'center' && attendanceData.location_details) {
        setSelectedCenters(attendanceData.location_details.split(','));
      }
    }
  }, [attendanceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAimChange = (e) => {
    const { options } = e.target;
    const selectedAims = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedAims.push(options[i].value);
      }
    }
    setFormData(prev => ({ ...prev, aim: selectedAims }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, attendance_date: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Calculate total hours if start and end times are provided
    let totalHours = formData.total_hours;
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
      totalHours = diff.toFixed(2);
    }

    const centerValue = formData.location === 'center' ? selectedCenters.join(',') : formData.location;
    
    const payload = {
      schedule_id: formData.schedule_id,
      aim: formData.aim.join(','),
      location: formData.location,
      location_details: centerValue,
      attendance_date: formData.attendance_date ? formData.attendance_date.toISOString().split('T')[0] : null,
      start_time: formData.start_time,
      end_time: formData.end_time,
      total_hours: totalHours,
      topic: formData.topic,
      assignment_provide: formData.assignment_provide,
      assignment_description: formData.assignment_description,
    };

    try {
      const response = await Api.patch(`attendance/${formData._id}`, payload);
      if (response.status >= 200 && response.status < 300) {
        toast.success('Attendance updated successfully');
        onClose();
        refetch();
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to update attendance');
    }
  };

  const handleCenterSelection = (centerId) => {
    setSelectedCenters(prev =>
      prev.includes(centerId) ? prev.filter(id => id !== centerId) : [...prev, centerId]
    );
  };

  const filteredSchedules = schedule.filter(entry => {
    const fullText = `${entry.teacher_id?.name || ''} ${entry.student_id?.name || ''} ${entry.board_id?.board_prog_name || ''} ${entry.subject_id?.subject_name || ''} ${entry.subjectlevel_id?.subject_level_name || ''}`;
    return fullText.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleScheduleSelect = (scheduleId) => {
    setFormData(prev => ({ ...prev, schedule_id: scheduleId }));
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const selectedSchedule = schedule.find(s => s._id === formData.schedule_id);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Attendance</h2>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Combined Schedule Search and Select */}
              <div className="relative" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                  />
                  <FcSearch className="absolute left-3 top-3 text-lg" />
                </div>
                
                {isSearchOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-y-auto">
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map(entry => (
                        <div
                          key={entry._id}
                          className="p-2 hover:bg-gray-100 cursor-pointer border-b"
                          onClick={() => handleScheduleSelect(entry._id)}
                        >
                          <div className="font-medium">{entry.teacher_id?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-600">
                            {entry.student_id?.name || 'N/A'} | {entry.board_id?.board_prog_name || 'N/A'} | 
                            {entry.subject_id?.subject_name || 'N/A'} | {entry.subjectlevel_id?.subject_level_name || 'N/A'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No matching schedules found</div>
                    )}
                  </div>
                )}
                
                {selectedSchedule && !isSearchOpen && (
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    <div className="font-medium">{selectedSchedule.teacher_id?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      {selectedSchedule.student_id?.name || 'N/A'} | {selectedSchedule.board_id?.board_prog_name || 'N/A'} | 
                      {selectedSchedule.subject_id?.subject_name || 'N/A'} | {selectedSchedule.subjectlevel_id?.subject_level_name || 'N/A'}
                    </div>
                  </div>
                )}
              </div>

              {/* Aim Select with Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aims</label>
                <select
                  multiple
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  name="aim"
                  value={formData.aim}
                  onChange={handleAimChange}
                  size={4}
                >
                  <option value="Concept Building">Concept Building</option>
                  <option value="Practice">Practice</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Paper Discussion">Paper Discussion</option>
                </select>
                {formData.aim?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {formData.aim.map(aim => (
                      <span key={aim} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {aim}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="text-blue-600 focus:ring-blue-500"
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
                    className="text-blue-600 focus:ring-blue-500"
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
                    className="text-blue-600 focus:ring-blue-500"
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
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Select Center(s)</h3>
                  <div className="flex flex-wrap gap-4">
                    {centersList.map(center => (
                      <label key={center.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="text-blue-600 focus:ring-blue-500 rounded"
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

            {/* Date/Time Section */}
            <div className="border border-gray-300 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <DatePicker
                    selected={formData.attendance_date}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholderText="Select date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="total_hours"
                    value={formData.total_hours}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="topic"
                    rows={3}
                    value={formData.topic}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Provided?</label>
                  <div className="flex gap-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="text-blue-600 focus:ring-blue-500"
                        name="assignment_provide"
                        value="Yes"
                        checked={formData.assignment_provide === 'Yes'}
                        onChange={handleChange}
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="text-blue-600 focus:ring-blue-500"
                        name="assignment_provide"
                        value="No"
                        checked={formData.assignment_provide === 'No'}
                        onChange={handleChange}
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    name="assignment_description"
                    rows={3}
                    value={formData.assignment_description}
                    onChange={handleChange}
                    placeholder="Assignment details..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
              >
                Update Attendance
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAttendance;