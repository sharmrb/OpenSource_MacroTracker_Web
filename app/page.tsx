import Link from "next/link";
import {
  Leaf,
  BarChart3,
  Search,
  Camera,
  CheckCircle,
  GitFork,
  ArrowRight,
  Users,
  Database,
  Shield,
  Smartphone,
  Heart,
  Star,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const comparisonData = [
  { feature: "Completely free", macrofree: true, myfitnesspal: false, cronometer: false },
  { feature: "No ads", macrofree: true, myfitnesspal: false, cronometer: false },
  { feature: "Open source (MIT)", macrofree: true, myfitnesspal: false, cronometer: false },
  { feature: "Self-hostable", macrofree: true, myfitnesspal: false, cronometer: false },
  { feature: "Community food database", macrofree: true, myfitnesspal: true, cronometer: true },
  { feature: "Barcode scanning", macrofree: true, myfitnesspal: true, cronometer: true },
  { feature: "iOS app", macrofree: true, myfitnesspal: true, cronometer: true },
  { feature: "No data selling", macrofree: true, myfitnesspal: false, cronometer: false },
];

const features = [
  {
    icon: BarChart3,
    title: "Visual macro dashboard",
    description: "Calorie ring, macro bars, and daily history charts — everything at a glance.",
    color: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600",
  },
  {
    icon: Camera,
    title: "Barcode scanner",
    description: "Point your camera at any product and instantly pull its nutrition data.",
    color: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600",
  },
  {
    icon: Database,
    title: "Open food database",
    description: "3M+ foods from Open Food Facts + USDA. Search, find, log. No paywalls.",
    color: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600",
  },
  {
    icon: Users,
    title: "Community-built",
    description: "Users add missing foods. Every contribution improves the database for everyone.",
    color: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600",
  },
  {
    icon: Smartphone,
    title: "iOS + Web",
    description: "Native iOS app with offline support. Same account, same data, everywhere.",
    color: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-600",
  },
  {
    icon: Shield,
    title: "Your data, your rules",
    description: "No ads, no data selling. Host it yourself if you want. MIT licensed.",
    color: "bg-gray-50 dark:bg-gray-800",
    iconColor: "text-gray-600",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Search or scan",
    description: "Find any food by name or scan its barcode. We pull from Open Food Facts, USDA, and our growing community database.",
  },
  {
    step: "02",
    title: "Log your meal",
    description: "Pick breakfast, lunch, dinner, or snack. Adjust the serving size. Done in under 10 seconds.",
  },
  {
    step: "03",
    title: "See your progress",
    description: "Your dashboard updates live. Calorie ring, macro bars, weekly history — all the context you need.",
  },
  {
    step: "04",
    title: "Contribute back",
    description: "Food not found? Add it. Your addition gets verified and helps every other user who searches for it.",
  },
];

const stats = [
  { label: "Foods in database", value: "3.6M+", sub: "Across 5 data sources" },
  { label: "Countries covered", value: "164+", sub: "Open Food Facts global" },
  { label: "Cost to use", value: "$0", sub: "Now. Forever." },
  { label: "Premium tiers", value: "None", sub: "All features, always free" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Macro<span className="text-green-500">Free</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link>
            <Link href="#compare" className="hover:text-gray-900 dark:hover:text-white transition-colors">Compare</Link>
            <Link href="#open-source" className="hover:text-gray-900 dark:hover:text-white transition-colors">Open Source</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors">
              <GitFork className="h-4 w-4" />
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" asChild>
              <Link href="/auth/register">Get started free →</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-green-100 opacity-50 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-100 opacity-50 blur-3xl dark:opacity-10" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                100% Free & Open Source
              </Badge>
              <Badge variant="outline" className="text-gray-500 border-gray-300 dark:border-gray-700">
                MIT License
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.05]">
              Track macros.<br />
              <span className="text-green-500">Not your wallet.</span>
            </h1>

            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Every macro tracker worth using costs $50–80/year. MacroFree does
              the same thing — and always will — for{" "}
              <span className="font-semibold text-gray-900 dark:text-white">free</span>.
              Open source, community-built, no strings attached.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white text-base px-8 h-12" asChild>
                <Link href="/auth/register">
                  Start tracking free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <Link href="/dashboard">
                  View live demo
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No premium tier
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                iOS app included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Self-hostable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mock dashboard preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-medium text-gray-400 uppercase tracking-widest mb-6">
            What your dashboard looks like
          </p>
          {/* Browser chrome */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4 bg-white dark:bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 dark:border-gray-700">
                macrofree.app/dashboard
              </div>
            </div>
            <div className="p-6">
              {/* Summary row */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Hey, Alex!</p>
                  <p className="text-sm text-gray-500">Sunday, January 12</p>
                </div>
                <div className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                  + Log food
                </div>
              </div>
              {/* Macro cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Calories", value: "1,450", goal: "2,000", pct: 73, color: "bg-green-500" },
                  { label: "Protein", value: "102g", goal: "150g", pct: 68, color: "bg-blue-500" },
                  { label: "Carbs", value: "168g", goal: "225g", pct: 75, color: "bg-orange-400" },
                  { label: "Fat", value: "41g", goal: "67g", pct: 61, color: "bg-yellow-400" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{m.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{m.value}</p>
                    <p className="text-xs text-gray-400 mb-2">/ {m.goal}</p>
                    <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Meal list preview */}
              <div className="space-y-2">
                {[
                  { meal: "Breakfast", icon: "☀️", kcal: "573 kcal", items: "Oats · Eggs · Banana" },
                  { meal: "Lunch", icon: "🌤️", kcal: "515 kcal", items: "Chicken breast · Brown rice" },
                  { meal: "Snack", icon: "🍎", kcal: "162 kcal", items: "Almonds" },
                ].map((m) => (
                  <div key={m.meal} className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-700 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span>{m.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{m.meal}</p>
                        <p className="text-xs text-gray-400">{m.items}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{m.kcal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">{s.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need. Nothing you don't.
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We built what matters and skipped the bloat that other apps use to justify a subscription.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color} mb-4`}>
                    <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Simple by design
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Log a meal in under 10 seconds. Track your contribution to the community.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gray-200 dark:bg-gray-700 -translate-x-4 z-0" />
                )}
                <div className="relative z-10">
                  <div className="text-5xl font-black text-gray-100 dark:text-gray-800 mb-3 select-none">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section id="compare" className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why pay for something free?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              MyFitnessPal Premium is $79.99/year. Cronometer Gold is $49.99/year.
              MacroFree is $0. Forever.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-4 bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-1 text-sm font-medium text-gray-500">Feature</div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="h-5 w-5 rounded bg-green-500 flex items-center justify-center">
                    <Leaf className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-sm">MacroFree</span>
                </div>
                <div className="text-xs text-green-600 font-semibold mt-0.5">Free</div>
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">MyFitnessPal</span>
                <div className="text-xs text-gray-400 mt-0.5">$79.99/yr</div>
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">Cronometer</span>
                <div className="text-xs text-gray-400 mt-0.5">$49.99/yr</div>
              </div>
            </div>

            {/* Rows */}
            {comparisonData.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 px-6 py-3.5 items-center ${
                  i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50/50 dark:bg-gray-900/30"
                }`}
              >
                <div className="text-sm text-gray-700 dark:text-gray-300">{row.feature}</div>
                <div className="flex justify-center">
                  {row.macrofree ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.myfitnesspal ? (
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
                <div className="flex justify-center">
                  {row.cronometer ? (
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source section */}
      <section id="open-source" className="py-24 bg-gray-900 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2 text-sm text-gray-300 mb-6">
                <GitFork className="h-4 w-4 text-green-400" />
                Open source on GitHub
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Built in public.
                <br />
                <span className="text-green-400">Owned by everyone.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                MacroFree is fully open source under the MIT license. Read the
                code, audit our data handling, fork it, or deploy your own
                instance. No black boxes.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Shield, text: "Audit exactly how your data is stored and used" },
                  { icon: GitFork, text: "Fork it and self-host on your own server" },
                  { icon: Heart, text: "Contribute code, foods, or feedback" },
                  { icon: Star, text: "Star the repo to help more people find it" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button className="bg-green-500 hover:bg-green-600 text-white" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <GitFork className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white" asChild>
                  <Link href="/auth/register">
                    Create account
                  </Link>
                </Button>
              </div>
            </div>

            {/* Code snippet */}
            <div className="rounded-2xl bg-gray-800 border border-gray-700 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 ml-2">GET /foods/barcode/:barcode</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto">
                <code className="text-gray-300 font-mono leading-7">
{`// Barcode lookup — open source
// 1. Check local community DB
// 2. Fall back to Open Food Facts
// 3. Cache result for next user

const local = await db.query(
  \`SELECT * FROM foods
   WHERE barcode = $1\`,
  [barcode]
);

if (local.rows[0]) {
  return res.json({ food: local.rows[0] });
}

// Fetch from Open Food Facts (free)
const offFood = await lookupBarcodeOFF(barcode);
// Cache it — helps every future user
await db.query(\`INSERT INTO foods ...\`);`}
                </code>
              </pre>
              <div className="px-6 pb-5">
                <p className="text-xs text-gray-500">
                  Every barcode lookup is cached locally — making the app faster and more independent over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community flywheel section */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Better together
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The database gets better every time someone adds a missing food.
              What starts small becomes comprehensive — because of the community.
            </p>
          </div>

          {/* Flywheel diagram — text-based */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                step: "User searches for a food",
                detail: "We check our local database, Open Food Facts, and USDA simultaneously.",
                color: "border-blue-200 dark:border-blue-800",
                iconBg: "bg-blue-50 dark:bg-blue-900/20",
                iconColor: "text-blue-600",
              },
              {
                icon: Users,
                step: "Missing food? User contributes",
                detail: "Fill in the name, macros, and optionally a barcode. It goes live after community verification.",
                color: "border-purple-200 dark:border-purple-800",
                iconBg: "bg-purple-50 dark:bg-purple-900/20",
                iconColor: "text-purple-600",
              },
              {
                icon: TrendingUp,
                step: "Database grows for everyone",
                detail: "The next person who searches finds it instantly. No duplicate effort, no paywalls.",
                color: "border-green-200 dark:border-green-800",
                iconBg: "bg-green-50 dark:bg-green-900/20",
                iconColor: "text-green-600",
              },
            ].map((item) => (
              <div key={item.step} className={`rounded-2xl border-2 ${item.color} p-6`}>
                <div className={`h-12 w-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.step}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* iOS app section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                Coming to iOS
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Native iOS app — same account, same data
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                The iOS app is being built in parallel with the web app. Native SwiftUI,
                full barcode scanner using your camera, offline support for when you&apos;re
                at the gym. Same backend, same community database.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Native barcode scanning with the camera",
                  "Works offline — syncs when back online",
                  "Widgets for quick calorie glance",
                  "Health app integration (read/write)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <Smartphone className="h-4 w-4" />
                  iOS app in development
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Web app live now
                </div>
              </div>
            </div>

            {/* iOS mockup — text-based phone frame */}
            <div className="flex justify-center">
              <div className="relative w-64">
                <div className="rounded-[2.5rem] border-4 border-gray-900 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-2xl">
                  {/* Status bar */}
                  <div className="bg-gray-900 h-8 flex items-center justify-between px-6">
                    <div className="text-white text-xs">9:41</div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-white opacity-60" />
                      <div className="w-1 h-1 rounded-full bg-white opacity-80" />
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>
                  {/* App content */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Today</p>
                        <p className="text-xs text-gray-500">1,450 / 2,000 kcal</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-lg font-bold leading-none">+</span>
                      </div>
                    </div>
                    {/* Mini ring */}
                    <div className="flex justify-center mb-4">
                      <div className="relative h-20 w-20">
                        <svg className="h-20 w-20 rotate-[-90deg]" viewBox="0 0 80 80">
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          <circle cx="40" cy="40" r="30" fill="none" stroke="#22c55e" strokeWidth="8"
                            strokeDasharray="188.5" strokeDashoffset="50.9" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">73%</span>
                          <span className="text-[10px] text-gray-400">of goal</span>
                        </div>
                      </div>
                    </div>
                    {/* Macro pills */}
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {[
                        { label: "P", val: "102g", color: "bg-blue-100 text-blue-700" },
                        { label: "C", val: "168g", color: "bg-orange-100 text-orange-700" },
                        { label: "F", val: "41g", color: "bg-yellow-100 text-yellow-700" },
                      ].map((m) => (
                        <div key={m.label} className={`${m.color} rounded-lg p-1.5 text-center`}>
                          <p className="text-[10px] font-medium">{m.label}</p>
                          <p className="text-xs font-bold">{m.val}</p>
                        </div>
                      ))}
                    </div>
                    {/* Meal rows */}
                    {["Breakfast · 573 kcal", "Lunch · 515 kcal", "Snack · 162 kcal"].map((m) => (
                      <div key={m} className="bg-white dark:bg-gray-800 rounded-lg px-3 py-2 mb-1.5 text-xs text-gray-600 dark:text-gray-300">
                        {m}
                      </div>
                    ))}
                    {/* Scan button */}
                    <div className="mt-3 bg-green-500 rounded-xl py-2.5 flex items-center justify-center gap-2">
                      <Camera className="h-4 w-4 text-white" />
                      <span className="text-white text-xs font-semibold">Scan barcode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-green-500">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the community
          </h2>
          <p className="text-green-100 text-lg mb-2">
            Every account you create, every food you add, every bug you report —
            it makes MacroFree better for everyone.
          </p>
          <p className="text-green-200 text-sm mb-10">
            Free. Open source. No catch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-green-700 hover:bg-green-50 text-base px-10 h-12 font-semibold"
              asChild
            >
              <Link href="/auth/register">
                Create free account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-300 text-white hover:bg-green-600 text-base px-10 h-12"
              asChild
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <GitFork className="mr-2 h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Data Sources section — add just before the footer */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Trusted data, worldwide coverage
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We pull from multiple authoritative sources so you can find any food — whether it&apos;s a US grocery staple,
              a packaged product from Europe, or a traditional dish from anywhere in the world.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                name: "USDA FoodData Central",
                flag: "🇺🇸",
                badge: "Unlimited",
                badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                description: "600,000+ raw ingredients, branded foods, and recipes from the US Department of Agriculture. Considered the gold standard for nutritional accuracy.",
                link: "https://fdc.nal.usda.gov",
              },
              {
                name: "Open Food Facts",
                flag: "🌍",
                badge: "Unlimited",
                badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                description: "3M+ packaged products from 164 countries. Open-source community database covering foods from Asia, Europe, Africa, South America, and beyond.",
                link: "https://world.openfoodfacts.org",
              },
              {
                name: "Nutritionix",
                flag: "🍽️",
                badge: "Restaurant & branded",
                badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                description: "Extensive database of restaurant menu items and branded foods, including chains from North America, UK, and international markets.",
                link: "https://developer.nutritionix.com",
              },
              {
                name: "Edamam",
                flag: "🥗",
                badge: "Ingredients & recipes",
                badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                description: "Strong coverage of raw ingredients, international dishes, and recipe-based nutrition data. Great for finding generic foods not in other databases.",
                link: "https://developer.edamam.com",
              },
              {
                name: "Community Contributions",
                flag: "👥",
                badge: "User-verified",
                badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                description: "Foods added by MacroFree users. Local dishes, regional staples, and niche products that don't appear in any external database — verified by the community.",
                link: null,
              },
              {
                name: "Barcode Cache",
                flag: "📦",
                badge: "Self-growing",
                badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                description: "Every barcode lookup gets cached in our local database. Over time this makes the app faster and less dependent on external APIs for commonly scanned products.",
                link: null,
              },
            ].map((source) => (
              <div key={source.name} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{source.flag}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{source.name}</h3>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${source.badgeColor}`}>
                    {source.badge}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                  {source.description}
                </p>
                {source.link && (
                  <a href={source.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-green-600 dark:text-green-400 hover:underline">
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">
                  Macro<span className="text-green-500">Free</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                Free, open-source macro tracking for everyone.
                No paywall. No premium. No nonsense.
              </p>
              <p className="text-xs text-gray-400 mt-3">MIT License · v0.1.0</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">App</p>
                <div className="space-y-2 text-gray-500">
                  <div><Link href="/dashboard" className="hover:text-gray-900 dark:hover:text-white transition-colors">Dashboard</Link></div>
                  <div><Link href="/log" className="hover:text-gray-900 dark:hover:text-white transition-colors">Log food</Link></div>
                  <div><Link href="/foods" className="hover:text-gray-900 dark:hover:text-white transition-colors">Food database</Link></div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">Community</p>
                <div className="space-y-2 text-gray-500">
                  <div><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">GitHub</a></div>
                  <div><Link href="/foods" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contribute foods</Link></div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-3">Data sources</p>
                <div className="space-y-2 text-gray-500">
                  <div><a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Open Food Facts</a></div>
                  <div><a href="https://fdc.nal.usda.gov" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">USDA FoodData</a></div>
                  <div><a href="https://developer.nutritionix.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Nutritionix</a></div>
                  <div><a href="https://developer.edamam.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">Edamam</a></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
            Built with Next.js, Tailwind CSS, PostgreSQL, and open-source love.
            No tracking. No ads. No nonsense.
          </div>
        </div>
      </footer>
    </div>
  );
}
