import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useIsAuthLoading } from './PersistAuth';

const RequireAuth = () => {
  const { isLoading } = useIsAuthLoading();
  const { token } = useAuth();
  const location = useLocation();

  return isLoading || token ? (
    <Outlet />
  ) : (
    <Navigate to="sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
