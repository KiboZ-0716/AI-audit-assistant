import type { AuditProjectProgress } from '@/types/audit'

interface ProjectProgressProps {
  progress: AuditProjectProgress
}

export function ProjectProgress({ progress }: ProjectProgressProps) {
  const percent = Math.min(100, Math.max(0, progress.percent))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="truncate">{progress.label}</span>
        <span className="shrink-0 tabular-nums text-slate-700">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-700 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
