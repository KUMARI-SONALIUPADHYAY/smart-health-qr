"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Search, LayoutDashboard, User, Droplets, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PatientDashboard } from "@/components/patient-dashboard"

const demoPatients = [
  { id: "SHQ-1001", name: "Aarav Mehta", age: 34, blood: "B+", condition: "Type 2 Diabetes" },
  { id: "SHQ-1002", name: "Sara Johnson", age: 28, blood: "O-", condition: "Asthma" },
  { id: "SHQ-1003", name: "Raj Patel", age: 62, blood: "A+", condition: "Heart Disease" },
  { id: "SHQ-1004", name: "Emily Chen", age: 45, blood: "AB+", condition: "Hypothyroidism" },
  { id: "SHQ-1005", name: "Omar Hassan", age: 71, blood: "O+", condition: "COPD + CKD" },
]

function PatientPageInner() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("id") || ""
  const [inputId, setInputId] = useState(initialId)
  const [activeId, setActiveId] = useState(initialId)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setActiveId(inputId.trim())
  }

  if (activeId) {
    return (
      <div>
        <div className="mx-auto max-w-5xl px-4 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Enter Patient ID (e.g. SHQ-1001)"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                className="max-w-xs font-mono"
              />
              <Button type="submit" variant="outline" size="default">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
            <div className="flex flex-wrap gap-1.5">
              {demoPatients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setInputId(p.id); setActiveId(p.id) }}
                  className={`rounded-md px-2 py-1 text-xs font-mono transition-colors ${
                    activeId === p.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {p.id}
                </button>
              ))}
            </div>
          </div>
        </div>
        <PatientDashboard patientId={activeId} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <LayoutDashboard className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Enter your Patient ID or select a demo patient below
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="e.g. SHQ-1001"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              className="font-mono text-lg"
              required
            />
            <Button type="submit" size="lg">
              <Search className="mr-2 h-5 w-5" />
              View
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">Demo Patients</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {demoPatients.map((p) => (
            <button
              key={p.id}
              onClick={() => { setInputId(p.id); setActiveId(p.id) }}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <User className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{p.id}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{p.age}y</span>
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3 w-3" />
                    {p.blood}
                  </span>
                  <span>{p.condition}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PatientPage() {
  return (
    <Suspense>
      <PatientPageInner />
    </Suspense>
  )
}
