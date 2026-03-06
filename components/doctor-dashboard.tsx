"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Droplets,
  AlertTriangle,
  Activity,
  Phone,
  ContactRound,
  CalendarDays,
  Shield,
  Clock,
  Pill,
  FileText,
  Zap,
  User,
  CheckCircle2,
  XCircle,
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
  getVisits,
  calculateRiskLevel,
  checkConsent,
  grantConsent,
  addAccessLog,
  type Patient,
  type Visit,
  type ConsentSession,
} from "@/lib/store"
import { ConsentPopup } from "@/components/consent-popup"
import { EmergencyMode } from "@/components/emergency-mode"
import { PrescriptionForm } from "@/components/prescription-form"

const riskColors: Record<string, string> = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning-foreground border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
  critical: "bg-destructive text-white border-destructive",
}

export function DoctorDashboard({
  patientId,
  doctorName,
}: {
  patientId: string
  doctorName: string
}) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [visits, setVisitsList] = useState<Visit[]>([])
  const [consent, setConsent] = useState<ConsentSession | null>(null)
  const [showConsentPopup, setShowConsentPopup] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)
  const [showPrescription, setShowPrescription] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  const loadData = useCallback(() => {
    const p = getPatient(patientId)
    if (p) {
      setPatient(p)
      setVisitsList(getVisits(patientId))
      const c = checkConsent(patientId, doctorName)
      setConsent(c)
      if (c) {
        setTimeLeft(Math.max(0, Math.floor((c.expiresAt - Date.now()) / 1000)))
      }
    }
  }, [patientId, doctorName])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Countdown timer
  useEffect(() => {
    if (!consent) return
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((consent.expiresAt - Date.now()) / 1000)
      )
      setTimeLeft(remaining)
      if (remaining === 0) {
        setConsent(null)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [consent])

  function handleGrantConsent() {
    const session = grantConsent(patientId, doctorName)
    setConsent(session)
    setTimeLeft(15 * 60)
    setShowConsentPopup(false)
    addAccessLog({
      patientId,
      accessedBy: doctorName,
      accessType: "consent",
      timestamp: new Date().toISOString(),
      duration: "15 min",
    })
  }

  function handleEmergencyAccess() {
    setShowEmergency(true)
    addAccessLog({
      patientId,
      accessedBy: doctorName,
      accessType: "emergency",
      timestamp: new Date().toISOString(),
      duration: "Emergency",
    })
  }

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
  const hasAccess = consent !== null
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Doctor Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Viewing records for{" "}
            <span className="font-medium text-foreground">{patient.name}</span>{" "}
            ({patient.id})
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            className={`px-3 py-1 text-sm ${riskColors[risk]}`}
            variant="outline"
          >
            Risk: {risk.charAt(0).toUpperCase() + risk.slice(1)}
          </Badge>
          {hasAccess ? (
            <Badge
              variant="outline"
              className="gap-1.5 border-success/20 bg-success/10 px-3 py-1 text-sm text-success"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Access Granted
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1.5 border-destructive/20 bg-destructive/10 px-3 py-1 text-sm text-destructive"
            >
              <XCircle className="h-3.5 w-3.5" />
              No Access
            </Badge>
          )}
        </div>
      </div>

      {/* Timer & Actions Bar */}
      <Card className="mb-6">
        <CardContent className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
          <div className="flex items-center gap-4">
            {hasAccess && (
              <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2 border border-primary/20">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-mono text-lg font-bold text-primary">
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
                <span className="text-xs text-muted-foreground">remaining</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Doctor: <span className="font-medium text-foreground">{doctorName}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!hasAccess && (
              <Button onClick={() => setShowConsentPopup(true)}>
                <Shield className="mr-2 h-4 w-4" />
                Request Consent
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleEmergencyAccess}
            >
              <Zap className="mr-2 h-4 w-4" />
              Emergency Mode
            </Button>
            {hasAccess && (
              <Button
                variant="outline"
                onClick={() => setShowPrescription(true)}
              >
                <Pill className="mr-2 h-4 w-4" />
                Add Prescription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Info Card - Always visible */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency Information
            </CardTitle>
            <CardDescription>
              Critical data always visible to healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <EmergencyInfoItem
                icon={Droplets}
                label="Blood Group"
                value={patient.bloodGroup}
              />
              <EmergencyInfoItem
                icon={AlertTriangle}
                label="Allergies"
                value={patient.allergies}
              />
              <EmergencyInfoItem
                icon={Activity}
                label="Chronic Conditions"
                value={patient.chronicDisease}
              />
              <EmergencyInfoItem
                icon={ContactRound}
                label="Emergency Contact"
                value={`${patient.emergencyContact} (${patient.phone})`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasAccess ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <SummaryItem label="Full Name" value={patient.name} />
                <SummaryItem label="Age" value={`${patient.age} years`} />
                <SummaryItem label="Patient ID" value={patient.id} mono />
                <SummaryItem
                  label="Registered"
                  value={new Date(patient.registeredAt).toLocaleDateString()}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/50 py-8 text-muted-foreground">
                <Shield className="h-8 w-8" />
                <p className="text-sm">Request consent to view full details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visit History */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Visit History
          </CardTitle>
          <CardDescription>
            Previous consultations and diagnoses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasAccess ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/50 py-8 text-muted-foreground">
              <Shield className="h-8 w-8" />
              <p className="text-sm">Request consent to view visit history</p>
            </div>
          ) : visits.length === 0 ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 py-8 text-muted-foreground">
              <CalendarDays className="h-5 w-5" />
              No visit history found
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="rounded-xl border border-border bg-secondary/30 p-5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {visit.doctorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(visit.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{visit.id}</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Diagnosis</p>
                      <p className="text-sm font-medium text-foreground">
                        {visit.diagnosis}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Prescription
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {visit.prescription}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm font-medium text-foreground">
                        {visit.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConsentPopup
        open={showConsentPopup}
        onClose={() => setShowConsentPopup(false)}
        onGrant={handleGrantConsent}
        patientName={patient.name}
        doctorName={doctorName}
      />

      <EmergencyMode
        open={showEmergency}
        onClose={() => setShowEmergency(false)}
        patient={patient}
      />

      <PrescriptionForm
        open={showPrescription}
        onClose={() => {
          setShowPrescription(false)
          loadData()
        }}
        patientId={patient.id}
        doctorName={doctorName}
      />
    </div>
  )
}

function EmergencyInfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-card p-3 border border-border">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}

function SummaryItem({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-sm font-medium text-foreground ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  )
}
