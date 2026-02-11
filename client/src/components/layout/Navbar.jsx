import { useRecoilState } from 'recoil';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAtom } from '../../store/authAtom';

export default function Navbar() {
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
    navigate('/login');
  };

  // Don't show navbar on auth pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/boards" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-200 group-hover:shadow-lg group-hover:shadow-sky-300 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">
              TaskBoard
            </span>
          </Link>

          {/* Right side */}
          {auth.isAuthenticated && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                  {auth.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-700">{auth.user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
