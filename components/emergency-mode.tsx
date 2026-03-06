"use client"

import {
  Zap,
  Droplets,
  AlertTriangle,
  Activity,
  Phone,
  ContactRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Patient } from "@/lib/store"

interface EmergencyModeProps {
  open: boolean
  onClose: () => void
  patient: Patient
}

export function EmergencyMode({ open, onClose, patient }: EmergencyModeProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-destructive/30 sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
            <Zap className="h-7 w-7 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl text-destructive">
            Emergency Access Mode
          </DialogTitle>
          <DialogDescription className="text-center">
            Showing limited critical information without patient consent.
            This access is logged.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          <div className="rounded-xl border-2 border-destructive/20 bg-destructive/5 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-destructive">
              Critical Patient Data
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <EmergencyField
                icon={Droplets}
                label="Blood Group"
                value={patient.bloodGroup}
                large
              />
              <EmergencyField
                icon={AlertTriangle}
                label="Known Allergies"
                value={patient.allergies}
              />
              <EmergencyField
                icon={Activity}
                label="Chronic Conditions"
                value={patient.chronicDisease}
              />
              <EmergencyField
                icon={ContactRound}
                label="Emergency Contact"
                value={patient.emergencyContact}
              />
              <div className="sm:col-span-2">
                <EmergencyField
                  icon={Phone}
                  label="Contact Phone"
                  value={patient.phone}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-3 text-center">
            <p className="text-xs text-destructive/80">
              Emergency access logged at {new Date().toLocaleString()}.
              Full audit trail recorded.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onClose}
            className="w-full"
          >
            Close Emergency View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EmergencyField({
  icon: Icon,
  label,
  value,
  large,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  large?: boolean
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-card p-3 border border-border">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
        <Icon className="h-4 w-4 text-destructive" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`font-semibold text-foreground ${
            large ? "text-2xl" : "text-sm"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
