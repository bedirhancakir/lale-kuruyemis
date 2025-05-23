import LoginForm from "../components/auth/LoginForm";
import { useRedirectIfAuthenticated } from "../lib/redirectIfAuthenticated";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loading, user } = useAuth();
  useRedirectIfAuthenticated();

  if (loading || user) return null;

  return <LoginForm />;
}
