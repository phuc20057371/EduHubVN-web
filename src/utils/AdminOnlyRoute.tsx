import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminOnlyRoute = () => {
  const userProfile = useSelector((state: any) => state.userProfile);
  
  // Allow access only if user has ADMIN role (not SUB_ADMIN)
  const isAdmin = userProfile && userProfile.role === "ADMIN";
  
  return isAdmin ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default AdminOnlyRoute;
