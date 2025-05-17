import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEdit, FaTimes } from 'react-icons/fa';
import { Api } from '../../../Api/Api';


const StudentProfile = ({ idData, open, onClose }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get(`/users/${idData}`);
        setUser(response.data.data.user); 
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (idData && open) {
      fetchUserData();
    }
  }, [idData, open]);
  if (!open) return null;
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <div className="text-red-500 font-medium">
            {error.message || 'An error occurred while fetching user data.'}
          </div>
        </div>
      </div>
    );
  }

  // Handle case where no user data is available
  if (!user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <div className="text-blue-500 font-medium">No user data available.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Side - Profile Card */}
              <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-900 to-blue-900 text-white rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="relative">
                  <img
                    src={`https://myrevisionplus.com/api/img/users/${user.image || ''}`}
                    alt={user.name || 'User Avatar'}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white mb-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://ui-avatars.com/api/?name='+encodeURIComponent(user.name || 'User')+'&background=00246B&color=fff&size=128';
                    }}
                  />
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 text-blue-900 hover:bg-gray-100">
                    <FaEdit className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-xl font-medium">{user.name}</h3>
                <p className="text-sm opacity-90 mt-1">{user.role || 'Not Specified'}</p>
              </div>

              {/* Right Side - Info */}
              <div className="w-full md:w-2/3">
                <h4 className="text-lg font-semibold text-gray-900">Information</h4>
                <hr className="my-3 border-gray-200" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{user.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium text-gray-800">
                      {user.expire_date || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent Name</p>
                    <p className="font-medium text-gray-800">
                      {user.parent?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Parent Email</p>
                    <p className="font-medium text-gray-800">
                      {user.parent?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Social Links</h4>
                <hr className="my-3 border-gray-200" />
                
                <div className="flex space-x-4">
                  <a
                    href={user.facebook || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <FaFacebook className="h-6 w-6" />
                  </a>
                  <a
                    href={user.twitter || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <FaTwitter className="h-6 w-6" />
                  </a>
                  <a
                    href={user.instagram || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-800 transition-colors"
                  >
                    <FaInstagram className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-custom-primary text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;