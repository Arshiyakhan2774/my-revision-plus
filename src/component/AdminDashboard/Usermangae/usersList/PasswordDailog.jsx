import { useState } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaExpeditedssl } from "react-icons/fa";
import { toast } from 'react-toastify';
import AddButton from '../../../utilities/SaveButton';


const PasswordDialog = ({ open, onClose, onConfirm, userId }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
  const handleToggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const handleToggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleConfirm = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    const data = {
      passwordData: {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      id: userId,
    };

    try {
      await onConfirm(data);
      toast.success("Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-gray-100 rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-4">
          <FaExpeditedssl size={40} color="#1a73e8" />
          <h2 className="text-xl font-semibold text-center mt-2 text-[#1a73e8]">Update Password</h2>
        </div>

        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={handleToggleOldPasswordVisibility}
              >
                {showOldPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={handleToggleNewPasswordVisibility}
              >
                {showNewPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                onClick={handleToggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-2">
          <AddButton onClick={onClose} label="Cancel" />
          <AddButton onClick={handleConfirm} label="Update Password" />
        </div>
      </div>
    </div>
  );
};

export default PasswordDialog;
