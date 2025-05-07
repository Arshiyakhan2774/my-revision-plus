import { useEffect, useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaEdit, FaTimes } from 'react-icons/fa';
import { Api } from '../../../Api/Api';


const UserProfileModal = ({ idData, open, onClose }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await Api.get(`users/${idData}`);
        setUser(response.data.data.user); 
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (idData) fetchUserData();
  }, [idData]);

  if (!open) return null;

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
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error.message || 'An error occurred while fetching user data.'}</p>
              </div>
            </div>
          ) : !user ? (
            <div className="p-6">
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
                <p>No user data available.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">User Profile</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Profile Section */}
                  <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-lg p-6 flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        src={`http://myrevisionplus.com/api/img/users/${user.image || ''}`}
                        alt={user.name || 'User Avatar'}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://ui-avatars.com/api/?name='+encodeURIComponent(user.name || 'User')+'&background=00246B&color=fff&size=128';
                        }}
                      />
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 text-blue-800 hover:bg-gray-100 shadow-sm">
                        <FaEdit className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="text-xl font-medium">{user.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{user.role || 'Not Specified'}</p>
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-2/3">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">Information</h4>
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
                          <p className="text-sm text-gray-500">Expiration Date</p>
                          <p className="font-medium text-gray-800">
                            {user.expire_date ? new Date(user.expire_date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Social Links</h4>
                      <hr className="my-3 border-gray-200" />
                      <div className="flex space-x-4">
                        <a
                          href={user.facebook || '#'}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFacebook className="h-6 w-6" />
                        </a>
                        <a
                          href={user.twitter || '#'}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaTwitter className="h-6 w-6" />
                        </a>
                        <a
                          href={user.instagram || '#'}
                          className="text-pink-600 hover:text-pink-800 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaInstagram className="h-6 w-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;