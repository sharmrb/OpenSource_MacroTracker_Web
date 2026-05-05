const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Profile {
  user: User;
  goals: MacroGoals;
}

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  servingSize?: number;
  servingUnit?: string;
}

export interface LogEntry {
  id: string;
  foodId: string;
  food: Food;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  servingSize: number;
  date: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DailyLog {
  date: string;
  entries: LogEntry[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklySummary {
  week: {
    date: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Helper
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("mf_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
};

// Foods
export const foodsApi = {
  search: (q: string) =>
    apiFetch<Food[]>(`/foods/search?q=${encodeURIComponent(q)}`),

  getByBarcode: (barcode: string) =>
    apiFetch<Food>(`/foods/barcode/${barcode}`),

  contribute: (food: Omit<Food, "id">) =>
    apiFetch<Food>("/foods/contribute", {
      method: "POST",
      body: JSON.stringify(food),
    }),
};

// Logs
export const logsApi = {
  add: (entry: {
    foodId: string;
    meal: LogEntry["meal"];
    servings: number;
    servingSize: number;
    date: string;
  }) =>
    apiFetch<LogEntry>("/logs", {
      method: "POST",
      body: JSON.stringify(entry),
    }),

  getByDate: (date: string) =>
    apiFetch<DailyLog>(`/logs?date=${date}`),

  getHistory: () =>
    apiFetch<WeeklySummary>("/logs/history"),

  delete: (id: string) =>
    apiFetch<void>(`/logs/${id}`, { method: "DELETE" }),
};

// Profile
export const profileApi = {
  get: () => apiFetch<Profile>("/profile"),

  updateGoals: (goals: MacroGoals) =>
    apiFetch<Profile>("/profile/goals", {
      method: "PUT",
      body: JSON.stringify(goals),
    }),
};
