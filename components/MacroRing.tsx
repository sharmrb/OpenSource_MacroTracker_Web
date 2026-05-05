"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface MacroRingProps {
  consumed: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function MacroRing({
  consumed,
  goal,
  size = 180,
  strokeWidth = 14,
  className,
}: MacroRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, goal > 0 ? consumed / goal : 0);
  const offset = circumference - pct * circumference;
  const remaining = Math.max(0, goal - consumed);
  const overGoal = consumed > goal;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={overGoal ? "#ef4444" : "#22c55e"}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round(consumed)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">kcal</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            / {goal}
          </span>
        </div>
      </div>
      <div className="text-center">
        {overGoal ? (
          <p className="text-sm font-medium text-red-500">
            {Math.round(consumed - goal)} kcal over goal
          </p>
        ) : (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {Math.round(remaining)} kcal remaining
          </p>
        )}
      </div>
    </div>
  );
}
