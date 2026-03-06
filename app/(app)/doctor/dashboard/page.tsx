"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { DoctorDashboard } from "@/components/doctor-dashboard"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function DoctorDashboardInner() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId") || ""
  const doctorName = searchParams.get("doctor") || "Dr. Unknown"

  if (!patientId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Missing Patient ID</CardTitle>
            <CardDescription>
              Please scan or enter a patient QR code first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return <DoctorDashboard patientId={patientId} doctorName={doctorName} />
}

export default function DoctorDashboardPage() {
  return (
    <Suspense>
      <DoctorDashboardInner />
    </Suspense>
  )
}
