import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    if (!code) {
      navigate("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        // Determine which provider based on current path
        let endpoint = "/auth/google/callback";
        if (location.pathname.includes("github")) {
          endpoint = "/auth/github/callback";
        }

        const res = await api.post(endpoint, null, { params: { code } });
        setUser(res.data);
        navigate(res.data.onboarded ? "/dashboard" : "/profile", { replace: true });
      } catch (e) {
        console.error("auth callback failed", e);
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate, setUser, location.pathname, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce"></div>
        </div>
        <p className="text-zinc-400 text-xs uppercase font-mono tracking-widest">Signing you in</p>
      </div>
    </div>
  );
}
