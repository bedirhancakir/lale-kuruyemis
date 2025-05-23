import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

// allowedRoles: string[] → örnek: ['admin'], ['bireysel', 'kurumsal']
export default function withAuth(WrappedComponent, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          const publicRoutes = ["/", "/about", "/contact"];
          if (!publicRoutes.includes(router.pathname)) {
            router.replace("/login");
          }
        } else if (profile && !allowedRoles.includes(profile.role)) {
          router.replace("/");
        }
      }
    }, [user, profile, loading]);

    if (loading || !user || !profile) {
      return <p style={{ textAlign: "center" }}>Yükleniyor...</p>;
    }

    if (allowedRoles.includes(profile.role)) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
}
