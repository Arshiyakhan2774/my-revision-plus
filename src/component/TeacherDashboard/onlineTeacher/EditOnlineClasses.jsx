import { useEffect, useState } from "react";
import { GiLaptop } from "react-icons/gi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Api } from "../../Api/Api";
import IconWithTitle from "../../utilities/IconsTittle";


const EditOnlineClasses = ({ onClose, open, refetch, selectedClassForEdit }) => {
  const [formData, setFormData] = useState({
    startTime: null,
    endTime: null,
    displayName: "",
    meetingType: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedClassForEdit) {
      const schedule = selectedClassForEdit.upcoming_schedule?.[0] || 
                      selectedClassForEdit.past_schedule?.[0];
      
      if (schedule) {
        const calendar = schedule.calendar?.[0] || {};
        setFormData({
          startTime: calendar.start_time ? new Date(calendar.start_time) : null,
          endTime: calendar.end_time ? new Date(calendar.end_time) : null,
          displayName: schedule.class_details || "",
          meetingType: schedule.meet_type || "",
        });
      }
    }
  }, [selectedClassForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.startTime || !formData.endTime) {
      toast.error("Please select both start and end times");
      setLoading(false);
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error("End time must be after start time");
      setLoading(false);
      return;
    }

    if (!formData.displayName || !formData.meetingType) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        online_id: selectedClassForEdit._id, 
        session_id: selectedClassForEdit.upcoming_schedule?.[0]?._id || 
                   selectedClassForEdit.past_schedule?.[0]?._id,
        display_name: formData.displayName,
        uid: selectedClassForEdit.host_id?.email || "default@email.com",
        meet_type: formData.meetingType,
        calendar: [{
          start_time: formData.startTime.toISOString(),
          end_time: formData.endTime.toISOString(),
        }],
        // Include additional fields if needed by your API
        host_id: selectedClassForEdit.host_id?._id,
        student_id: selectedClassForEdit.student_id?._id,
        subject_id: selectedClassForEdit.subject_id?._id
      };

      // Make API call to update the class
      await Api.patch(`/onlineclass/update`, payload);
      
      toast.success("Class updated successfully");
      refetch();
      onClose();
    } catch (error) {
      console.error("Error updating class:", error);
      toast.error(error.response?.data?.message || "Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="bg-custom-primary text-white p-4 rounded-t-lg">
          <IconWithTitle
            icon={GiLaptop}
            title="Edit Online Class"
            iconColor="white"
            backgroundColor="transparent"
            iconSize="30px"
            titleColor="white"
            titleFontSize="24px"
          />
        </div>
        
        <div className="p-4">
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type</label>
                <select
                  name="meetingType"
                  value={formData.meetingType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Meeting Type</option>
                  <option value="Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="InstaVc">Insta VC</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <DatePicker
                  selected={formData.startTime}
                  onChange={(date) => setFormData(prev => ({ ...prev, startTime: date }))}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd h:mm aa"
                  minDate={new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <DatePicker
                  selected={formData.endTime}
                  onChange={(date) => setFormData(prev => ({ ...prev, endTime: date }))}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd h:mm aa"
                  minDate={formData.startTime || new Date()}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-custom-primary text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOnlineClasses;