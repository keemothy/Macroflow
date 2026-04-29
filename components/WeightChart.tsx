"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeightChart({
  data,
  isMini = false,
}: {
  data: any[];
  isMini?: boolean;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{ height: isMini ? 80 : 300 }}
        className="w-full bg-slate-50 rounded-xl"
      />
    );
  }

  return (
    <div style={{ width: "100%", height: isMini ? 80 : 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {!isMini && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
          )}
          <XAxis
            dataKey="day_of_week"
            hide={isMini}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={3}
            dot={!isMini}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
