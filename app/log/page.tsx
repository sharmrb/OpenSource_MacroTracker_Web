"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Wifi,
  WifiOff,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { FoodSearchResult } from "@/components/FoodSearchResult";
import { useLogStore } from "@/store/useLogStore";
import { useAuthStore } from "@/store/useAuthStore";
import { foodsApi, logsApi } from "@/lib/api";
import { mockFoods } from "@/lib/mock-data";
import type { Food, LogEntry } from "@/lib/api";

const addFoodSchema = z.object({
  meal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  servingSize: z.string().min(1, "Required"),
});
type AddFoodForm = z.infer<typeof addFoodSchema>;

function formatDate(dateStr: string): string {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function LogPage() {
  const { addEntry } = useLogStore();
  const { isAuthenticated } = useAuthStore();

  const today = new Date().toISOString().split("T")[0];
  const [logDate, setLogDate] = useState(today);

  const shiftDate = (delta: number) => {
    const d = new Date(logDate + "T00:00:00");
    d.setDate(d.getDate() + delta);
    const newDate = d.toISOString().split("T")[0];
    if (newDate <= today) setLogDate(newDate);
  };

  const [query, setQuery] = useState("");
  const [localResults, setLocalResults] = useState<Food[]>([]);
  const [externalResults, setExternalResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [barcodeSearching, setBarcodeSearching] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Debounce ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<AddFoodForm>({
      resolver: zodResolver(addFoodSchema),
      defaultValues: { meal: "breakfast", servingSize: "100" },
    });

  const meal = watch("meal");
  const servingSize = watch("servingSize");

  // Check backend on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/health`)
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  // Debounced search — fires 400ms after user stops typing; requires 2+ chars
  useEffect(() => {
    if (query.trim().length < 2) {
      setLocalResults([]);
      setExternalResults([]);
      setHasSearched(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runSearch(query); }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const runSearch = useCallback(async (q: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const { local, external } = await foodsApi.search(q);
      setLocalResults(local);
      setExternalResults(external);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
      // Fall back to mock data
      const lower = q.toLowerCase();
      const mocked = mockFoods.filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          f.brand?.toLowerCase().includes(lower)
      );
      setLocalResults(mocked);
      setExternalResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const openAddDialog = (food: Food) => {
    setSelectedFood(food);
    reset({ meal, servingSize: String(food.servingSize || 100) });
    setAddSuccess(false);
  };

  const onAddFood = async (data: AddFoodForm) => {
    if (!selectedFood) return;
    setIsAdding(true);
    const servingSizeNum = parseFloat(data.servingSize) || 100;
    const ratio = servingSizeNum / 100;

    const entry: LogEntry = {
      id: `log_${Date.now()}`,
      foodId: selectedFood.id,
      food: selectedFood,
      meal: data.meal,
      servings: 1,
      servingSize: servingSizeNum,
      date: logDate,
      macros: {
        calories: selectedFood.per100g.calories * ratio,
        protein: selectedFood.per100g.protein * ratio,
        carbs: selectedFood.per100g.carbs * ratio,
        fat: selectedFood.per100g.fat * ratio,
      },
    };

    // Optimistically update local store
    addEntry(entry);

    // Persist to backend if authenticated and online
    if (isAuthenticated && backendOnline) {
      try {
        await logsApi.add({
          food_id: selectedFood.id,
          meal_type: data.meal,
          serving_g: servingSizeNum,
          logged_at: logDate,
        });
      } catch {
        // Entry is already in local store — backend sync will happen next time
      }
    }

    setIsAdding(false);
    setAddSuccess(true);
    setTimeout(() => {
      setSelectedFood(null);
      setAddSuccess(false);
    }, 1400);
  };

  const startScanner = async () => {
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Camera access denied or unavailable on this device.");
      setShowScanner(false);
    }
  };

  const stopScanner = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setShowScanner(false);
    setBarcodeValue("");
  };

  const handleBarcodeSearch = async () => {
    if (!barcodeValue.trim()) return;
    setBarcodeSearching(true);
    try {
      const food = await foodsApi.getByBarcode(barcodeValue.trim());
      setLocalResults([food]);
      setExternalResults([]);
      setHasSearched(true);
      stopScanner();
    } catch {
      // Try mock fallback
      const found = mockFoods.find((f) => f.barcode === barcodeValue.trim());
      if (found) {
        setLocalResults([found]);
        setHasSearched(true);
      } else {
        alert(`Barcode "${barcodeValue}" not found. Try contributing it!`);
      }
      stopScanner();
    } finally {
      setBarcodeSearching(false);
    }
  };

  const allResults = [...localResults, ...externalResults];
  const totalResults = allResults.length;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Log Food</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Search any food — USDA first, then Open Food Facts and the community.
            </p>
          </div>
          {backendOnline !== null && (
            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
              backendOnline
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            }`}>
              {backendOnline ? (
                <><Wifi className="h-3 w-3" /> Live</>
              ) : (
                <><WifiOff className="h-3 w-3" /> Demo mode</>
              )}
            </div>
          )}
        </div>

        {/* Date navigator */}
        <div className="flex items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2 border border-gray-100 dark:border-gray-700">
          <button
            onClick={() => shiftDate(-1)}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
            <CalendarDays className="h-4 w-4 text-green-500" />
            {formatDate(logDate)}
          </div>
          <button
            onClick={() => shiftDate(1)}
            disabled={logDate >= today}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Meal selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-500 shrink-0">Add to:</span>
          <div className="flex gap-2 flex-wrap">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setValue("meal", m)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  meal === m
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search foods — e.g. chicken breast, oats, banana..."
              className="pl-9 pr-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => { setQuery(""); setLocalResults([]); setExternalResults([]); setHasSearched(false); }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" size="icon" onClick={startScanner} title="Scan barcode">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {/* Searching indicator */}
        {isSearching && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching USDA, Open Food Facts &amp; community database...
          </div>
        )}

        {/* Results */}
        {!isSearching && totalResults > 0 && (
          <div className="space-y-4">
            {/* Local / community results */}
            {localResults.length > 0 && (
              <div>
                {externalResults.length > 0 && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    Community database
                  </p>
                )}
                <div className="space-y-2">
                  {localResults.map((food) => (
                    <FoodSearchResult key={food.id} food={food} onAdd={openAddDialog} />
                  ))}
                </div>
              </div>
            )}

            {/* External results (OFF + USDA) */}
            {externalResults.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    USDA &amp; Open Food Facts
                  </p>
                  <Badge variant="outline" className="text-[10px] py-0">
                    {externalResults.length} results
                  </Badge>
                </div>
                <div className="space-y-2">
                  {externalResults.slice(0, 10).map((food, i) => (
                    <FoodSearchResult key={`ext-${i}`} food={food} onAdd={openAddDialog} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No results */}
        {!isSearching && hasSearched && totalResults === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-gray-600 dark:text-gray-300">
              No results for &quot;{query}&quot;
            </p>
            <p className="text-sm mt-1">
              Can&apos;t find it?{" "}
              <a href="/foods" className="text-green-600 hover:underline">
                Contribute this food
              </a>{" "}
              and help the community.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isSearching && !hasSearched && (
          <Card className="border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
            <CardContent className="py-12 text-center text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-600 dark:text-gray-300">
                Start typing to search
              </p>
              <p className="text-sm mt-1">
                Type at least 2 characters — results update as you type
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add food dialog */}
      <Dialog open={!!selectedFood} onOpenChange={(o) => !o && setSelectedFood(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add to {meal}</DialogTitle>
            <DialogDescription>
              {selectedFood?.name}
              {selectedFood?.brand ? ` · ${selectedFood.brand}` : ""}
            </DialogDescription>
          </DialogHeader>

          {addSuccess ? (
            <div className="flex flex-col items-center py-6 gap-3">
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Added to {meal}!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onAddFood)} className="space-y-4">
              {/* Live macro preview */}
              {selectedFood && (
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "kcal", value: Math.round(selectedFood.per100g.calories * (parseFloat(servingSize || "100") / 100)), color: "text-gray-800 dark:text-white" },
                    { label: "protein", value: `${Math.round(selectedFood.per100g.protein * (parseFloat(servingSize || "100") / 100))}g`, color: "text-blue-600" },
                    { label: "carbs", value: `${Math.round(selectedFood.per100g.carbs * (parseFloat(servingSize || "100") / 100))}g`, color: "text-orange-500" },
                    { label: "fat", value: `${Math.round(selectedFood.per100g.fat * (parseFloat(servingSize || "100") / 100))}g`, color: "text-yellow-600" },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-xs text-gray-400">{m.label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Serving size (g)</Label>
                <Input type="number" min={1} max={2000} {...register("servingSize")} />
                {errors.servingSize && (
                  <p className="text-xs text-red-500">{errors.servingSize.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Meal</Label>
                <Select value={meal} onValueChange={(v) => setValue("meal", v as AddFoodForm["meal"])}>
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

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isAdding}>
                {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to log"}
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
              <ScanLine className="h-5 w-5 text-green-500" />
              Scan Barcode
            </DialogTitle>
            <DialogDescription>
              Point your camera at a product barcode.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Scanner overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-52 h-24">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-400 rounded-tl" />
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-400 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-400 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-400 rounded-br" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-green-400 opacity-60 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Or enter barcode manually</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. 0123456789012"
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                />
                <Button onClick={handleBarcodeSearch} disabled={!barcodeValue || barcodeSearching}>
                  {barcodeSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
