import { useAppSelector } from '@/app/hooks';
import { selectCurrentToken } from '../slices/authSlice';
import { useLocation, Outlet, Navigate } from 'react-router-dom';

const RequireAuth = () => {
  const token = useAppSelector(selectCurrentToken);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" state={{ from: location }} replace />
  );
};

export default RequireAuth;
