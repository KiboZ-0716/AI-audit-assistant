import { Link, useParams } from 'react-router-dom'
import { useAuditStore } from '@/stores/auditStore'

export function ReportDetailPage() {
  const { projectId = '', reportId = '' } = useParams()
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))
  const updateReportItem = useAuditStore((s) => s.updateReportItem)

  if (!workspace) return null

  const report = workspace.auditReports.find((r) => r.id === reportId)

  if (!report) {
    return (
      <section className="border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-600">
        未找到该报告
        <div className="mt-3">
          <Link to={`/projects/${projectId}/reports`} className="underline">
            返回报告列表
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      <Link
        to={`/projects/${projectId}/reports`}
        className="text-xs font-medium text-slate-500 hover:text-slate-800"
      >
        ← 返回报告列表
      </Link>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{report.title}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{report.plant}</span>
            <span>{report.period}</span>
            <span>生成于 {report.generatedAt}</span>
            <span>{report.status === 'published' ? '已发布' : '草稿'}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{report.summary}</p>
        </div>
        <div className="px-5 py-4">
          <textarea
            className="min-h-80 w-full border border-slate-200 px-3 py-2 text-sm leading-relaxed"
            value={report.content}
            onChange={(e) => updateReportItem(projectId, report.id, { content: e.target.value })}
          />
        </div>
      </section>
    </div>
  )
}
