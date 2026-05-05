"use client";
import React from "react";
import { cn, getPercentage } from "@/lib/utils";

interface MacroBarProps {
  label: string;
  consumed: number;
  goal: number;
  unit?: string;
  color?: string;
  className?: string;
}

const colorMap: Record<string, { bar: string; text: string }> = {
  protein: { bar: "bg-blue-500", text: "text-blue-600" },
  carbs: { bar: "bg-orange-400", text: "text-orange-600" },
  fat: { bar: "bg-yellow-400", text: "text-yellow-600" },
  default: { bar: "bg-primary-500", text: "text-primary-600" },
};

export function MacroBar({
  label,
  consumed,
  goal,
  unit = "g",
  color = "default",
  className,
}: MacroBarProps) {
  const pct = getPercentage(consumed, goal);
  const remaining = Math.max(0, goal - consumed);
  const overGoal = consumed > goal;
  const colors = colorMap[color] || colorMap.default;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">
          <span className={cn("font-semibold", colors.text)}>
            {Math.round(consumed)}{unit}
          </span>
          <span className="text-gray-400"> / {goal}{unit}</span>
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colors.bar, overGoal && "bg-red-500")}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {overGoal
          ? `${Math.round(consumed - goal)}${unit} over goal`
          : `${Math.round(remaining)}${unit} remaining`}
      </p>
    </div>
  );
}
