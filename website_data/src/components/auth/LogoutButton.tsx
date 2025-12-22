"use client"

import { signOut } from "next-auth/react"

type Props = {
  className?: string
}

export default function LogoutButton({ className }: Props) {
  function handleLogout() {
    const ok = window.confirm("Are you sure you want to log out?")
    if (!ok) return

    signOut({ callbackUrl: "/login" })
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`text-sm text-neutral-400 hover:text-white ${className ?? ""}`}
    >
      Log out
    </button>
  )
}
