"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { OutputKey } from "./DashboardClient"

import usePullToRefresh from "@/hooks/usePullToRefresh"

import OutputOne from "./outputs/OutputOne"
import OutputTwo from "./outputs/OutputTwo"
import OutputThree from "./outputs/OutputThree"
import OutputFour from "./outputs/OutputFour"

const ORDER: OutputKey[] = ["one", "two", "three", "four"]

export default function OutputContainer({
  active,
  onSwipe,
}: {
  active: OutputKey
  onSwipe?: (next: OutputKey) => void
}) {
  // ✅ ALL hooks live here
  const startX = useRef<number | null>(null)
  const lastX = useRef<number>(0)
  const lastTime = useRef<number>(0)
  const [offset, setOffset] = useState(0)

  const refresh = async () => {
    // simulate refresh for now
    await new Promise((r) => setTimeout(r, 800))
  }

  const { pull, refreshing, onTouchStart: ptrStart, onTouchMove: ptrMove, onTouchEnd: ptrEnd } =
  usePullToRefresh(refresh)


  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    lastX.current = startX.current
    lastTime.current = performance.now()
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startX.current === null) return

    const x = e.touches[0].clientX
    setOffset(x - startX.current)

    lastX.current = x
    lastTime.current = performance.now()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return

    const endX = e.changedTouches[0].clientX
    const dt = Math.max(1, performance.now() - lastTime.current)
    const velocity = (endX - lastX.current) / dt // px/ms

    const delta = endX - startX.current
    startX.current = null
    setOffset(0)

    const index = ORDER.indexOf(active)
    const THRESHOLD = 60
    const VELOCITY = 0.5

    const goNext = delta < -THRESHOLD || velocity < -VELOCITY
    const goPrev = delta > THRESHOLD || velocity > VELOCITY

    const next = goNext
      ? ORDER[index + 1]
      : goPrev
      ? ORDER[index - 1]
      : null

    if (next && onSwipe) onSwipe(next)
  }

  return (
    <section
      onTouchStart={(e) => {
        handleTouchStart(e)
        ptrStart(e)
      }}
      onTouchMove={(e) => {
        handleTouchMove(e)
        ptrMove(e)
      }}
      onTouchEnd={(e) => {
        handleTouchEnd(e)
        ptrEnd()
      }}
      className="relative h-full overflow-hidden rounded-2xl bg-smfc-charcoal border border-smfc-grey p-4 shadow-lg shadow-black/40 transition-shadow duration-300"
    >
      {/* Pull-to-refresh spinner */}
      <div
        className="
          absolute left-1/2 top-2 z-20
          -translate-x-1/2
          transition-opacity duration-200
        "
        style={{ opacity: pull > 10 || refreshing ? 1 : 0 }}
      >
        <div
          className={`
            h-6 w-6 rounded-full border-2 border-smfc-grey
            border-t-smfc-red
            ${refreshing ? "animate-spin" : ""}
          `}
          style={{
            transform: `rotate(${pull * 2}deg)`,
          }}
        />
      </div>
      {/* Watermark */}
      <Image
        src="/crest.svg"
        alt=""
        width={200}
        height={200}
        className="pointer-events-none absolute right-4 bottom-4 opacity-[0.05]"
      />

      {/* Swipe-follow content */}
      <div
        key={active}
        className="h-full transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {active === "one" && <OutputOne />}
        {active === "two" && <OutputTwo />}
        {active === "three" && <OutputThree />}
        {active === "four" && <OutputFour />}
      </div>
    </section>
  )
}
