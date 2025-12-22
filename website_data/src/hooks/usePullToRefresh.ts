"use client"

import { useRef, useState } from "react"

export default function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const startY = useRef<number | null>(null)
  const triggered = useRef(false)

  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null || refreshing) return

    const dy = e.touches[0].clientY - startY.current
    if (dy > 0) {
      setPull(Math.min(dy, 120))
      if (dy > 80) triggered.current = true
    }
  }

  async function onTouchEnd() {
    if (triggered.current && !refreshing) {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }

    setPull(0)
    triggered.current = false
    startY.current = null
  }

  return {
    pull,
    refreshing,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
