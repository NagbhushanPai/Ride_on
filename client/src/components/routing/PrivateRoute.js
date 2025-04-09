import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, loadUser } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  
  if (isAuthenticated) {
    return <Component />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute; 