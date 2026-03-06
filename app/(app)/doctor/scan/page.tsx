"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ScanLine,
  Search,
  Stethoscope,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DoctorScanPage() {
  const router = useRouter()
  const [qrId, setQrId] = useState("")
  const [doctorName, setDoctorName] = useState("Dr. Sharma")

  function handleScan(e: React.FormEvent) {
    e.preventDefault()
    if (qrId.trim() && doctorName.trim()) {
      router.push(
        `/doctor/dashboard?patientId=${qrId.trim()}&doctor=${encodeURIComponent(
          doctorName.trim()
        )}`
      )
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Doctor Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Enter patient QR ID to access medical records
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ScanLine className="h-5 w-5 text-primary" />
              Scan / Enter QR ID
            </CardTitle>
            <CardDescription>
              Enter the patient QR code ID and your doctor name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Doctor Name
                </label>
                <Input
                  placeholder="e.g. Dr. Sharma"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Patient QR ID
                </label>
                <Input
                  placeholder="e.g. SHQ-1001"
                  value={qrId}
                  onChange={(e) => setQrId(e.target.value)}
                  className="font-mono text-lg"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="h-12 text-base">
                <Search className="mr-2 h-5 w-5" />
                Access Patient Records
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <div className="mt-6 rounded-xl bg-secondary/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Quick Access -- Try these demo patients:
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  { id: "SHQ-1001", name: "Aarav Mehta", condition: "Diabetes", risk: "medium" },
                  { id: "SHQ-1002", name: "Sara Johnson", condition: "Asthma", risk: "low" },
                  { id: "SHQ-1003", name: "Raj Patel", condition: "Heart Disease", risk: "critical" },
                  { id: "SHQ-1005", name: "Omar Hassan", condition: "COPD + CKD", risk: "critical" },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setQrId(p.id)
                      if (doctorName.trim()) {
                        router.push(
                          `/doctor/dashboard?patientId=${p.id}&doctor=${encodeURIComponent(doctorName.trim())}`
                        )
                      }
                    }}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5 text-left transition-colors hover:bg-primary/5 hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary">{p.id}</span>
                      <span className="text-sm text-foreground">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{p.condition}</span>
                      <span className={`inline-block h-2 w-2 rounded-full ${
                        p.risk === "critical" ? "bg-destructive" :
                        p.risk === "high" ? "bg-orange-500" :
                        p.risk === "medium" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
