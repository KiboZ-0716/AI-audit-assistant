import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProjectStatusBadge } from '@/components/business/ProjectStatusBadge'
import { useAuditStore } from '@/stores/auditStore'
import type { ReportAssetType } from '@/types/audit'

const TABS: { type: ReportAssetType; label: string }[] = [
  { type: 'bip', label: 'BIP 问题管理表' },
  { type: 'score', label: '问题打分结果' },
  { type: 'common_issues', label: '共性问题总结' },
  { type: 'comprehensive', label: '综合性报告' },
]

export function ReportWorkspacePage() {
  const { projectId = '' } = useParams()
  const [activeType, setActiveType] = useState<ReportAssetType>('bip')
  const [downloadHint, setDownloadHint] = useState<string | null>(null)

  const project = useAuditStore((s) => s.projects.find((p) => p.id === projectId))
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))
  const generateReport = useAuditStore((s) => s.generateReport)
  const updateReportContent = useAuditStore((s) => s.updateReportContent)

  if (!projectId || !project || !workspace) {
    return (
      <section className="border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-600">
        未找到审核项目
        <div className="mt-3">
          <Link to="/projects" className="underline">
            返回列表
          </Link>
        </div>
      </section>
    )
  }

  const active = workspace.reports.find((r) => r.type === activeType)!

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/projects" className="text-xs font-medium text-slate-500 hover:text-slate-800">
          ← 返回审核项目
        </Link>
        <Link
          to={`/projects/${projectId}/results`}
          className="text-xs font-medium text-slate-700 underline"
        >
          返回人工复审
        </Link>
      </div>

      <header className="border border-slate-200 bg-white px-5 py-4">
        <div className="text-xs font-medium tracking-wide text-slate-500">报告中心</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{workspace.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="mt-2 text-sm text-slate-500">
          四类 AI 产出并列管理，支持人工修改与独立下载（模板后续提供，Demo 模拟导出）。
        </p>
      </header>

      <div className="flex flex-wrap gap-2 border border-slate-200 bg-white p-2">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => {
              setActiveType(tab.type)
              setDownloadHint(null)
            }}
            className={[
              'px-3 py-2 text-sm',
              activeType === tab.type
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{active.title}</h2>
            <p className="text-xs text-slate-500">
              {active.generated ? '已生成，可修改后下载' : '尚未生成，请先触发生成'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => generateReport(projectId, activeType)}
              className="border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50"
            >
              {active.generated ? '重新生成' : '生成'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!active.generated) {
                  generateReport(projectId, activeType)
                }
                setDownloadHint(`已模拟下载：${active.title}`)
              }}
              className="bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              独立下载
            </button>
          </div>
        </div>

        <div className="px-5 py-4">
          {downloadHint && (
            <div className="mb-3 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              {downloadHint}
            </div>
          )}
          <textarea
            className="min-h-64 w-full border border-slate-200 px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none focus:border-slate-400"
            value={active.content}
            onChange={(e) => updateReportContent(projectId, activeType, e.target.value)}
          />
        </div>
      </section>
    </div>
  )
}
