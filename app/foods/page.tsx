"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Database, Plus, Search, CheckCircle, Loader2, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { foodsApi } from "@/lib/api";
import { mockFoods } from "@/lib/mock-data";
import type { Food } from "@/lib/api";

const contributeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  brand: z.string().optional(),
  barcode: z.string().optional(),
  calories: z.string().min(1, "Required"),
  protein: z.string().min(1, "Required"),
  carbs: z.string().min(1, "Required"),
  fat: z.string().min(1, "Required"),
  fiber: z.string().optional(),
  servingSize: z.string().optional(),
});

type ContributeForm = z.infer<typeof contributeSchema>;

export default function FoodsPage() {
  const [query, setQuery] = useState("");
  const [showContribute, setShowContribute] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [foods, setFoods] = useState<Food[]>(mockFoods);
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live search against backend when query changes
  React.useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { local, external } = await foodsApi.search(query);
        setSearchResults([...local, ...external.slice(0, 10)]);
      } catch {
        // Fall back to local filter
        setSearchResults(
          foods.filter(
            (f) =>
              f.name.toLowerCase().includes(query.toLowerCase()) ||
              f.brand?.toLowerCase().includes(query.toLowerCase())
          )
        );
      } finally {
        setIsSearching(false);
      }
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const displayedFoods = query ? searchResults : foods;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContributeForm>({
    resolver: zodResolver(contributeSchema),
    defaultValues: { servingSize: "100" },
  });

  const onContribute = async (data: ContributeForm) => {
    const payload = {
      name: data.name,
      brand: data.brand || undefined,
      barcode: data.barcode || undefined,
      calories_per_100g: parseFloat(data.calories) || 0,
      protein_per_100g: parseFloat(data.protein) || 0,
      carbs_per_100g: parseFloat(data.carbs) || 0,
      fat_per_100g: parseFloat(data.fat) || 0,
      fiber_per_100g: data.fiber ? parseFloat(data.fiber) : undefined,
    };
    try {
      const contributed = await foodsApi.contribute(payload);
      setFoods((prev) => [contributed, ...prev]);
    } catch {
      // Backend offline — add to local list optimistically
      const newFood: Food = {
        id: `user_${Date.now()}`,
        name: payload.name,
        brand: payload.brand,
        barcode: payload.barcode,
        per100g: {
          calories: payload.calories_per_100g,
          protein: payload.protein_per_100g,
          carbs: payload.carbs_per_100g,
          fat: payload.fat_per_100g,
          fiber: payload.fiber_per_100g,
        },
        servingSize: data.servingSize ? parseFloat(data.servingSize) : 100,
        servingUnit: "g",
        source: "user",
        verified: false,
      };
      setFoods((prev) => [newFood, ...prev]);
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowContribute(false);
      reset();
    }, 2000);
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-green-500" />
            Food Database
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {query
              ? `${displayedFoods.length} results for "${query}"`
              : `${foods.length} local foods · Search to query Open Food Facts & USDA`}
          </p>
        </div>
        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setShowContribute(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Contribute
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search Open Food Facts, USDA & community..."
          className="pl-9 pr-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
        )}
        {query && !isSearching && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setQuery("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search hint */}
      {query && searchResults.length > 0 && (
        <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <Globe className="h-3.5 w-3.5" />
          Results from Open Food Facts, USDA, and community database
        </div>
      )}

      {/* Food grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {displayedFoods.map((food) => (
          <Card key={food.id} className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {food.name}
                  </p>
                  {food.brand && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {food.brand}
                    </Badge>
                  )}
                </div>
                {food.barcode && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    {food.barcode}
                  </Badge>
                )}
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {Math.round(food.per100g.calories)}
                  </p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {Math.round(food.per100g.protein)}g
                  </p>
                  <p className="text-xs text-gray-500">prot</p>
                </div>
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-2">
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-300">
                    {Math.round(food.per100g.carbs)}g
                  </p>
                  <p className="text-xs text-gray-500">carbs</p>
                </div>
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-2">
                  <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
                    {Math.round(food.per100g.fat)}g
                  </p>
                  <p className="text-xs text-gray-500">fat</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-400 text-right">
                Per 100g · Serving: {food.servingSize ?? 100}{food.servingUnit ?? "g"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedFoods.length === 0 && !isSearching && query && (
        <div className="text-center py-12 text-gray-400">
          <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No foods found for &quot;{query}&quot;</p>
          <Button
            variant="link"
            className="mt-2 text-primary-600"
            onClick={() => setShowContribute(true)}
          >
            Contribute this food
          </Button>
        </div>
      )}

      {/* Contribute dialog */}
      <Dialog open={showContribute} onOpenChange={setShowContribute}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contribute a Food</DialogTitle>
            <DialogDescription>
              Add a food to the community database. All values per 100g.
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <CheckCircle className="h-12 w-12 text-primary-500" />
              <p className="font-semibold">Thank you for contributing!</p>
              <p className="text-sm text-gray-500">Your food has been added.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onContribute)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Food name *</Label>
                  <Input placeholder="e.g. Brown Rice (Cooked)" {...register("name")} />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input placeholder="Optional" {...register("brand")} />
                </div>

                <div className="space-y-2">
                  <Label>Barcode</Label>
                  <Input placeholder="Optional" {...register("barcode")} />
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-t pt-4">
                Nutritional values per 100g
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calories (kcal) *</Label>
                  <Input type="number" min={0} {...register("calories")} />
                  {errors.calories && <p className="text-xs text-red-500">{errors.calories.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Protein (g) *</Label>
                  <Input type="number" min={0} step="0.1" {...register("protein")} />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (g) *</Label>
                  <Input type="number" min={0} step="0.1" {...register("carbs")} />
                </div>
                <div className="space-y-2">
                  <Label>Fat (g) *</Label>
                  <Input type="number" min={0} step="0.1" {...register("fat")} />
                </div>
                <div className="space-y-2">
                  <Label>Fiber (g)</Label>
                  <Input type="number" min={0} step="0.1" {...register("fiber")} />
                </div>
                <div className="space-y-2">
                  <Label>Typical serving (g)</Label>
                  <Input type="number" min={1} {...register("servingSize")} />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit food"
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
