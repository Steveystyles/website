"use client"

import { signOut } from "next-auth/react"

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: "/login",
        })
      }
      style={{
        borderRadius: 999,
        border: "1px solid #cbd5f5",
        background: "#ffffff",
        padding: "8px 16px",
        fontSize: 14,
        fontWeight: 600,
        color: "#1d4ed8",
        cursor: "pointer",
      }}
      aria-label="Log out of your account"
    >
      Log out
    </button>
  )
}
