"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface DayData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailyChartProps {
  data: DayData[];
  goalCalories?: number;
  mode?: "calories" | "macros";
}

function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function DailyChart({ data, goalCalories = 2000, mode = "calories" }: DailyChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    day: formatDay(d.date),
  }));

  if (mode === "macros") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
            formatter={(val: number, name: string) => [`${Math.round(val)}g`, name]}
          />
          <Bar dataKey="protein" name="Protein" fill="#3b82f6" radius={[4, 4, 0, 0]} stackId="macros" />
          <Bar dataKey="carbs" name="Carbs" fill="#f97316" radius={[0, 0, 0, 0]} stackId="macros" />
          <Bar dataKey="fat" name="Fat" fill="#eab308" radius={[4, 4, 0, 0]} stackId="macros" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={[0, Math.max(goalCalories * 1.3, 2500)]} />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "12px",
          }}
          formatter={(val: number) => [`${Math.round(val)} kcal`, "Calories"]}
        />
        <ReferenceLine
          y={goalCalories}
          stroke="#22c55e"
          strokeDasharray="4 4"
          label={{ value: "Goal", position: "right", fontSize: 11, fill: "#22c55e" }}
        />
        <Bar dataKey="calories" name="Calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
