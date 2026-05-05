import type { Food, LogEntry, DailyLog, WeeklySummary, Profile } from "./api";

export const mockFoods: Food[] = [
  {
    id: "1",
    name: "Chicken Breast (Grilled)",
    brand: "Generic",
    per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sodium: 74 },
    servingSize: 100,
    servingUnit: "g",
  },
  {
    id: "2",
    name: "Brown Rice (Cooked)",
    brand: "Generic",
    per100g: { calories: 123, protein: 2.7, carbs: 26, fat: 0.9, fiber: 1.8 },
    servingSize: 100,
    servingUnit: "g",
  },
  {
    id: "3",
    name: "Greek Yogurt (Plain, Non-fat)",
    brand: "Chobani",
    per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4, sugar: 3.2 },
    servingSize: 170,
    servingUnit: "g",
  },
  {
    id: "4",
    name: "Whole Egg",
    brand: "Generic",
    per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11, cholesterol: 373 } as Food["per100g"],
    servingSize: 50,
    servingUnit: "g",
  },
  {
    id: "5",
    name: "Oats (Rolled, Dry)",
    brand: "Quaker",
    per100g: { calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 10 },
    servingSize: 40,
    servingUnit: "g",
  },
  {
    id: "6",
    name: "Banana",
    brand: "Generic",
    per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
    servingSize: 120,
    servingUnit: "g",
  },
  {
    id: "7",
    name: "Almonds (Raw)",
    brand: "Generic",
    per100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 },
    servingSize: 28,
    servingUnit: "g",
  },
  {
    id: "8",
    name: "Salmon (Atlantic, Farmed)",
    brand: "Generic",
    per100g: { calories: 208, protein: 20, carbs: 0, fat: 13, sodium: 59 },
    servingSize: 140,
    servingUnit: "g",
  },
  {
    id: "9",
    name: "Sweet Potato",
    brand: "Generic",
    per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, sugar: 4.2 },
    servingSize: 130,
    servingUnit: "g",
  },
  {
    id: "10",
    name: "Whey Protein Powder",
    brand: "Optimum Nutrition",
    per100g: { calories: 400, protein: 80, carbs: 10, fat: 6 },
    servingSize: 30,
    servingUnit: "g",
  },
];

export const mockLogEntries: LogEntry[] = [
  {
    id: "log1",
    foodId: "5",
    food: mockFoods[4],
    meal: "breakfast",
    servings: 1,
    servingSize: 80,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 311, protein: 13.6, carbs: 52.8, fat: 5.6 },
  },
  {
    id: "log2",
    foodId: "4",
    food: mockFoods[3],
    meal: "breakfast",
    servings: 2,
    servingSize: 50,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  },
  {
    id: "log3",
    foodId: "6",
    food: mockFoods[5],
    meal: "breakfast",
    servings: 1,
    servingSize: 120,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 107, protein: 1.3, carbs: 27.6, fat: 0.4 },
  },
  {
    id: "log4",
    foodId: "1",
    food: mockFoods[0],
    meal: "lunch",
    servings: 1,
    servingSize: 200,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 330, protein: 62, carbs: 0, fat: 7.2 },
  },
  {
    id: "log5",
    foodId: "2",
    food: mockFoods[1],
    meal: "lunch",
    servings: 1,
    servingSize: 150,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 185, protein: 4.1, carbs: 39, fat: 1.4 },
  },
  {
    id: "log6",
    foodId: "7",
    food: mockFoods[6],
    meal: "snack",
    servings: 1,
    servingSize: 28,
    date: new Date().toISOString().split("T")[0],
    macros: { calories: 162, protein: 5.9, carbs: 6.1, fat: 14 },
  },
];

export const mockDailyLog: DailyLog = {
  date: new Date().toISOString().split("T")[0],
  entries: mockLogEntries,
  totals: {
    calories: mockLogEntries.reduce((s, e) => s + e.macros.calories, 0),
    protein: mockLogEntries.reduce((s, e) => s + e.macros.protein, 0),
    carbs: mockLogEntries.reduce((s, e) => s + e.macros.carbs, 0),
    fat: mockLogEntries.reduce((s, e) => s + e.macros.fat, 0),
  },
};

export const mockWeekly: WeeklySummary = {
  week: Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split("T")[0],
      calories: 1400 + Math.round(Math.random() * 600),
      protein: 120 + Math.round(Math.random() * 60),
      carbs: 180 + Math.round(Math.random() * 80),
      fat: 50 + Math.round(Math.random() * 30),
    };
  }),
};

export const mockProfile: Profile = {
  user: {
    id: "u1",
    name: "Alex Johnson",
    email: "alex@example.com",
  },
  goals: {
    calories: 2000,
    protein: 150,
    carbs: 225,
    fat: 67,
  },
};
