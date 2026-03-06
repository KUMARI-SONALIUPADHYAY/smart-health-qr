"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HeartPulse,
  UserPlus,
  LayoutDashboard,
  ScanLine,
  ClipboardList,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home", icon: HeartPulse },
  { href: "/register", label: "Register", icon: UserPlus },
  { href: "/patient", label: "Patient", icon: LayoutDashboard },
  { href: "/doctor/scan", label: "Doctor", icon: ScanLine },
  { href: "/logs", label: "Logs", icon: ClipboardList },
]

export function AppHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
            <HeartPulse className="h-[18px] w-[18px] text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Smart Health QR
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/[0.08] text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-3 right-3 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="animate-fade-in border-t border-border/60 bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/[0.08] text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
