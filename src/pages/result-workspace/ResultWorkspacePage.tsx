import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProjectStatusBadge } from '@/components/business/ProjectStatusBadge'
import { WorkspacePhaseRail } from '@/components/business/WorkspacePhaseRail'
import { useAuditStore } from '@/stores/auditStore'

export function ResultWorkspacePage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)

  const project = useAuditStore((s) => s.projects.find((p) => p.id === projectId))
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))
  const updateIssue = useAuditStore((s) => s.updateIssue)

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

  const issues = workspace.issues
  const active = issues.find((i) => i.id === activeId) ?? issues[0]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/projects" className="text-xs font-medium text-slate-500 hover:text-slate-800">
          ← 返回审核项目
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/projects/${projectId}/report`)}
          className="bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          进入报告中心
        </button>
      </div>

      <header className="space-y-3 border border-slate-200 bg-white px-5 py-4">
        <div className="text-xs font-medium tracking-wide text-slate-500">人工复审工作台</div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{workspace.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="text-sm text-slate-500">
          对 AI 给出的问题描述与打分结果进行审阅和修改。正式交付物在报告中心独立导出。
        </p>
        <WorkspacePhaseRail activeStep="review" />
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            问题列表（{issues.length}）
          </div>
          <ul className="divide-y divide-slate-100">
            {issues.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(issue.id)}
                  className={[
                    'block w-full px-5 py-3 text-left hover:bg-slate-50',
                    active?.id === issue.id ? 'bg-slate-50' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-900">{issue.subElementName}</span>
                    <span className="text-xs tabular-nums text-slate-600">评分 {issue.score}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{issue.description}</p>
                  {issue.modified && (
                    <span className="mt-1 inline-block text-[11px] text-amber-700">已人工修改</span>
                  )}
                </button>
              </li>
            ))}
            {issues.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-slate-500">暂无问题，请先完成 AI 审核</li>
            )}
          </ul>
        </section>

        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900">
            问题详情与修改
          </div>
          {active ? (
            <div className="space-y-3 px-5 py-4">
              <div className="text-xs text-slate-500">标准依据</div>
              <div className="text-sm text-slate-800">{active.standardRef}</div>
              <div className="border border-sky-100 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-900">
                {active.rationale}
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs text-slate-500">问题描述</span>
                <textarea
                  className="min-h-24 w-full border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
                  value={active.description}
                  onChange={(e) =>
                    updateIssue(projectId, active.id, { description: e.target.value })
                  }
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs text-slate-500">打分结果（0-10）</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  className="w-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  value={active.score}
                  onChange={(e) =>
                    updateIssue(projectId, active.id, {
                      score: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-slate-500">请选择问题</div>
          )}
        </section>
      </div>
    </div>
  )
}
