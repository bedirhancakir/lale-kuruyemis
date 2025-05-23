// lib/redirectIfAuthenticated.js
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export function useRedirectIfAuthenticated() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading]);
}
