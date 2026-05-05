"use client";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Food } from "@/lib/api";

interface FoodSearchResultProps {
  food: Food;
  onAdd: (food: Food) => void;
}

export function FoodSearchResult({ food, onAdd }: FoodSearchResultProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {food.name}
          </h3>
          {food.brand && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {food.brand}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Per 100g
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {Math.round(food.per100g.calories)} kcal
          </span>
          <span className="text-blue-600 font-medium">P: {Math.round(food.per100g.protein)}g</span>
          <span className="text-orange-500 font-medium">C: {Math.round(food.per100g.carbs)}g</span>
          <span className="text-yellow-600 font-medium">F: {Math.round(food.per100g.fat)}g</span>
        </div>
      </div>
      <Button
        size="icon"
        className="ml-4 shrink-0 bg-primary-500 hover:bg-primary-600 text-white rounded-full h-9 w-9"
        onClick={() => onAdd(food)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add {food.name}</span>
      </Button>
    </div>
  );
}
