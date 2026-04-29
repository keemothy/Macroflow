"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import WeightCard from "@/components/WeightCard";
import WeightChart from "@/components/WeightChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [weightData, setWeightData] = useState<any[]>([]);
  const [macroData, setMacroData] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: weights } = await supabase
          .from("weight_logs")
          .select("log_date, weight")
          .eq("user_id", user.id)
          .order("log_date", { ascending: true });

        if (weights) {
          const formattedWeights = weights.map((row) => ({
            ...row,
            day_of_week: new Date(
              row.log_date + "T00:00:00",
            ).toLocaleDateString("en-US", { weekday: "short" }),
          }));
          setWeightData(formattedWeights);
        }

        const todayStr = new Date().toLocaleDateString("en-US", {
          weekday: "short",
        });
        const { data: foods } = await supabase
          .from("food_logs")
          .select("protein, carbs, fat")
          .eq("user_id", user.id)
          .eq("day_of_week", todayStr);

        if (foods) {
          const totals = foods.reduce(
            (acc, curr) => ({
              protein: acc.protein + (Number(curr.protein) || 0),
              carbs: acc.carbs + (Number(curr.carbs) || 0),
              fat: acc.fat + (Number(curr.fat) || 0),
            }),
            { protein: 0, carbs: 0, fat: 0 },
          );

          setMacroData([
            { name: "Protein", value: totals.protein, color: "#2563eb" },
            { name: "Carbs", value: totals.carbs, color: "#10b981" },
            { name: "Fat", value: totals.fat, color: "#f59e0b" },
          ]);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          Welcome back, {user?.email?.split("@")[0] || "User"}!
        </h1>
        <p className="text-gray-500">Your health overview and trajectory.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-700">
              Weight Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <WeightChart data={weightData} isMini={false} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-gray-700">
              Today's Macro Intake
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center">
            {isReady ? (
              <ResponsiveContainer width="99%" height="99%">
                <PieChart>
                  <Pie
                    data={macroData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 rounded-xl" />
            )}
            <div className="flex justify-center gap-4 text-xs font-medium mt-4">
              {macroData.map((m) => (
                <div key={m.name} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.color }}
                  />
                  <span>
                    {m.name}: {m.value}g
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WeightCard />
      </div>
    </div>
  );
}
