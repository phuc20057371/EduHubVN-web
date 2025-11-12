import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  useEffect(() => {
    if (!accessToken) {
      window.location.href = import.meta.env.VITE_WELCOME_URL;
    }
  }, [accessToken]);
  
  return accessToken ? <Outlet /> : null;
};

export default ProtectedRoute;
