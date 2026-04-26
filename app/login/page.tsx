"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = () => {
    window.location.href = "/api/google";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Macroflow</h1>

        <button
          onClick={handleLogin}
          className="flex items-center justify-center w-full gap-3 px-6 py-3 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all bg-white text-black font-medium"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
