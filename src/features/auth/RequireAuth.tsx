import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RequireAuth = () => {
  const { token } = useAuth();
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
