import { Link } from 'react-router-dom'
import { useAuditStore } from '@/stores/auditStore'

export function MobileTasksPage() {
  const projects = useAuditStore((s) =>
    s.projects.filter(
      (p) => p.status === 'configuring' || p.status === 'pending_review' || p.status === 'ai_running',
    ),
  )

  return (
    <section className="space-y-3">
      <div>
        <h1 className="text-base font-semibold text-slate-900">我的审核任务</h1>
        <p className="mt-1 text-xs text-slate-500">用于人工录入类子要素的现场取证</p>
      </div>
      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p.id}>
            <Link
              to={`/m/tasks/${p.id}`}
              className="block border border-slate-200 bg-white px-3 py-3"
            >
              <div className="text-sm font-medium text-slate-900">{p.name}</div>
              <div className="mt-1 text-xs text-slate-500">
                {p.plant} · {p.area}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
