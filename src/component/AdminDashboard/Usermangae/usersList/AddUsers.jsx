import { useState } from 'react';
import { GiTeacher } from "react-icons/gi";
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from '../../../Api/Api';
import { useGetUserTypesQuery } from '../../../Services/UserMangae/UserMangeSlice';
import BackButton from '../../../utilities/BackButrton';
import AddButton from '../../../utilities/SaveButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconWithTitle from '../../../utilities/IconsTittle';

const AddUsers = () => {
  const [teacher, setTeacher] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [inactiveDate, setInactiveDate] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { data } = useGetUserTypesQuery();
  const userTypes = data?.data?.usertypes || [];

  const isStrongPassword = (password) => {
    const minLength = 8;
    return password.length >= minLength &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };

  const resetForm = () => {
    setTeacher('');
    setName('');
    setEmail('');
    setMobile('');
    setInactiveDate('');
    setPassword('');
    setProfilePic(null);
  };

  const handleTogglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleProfilePicChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB", { position: "top-right" });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(selectedFile.type)) {
        toast.error("Only JPG, PNG or GIF images are allowed", { position: "top-right" });
        return;
      }
      setProfilePic(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];

    if (!teacher) validationErrors.push("User Type");
    if (!name) validationErrors.push("Name");
    if (!email) validationErrors.push("Email");
    if (!mobile) validationErrors.push("Mobile");
    if (!inactiveDate) validationErrors.push("Inactivation Date");
    if (!password) validationErrors.push("User Password");
    if (!isStrongPassword(password)) validationErrors.push("Password must be strong.");

    if (validationErrors.length > 0) {
      toast.error(`Please fill out: ${validationErrors.join(", ")}`, { position: "top-right" });
      return;
    }

    const formData = new FormData();
    formData.append("usertype_id", teacher);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("images", profilePic);
    formData.append("password", password);
    formData.append("mobile", mobile);
    formData.append("expire_date", inactiveDate);

    try {
      const response = await Api.post("/users/create", formData);
      console.log(response.data.data);
      toast.success("User created successfully!");
      resetForm();
    } catch (error) {
      if (error.response?.data?.error?.code === 11000) {
        const duplicateField = Object.keys(error.response.data.error.keyValue)[0];
        const duplicateValue = Object.values(error.response.data.error.keyValue)[0];
        toast.error(`Duplicate entry: ${duplicateField} (${duplicateValue}) already exists.`, {
          position: "top-right",
        });
      } else {
        console.error("Error:", error);
        toast.error("Failed to add user. Please try again.");
      }
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
    <div className="max-w-auto w-full mx-auto px-4 py-10">
      <IconWithTitle
        icon={GiTeacher}
        title="Add Teacher"
        iconColor="white"
        backgroundColor="#1a73e8"
        iconSize="30px"
        titleColor="#1a73e8"
        titleFontSize="34px"
      />

      <div className="bg-white shadow-lg  p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="mt-1 h-[42px] w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select UserType</option>
                {userTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input 
                type="text" 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)} 
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Inactivation Date</label>
              <DatePicker
                selected={inactiveDate}
                onChange={(date) => setInactiveDate(date)}
                className="mt-1 h-[42px] w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={handleTogglePasswordVisibility}
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

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Profile Picture *</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-blue-500 transition-colors">
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
                </div>
                {profilePic && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(profilePic)} 
                      alt="Profile Preview" 
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-200" 
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={() => setProfilePic(null)}
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

          <div className="flex justify-between mt-8">
            <BackButton />
            <AddButton type="submit" label="Add Teacher" />
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddUsers;