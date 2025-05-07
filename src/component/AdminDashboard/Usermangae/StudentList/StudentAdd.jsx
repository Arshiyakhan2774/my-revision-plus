import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineAddToQueue } from "react-icons/md";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Api } from '../../../Api/Api';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';

const StudentAdd = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [inactiveDate, setInactiveDate] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [frequency, setFrequency] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (!name) errors.push('Name');
    if (!email) errors.push('Email');
    if (!parentName) errors.push('Parent Name');
    if (!parentEmail) errors.push('Parent Email');
    if (!inactiveDate) errors.push('Inactivation Date');
    if (!password || !isStrongPassword(password)) errors.push('User Password (strong password required)');
    if (!frequency) errors.push('Attendance Frequency');

    if (errors.length > 0) {
      toast.error(`Please fill out: ${errors.join(', ')}`);
      return;
    }

    const formData = new FormData();
    formData.append('usertype_id', "6730ea0590eb66bde2c2bb6b");
    formData.append('name', name);
    formData.append('email', email);
    if (profilePic) formData.append('images', profilePic);
    formData.append('password', password);
    formData.append('parent_email', parentEmail);
    formData.append('parent_name', parentName);
    formData.append('expire_date', inactiveDate.toISOString().split('T')[0]);
    formData.append('board', frequency);

    try {
      const response = await Api.post(`/users/create`, formData);
      if (response?.status === 201 || response?.success) {
        toast.success('Student created successfully!');
        setName('');
        setEmail('');
        setParentName('');
        setParentEmail('');
        setInactiveDate(null);
        setPassword('');
        setProfilePic(null);
        setFrequency('');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      if (error.response?.data?.error?.code === 11000) {
        const field = Object.keys(error.response.data.error.keyValue)[0];
        const value = Object.values(error.response.data.error.keyValue)[0];
        toast.error(`Duplicate entry: ${field} (${value}) already exists.`);
      } else {
        toast.error("Failed to add student. Please try again.");
      }
    }
  };

  const isStrongPassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
        toast.error("Only JPG, PNG or GIF images are allowed");
        return;
      }
      setProfilePic(selectedFile);
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", regex: /.{8,}/ },
    { label: "At least one uppercase letter", regex: /[A-Z]/ },
    { label: "At least one lowercase letter", regex: /[a-z]/ },
    { label: "At least one number", regex: /\d/ },
    { label: "At least one special character", regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  return (
    <div className="w-full mx-auto p-8 mt-2 mr-2 ml-2 mb-2 bg-white shadow-lg border border-gray-200">
      <div className="flex flex-col items-center mb-8">
        <div className="border-4 border-blue-900 rounded-full p-4 mb-4">
          <MdOutlineAddToQueue size={40} color="#1a73e8" />
        </div>
        <h2 className="text-3xl font-bold text-blue-900">Add Student</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Student Name *</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="text"
              placeholder="Enter student name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Student Email *</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="email"
              placeholder="Enter student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Parent Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Parent Name *</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="text"
              placeholder="Enter parent name"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              required
            />
          </div>

          {/* Parent Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Parent Email *</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              type="email"
              placeholder="Enter parent email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              required
            />
          </div>

          {/* Inactive Date Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Inactivation Date *</label>
            <DatePicker
              selected={inactiveDate}
              onChange={(date) => setInactiveDate(date)}
              placeholderText="Select date"
              dateFormat="yyyy-MM-dd"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordFocused && (
              <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <li key={index} className={`flex items-center ${req.regex.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-1">{req.regex.test(password) ? '✓' : '•'}</span>
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Frequency Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Attendance Frequency *</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Profile Picture Field */}
          <div className="space-y-2 md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-xs text-gray-500 mt-2">Click to upload</p>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden" 
                />
              </label>
              {profilePic && (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(profilePic)}
                    alt="Preview"
                    className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setProfilePic(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <BackButton />
          <AddButton type="submit" label="Add Student" />
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default StudentAdd;