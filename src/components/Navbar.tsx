import { useNavigate } from 'react-router-dom';
import { LogOut, Activity, User } from 'lucide-react';

interface NavbarProps {
  fullName: string;
  role: string;
  facility?: string;
}

export default function Navbar({ fullName, role, facility }: NavbarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-[#6c63ff]',
    DEVELOPER: 'bg-blue-100 text-blue-700',
    FACILITY_ADMIN: 'bg-teal-100 text-teal-700',
    REFERRAL_OFFICER: 'bg-amber-100 text-amber-700',
    VIEWER: 'bg-gray-100 text-gray-600',
  };

  return (
    <nav className="bg-[#1a1a4e] text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="bg-[#6c63ff] p-1.5 rounded-lg">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Referral Tracker</p>
            <p className="text-xs text-gray-400 leading-tight">Healthcare System</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/referrals')}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Referrals
          </button>

          {(role === 'ADMIN' || role === 'DEVELOPER' || role === 'FACILITY_ADMIN') && (
            <button
              onClick={() => navigate('/users')}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Users
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <p className="text-sm font-medium">{fullName}</p>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`
                  text-xs px-2 py-0.5 rounded-full font-medium
                  ${roleColors[role] || 'bg-gray-100 text-gray-600'}
                `}
              >
                {role.replace('_', ' ')}
              </span>
              {facility && (
                <span className="text-xs text-gray-400">{facility}</span>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 px-3 py-2
              text-sm text-gray-300
              border border-gray-600 rounded-lg
              hover:bg-red-600 hover:text-white hover:border-red-600
              transition-all duration-200
            "
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>

        </div>
      </div>
    </nav>
  );
}