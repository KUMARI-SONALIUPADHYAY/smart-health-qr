"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  HeartPulse,
  QrCode,
  Shield,
  Clock,
  UserPlus,
  ScanLine,
  ArrowRight,
  Stethoscope,
  Zap,
  Lock,
  ClipboardList,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return <span>{count.toLocaleString()}{suffix}</span>
}

const features = [
  {
    icon: QrCode,
    title: "Instant QR Access",
    description:
      "Generate a unique QR code for each patient. One scan reveals complete medical history.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Patient consent required for access. Time-limited sessions with full audit trails.",
  },
  {
    icon: Clock,
    title: "15-Min Sessions",
    description:
      "Auto-expiring access windows ensure data is only available when actively needed.",
  },
  {
    icon: Zap,
    title: "Emergency Mode",
    description:
      "Critical info available instantly in emergencies -- blood group, allergies, and contacts.",
  },
  {
    icon: Stethoscope,
    title: "Doctor Dashboard",
    description:
      "Complete patient view with risk assessment, visit history, and prescription management.",
  },
  {
    icon: Lock,
    title: "Access Logging",
    description:
      "Every data access is logged with timestamp, accessor details, and session duration.",
  },
]

const steps = [
  {
    title: "Register Patient",
    description: "Fill in medical details and emergency contacts",
    icon: UserPlus,
  },
  {
    title: "Get QR Code",
    description: "A unique QR code is generated for the patient",
    icon: QrCode,
  },
  {
    title: "Doctor Scans",
    description: "Healthcare provider scans or enters the QR ID",
    icon: ScanLine,
  },
  {
    title: "Access Records",
    description: "View medical history with patient consent",
    icon: Stethoscope,
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
          <nav className="hidden items-center gap-0.5 sm:flex">
            {[
              { href: "/register", icon: UserPlus, label: "Register" },
              { href: "/patient", icon: QrCode, label: "Patient" },
              { href: "/doctor/scan", icon: Stethoscope, label: "Doctor" },
              { href: "/logs", icon: ClipboardList, label: "Logs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex sm:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,_oklch(0.50_0.16_250_/_0.12),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_oklch(0.57_0.17_200_/_0.06),_transparent_40%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-32 lg:pb-32">
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-primary/[0.04] px-5 py-2 text-sm font-medium text-primary shadow-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              <HeartPulse className="h-3 w-3" />
            </div>
            Healthcare, Reimagined
            <ChevronRight className="h-3.5 w-3.5 text-primary/50" />
          </div>

          <h1 className="animate-fade-up stagger-1 max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4.25rem] lg:leading-[1.1]">
            Scan Once.{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Save Lives.</span>
          </h1>

          <p className="animate-fade-up stagger-2 mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl lg:leading-8">
            Smart Health QR bridges the gap between patients and doctors with
            instant, secure access to critical medical records through a simple
            QR code.
          </p>

          <div className="animate-fade-up stagger-3 mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25" asChild>
              <Link href="/register">
                <UserPlus className="mr-2 h-5 w-5" />
                Register Patient
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base transition-all duration-200 hover:bg-secondary"
              asChild
            >
              <Link href="/doctor/scan">
                <ScanLine className="mr-2 h-5 w-5" />
                Doctor Login
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up stagger-4 mt-20 grid w-full max-w-3xl grid-cols-3 gap-8 rounded-2xl border border-border/60 bg-card p-8 shadow-lg shadow-foreground/[0.03] lg:p-10">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
                <AnimatedCounter target={1247} suffix="+" />
              </span>
              <span className="mt-1.5 text-xs font-medium text-muted-foreground lg:text-sm">
                Patients Registered
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-border/60">
              <span className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
                <AnimatedCounter target={342} suffix="+" />
              </span>
              <span className="mt-1.5 text-xs font-medium text-muted-foreground lg:text-sm">
                Doctors Active
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tight text-primary lg:text-4xl">
                <AnimatedCounter target={5831} suffix="+" />
              </span>
              <span className="mt-1.5 text-xs font-medium text-muted-foreground lg:text-sm">
                QR Scans
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            A complete platform for modern healthcare record management
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className={`group animate-fade-up stagger-${i + 1} border-border/60 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/[0.04]`}
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary group-hover:shadow-md group-hover:shadow-primary/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-[17px] font-semibold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-[15px] leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border/60 bg-gradient-to-b from-secondary/40 to-secondary/20 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              How It Works
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Four Simple Steps
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Digitize patient records in minutes
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden w-full translate-x-1/2 lg:block">
                    <div className="mx-auto flex items-center justify-center">
                      <div className="h-px w-full bg-gradient-to-r from-border to-border/40" />
                      <ArrowRight className="mx-1 h-4 w-4 shrink-0 text-muted-foreground/30" />
                    </div>
                  </div>
                )}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-lg shadow-foreground/[0.03]">
                  <step.icon className="h-9 w-9 text-primary" />
                  <div className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/30">
                    {i + 1}
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent px-8 py-20 text-center text-primary-foreground shadow-xl shadow-primary/20 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-10%,_oklch(0.99_0_0_/_0.08),_transparent_45%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_110%,_oklch(0.99_0_0_/_0.06),_transparent_45%)]" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight lg:text-4xl">
              Ready to Modernize Your Practice?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/75">
              Join thousands of healthcare providers using Smart Health QR for
              faster, safer patient care.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base shadow-md transition-all duration-200 hover:shadow-lg"
                asChild
              >
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-primary-foreground/20 px-8 text-base text-primary-foreground transition-all duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/doctor/scan">Try Doctor View</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <HeartPulse className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Smart Health QR</span>
          </div>
          <p className="text-muted-foreground/70">Secure. Fast. Life-Saving.</p>
        </div>
      </footer>
    </div>
  )
}
