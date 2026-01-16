import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function UserMenu() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <button
      onClick={() => navigate('/profile')}
      className="flex items-center gap-2 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors"
    >
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="h-4 w-4 text-blue-600" />
      </div>
      <span className="text-sm text-slate-700 font-medium">
        {user?.name}
      </span>
    </button>
  );
}
