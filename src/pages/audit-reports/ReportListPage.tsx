import { Link, useParams } from 'react-router-dom'
import { useAuditStore } from '@/stores/auditStore'

export function ReportListPage() {
  const { projectId = '' } = useParams()
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))

  if (!workspace) return null

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">审核报告</h2>
        <p className="mt-0.5 text-xs text-slate-500">查看报告列表，点击进入详情</p>
      </div>
      <ul className="divide-y divide-slate-100">
        {workspace.auditReports.map((report) => (
          <li key={report.id}>
            <Link
              to={`/projects/${projectId}/reports/${report.id}`}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50"
            >
              <div>
                <div className="text-sm font-medium text-slate-900">{report.title}</div>
                <div className="mt-1 text-xs text-slate-500">{report.summary}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {report.plant} · {report.period} · {report.generatedAt}
                </div>
              </div>
              <span
                className={[
                  'rounded px-2 py-0.5 text-xs font-medium',
                  report.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700',
                ].join(' ')}
              >
                {report.status === 'published' ? '已发布' : '草稿'}
              </span>
            </Link>
          </li>
        ))}
        {workspace.auditReports.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-slate-500">暂无审核报告</li>
        )}
      </ul>
    </section>
  )
}
