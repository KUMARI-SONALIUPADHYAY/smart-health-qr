"use client"

import { Shield, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConsentPopupProps {
  open: boolean
  onClose: () => void
  onGrant: () => void
  patientName: string
  doctorName: string
}

export function ConsentPopup({
  open,
  onClose,
  onGrant,
  patientName,
  doctorName,
}: ConsentPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Patient Consent Required
          </DialogTitle>
          <DialogDescription className="text-center">
            The following doctor is requesting access to medical records
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Patient</span>
                <span className="font-medium text-foreground">
                  {patientName}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Doctor</span>
                <span className="font-medium text-foreground">
                  {doctorName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
            <Clock className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                15-Minute Access Window
              </p>
              <p className="text-xs text-muted-foreground">
                Access will automatically expire after 15 minutes. All
                activity is logged for your records.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-success/5 border border-success/20 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">
                What the doctor can see:
              </p>
              <ul className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                <li>Medical history and chronic conditions</li>
                <li>Allergy information and blood group</li>
                <li>Previous visit records and prescriptions</li>
                <li>Emergency contact details</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Deny Access
          </Button>
          <Button onClick={onGrant} className="flex-1">
            <Shield className="mr-2 h-4 w-4" />
            Grant Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
