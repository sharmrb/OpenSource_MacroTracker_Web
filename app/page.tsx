import Link from "next/link";
import {
  Leaf,
  BarChart3,
  Search,
  Camera,
  CheckCircle,
  Github,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Visual Macro Dashboard",
    description:
      "See your calories, protein, carbs, and fat at a glance with beautiful progress rings and bars.",
  },
  {
    icon: Search,
    title: "Extensive Food Database",
    description:
      "Search thousands of foods and add your own to the community database.",
  },
  {
    icon: Camera,
    title: "Barcode Scanner",
    description:
      "Instantly log packaged foods by scanning their barcode with your phone camera.",
  },
  {
    icon: BarChart3,
    title: "History & Trends",
    description:
      "Review weekly and monthly charts to spot patterns and stay on track.",
  },
];

const benefits = [
  "Completely free — no premium tier",
  "Open source under MIT license",
  "No ads, no data selling",
  "Works on mobile and desktop",
  "Set custom macro goals",
  "Community food contributions",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">
              Macro<span className="text-primary-500">Free</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Badge className="mb-6 bg-primary-100 text-primary-700 border-primary-200 hover:bg-primary-100">
            100% Free & Open Source
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            Track your macros.
            <br />
            <span className="text-primary-500">Hit your goals.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            MacroFree is a completely free, open-source nutrition tracker. Log
            meals, scan barcodes, and visualize your daily macro intake — with
            no hidden fees, ever.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/auth/register">
                Start tracking free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link href="/dashboard">View demo dashboard</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. Always free.
          </p>
        </div>

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary-100 opacity-40 blur-3xl dark:opacity-10" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-100 opacity-40 blur-3xl dark:opacity-10" />
      </section>

      {/* Mock dashboard preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden dark:border-gray-700 dark:bg-gray-800">
            {/* Fake dashboard header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-4 text-gray-400 text-sm">MacroFree Dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Calories", value: "1,450", goal: "2,000", pct: 73, color: "bg-primary-500" },
                { label: "Protein", value: "102g", goal: "150g", pct: 68, color: "bg-blue-500" },
                { label: "Carbs", value: "168g", goal: "225g", pct: 75, color: "bg-orange-400" },
                { label: "Fat", value: "41g", goal: "67g", pct: 61, color: "bg-yellow-400" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {m.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {m.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">/ {m.goal}</p>
                  <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className={`h-full rounded-full ${m.color}`}
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to track nutrition
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              No bloat, just the features that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-gray-200 dark:border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/20 mb-4">
                    <f.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Why MacroFree?
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Most nutrition apps lock features behind paywalls or sell your
                data. MacroFree is different — it&apos;s open source and built
                for the community.
              </p>
              <ul className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-gray-900 p-8 text-center">
              <Github className="h-16 w-16 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Open Source</h3>
              <p className="text-gray-400 text-sm mb-6">
                Inspect the code, contribute, or self-host. Licensed under MIT.
              </p>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-500">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Start tracking your macros today
          </h2>
          <p className="mt-4 text-primary-100">
            Free forever. No credit card. No nonsense.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 text-base px-8"
              asChild
            >
              <Link href="/auth/register">Create free account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-primary-600 text-base px-8"
              asChild
            >
              <Link href="/dashboard">Try demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              MacroFree
            </span>
            <span className="text-gray-400 text-sm">MIT License</span>
          </div>
          <p className="text-sm text-gray-500">
            Built with Next.js, Tailwind CSS, and open-source love.
          </p>
        </div>
      </footer>
    </div>
  );
}
