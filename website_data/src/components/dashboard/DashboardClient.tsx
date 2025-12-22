"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import OutputContainer from "./OutputContainer"
import BottomTabs from "./BottomTabs"
import { useSession } from "next-auth/react"
import LogoutButton from "@/components/auth/LogoutButton"
import useAutoLogout from "@/hooks/useAutoLogout"
import Image from "next/image"





export type OutputKey = "one" | "two" | "three" | "four"

const VALID_VIEWS: OutputKey[] = ["one", "two", "three", "four"]

function normalizeView(view: string | null): OutputKey {
  return VALID_VIEWS.includes(view as OutputKey) ? (view as OutputKey) : "one"
}

export default function DashboardClient() {
  useAutoLogout()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  const normalizedView = normalizeView(searchParams.get("view"))
  const [active, setActive] = useState<OutputKey>(normalizedView)

  // Keep state + URL in sync
  useEffect(() => {
    if (active !== normalizedView) {
      setActive(normalizedView)
    }

    // If URL is invalid, fix it silently
    if (searchParams.get("view") !== normalizedView) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("view", normalizedView)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedView])

  function setView(next: OutputKey) {
    setActive(next)

    const params = new URLSearchParams(searchParams.toString())
    params.set("view", next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="h-[100dvh] flex flex-col p-4 pb-0 gap-4">
      <header className="flex items-center justify-between rounded-xl bg-smfc-charcoal px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/crest.svg"
            alt="St Mirren crest"
            width={36}
            height={36}
            priority
          />

          <div>
            <h1 className="text-lg font-bold tracking-wide leading-tight">
              FULTONS MOVIES
            </h1>
            <p className="text-xs text-neutral-400 truncate max-w-[160px]">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <LogoutButton />
      </header>
      <div className="flex-1 min-h-0">
        <OutputContainer active={active} onSwipe={setView} />
      </div>
      <BottomTabs active={active} onChange={setView} />
    </div>
  )
}
