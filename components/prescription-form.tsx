"use client"

import { useState } from "react"
import { Pill, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { addPrescription, addVisit } from "@/lib/store"

interface PrescriptionFormProps {
  open: boolean
  onClose: () => void
  patientId: string
  doctorName: string
}

interface Medicine {
  name: string
  dosage: string
  duration: string
}

export function PrescriptionForm({
  open,
  onClose,
  patientId,
  doctorName,
}: PrescriptionFormProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "Amoxicillin", dosage: "500mg 3x daily", duration: "7 days" },
  ])
  const [diagnosis, setDiagnosis] = useState("Upper respiratory infection")
  const [notes, setNotes] = useState("Complete the full antibiotic course. Return if fever persists beyond 3 days.")
  const [submitted, setSubmitted] = useState(false)

  function addMedicine() {
    setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }])
  }

  function removeMedicine(index: number) {
    setMedicines((prev) => prev.filter((_, i) => i !== index))
  }

  function updateMedicine(
    index: number,
    field: keyof Medicine,
    value: string
  ) {
    setMedicines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validMedicines = medicines.filter((m) => m.name.trim())
    if (validMedicines.length === 0) return

    addPrescription({
      patientId,
      doctorName,
      medicines: validMedicines,
      notes,
      date: new Date().toISOString().split("T")[0],
    })

    addVisit({
      patientId,
      doctorName,
      date: new Date().toISOString().split("T")[0],
      diagnosis: diagnosis || "Consultation",
      prescription: validMedicines.map((m) => `${m.name} ${m.dosage}`).join(", "),
      notes: notes || "No additional notes",
    })

    setSubmitted(true)
  }

  function handleClose() {
    setMedicines([{ name: "Amoxicillin", dosage: "500mg 3x daily", duration: "7 days" }])
    setDiagnosis("Upper respiratory infection")
    setNotes("Complete the full antibiotic course. Return if fever persists beyond 3 days.")
    setSubmitted(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Prescription Added
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              The prescription has been saved and visit record updated.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Pill className="h-7 w-7 text-primary" />
              </div>
              <DialogTitle className="text-center text-xl">
                New Prescription
              </DialogTitle>
              <DialogDescription className="text-center">
                Add medicines and notes for this patient
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label>Diagnosis</Label>
                <Input
                  placeholder="e.g. Upper respiratory infection"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Medicines</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addMedicine}
                    className="h-8 text-xs"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Medicine
                  </Button>
                </div>
                {medicines.map((med, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-secondary/30 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Medicine {i + 1}
                      </span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(i)}
                          className="rounded-lg p-1 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove medicine ${i + 1}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        placeholder="Name"
                        value={med.name}
                        onChange={(e) =>
                          updateMedicine(i, "name", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          updateMedicine(i, "dosage", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) =>
                          updateMedicine(i, "duration", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <DialogFooter className="gap-3 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Pill className="mr-2 h-4 w-4" />
                  Save Prescription
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
