const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─── Frontend types (what the UI uses) ───────────────────────────────────────

export interface User {
  id: string;
  name: string;    // maps from backend "username"
  email: string;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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
  source?: string;
  verified?: boolean;
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

export interface Profile {
  user: User;
  goals: MacroGoals;
  streak?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Backend wire types (what the API actually returns) ───────────────────────

interface BackendFood {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100mg?: number;
  source?: string;
  verified?: boolean;
}

interface BackendUser {
  id: string;
  email: string;
  username: string;
}

interface BackendLogRow {
  id: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  serving_g: number;
  logged_at: string;
  food_id: string;
  name: string;
  brand?: string;
  calories: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

function adaptFood(b: BackendFood): Food {
  return {
    id: b.id,
    name: b.name,
    brand: b.brand,
    barcode: b.barcode,
    per100g: {
      calories: Number(b.calories_per_100g),
      protein: Number(b.protein_per_100g),
      carbs: Number(b.carbs_per_100g),
      fat: Number(b.fat_per_100g),
      fiber: b.fiber_per_100g != null ? Number(b.fiber_per_100g) : undefined,
      sugar: b.sugar_per_100g != null ? Number(b.sugar_per_100g) : undefined,
      sodium: b.sodium_per_100mg != null ? Number(b.sodium_per_100mg) : undefined,
    },
    servingSize: 100,
    servingUnit: "g",
    source: b.source,
    verified: b.verified,
  };
}

function adaptUser(b: BackendUser): User {
  return { id: b.id, email: b.email, name: b.username };
}

function adaptLogRow(row: BackendLogRow): LogEntry {
  const servingG = Number(row.serving_g);
  const ratio = servingG / 100;
  // Build a minimal Food stub for display — real macros come from the row
  const food: Food = {
    id: row.food_id,
    name: row.name,
    brand: row.brand,
    per100g: {
      calories: Number(row.calories) / ratio,
      protein: Number(row.protein_g) / ratio,
      carbs: Number(row.carbs_g) / ratio,
      fat: Number(row.fat_g) / ratio,
    },
    servingSize: servingG,
    servingUnit: "g",
  };

  return {
    id: row.id,
    foodId: row.food_id,
    food,
    meal: row.meal_type,
    servings: 1,
    servingSize: servingG,
    date: row.logged_at.slice(0, 10),
    macros: {
      calories: Number(row.calories),
      protein: Number(row.protein_g),
      carbs: Number(row.carbs_g),
      fat: Number(row.fat_g),
    },
  };
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("mf_token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new ApiError(res.status, body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const data = await apiFetch<{ token: string; user: BackendUser }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    return { token: data.token, user: adaptUser(data.user) };
  },

  // name is used as the username on the backend
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const username = name.toLowerCase().replace(/\s+/g, "_");
    const data = await apiFetch<{ token: string; user: BackendUser }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
      }
    );
    return { token: data.token, user: adaptUser(data.user) };
  },

  me: async (): Promise<User> => {
    const data = await apiFetch<BackendUser>("/auth/me");
    return adaptUser(data);
  },
};

// ─── Foods API ────────────────────────────────────────────────────────────────

export const foodsApi = {
  search: async (q: string): Promise<{ local: Food[]; external: Food[] }> => {
    const data = await apiFetch<{
      foods: BackendFood[];
      external: BackendFood[];
    }>(`/foods/search?q=${encodeURIComponent(q)}`);
    return {
      local: (data.foods || []).map(adaptFood),
      external: (data.external || []).map(adaptFood),
    };
  },

  getByBarcode: async (barcode: string): Promise<Food> => {
    const data = await apiFetch<{ food: BackendFood }>(
      `/foods/barcode/${barcode}`
    );
    return adaptFood(data.food);
  },

  contribute: async (food: {
    name: string;
    brand?: string;
    barcode?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g?: number;
  }): Promise<Food> => {
    const data = await apiFetch<{ food: BackendFood }>("/foods/contribute", {
      method: "POST",
      body: JSON.stringify(food),
    });
    return adaptFood(data.food);
  },
};

// ─── Logs API ─────────────────────────────────────────────────────────────────

export const logsApi = {
  getByDate: async (date: string): Promise<DailyLog> => {
    const data = await apiFetch<{
      date: string;
      meals: Record<string, BackendLogRow[]>;
      totals: {
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
      };
    }>(`/logs?date=${date}`);

    const entries: LogEntry[] = Object.values(data.meals)
      .flat()
      .map(adaptLogRow);

    return {
      date: data.date,
      entries,
      totals: {
        calories: Number(data.totals.calories),
        protein: Number(data.totals.protein_g),
        carbs: Number(data.totals.carbs_g),
        fat: Number(data.totals.fat_g),
      },
    };
  },

  add: async (entry: {
    food_id: string;
    meal_type: LogEntry["meal"];
    serving_g: number;
    logged_at?: string; // ISO date string, defaults to now
  }): Promise<void> => {
    await apiFetch("/logs", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch(`/logs/${id}`, { method: "DELETE" });
  },

  getHistory: async (days = 7): Promise<WeeklySummary> => {
    const data = await apiFetch<{
      history: {
        date: string;
        total_calories: string;
        total_protein_g: string;
        total_carbs_g: string;
        total_fat_g: string;
      }[];
    }>(`/logs/history?days=${days}`);

    return {
      week: data.history.map((h) => ({
        date: h.date,
        calories: Number(h.total_calories),
        protein: Number(h.total_protein_g),
        carbs: Number(h.total_carbs_g),
        fat: Number(h.total_fat_g),
      })),
    };
  },
};

// ─── Export API ──────────────────────────────────────────────────────────────

export const exportApi = {
  downloadCsv: async (): Promise<void> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("mf_token") : null;
    const res = await fetch(`${BASE_URL}/logs/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new ApiError(res.status, "Export failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `macrofree-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

// ─── Profile API ──────────────────────────────────────────────────────────────

export const profileApi = {
  get: async (): Promise<Profile> => {
    const data = await apiFetch<{
      profile: BackendUser & {
        calories: number;
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        streak?: number;
      };
    }>("/profile");
    const p = data.profile;
    return {
      user: adaptUser(p),
      goals: {
        calories: Number(p.calories),
        protein: Number(p.protein_g),
        carbs: Number(p.carbs_g),
        fat: Number(p.fat_g),
      },
      streak: p.streak ?? 0,
    };
  },

  updateGoals: async (goals: MacroGoals): Promise<void> => {
    await apiFetch("/profile/goals", {
      method: "PUT",
      body: JSON.stringify({
        calories: goals.calories,
        protein_g: goals.protein,
        carbs_g: goals.carbs,
        fat_g: goals.fat,
      }),
    });
  },
};
