import { useParams } from 'react-router-dom'
import { useAuditStore } from '@/stores/auditStore'

export function ComplianceScoresPage() {
  const { projectId = '' } = useParams()
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))

  if (!workspace) return null

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">符合率评分表</h2>
        <p className="mt-0.5 text-xs text-slate-500">对应 Excel「符合率评分表」工作表</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">制造基地</th>
              <th className="px-3 py-2 font-medium">区域</th>
              <th className="px-3 py-2 font-medium">标定时间</th>
              <th className="px-3 py-2 font-medium">项目</th>
              <th className="px-3 py-2 font-medium">子要素</th>
              <th className="px-3 py-2 font-medium">得分</th>
              <th className="px-3 py-2 font-medium">符合率</th>
            </tr>
          </thead>
          <tbody>
            {workspace.complianceScores.map((row, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-3 py-2">{row.plant}</td>
                <td className="px-3 py-2">{row.area}</td>
                <td className="px-3 py-2 tabular-nums">{row.calibrateTime}</td>
                <td className="px-3 py-2">{row.project}</td>
                <td className="px-3 py-2">{row.subElement}</td>
                <td className="px-3 py-2 tabular-nums">{row.score ?? '-'}</td>
                <td className="px-3 py-2 tabular-nums">
                  {row.complianceRate != null ? `${row.complianceRate}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
