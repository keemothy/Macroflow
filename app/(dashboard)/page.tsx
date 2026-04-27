"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import WeightCard from "@/components/WeightCard";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <div className="max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-gray-500">
          These are your health metrics as of today.
        </p>
      </header>

      {/* Grid for your future charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placeholder for Weight Trajectory */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
          <p className="text-gray-400 italic">
            Weight Trajectory Graph Coming Soon
          </p>
        </div>

        {/* Placeholder for Daily Macros */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
          <p className="text-gray-400 italic">
            Daily Macros Progress Coming Soon
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Row 1: Key Stats */}
        <WeightCard />
        {/* ... other summary cards like Calories remaining or Steps ... */}
      </div>
    </div>
  );
}
