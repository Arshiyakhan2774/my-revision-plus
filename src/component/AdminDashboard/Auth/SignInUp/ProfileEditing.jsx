import React, { useCallback, useState } from 'react';
import Avatar from 'react-avatar';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const EditProfileDialog = ({ openDialog, handleCloseDialog }) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    gender: '',
    mobileNumber: '',
    password: '',
    showPassword: false,
    avatar: ''
  });

  const {
    userName,
    email,
    gender,
    mobileNumber,
    password,
    showPassword,
    avatar
  } = formData;

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePasswordVisibilityToggle = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('avatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [handleChange]);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', formData);
    handleCloseDialog();
  };

  if (!openDialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Edit My Profile</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={userName}
            onChange={(e) => handleChange('userName', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10"
            />
            <button
              type="button"
              onClick={handlePasswordVisibilityToggle}
              className="absolute inset-y-0 right-2 flex items-center text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <select
            value={gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => handleChange('mobileNumber', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="block mt-2"
          />
          {avatar && (
            <div className="flex justify-center mt-2">
              <Avatar src={avatar} name={userName} size="40" round />
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCloseDialog}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditProfileDialog);
