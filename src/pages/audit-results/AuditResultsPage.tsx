import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuditStore } from '@/stores/auditStore'

export function AuditResultsPage() {
  const { projectId = '' } = useParams()
  const [activeId, setActiveId] = useState<string | null>(null)

  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))
  const updateIssue = useAuditStore((s) => s.updateIssue)
  const updateMajorSummary = useAuditStore((s) => s.updateMajorSummary)

  if (!workspace) return null

  const issues = workspace.issues
  const active = issues.find((i) => i.id === activeId) ?? issues[0]
  const tableRows =
    issues.length > 0
      ? issues.map((issue, idx) => ({
          id: issue.id,
          seq: idx + 1,
          area: '-',
          project: '-',
          subElement: issue.subElementName,
          description: issue.description,
          severity: issue.score,
          attribute: issue.source,
          editable: true,
        }))
      : workspace.bipIssues.map((row) => ({
          id: row.id,
          seq: row.seq,
          area: row.area,
          project: row.project,
          subElement: row.subElement,
          description: row.description,
          severity: row.severity,
          attribute: row.attribute,
          editable: false,
        }))

  return (
    <div className="space-y-5">
      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">人工复审 · BIP 问题管理表</h2>
          <p className="mt-0.5 text-xs text-slate-500">对 AI 识别的问题描述与打分进行审阅修改</p>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="overflow-x-auto border-b border-slate-100 lg:border-b-0 lg:border-r">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-medium">序号</th>
                  <th className="px-3 py-2 font-medium">区域</th>
                  <th className="px-3 py-2 font-medium">项目</th>
                  <th className="px-3 py-2 font-medium">子要素</th>
                  <th className="px-3 py-2 font-medium">问题描述</th>
                  <th className="px-3 py-2 font-medium">严重度</th>
                  <th className="px-3 py-2 font-medium">属性</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className={[
                      'border-t border-slate-100',
                      row.editable ? 'cursor-pointer hover:bg-slate-50' : '',
                      active?.id === row.id ? 'bg-slate-50' : '',
                    ].join(' ')}
                    onClick={() => row.editable && setActiveId(row.id)}
                  >
                    <td className="px-3 py-2 tabular-nums">{row.seq}</td>
                    <td className="px-3 py-2">{row.area}</td>
                    <td className="px-3 py-2">{row.project}</td>
                    <td className="px-3 py-2">{row.subElement}</td>
                    <td className="max-w-xs truncate px-3 py-2">{row.description}</td>
                    <td className="px-3 py-2 tabular-nums">{row.severity}</td>
                    <td className="px-3 py-2">{row.attribute}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">问题详情与修改</h3>
            {active ? (
              <div className="mt-3 space-y-3">
                <div className="text-xs text-slate-500">标准依据 · {active.standardRef}</div>
                <textarea
                  className="min-h-24 w-full border border-slate-200 px-3 py-2 text-sm"
                  value={active.description}
                  onChange={(e) =>
                    updateIssue(projectId, active.id, { description: e.target.value })
                  }
                />
                <label className="block text-xs text-slate-500">
                  严重度（赋分）
                  <input
                    type="number"
                    min={0}
                    max={10}
                    className="mt-1 w-full border border-slate-200 px-3 py-2 text-sm"
                    value={active.score}
                    onChange={(e) =>
                      updateIssue(projectId, active.id, { score: Number(e.target.value) })
                    }
                  />
                </label>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                {issues.length > 0 ? '请选择问题行进行编辑' : '展示 Excel 样例数据，完成 AI 审核后可编辑'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">主要问题总结</h2>
          <p className="mt-0.5 text-xs text-slate-500">对应 Excel「主要问题总结」工作表</p>
        </div>
        <div className="px-5 py-4">
          <textarea
            className="min-h-40 w-full border border-slate-200 px-3 py-2 text-sm leading-relaxed text-slate-800"
            value={workspace.majorIssueSummary}
            onChange={(e) => updateMajorSummary(projectId, e.target.value)}
          />
        </div>
      </section>
    </div>
  )
}
