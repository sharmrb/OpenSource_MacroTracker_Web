"use client";
import React from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Food } from "@/lib/api";

interface FoodSearchResultProps {
  food: Food;
  onAdd: (food: Food) => void;
}

const sourceLabel: Record<string, { label: string; className: string }> = {
  openfoodfacts: { label: "Open Food Facts", className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" },
  usda: { label: "USDA", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
  user: { label: "Community", className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800" },
};

export function FoodSearchResult({ food, onAdd }: FoodSearchResultProps) {
  const src = food.source ? sourceLabel[food.source] : null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {food.name}
          </h3>
          {food.brand && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {food.brand}
            </Badge>
          )}
          {food.verified && (
            <span title="Verified food entry">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-gray-800 dark:text-gray-100">
            {Math.round(food.per100g.calories)} kcal
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            P {Math.round(food.per100g.protein)}g
          </span>
          <span className="text-orange-500 dark:text-orange-400 font-medium">
            C {Math.round(food.per100g.carbs)}g
          </span>
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
            F {Math.round(food.per100g.fat)}g
          </span>
          <span className="text-gray-400">· per 100g</span>
        </div>

        {src && (
          <div className="mt-2">
            <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${src.className}`}>
              {src.label}
            </span>
          </div>
        )}
      </div>

      <Button
        size="icon"
        className="ml-4 shrink-0 bg-green-500 hover:bg-green-600 text-white rounded-full h-9 w-9"
        onClick={() => onAdd(food)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add {food.name}</span>
      </Button>
    </div>
  );
}
