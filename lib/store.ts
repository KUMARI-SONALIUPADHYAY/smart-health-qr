// In-memory data store for Smart Health QR
// Uses dummy data for demonstration

export interface Patient {
  id: string
  name: string
  age: number
  bloodGroup: string
  allergies: string
  chronicDisease: string
  emergencyContact: string
  phone: string
  registeredAt: string
}

export interface Visit {
  id: string
  patientId: string
  doctorName: string
  date: string
  diagnosis: string
  prescription: string
  notes: string
}

export interface AccessLog {
  id: string
  patientId: string
  accessedBy: string
  accessType: "consent" | "emergency" | "scan"
  timestamp: string
  duration: string
}

export interface Prescription {
  id: string
  patientId: string
  doctorName: string
  medicines: { name: string; dosage: string; duration: string }[]
  notes: string
  date: string
}

export interface ConsentSession {
  patientId: string
  doctorName: string
  grantedAt: number
  expiresAt: number
}

// Generate unique IDs
let idCounter = 1000
export function generateId(prefix: string = "SHQ"): string {
  idCounter++
  return `${prefix}-${idCounter}`
}

// Dummy patients
const dummyPatients: Patient[] = [
  {
    id: "SHQ-1001",
    name: "Aarav Mehta",
    age: 34,
    bloodGroup: "B+",
    allergies: "Penicillin, Dust Mites",
    chronicDisease: "Type 2 Diabetes",
    emergencyContact: "Priya Mehta (Wife)",
    phone: "+91-9876543210",
    registeredAt: "2025-12-15T10:30:00Z",
  },
  {
    id: "SHQ-1002",
    name: "Sara Johnson",
    age: 28,
    bloodGroup: "O-",
    allergies: "None",
    chronicDisease: "Asthma",
    emergencyContact: "Mike Johnson (Brother)",
    phone: "+1-555-0123",
    registeredAt: "2026-01-10T14:20:00Z",
  },
  {
    id: "SHQ-1003",
    name: "Raj Patel",
    age: 62,
    bloodGroup: "A+",
    allergies: "Sulfa Drugs, Aspirin, Ibuprofen",
    chronicDisease: "Hypertension, Coronary Artery Disease, Type 2 Diabetes",
    emergencyContact: "Anita Patel (Daughter)",
    phone: "+91-9812345678",
    registeredAt: "2026-02-01T09:15:00Z",
  },
  {
    id: "SHQ-1004",
    name: "Emily Chen",
    age: 45,
    bloodGroup: "AB+",
    allergies: "Latex, Shellfish",
    chronicDisease: "Hypothyroidism, Migraine",
    emergencyContact: "David Chen (Husband)",
    phone: "+1-555-0456",
    registeredAt: "2026-01-25T11:00:00Z",
  },
  {
    id: "SHQ-1005",
    name: "Omar Hassan",
    age: 71,
    bloodGroup: "O+",
    allergies: "Codeine, NSAIDs, Peanuts",
    chronicDisease: "COPD, Atrial Fibrillation, Chronic Kidney Disease",
    emergencyContact: "Fatima Hassan (Wife)",
    phone: "+44-7700-900123",
    registeredAt: "2025-11-05T08:45:00Z",
  },
]

