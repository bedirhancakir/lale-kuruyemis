import RegisterForm from "../components/auth/RegisterForm";
import { useRedirectIfAuthenticated } from "../lib/redirectIfAuthenticated";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { loading, user } = useAuth();
  useRedirectIfAuthenticated();

  if (loading || user) return null;

  return <RegisterForm />;
}
