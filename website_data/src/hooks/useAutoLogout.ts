"use client"

import { useEffect, useRef } from "react"
import { signOut } from "next-auth/react"

const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

export default function useAutoLogout() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" })
      }, TIMEOUT_MS)
    }

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ]

    // Attach listeners ONCE
    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    )

    // Start timer immediately
    resetTimer()

    // Cleanup ONCE on unmount
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      )

      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, []) // 👈 EMPTY DEP ARRAY IS THE KEY GUARANTEE
}
