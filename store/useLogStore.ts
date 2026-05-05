"use client";
import { create } from "zustand";
import type { LogEntry, MacroGoals } from "@/lib/api";
import { mockProfile } from "@/lib/mock-data";

interface LogState {
  entries: LogEntry[];
  goals: MacroGoals;
  addEntry: (entry: LogEntry) => void;
  removeEntry: (id: string) => void;
  setDateEntries: (date: string, entries: LogEntry[]) => void;
  setGoals: (goals: MacroGoals) => void;
  getTotals: (date?: string) => { calories: number; protein: number; carbs: number; fat: number };
}

export const useLogStore = create<LogState>((set, get) => ({
  entries: [],
  goals: mockProfile.goals,
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  removeEntry: (id) => set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
  // Replace all entries for a given date (used when syncing from backend)
  setDateEntries: (date, newEntries) =>
    set((s) => ({
      entries: [
        ...s.entries.filter((e) => e.date !== date),
        ...newEntries,
      ],
    })),
  setGoals: (goals) => set({ goals }),
  getTotals: (date) => {
    const entries = date
      ? get().entries.filter((e) => e.date === date)
      : get().entries;
    return {
      calories: entries.reduce((s, e) => s + e.macros.calories, 0),
      protein: entries.reduce((s, e) => s + e.macros.protein, 0),
      carbs: entries.reduce((s, e) => s + e.macros.carbs, 0),
      fat: entries.reduce((s, e) => s + e.macros.fat, 0),
    };
  },
}));
