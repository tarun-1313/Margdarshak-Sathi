
import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

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
      toast.error("Authentication code missing");

      navigate("/login", {
        replace: true,
      });

      return;
    }

    (async () => {
      try {
        // Detect provider
        let endpoint = "/auth/google/callback";

        if (location.pathname.includes("github")) {
          endpoint = "/auth/github/callback";
        }

        // Exchange OAuth code with backend
        await api.post(
          endpoint,
          null,
          {
            params: { code },
            withCredentials: true,
          }
        );

        // Verify authenticated user
        const me = await api.get(
          "/auth/me",
          {
            withCredentials: true,
          }
        );

        // Save user in context
        setUser(me.data);

        toast.success("Logged in successfully!");

        // Redirect
        navigate(
          me.data.onboarded
            ? "/dashboard"
            : "/profile",
          {
            replace: true,
          }
        );

      } catch (e) {
        console.error("auth callback failed", e);

        toast.error(
          e?.response?.data?.detail ||
          "Authentication failed"
        );

        navigate("/login", {
          replace: true,
        });
      }
    })();

  }, [
    navigate,
    setUser,
    location.pathname,
    location.search,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-center">

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>

          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>

          <div className="w-2 h-2 bg-[#d7ff00] rounded-full animate-bounce"></div>
        </div>

        <h2 className="text-white text-xl font-bold mb-2">
          Signing you in...
        </h2>

        <p className="text-zinc-400 text-xs uppercase font-mono tracking-widest">
          Please wait while we complete authentication
        </p>

      </div>
    </div>
  );
}

