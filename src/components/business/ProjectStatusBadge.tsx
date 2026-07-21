import type { AuditProjectStatus } from '@/types/audit'
import { AUDIT_STATUS_LABEL } from '@/lib/project-navigation'

const STATUS_STYLE: Record<AuditProjectStatus, string> = {
  configuring: 'bg-slate-100 text-slate-700 ring-slate-200',
  ai_running: 'bg-sky-50 text-sky-800 ring-sky-200',
  pending_review: 'bg-amber-50 text-amber-800 ring-amber-200',
  report_ready: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
}

export function ProjectStatusBadge({ status }: { status: AuditProjectStatus }) {
  return (
    <span
      className={[
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        STATUS_STYLE[status],
      ].join(' ')}
    >
      {AUDIT_STATUS_LABEL[status]}
    </span>
  )
}