const dummyVisits: Visit[] = [
  {
    id: "V-001",
    patientId: "SHQ-1001",
    doctorName: "Dr. Sharma",
    date: "2026-01-20",
    diagnosis: "Blood sugar fluctuation - HbA1c at 7.8%",
    prescription: "Metformin 500mg twice daily",
    notes: "Follow up in 2 weeks. Advised dietary changes and 30 min daily walks.",
  },
  {
    id: "V-002",
    patientId: "SHQ-1001",
    doctorName: "Dr. Gupta",
    date: "2026-02-05",
    diagnosis: "Routine diabetes follow-up",
    prescription: "Continue Metformin 500mg, add Glimepiride 1mg",
    notes: "HbA1c improved to 7.2%. Continue monitoring fasting sugar. Next review in 1 month.",
  },
  {
    id: "V-003",
    patientId: "SHQ-1001",
    doctorName: "Dr. Sharma",
    date: "2026-02-18",
    diagnosis: "Seasonal allergic rhinitis",
    prescription: "Cetirizine 10mg, Fluticasone nasal spray",
    notes: "Avoid dust exposure. Allergy to Penicillin noted - prescribed non-penicillin alternatives.",
  },
  {
    id: "V-004",
    patientId: "SHQ-1002",
    doctorName: "Dr. Williams",
    date: "2026-02-10",
    diagnosis: "Acute asthma exacerbation",
    prescription: "Salbutamol Inhaler PRN, Budesonide 200mcg",
    notes: "SpO2 was 94% on arrival. Nebulized in ER. Avoid cold air and smoke. Return if worsening.",
  },
  {
    id: "V-005",
    patientId: "SHQ-1002",
    doctorName: "Dr. Patel",
    date: "2026-02-17",
    diagnosis: "Post-exacerbation follow-up",
    prescription: "Continue Budesonide, add Montelukast 10mg",
    notes: "Lung function improving. Peak flow 85% predicted. Review inhaler technique.",
  },
  {
    id: "V-006",
    patientId: "SHQ-1003",
    doctorName: "Dr. Kumar",
    date: "2026-02-15",
    diagnosis: "Uncontrolled hypertension - BP 158/96 mmHg",
    prescription: "Amlodipine 5mg, Losartan 50mg, Aspirin 75mg",
    notes: "Added Losartan to regimen. Advised low sodium diet. ECG shows mild LVH. Echocardiogram ordered.",
  },
  {
    id: "V-007",
    patientId: "SHQ-1003",
    doctorName: "Dr. Reddy",
    date: "2026-02-20",
    diagnosis: "Cardiology consultation - stable angina",
    prescription: "Atorvastatin 40mg, Nitroglycerin PRN",
    notes: "Echo shows EF 55%. Mild diastolic dysfunction. Stress test recommended. Continue all current meds.",
  },
  {
    id: "V-008",
    patientId: "SHQ-1004",
    doctorName: "Dr. Martinez",
    date: "2026-02-08",
    diagnosis: "Migraine with aura - 3 episodes this month",
    prescription: "Sumatriptan 50mg PRN, Propranolol 40mg daily",
    notes: "Starting prophylactic therapy. Maintain headache diary. Avoid known triggers.",
  },
  {
    id: "V-009",
    patientId: "SHQ-1004",
    doctorName: "Dr. Lee",
    date: "2026-02-19",
    diagnosis: "Thyroid function review",
    prescription: "Levothyroxine 75mcg, continue Propranolol",
    notes: "TSH 5.8 - slightly elevated. Increased Levothyroxine dose. Recheck in 6 weeks.",
  },
  {
    id: "V-010",
    patientId: "SHQ-1005",
    doctorName: "Dr. Thompson",
    date: "2026-02-12",
    diagnosis: "COPD exacerbation with productive cough",
    prescription: "Azithromycin 500mg, Prednisolone 30mg taper, Tiotropium",
    notes: "FEV1 at 42% predicted. Chest X-ray shows hyperinflation. Oxygen sats 91% on room air.",
  },
  {
    id: "V-011",
    patientId: "SHQ-1005",
    doctorName: "Dr. Kumar",
    date: "2026-02-18",
    diagnosis: "AFib rate control check + CKD monitoring",
    prescription: "Metoprolol 50mg, Apixaban 2.5mg, Furosemide 20mg",
    notes: "Heart rate 78bpm. Creatinine 2.1 mg/dL (eGFR 32). Reduced Apixaban dose for renal function.",
  },
]

