"use client";
import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  Camera,
  X,
  CheckCircle,
  Loader2,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/AppShell";
import { FoodSearchResult } from "@/components/FoodSearchResult";
import { useLogStore } from "@/store/useLogStore";
import { mockFoods } from "@/lib/mock-data";
import type { Food, LogEntry } from "@/lib/api";

const addFoodSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  servingSize: z.coerce.number().min(1, "Serving size must be > 0"),
});

type AddFoodForm = z.infer<typeof addFoodSchema>;

export default function LogPage() {
  const { addEntry } = useLogStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddFoodForm>({
    resolver: zodResolver(addFoodSchema),
    defaultValues: { meal: "breakfast", servingSize: 100 },
  });

  const meal = watch("meal");

  // Client-side search through mock data (falls back to API)
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      // Try real API first
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/foods/search?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        throw new Error("API unavailable");
      }
    } catch {
      // Fallback to mock data
      const q = query.toLowerCase();
      setResults(
        mockFoods.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.brand?.toLowerCase().includes(q)
        )
      );
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const openAddDialog = (food: Food) => {
    setSelectedFood(food);
    reset({ meal: "breakfast", servingSize: food.servingSize || 100 });
    setAddSuccess(false);
  };

  const onAddFood = (data: AddFoodForm) => {
    if (!selectedFood) return;
    const ratio = data.servingSize / 100;
    const entry: LogEntry = {
      id: `log_${Date.now()}`,
      foodId: selectedFood.id,
      food: selectedFood,
      meal: data.meal,
      servings: 1,
      servingSize: data.servingSize,
      date: new Date().toISOString().split("T")[0],
      macros: {
        calories: selectedFood.per100g.calories * ratio,
        protein: selectedFood.per100g.protein * ratio,
        carbs: selectedFood.per100g.carbs * ratio,
        fat: selectedFood.per100g.fat * ratio,
      },
    };
    addEntry(entry);
    setAddSuccess(true);
    setTimeout(() => {
      setSelectedFood(null);
      setAddSuccess(false);
    }, 1500);
  };

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Camera access denied or not available.");
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowScanner(false);
  };

  const handleBarcodeSearch = async () => {
    if (!barcodeValue.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/foods/barcode/${barcodeValue}`
      );
      if (res.ok) {
        const food: Food = await res.json();
        setResults([food]);
        setShowScanner(false);
      } else {
        throw new Error("Not found");
      }
    } catch {
      // Demo fallback
      const found = mockFoods.find((f) => f.barcode === barcodeValue);
      if (found) {
        setResults([found]);
      } else {
        alert(`Barcode ${barcodeValue} not found in database.`);
      }
      setShowScanner(false);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log Food</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Search for a food or scan a barcode to add it to today&apos;s log.
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search foods... e.g. chicken breast, oats"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => { setQuery(""); setResults([]); }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={startScanner} title="Scan barcode">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Meal selector */}
        <div className="flex items-center gap-3 mb-6">
          <Label className="shrink-0 text-sm text-gray-600 dark:text-gray-400">Add to:</Label>
          <div className="flex gap-2 flex-wrap">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setValue("meal", m)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  meal === m
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
            {results.map((food) => (
              <FoodSearchResult key={food.id} food={food} onAdd={openAddDialog} />
            ))}
          </div>
        )}

        {results.length === 0 && !isSearching && query && (
          <div className="text-center py-12 text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No results for &quot;{query}&quot;</p>
            <p className="text-sm mt-1">
              Try a different search or{" "}
              <a href="/foods" className="text-primary-500 hover:underline">
                contribute this food
              </a>
              .
            </p>
          </div>
        )}

        {results.length === 0 && !query && (
          <Card className="border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
            <CardContent className="py-12 text-center text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Search for a food to get started</p>
              <p className="text-sm mt-1">Or scan a barcode using your camera</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add food dialog */}
      <Dialog open={!!selectedFood} onOpenChange={(o) => !o && setSelectedFood(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add to log</DialogTitle>
            <DialogDescription>
              {selectedFood?.name}
              {selectedFood?.brand ? ` · ${selectedFood.brand}` : ""}
            </DialogDescription>
          </DialogHeader>

          {addSuccess ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <CheckCircle className="h-12 w-12 text-primary-500" />
              <p className="font-semibold text-gray-800 dark:text-gray-200">Added!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onAddFood)} className="space-y-4">
              {selectedFood && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-sm grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {Math.round(selectedFood.per100g.calories * (watch("servingSize") / 100))}
                    </p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">
                      {Math.round(selectedFood.per100g.protein * (watch("servingSize") / 100))}g
                    </p>
                    <p className="text-xs text-gray-500">protein</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-500">
                      {Math.round(selectedFood.per100g.carbs * (watch("servingSize") / 100))}g
                    </p>
                    <p className="text-xs text-gray-500">carbs</p>
                  </div>
                  <div>
                    <p className="font-semibold text-yellow-600">
                      {Math.round(selectedFood.per100g.fat * (watch("servingSize") / 100))}g
                    </p>
                    <p className="text-xs text-gray-500">fat</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Serving size (g)</Label>
                <Input
                  type="number"
                  min={1}
                  {...register("servingSize")}
                />
                {errors.servingSize && (
                  <p className="text-xs text-red-500">{errors.servingSize.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Meal</Label>
                <Select
                  value={meal}
                  onValueChange={(v) => setValue("meal", v as AddFoodForm["meal"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Add to log
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={(o) => !o && stopScanner()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-primary-500" />
              Barcode Scanner
            </DialogTitle>
            <DialogDescription>
              Point your camera at a barcode to scan it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-24 border-2 border-primary-400 rounded-lg opacity-70" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Or enter barcode manually</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. 0123456789012"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                />
                <Button onClick={handleBarcodeSearch} disabled={!barcodeValue}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
