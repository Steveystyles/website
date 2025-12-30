"use client"

import Image from "next/image"
import { OutputKey } from "./DashboardClient"
import usePullToRefresh from "@/hooks/usePullToRefresh"
import { SoccerIndex } from "@/lib/data/soccerIndex"

import OutputOne from "./outputs/OutputOne"
import OutputTwo from "./outputs/OutputTwo"
import OutputThree from "./outputs/OutputThree"
import OutputFour from "./outputs/OutputFour"

export default function OutputContainer({
  active,
  soccerIndex,
}: {
  active: OutputKey
  soccerIndex: SoccerIndex
}) {
  // Pull-to-refresh only (no swipe navigation)
  const refresh = async () => {
    await new Promise((r) => setTimeout(r, 800))
  }

  const {
    pull,
    refreshing,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = usePullToRefresh(refresh)

  return (
    <section
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="
        relative h-full
        overflow-hidden
        rounded-2xl
        bg-smfc-charcoal
        border border-smfc-grey
        p-4
      "
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

      {/* Active output */}
      <div className="h-full">
        {active === "one" && <OutputOne soccerIndex={soccerIndex} />}
        {active === "two" && <OutputTwo />}
        {active === "three" && <OutputThree />}
        {active === "four" && <OutputFour />}
      </div>
    </section>
  )
}
