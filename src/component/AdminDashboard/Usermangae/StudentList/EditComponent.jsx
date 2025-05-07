import { useEffect, useState } from 'react';
import { TbHomeEdit } from 'react-icons/tb';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserTypesQuery } from '../../../Services/UserMangae/UserMangeSlice';
import { Api } from '../../../Api/Api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditUserModal = ({ open, onClose, user, refetch }) => {
  const baseImageUrl = 'https://myrevisionplus.com/api/img/users/';
  const [userDetails, setUserDetails] = useState({
    teacher: '',
    id: '',
    name: '',
    email: '',
    mobile: '',
    expiryDate: null,
    parentName: '',
    parentEmail: '',
    image: '',
    gender: '',
    frequency: ''
  });

  const [previewImage, setPreviewImage] = useState('');
  const { data } = useGetUserTypesQuery();

  useEffect(() => {
    if (user) {
      setUserDetails({
        teacher: user.usertype_id?._id || '',
        id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        expiryDate: user.expiry_date ? new Date(user.expiry_date) : null,
        parentName: user?.parent?.name || '',
        parentEmail: user?.parent?.email || '',
        gender: user?.gender || '',
        frequency: user?.frequency || '',
        image: user.image || ''
      });
      
      if (user.image) {
        setPreviewImage(`${baseImageUrl}${user.image}`);
      }
    }
  }, [user, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setUserDetails(prev => ({ ...prev, expiryDate: date }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserDetails(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();
    Object.entries(userDetails).forEach(([key, value]) => {
      if (key !== 'usertype_id' && value) {
        // Format date before appending
        const formattedValue = key === 'expiryDate' 
          ? value.toISOString().split('T')[0]
          : value;
        formData.append(key === 'teacher' ? 'usertype_id' : key, formattedValue);
      }
    });
    formData.append('address', 'warud');

    try {
      await Api.patch(`/users/${userDetails.id}`, formData);
      toast.success('User updated successfully!');
      refetch();
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user. Please try again.');
    }
  };

  const userTypes = data?.data?.usertypes || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-center space-x-4">
            <div className="border-4 border-blue-900 rounded-full p-2">
              <TbHomeEdit className="text-blue-900 text-3xl" />
            </div>
            <h2 className="text-xl font-semibold text-blue-900">Edit User</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">User Type</label>
                <select
                  name="teacher"
                  value={userDetails.teacher}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select User Type</option>
                  {userTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={userDetails.mobile}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                <DatePicker
                  selected={userDetails.expiryDate}
                  onChange={handleDateChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select expiry date"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Parent Name</label>
                <input
                  type="text"
                  name="parentName"
                  value={userDetails.parentName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Parent Email</label>
                <input
                  type="email"
                  name="parentEmail"
                  value={userDetails.parentEmail}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Attendance Frequency</label>
                <select
                  name="frequency"
                  value={userDetails.frequency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Profile Image</label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 p-4">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-8 h-8 mb-2 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
              {previewImage && (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button 
                    onClick={() => {
                      setPreviewImage('');
                      setUserDetails(prev => ({ ...prev, image: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default EditUserModal;