const dummyAccessLogs: AccessLog[] = [
  {
    id: "AL-001",
    patientId: "SHQ-1001",
    accessedBy: "Dr. Sharma",
    accessType: "consent",
    timestamp: "2026-01-20T10:00:00Z",
    duration: "15 min",
  },
  {
    id: "AL-002",
    patientId: "SHQ-1001",
    accessedBy: "Dr. Gupta",
    accessType: "consent",
    timestamp: "2026-02-05T14:30:00Z",
    duration: "15 min",
  },
  {
    id: "AL-003",
    patientId: "SHQ-1001",
    accessedBy: "Dr. Sharma",
    accessType: "scan",
    timestamp: "2026-02-18T09:15:00Z",
    duration: "12 min",
  },
  {
    id: "AL-004",
    patientId: "SHQ-1002",
    accessedBy: "Dr. Williams",
    accessType: "emergency",
    timestamp: "2026-02-10T03:15:00Z",
    duration: "8 min",
  },
  {
    id: "AL-005",
    patientId: "SHQ-1002",
    accessedBy: "Dr. Patel",
    accessType: "consent",
    timestamp: "2026-02-17T10:00:00Z",
    duration: "15 min",
  },
  {
    id: "AL-006",
    patientId: "SHQ-1003",
    accessedBy: "Dr. Kumar",
    accessType: "consent",
    timestamp: "2026-02-15T11:45:00Z",
    duration: "15 min",
  },
  {
    id: "AL-007",
    patientId: "SHQ-1003",
    accessedBy: "Dr. Reddy",
    accessType: "consent",
    timestamp: "2026-02-20T14:20:00Z",
    duration: "15 min",
  },
  {
    id: "AL-008",
    patientId: "SHQ-1004",
    accessedBy: "Dr. Martinez",
    accessType: "scan",
    timestamp: "2026-02-08T16:00:00Z",
    duration: "10 min",
  },
  {
    id: "AL-009",
    patientId: "SHQ-1004",
    accessedBy: "Dr. Lee",
    accessType: "consent",
    timestamp: "2026-02-19T11:30:00Z",
    duration: "15 min",
  },
  {
    id: "AL-010",
    patientId: "SHQ-1005",
    accessedBy: "ER Team - City Hospital",
    accessType: "emergency",
    timestamp: "2026-02-12T02:45:00Z",
    duration: "6 min",
  },
  {
    id: "AL-011",
    patientId: "SHQ-1005",
    accessedBy: "Dr. Thompson",
    accessType: "consent",
    timestamp: "2026-02-12T09:00:00Z",
    duration: "15 min",
  },
  {
    id: "AL-012",
    patientId: "SHQ-1005",
    accessedBy: "Dr. Kumar",
    accessType: "consent",
    timestamp: "2026-02-18T15:30:00Z",
    duration: "15 min",
  },
]

const dummyPrescriptions: Prescription[] = [
  {
    id: "RX-001",
    patientId: "SHQ-1001",
    doctorName: "Dr. Sharma",
    medicines: [
      { name: "Metformin", dosage: "500mg twice daily", duration: "30 days" },
      { name: "Vitamin D3", dosage: "60000 IU weekly", duration: "8 weeks" },
    ],
    notes: "Take Metformin after meals. Check fasting blood sugar weekly. Avoid sugary drinks.",
    date: "2026-01-20",
  },
  {
    id: "RX-002",
    patientId: "SHQ-1001",
    doctorName: "Dr. Gupta",
    medicines: [
      { name: "Metformin", dosage: "500mg twice daily", duration: "30 days" },
      { name: "Glimepiride", dosage: "1mg before breakfast", duration: "30 days" },
    ],
    notes: "Monitor for hypoglycemia symptoms. Keep glucose tablets handy. Next HbA1c in 3 months.",
    date: "2026-02-05",
  },
  {
    id: "RX-003",
    patientId: "SHQ-1002",
    doctorName: "Dr. Williams",
    medicines: [
      { name: "Salbutamol Inhaler", dosage: "2 puffs PRN", duration: "As needed" },
      { name: "Budesonide Inhaler", dosage: "200mcg twice daily", duration: "60 days" },
    ],
    notes: "Use spacer with inhaler. Rinse mouth after Budesonide. Seek ER if no relief after 3 puffs.",
    date: "2026-02-10",
  },
  {
    id: "RX-004",
    patientId: "SHQ-1003",
    doctorName: "Dr. Kumar",
    medicines: [
      { name: "Amlodipine", dosage: "5mg once daily", duration: "30 days" },
      { name: "Losartan", dosage: "50mg once daily", duration: "30 days" },
      { name: "Aspirin", dosage: "75mg after lunch", duration: "Ongoing" },
    ],
    notes: "Note: Patient allergic to NSAIDs and higher dose Aspirin. Low-dose Aspirin tolerated. Monitor BP at home twice daily.",
    date: "2026-02-15",
  },
  {
    id: "RX-005",
    patientId: "SHQ-1005",
    doctorName: "Dr. Thompson",
    medicines: [
      { name: "Azithromycin", dosage: "500mg day 1, then 250mg", duration: "5 days" },
      { name: "Prednisolone", dosage: "30mg daily, taper over 7 days", duration: "7 days" },
      { name: "Tiotropium", dosage: "18mcg once daily", duration: "30 days" },
    ],
    notes: "Avoid Codeine-based cough suppressants (allergy). Use incentive spirometer. Oxygen PRN if sats below 92%.",
    date: "2026-02-12",
  },
]

