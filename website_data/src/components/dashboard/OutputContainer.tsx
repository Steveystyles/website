"use client"

import { useRef } from "react"
import Image from "next/image"
import { OutputKey } from "./DashboardClient"

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
  const startX = useRef<number | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    const delta = e.changedTouches[0].clientX - startX.current
    startX.current = null

    if (Math.abs(delta) < 50) return

    const index = ORDER.indexOf(active)
    const next = delta < 0 ? ORDER[index + 1] : ORDER[index - 1]
    if (next && onSwipe) onSwipe(next)
  }

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="
        relative
        h-full
        overflow-hidden
        rounded-2xl
        bg-smfc-charcoal
        border border-smfc-grey
        p-4
        shadow-lg shadow-black/40
        transition-shadow duration-300
      "
    >
      {/* Watermark */}
      <Image
        src="/crest.svg"
        alt=""
        width={200}
        height={200}
        className="pointer-events-none absolute right-4 bottom-4 opacity-[0.05]"
      />
      <div
        key={active}
        className="
          relative z-10
          h-full
          animate-fade-slide
        "
      >
      {active === "one" && <OutputOne />}
      {active === "two" && <OutputTwo />}
      {active === "three" && <OutputThree />}
      {active === "four" && <OutputFour />}
      </div>
      
    </section>
  )
}
