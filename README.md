# MacroFree - Open Source Macro Tracker

A free, open-source macro and nutrition tracker built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- Track daily calorie and macro intake (protein, carbs, fat)
- Search a community food database
- Barcode scanning via device camera
- Daily dashboard with visual progress rings and bars
- Weekly/monthly history charts
- Custom daily macro goal settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack React Query
- **Client State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repo and navigate to the web directory:
   ```bash
   cd OpenSource_MacroTracker_Web
   ```

2. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Edit `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend URL (defaults to `http://localhost:3001`).

4. Install dependencies:
   ```bash
   npm install
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  (auth)/
    login/       - Login page
    register/    - Register page
  dashboard/     - Main dashboard
  log/           - Food logging / search
  history/       - Past log history with charts
  foods/         - Community food database
  profile/       - User profile and goals
  layout.tsx     - Root layout
  page.tsx       - Landing page
components/
  ui/            - shadcn/ui base components
  MacroRing.tsx  - Circular calorie progress
  MacroBar.tsx   - Horizontal macro progress bars
  FoodSearchResult.tsx
  MealSection.tsx
  DailyChart.tsx
  NavBar.tsx
  SideBar.tsx
  BottomNav.tsx
lib/
  api.ts         - Typed API fetch helpers
  auth.ts        - Auth utilities
  mock-data.ts   - Mock/placeholder data
  utils.ts       - Utility functions
store/
  useAuthStore.ts
  useLogStore.ts
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` |

## Contributing

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

## License

MIT
