"use client"

import { useEffect, useState } from "react"
import Skeleton from "../Skeleton"

export default function OutputTwo() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <Skeleton />

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Output Two</h2>
      <p className="text-sm text-neutral-400">Loaded content</p>
    </div>
  )
}
