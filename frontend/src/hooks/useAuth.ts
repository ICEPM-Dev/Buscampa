import { useAuth as useAuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const auth = useAuthContext();

  return {
    ...auth,
    isUser: auth.user?.type === "USER",
    isChurch: auth.user?.type === "IGLESIA",
  };
}
