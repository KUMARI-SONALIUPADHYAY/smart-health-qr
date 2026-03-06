"use client"

import { useEffect, useState } from "react"
import {
  ClipboardList,
  Search,
  Shield,
  Zap,
  ScanLine,
  Filter,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAccessLogs, type AccessLog } from "@/lib/store"

const accessTypeConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>
    color: string
    label: string
  }
> = {
  consent: {
    icon: Shield,
    color: "bg-success/10 text-success border-success/20",
    label: "Consent",
  },
  emergency: {
    icon: Zap,
    color: "bg-destructive/10 text-destructive border-destructive/20",
    label: "Emergency",
  },
  scan: {
    icon: ScanLine,
    color: "bg-primary/10 text-primary border-primary/20",
    label: "Scan",
  },
}

export function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [filter, setFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    setLogs(getAccessLogs())
  }, [])

  const filtered = logs.filter((log) => {
    const matchesSearch =
      !filter ||
      log.patientId.toLowerCase().includes(filter.toLowerCase()) ||
      log.accessedBy.toLowerCase().includes(filter.toLowerCase())
    const matchesType =
      typeFilter === "all" || log.accessType === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              Access Logs
            </h1>
            <p className="text-muted-foreground">
              Complete audit trail of all medical record access
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Patient ID or Doctor name..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {["all", "consent", "emergency", "scan"].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Accesses"
          value={logs.length}
          icon={ClipboardList}
        />
        <StatsCard
          label="Consent Based"
          value={logs.filter((l) => l.accessType === "consent").length}
          icon={Shield}
          color="text-success"
        />
        <StatsCard
          label="Emergency Accesses"
          value={logs.filter((l) => l.accessType === "emergency").length}
          icon={Zap}
          color="text-destructive"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Access Records</CardTitle>
          <CardDescription>
            Showing {filtered.length} of {logs.length} total records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-secondary/50 py-12 text-muted-foreground">
              <ClipboardList className="h-8 w-8" />
              <p>No access logs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Accessed By</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => {
                  const config = accessTypeConfig[log.accessType]
                  const TypeIcon = config?.icon || Shield
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.id}
                      </TableCell>
                      <TableCell className="font-mono font-medium">
                        {log.patientId}
                      </TableCell>
                      <TableCell>{log.accessedBy}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`gap-1 ${config?.color || ""}`}
                        >
                          <TypeIcon className="h-3 w-3" />
                          {config?.label || log.accessType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.duration}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Icon className={`h-5 w-5 ${color || "text-primary"}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
