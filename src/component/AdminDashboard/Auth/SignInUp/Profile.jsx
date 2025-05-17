import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiEdit } from 'react-icons/fi';
import Avatar from 'react-avatar';

const UserProfile = ({ openDialog, setOpenDialog,handleOpenDialog,isOpen }) => {
  const userResponse = useSelector((state) => state.idSlice.userResponse);
  

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const avatarUrl = userResponse?.image
    ? `https://myrevisionplus.com/api/img/users/${userResponse.image}`
    : null;

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userResponse?.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-bold">
              {userResponse?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          {isOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium text-black">
                {userResponse?.name || 'Guest'}
              </p>
              <p className="text-xs text-gray-500">
                {userResponse?.email || 'user@company.com'}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleOpenDialog}
          className="text-blue-500 hover:text-blue-700 p-1"
        >
          <FiEdit size={18} />
        </button>
      </div>

      <EditProfileDialog
        openDialog={openDialog}
        handleCloseDialog={handleDialogClose}
      />
    </div>
  );
};

export default UserProfile;
