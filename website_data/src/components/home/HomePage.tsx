"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

type HomePageProps = {
  userEmail: string
}

const placeholderItems = [
  { href: "/placeholder-1", label: "Overview" },
  { href: "/placeholder-2", label: "Reports" },
  { href: "/placeholder-3", label: "Team" },
  { href: "/placeholder-4", label: "Settings" },
]

export default function HomePage({ userEmail }: HomePageProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const currentTime = useMemo(() => new Date().toLocaleTimeString(), [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside
          className={`flex flex-col border-r border-slate-800 bg-slate-900/60 transition-all duration-300 ${
            isCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between gap-2 p-4">
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 text-slate-100 transition hover:border-slate-500 hover:text-white"
            >
              <span className="text-xl leading-none">☰</span>
            </button>
            {!isCollapsed && (
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Console
              </span>
            )}
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">
            {placeholderItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-xs font-semibold text-slate-200">
                  {item.label.slice(0, 2).toUpperCase()}
                </span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-800 px-4 py-4">
            {!isCollapsed ? (
              <div className="space-y-1 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">{userEmail}</p>
                <p>Last login: {currentTime}</p>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
                {userEmail.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 px-6 py-8 lg:px-10">
          <header className="flex flex-col gap-2 border-b border-slate-800 pb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              User Home
            </p>
            <h1 className="text-3xl font-semibold text-white">
              Welcome back, {userEmail}
            </h1>
            <p className="max-w-2xl text-sm text-slate-400">
              This is your user-level workspace. API-powered data will live here soon—right now
              you can use the layout to plan dashboards, reports, and alerts.
            </p>
          </header>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            {["Active Projects", "API Status", "Recent Activity"].map((title) => (
              <div
                key={title}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                    Placeholder
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="h-2 w-full rounded-full bg-slate-800">
                    <div className="h-2 w-2/3 rounded-full bg-indigo-500/80" />
                  </div>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>Connect your APIs to replace these metrics.</p>
                    <p>Track trends, alerts, and engagement in real time.</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-200">
                Placeholder canvas for your main content
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Drop in charts, tables, and API-driven widgets here once they are ready.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-left">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Next step</p>
                  <p className="mt-2 text-sm text-slate-200">Wire up endpoint data.</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-left">
                  <p className="text-xs uppercase tracking-widest text-slate-500">Reminder</p>
                  <p className="mt-2 text-sm text-slate-200">
                    Add filters and context once endpoints are available.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
