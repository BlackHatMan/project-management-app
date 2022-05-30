import { useLocation, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux.hooks';

type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();
  const { isLoggedIn } = useAppSelector((store) => store.auth);

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={location.pathname} />;
  }

  return children;
};
export default RequireAuth;