// Store state
let patients = [...dummyPatients]
let visits = [...dummyVisits]
let accessLogs = [...dummyAccessLogs]
let prescriptions = [...dummyPrescriptions]
let consentSessions: ConsentSession[] = []

// Patient CRUD
export function getPatients(): Patient[] {
  return patients
}

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id)
}

export function addPatient(data: Omit<Patient, "id" | "registeredAt">): Patient {
  const patient: Patient = {
    ...data,
    id: generateId(),
    registeredAt: new Date().toISOString(),
  }
  patients = [patient, ...patients]
  return patient
}

// Visit CRUD
export function getVisits(patientId: string): Visit[] {
  return visits.filter((v) => v.patientId === patientId)
}

export function addVisit(data: Omit<Visit, "id">): Visit {
  const visit: Visit = {
    ...data,
    id: generateId("V"),
  }
  visits = [visit, ...visits]
  return visit
}

// Access Logs
export function getAccessLogs(patientId?: string): AccessLog[] {
  if (patientId) {
    return accessLogs.filter((l) => l.patientId === patientId)
  }
  return accessLogs
}

export function addAccessLog(data: Omit<AccessLog, "id">): AccessLog {
  const log: AccessLog = {
    ...data,
    id: generateId("AL"),
  }
  accessLogs = [log, ...accessLogs]
  return log
}

// Prescriptions
export function getPrescriptions(patientId: string): Prescription[] {
  return prescriptions.filter((p) => p.patientId === patientId)
}

export function addPrescription(data: Omit<Prescription, "id">): Prescription {
  const prescription: Prescription = {
    ...data,
    id: generateId("RX"),
  }
  prescriptions = [prescription, ...prescriptions]
  return prescription
}

// Consent
export function grantConsent(
  patientId: string,
  doctorName: string
): ConsentSession {
  const session: ConsentSession = {
    patientId,
    doctorName,
    grantedAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  }
  consentSessions = [
    ...consentSessions.filter(
      (s) => !(s.patientId === patientId && s.doctorName === doctorName)
    ),
    session,
  ]
  return session
}

export function checkConsent(
  patientId: string,
  doctorName: string
): ConsentSession | null {
  const session = consentSessions.find(
    (s) => s.patientId === patientId && s.doctorName === doctorName
  )
  if (session && session.expiresAt > Date.now()) {
    return session
  }
  return null
}

export function revokeConsent(patientId: string, doctorName: string): void {
  consentSessions = consentSessions.filter(
    (s) => !(s.patientId === patientId && s.doctorName === doctorName)
  )
}

// Risk level calculator
export function calculateRiskLevel(
  patient: Patient
): "low" | "medium" | "high" | "critical" {
  let riskScore = 0
  if (patient.allergies && patient.allergies.toLowerCase() !== "none") {
    riskScore += patient.allergies.split(",").length
  }
  if (patient.chronicDisease && patient.chronicDisease.toLowerCase() !== "none") {
    riskScore += patient.chronicDisease.split(",").length * 2
  }
  if (patient.age > 60) riskScore += 2
  else if (patient.age > 45) riskScore += 1

  if (riskScore >= 6) return "critical"
  if (riskScore >= 4) return "high"
  if (riskScore >= 2) return "medium"
  return "low"
}
