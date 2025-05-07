import { useEffect, useState } from 'react';
import { TbHomeEdit } from 'react-icons/tb';
import { toast } from 'react-toastify';
import { useGetUserTypesQuery } from '../../../Services/UserMangae/UserMangeSlice';
import { Api } from '../../../Api/Api';

const AdminEdit = ({  open, onClose, user, refetch }) => {
  const baseImageUrl = 'https://myrevisionplus.com/api/img/users/';
  const [userDetails, setUserDetails] = useState({
    teacher: '',
    id: '',
    name: '',
    email: '',
    mobile: '',
    expiryDate: '',
    usertype_id: '',
    image: '',
    gender: '',
    parentName: '',
    parentEmail: ''
  });

  const { data } = useGetUserTypesQuery();
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (user) {
      setUserDetails({
        teacher: user.usertype_id?._id || '',
        id: user._id || '',
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        expiryDate: user.expiry_date ? user.expiry_date.split('T')[0] : '',
        usertype_id: user.usertype_id?.name || '',
        image: user.image || '',
        gender: user.gender || '',
        parentName: user?.parent?.name || '',
        parentEmail: user?.parent?.email || ''
      });
      
      if (user.image) {
        setPreviewImage(`${baseImageUrl}${user.image}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
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
        formData.append(key === 'teacher' ? 'usertype_id' : key, value);
      }
    });
    formData.append('address', 'warud');

    try {
      await Api.patch(`/users/${userDetails.id}`, formData);
      refetch();
      toast.success('User updated successfully!');
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user. Please try again.');
    }
  };

  const userTypes = data?.data?.usertypes || [];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-50">
              <TbHomeEdit size={24} className="text-blue-900" />
            </div>
            <h2 className="text-xl font-semibold text-blue-900">Edit User</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
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

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={userDetails.expiryDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block mb-2 text-sm font-medium text-gray-700">Profile Image</label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                    </div>
                    <input 
                      id="dropzone-file" 
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
    </div>
  );
};

export default AdminEdit;