import { useRecoilValue } from 'recoil';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../../store/authAtom';

export default function ProtectedRoute({ children }) {
  const auth = useRecoilValue(authAtom);

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
