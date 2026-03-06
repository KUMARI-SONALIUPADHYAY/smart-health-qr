"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  UserPlus,
  User,
  CalendarDays,
  Droplets,
  AlertTriangle,
  Activity,
  Phone,
  ContactRound,
  CheckCircle2,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addPatient } from "@/lib/store"

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

export function PatientRegistration() {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [patientId, setPatientId] = useState("")
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    allergies: "",
    chronicDisease: "",
    emergencyContact: "",
    phone: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function fillSampleData() {
    setFormData({
      name: "Neha Kapoor",
      age: "29",
      bloodGroup: "A-",
      allergies: "Latex, Pollen",
      chronicDisease: "None",
      emergencyContact: "Arjun Kapoor (Husband)",
      phone: "+91-9988776655",
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const patient = addPatient({
      name: formData.name,
      age: parseInt(formData.age),
      bloodGroup: formData.bloodGroup,
      allergies: formData.allergies || "None",
      chronicDisease: formData.chronicDisease || "None",
      emergencyContact: formData.emergencyContact,
      phone: formData.phone,
    })
    setPatientId(patient.id)
    setSubmitted(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(patientId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Registration Successful</CardTitle>
            <CardDescription>
              Patient has been registered in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-full rounded-xl border border-primary/20 bg-primary/5 p-6">
              <p className="mb-1 text-sm text-muted-foreground">Patient ID</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-primary">
                  {patientId}
                </span>
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Copy patient ID"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Save this ID. Use it to access the patient dashboard and QR code.
            </p>
            <div className="flex flex-col gap-3 w-full sm:flex-row">
              <Button
                className="flex-1"
                onClick={() =>
                  router.push(`/patient?id=${patientId}`)
                }
              >
                View Dashboard
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    name: "",
                    age: "",
                    bloodGroup: "",
                    allergies: "",
                    chronicDisease: "",
                    emergencyContact: "",
                    phone: "",
                  })
                }}
              >
                Register Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <UserPlus className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Patient Registration
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter patient details to generate a unique health QR code
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Want to see a demo?</p>
              <p className="text-xs text-muted-foreground">Auto-fill the form with sample patient data</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={fillSampleData} className="shrink-0 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
              Fill Sample Data
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Age and Blood Group */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="150"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  Blood Group
                </Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, bloodGroup: v }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Allergies */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="allergies" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Allergies
              </Label>
              <Textarea
                id="allergies"
                name="allergies"
                placeholder="e.g., Penicillin, Dust, Pollen (or None)"
                value={formData.allergies}
                onChange={handleChange}
                rows={2}
              />
            </div>

            {/* Chronic Disease */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="chronicDisease"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4 text-muted-foreground" />
                Chronic Diseases
              </Label>
              <Textarea
                id="chronicDisease"
                name="chronicDisease"
                placeholder="e.g., Diabetes, Hypertension (or None)"
                value={formData.chronicDisease}
                onChange={handleChange}
                rows={2}
              />
            </div>

            {/* Emergency Contact and Phone */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="emergencyContact"
                  className="flex items-center gap-2"
                >
                  <ContactRound className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  name="emergencyContact"
                  placeholder="Contact name"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1-555-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 h-12 text-base">
              <UserPlus className="mr-2 h-5 w-5" />
              Register Patient
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
