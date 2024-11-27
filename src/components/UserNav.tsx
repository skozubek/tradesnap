// src/components/UserNav.tsx
"use client"

import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ThemeToggle"

export function UserNav() {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}