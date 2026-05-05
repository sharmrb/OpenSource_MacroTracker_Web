"use client";
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { LogEntry } from "@/lib/api";

interface MealSectionProps {
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  entries: LogEntry[];
  onRemove?: (id: string) => void;
}

const mealLabels: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

const mealEmojis: Record<string, string> = {
  breakfast: "☀️",
  lunch: "🌤️",
  dinner: "🌙",
  snack: "🍎",
};

export function MealSection({ meal, entries, onRemove }: MealSectionProps) {
  const mealEntries = entries.filter((e) => e.meal === meal);
  const totalCals = mealEntries.reduce((s, e) => s + e.macros.calories, 0);

  if (mealEntries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{mealEmojis[meal]}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {mealLabels[meal]}
            </span>
          </div>
          <span className="text-sm text-gray-400">0 kcal</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 ml-7">
          No foods logged yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">{mealEmojis[meal]}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {mealLabels[meal]}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {Math.round(totalCals)} kcal
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {mealEntries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between px-4 py-3 group">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">
                {entry.food.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {entry.servingSize}g · {Math.round(entry.macros.calories)} kcal ·{" "}
                <span className="text-blue-500">P {Math.round(entry.macros.protein)}g</span>{" "}
                <span className="text-orange-400">C {Math.round(entry.macros.carbs)}g</span>{" "}
                <span className="text-yellow-500">F {Math.round(entry.macros.fat)}g</span>
              </p>
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => onRemove(entry.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
