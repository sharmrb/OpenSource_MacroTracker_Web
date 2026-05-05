"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UserCircle,
  Settings,
  LogOut,
  CheckCircle,
  Loader2,
  Info,
  GitFork,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AppShell } from "@/components/AppShell";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogStore } from "@/store/useLogStore";
import { profileApi, exportApi } from "@/lib/api";

const goalsSchema = z.object({
  calories: z.number().min(500, "Min 500 kcal").max(10000, "Max 10,000 kcal"),
  protein: z.number().min(0).max(500),
  carbs: z.number().min(0).max(1000),
  fat: z.number().min(0).max(500),
});
type GoalsForm = z.infer<typeof goalsSchema>;

const presets = [
  { label: "Cut", sub: "1600 kcal", values: { calories: 1600, protein: 160, carbs: 130, fat: 50 } },
  { label: "Maintain", sub: "2000 kcal", values: { calories: 2000, protein: 150, carbs: 225, fat: 67 } },
  { label: "Bulk", sub: "2500 kcal", values: { calories: 2500, protein: 180, carbs: 300, fat: 80 } },
];

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { goals, setGoals } = useLogStore();
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalsForm>({
    resolver: zodResolver(goalsSchema),
    defaultValues: goals,
  });

  // Load goals from backend on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    setSyncing(true);
    profileApi
      .get()
      .then((p) => {
        setGoals(p.goals);
        reset(p.goals);
      })
      .catch(() => { /* offline — use local goals */ })
      .finally(() => setSyncing(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const watchedValues = watch();
  const macroCalories =
    (Number(watchedValues.protein) || 0) * 4 +
    (Number(watchedValues.carbs) || 0) * 4 +
    (Number(watchedValues.fat) || 0) * 9;

  const onExport = async () => {
    setExporting(true);
    try {
      await exportApi.downloadCsv();
    } catch { /* offline or no data */ }
    finally { setExporting(false); }
  };

  const onSaveGoals = async (data: GoalsForm) => {
    setGoals(data);
    if (isAuthenticated) {
      try {
        await profileApi.updateGoals(data);
      } catch { /* offline — goals saved locally */ }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UserCircle className="h-6 w-6 text-green-500" />
              Profile
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Manage your account and daily macro goals.
            </p>
          </div>
          {syncing && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Syncing...
            </div>
          )}
        </div>

        {/* User card */}
        <Card className="mb-6 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xl font-bold">
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.name || "Demo User"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {user?.email || "demo@macrofree.app"}
                </p>
                {!isAuthenticated && (
                  <span className="inline-block mt-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    Demo mode — goals saved locally
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Goals form */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-500" />
              Daily Macro Goals
            </CardTitle>
            <CardDescription>
              Your daily targets. Used for progress bars on the dashboard.
              {isAuthenticated && " Synced to your account."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSaveGoals)} className="space-y-5">
              {/* Calorie goal */}
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calorie Goal (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  min={500}
                  max={10000}
                  {...register("calories", { valueAsNumber: true })}
                />
                {errors.calories && <p className="text-xs text-red-500">{errors.calories.message}</p>}
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein" className="text-blue-600">Protein (g)</Label>
                  <Input id="protein" type="number" min={0} {...register("protein", { valueAsNumber: true })} />
                  {errors.protein && <p className="text-xs text-red-500">{errors.protein.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs" className="text-orange-500">Carbs (g)</Label>
                  <Input id="carbs" type="number" min={0} {...register("carbs", { valueAsNumber: true })} />
                  {errors.carbs && <p className="text-xs text-red-500">{errors.carbs.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat" className="text-yellow-600">Fat (g)</Label>
                  <Input id="fat" type="number" min={0} {...register("fat", { valueAsNumber: true })} />
                  {errors.fat && <p className="text-xs text-red-500">{errors.fat.message}</p>}
                </div>
              </div>

              {/* Macro calorie breakdown hint */}
              {macroCalories > 0 && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-3 flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-medium">Your macros sum to {macroCalories} kcal</span>
                    {Math.abs(macroCalories - (Number(watchedValues.calories) || 0)) > 50 && (
                      <span className="ml-1 text-blue-500">
                        (goal is {Number(watchedValues.calories)} kcal)
                      </span>
                    )}
                    <div className="mt-0.5 text-xs text-blue-500">
                      Protein: {(Number(watchedValues.protein) || 0) * 4} ·{" "}
                      Carbs: {(Number(watchedValues.carbs) || 0) * 4} ·{" "}
                      Fat: {(Number(watchedValues.fat) || 0) * 9} kcal
                    </div>
                  </div>
                </div>
              )}

              {/* Quick presets */}
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Quick presets</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setGoals(preset.values);
                        reset(preset.values);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {preset.label}
                      <span className="ml-1 text-gray-400">{preset.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                ) : saved ? (
                  <><CheckCircle className="mr-2 h-4 w-4" />Saved!</>
                ) : "Save goals"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Export data card */}
        {isAuthenticated && (
          <Card className="mt-4 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
                  <Download className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Export your data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Download all your food logs as a CSV file</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  disabled={exporting}
                  className="shrink-0"
                >
                  {exporting ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />Exporting...</>
                  ) : (
                    <><Download className="h-3.5 w-3.5 mr-1" />Export CSV</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Open source card */}
        <Card className="mt-4 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                <GitFork className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">MacroFree is open source</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">MIT licensed · v0.1.0 · Free forever</p>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline shrink-0"
              >
                View on GitHub →
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
