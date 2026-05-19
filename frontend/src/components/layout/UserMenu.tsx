import { useNavigate } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface UserMenuProps {
  isTransparent?: boolean;
}

export function UserMenu({ isTransparent = false }: UserMenuProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <button
      onClick={() => navigate("/profile")}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors group ${
        isTransparent
          ? "hover:bg-white/10"
          : "hover:bg-slate-100"
      }`}
    >
      {/* Avatar */}
      {user?.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={user.name}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-sm"
        />
      ) : (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm ${
          isTransparent ? "bg-blue-400/30" : "bg-blue-100"
        }`}>
          <User className={`h-3.5 w-3.5 ${
            isTransparent ? "text-blue-100" : "text-blue-600"
          }`} />
        </div>
      )}

      {/* Name */}
      <span className={`text-sm font-medium max-w-30 truncate transition-colors ${
        isTransparent
          ? "text-white/85 group-hover:text-white"
          : "text-slate-700 group-hover:text-slate-900"
      }`}>
        {user?.name}
      </span>

      <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-colors ${
        isTransparent
          ? "text-white/55 group-hover:text-white/75"
          : "text-slate-400 group-hover:text-slate-600"
      }`} />
    </button>
  );
}

export default UserMenu;
