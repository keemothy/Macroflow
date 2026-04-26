"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        // If not logged in, send them to the login page
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading)
    return <div className="p-24 text-center">Checking authentication...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Only visible to logged in users */}
      <aside className="w-64 bg-white border-r flex flex-col p-6 shadow-sm">
        <div className="text-2xl font-bold text-blue-600 mb-10">MACROFLOW</div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link
            href="/"
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Home
          </Link>
          <Link
            href="/planner"
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Planner
          </Link>
          <Link
            href="/diary"
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Diary
          </Link>
          <Link
            href="/metrics"
            className="p-3 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Metrics
          </Link>
        </nav>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="p-3 text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  );
}
