// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const LoginProtection = ({ children }) => {
//   const { isAuthenticated, loading } = useSelector((state) => state.auth);

//   if (loading) {
//     return <div>Loading...</div>; // Or a spinner
//   }

//   return isAuthenticated ? children : <Navigate to="/" replace />;
// };

// export default LoginProtection;
import React from 'react'

const LogInProtection = () => {
  return (
    <div></div>
  )
}

export default LogInProtection