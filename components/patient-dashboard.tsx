"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  User,
  Droplets,
  AlertTriangle,
  Activity,
  Phone,
  ContactRound,
  CalendarDays,
  QrCode,
  Download,
  ClipboardList,
  Shield,
  FileText,
  Pill,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getPatient,
  getAccessLogs,
  getVisits,
  getPrescriptions,
  calculateRiskLevel,
  type Patient,
  type AccessLog,
  type Visit,
  type Prescription,
} from "@/lib/store"

function QrCodeDisplay({ patientId }: { patientId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawQR = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = 200
    canvas.width = size
    canvas.height = size

    // White background
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, size, size)

    // Generate deterministic pattern from patient ID
    const seed = patientId
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0)
    const moduleSize = 8
    const modules = Math.floor(size / moduleSize)

    ctx.fillStyle = "#0f172a"

    // Position detection patterns (three corners)
    function drawFinder(x: number, y: number) {
      // Outer
      ctx.fillRect(
        x * moduleSize,
        y * moduleSize,
        7 * moduleSize,
        7 * moduleSize
      )
      // White inner
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(
        (x + 1) * moduleSize,
        (y + 1) * moduleSize,
        5 * moduleSize,
        5 * moduleSize
      )
      // Dark center
      ctx.fillStyle = "#0f172a"
      ctx.fillRect(
        (x + 2) * moduleSize,
        (y + 2) * moduleSize,
        3 * moduleSize,
        3 * moduleSize
      )
    }

    drawFinder(1, 1)
    drawFinder(modules - 9, 1)
    drawFinder(1, modules - 9)

    // Data modules - deterministic from seed
    let state = seed
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Skip finder patterns
        if (
          (row < 10 && col < 10) ||
          (row < 10 && col > modules - 11) ||
          (row > modules - 11 && col < 10)
        )
          continue

        state = ((state * 1103515245 + 12345) & 0x7fffffff) >>> 0
        if (state % 3 === 0) {
          ctx.fillStyle = "#0f172a"
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          )
        }
      }
    }

    // Add patient ID text at bottom
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, size - 24, size, 24)
    ctx.fillStyle = "#0f172a"
    ctx.font = "bold 12px monospace"
    ctx.textAlign = "center"
    ctx.fillText(patientId, size / 2, size - 8)
  }, [patientId])

  useEffect(() => {
    drawQR()
  }, [drawQR])

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `qr-${patientId}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-5 shadow-sm">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-semibold tracking-wider text-primary-foreground uppercase">
          Health QR
        </div>
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Show this code at any clinic for instant record access
      </p>
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  )
}

const riskColors = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning-foreground border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-white border-destructive",
}

export function PatientDashboard({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [visits, setVisitsList] = useState<Visit[]>([])
  const [prescriptions, setPrescriptionsList] = useState<Prescription[]>([])

  useEffect(() => {
    const p = getPatient(patientId)
    if (p) {
      setPatient(p)
      setLogs(getAccessLogs(patientId))
      setVisitsList(getVisits(patientId))
      setPrescriptionsList(getPrescriptions(patientId))
    }
  }, [patientId])

  if (!patient) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>
              No patient found with ID: {patientId}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const risk = calculateRiskLevel(patient)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Patient Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            QR Code and medical profile for{" "}
            <span className="font-medium text-foreground">{patient.name}</span>
          </p>
        </div>
        <Badge
          className={`px-3 py-1 text-sm ${riskColors[risk]}`}
          variant="outline"
        >
          Risk: {risk.charAt(0).toUpperCase() + risk.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* QR Code Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <QrCode className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Your Health QR</CardTitle>
            <CardDescription>Show this to your healthcare provider</CardDescription>
          </CardHeader>
          <CardContent>
            <QrCodeDisplay patientId={patient.id} />
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{patient.name}</CardTitle>
                <CardDescription className="font-mono">
                  ID: {patient.id}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={CalendarDays}
                label="Age"
                value={`${patient.age} years`}
              />
              <InfoRow
                icon={Droplets}
                label="Blood Group"
                value={patient.bloodGroup}
                highlight
              />
              <InfoRow
                icon={AlertTriangle}
                label="Allergies"
                value={patient.allergies}
                warning={patient.allergies.toLowerCase() !== "none"}
              />
              <InfoRow
                icon={Activity}
                label="Chronic Diseases"
                value={patient.chronicDisease}
                warning={patient.chronicDisease.toLowerCase() !== "none"}
              />
              <InfoRow
                icon={ContactRound}
                label="Emergency Contact"
                value={patient.emergencyContact}
              />
              <InfoRow icon={Phone} label="Phone" value={patient.phone} />
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Visit History</CardTitle>
                <CardDescription>
                  Your past consultations ({visits.length} records)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {visits.length === 0 ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 py-8 text-muted-foreground">
                <FileText className="h-5 w-5" />
                No visit history yet
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visits.map((visit) => (
                  <div
                    key={visit.id}
                    className="rounded-xl border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{visit.doctorName}</span>
                        <Badge variant="secondary" className="text-[10px]">{visit.id}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(visit.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Diagnosis</p>
                        <p className="font-medium text-foreground">{visit.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Prescription</p>
                        <p className="text-foreground">{visit.prescription}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Notes</p>
                        <p className="text-foreground">{visit.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriptions */}
        {prescriptions.length > 0 && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Pill className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Active Prescriptions</CardTitle>
                  <CardDescription>
                    Medicines prescribed to you ({prescriptions.length} prescriptions)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="rounded-xl border border-border bg-secondary/30 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{rx.doctorName}</span>
                        <Badge variant="outline" className="font-mono text-[10px]">{rx.id}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{rx.date}</span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      {rx.medicines.map((med, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-card p-2.5 border border-border">
                          <Pill className="h-4 w-4 shrink-0 text-accent" />
                          <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className="font-medium text-foreground">{med.name}</span>
                            <span className="text-muted-foreground">{med.dosage}</span>
                            <span className="text-xs text-muted-foreground">({med.duration})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {rx.notes && (
                      <p className="mt-2 text-xs text-muted-foreground">{rx.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Access */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Recent Access</CardTitle>
                <CardDescription>
                  Who has accessed your medical records ({logs.length} records)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 py-8 text-muted-foreground">
                <ClipboardList className="h-5 w-5" />
                No access logs yet
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {logs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-col gap-1 rounded-xl border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {log.accessedBy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        log.accessType === "emergency"
                          ? "destructive"
                          : "secondary"
                      }
                      className="w-fit"
                    >
                      {log.accessType}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
  warning,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
  warning?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-3">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          warning
            ? "bg-destructive/10 text-destructive"
            : highlight
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`text-sm font-medium ${
            warning ? "text-destructive" : "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
