"use client"

import { useEffect, useState } from "react"
import OutputFourSkeleton from "./OutputFourSkeleton"

export default function OutputFour() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <OutputFourSkeleton />

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Output Four</h2>
      <p className="text-sm text-neutral-400">Loaded content</p>
    </div>
  )
}
