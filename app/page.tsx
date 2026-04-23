"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // 2. Listen for auth changes (like logging in/out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/google";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return <div className="p-24 text-center">Loading...</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Macroflow</h1>

      {user ? (
        <div className="text-center">
          <p className="mb-4 text-xl">
            Welcome back,{" "}
            <span className="font-mono text-blue-600">{user.email}</span>!
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors bg-white text-black font-medium"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
      )}
    </main>
  );
}
