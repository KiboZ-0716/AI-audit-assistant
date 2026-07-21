import { Link, useParams } from 'react-router-dom'
import { flattenSubElements } from '@/features/audit-project/workspace-utils'
import { useAuditStore } from '@/stores/auditStore'

export function MobileFieldWorkspacePage() {
  const { projectId = '' } = useParams()
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))
  const patchSubElementSources = useAuditStore((s) => s.patchSubElementSources)

  if (!workspace) {
    return (
      <section className="border border-slate-200 bg-white p-4 text-sm text-slate-600">
        未找到任务
        <div className="mt-2">
          <Link to="/m/tasks" className="underline">
            返回
          </Link>
        </div>
      </section>
    )
  }

  const manualItems = flattenSubElements(workspace.scopeTree).filter(
    (s) => s.selected && s.dataSources.manualEnabled,
  )

  return (
    <section className="space-y-3">
      <div>
        <Link to="/m/tasks" className="text-xs text-slate-500">
          ← 任务列表
        </Link>
        <h1 className="mt-2 text-base font-semibold text-slate-900">现场取证</h1>
        <p className="mt-1 text-xs text-slate-500">{workspace.name}</p>
      </div>

      {manualItems.length === 0 && (
        <div className="border border-slate-200 bg-white p-4 text-sm text-slate-500">
          当前任务没有「人工录入」类子要素
        </div>
      )}

      <ul className="space-y-2">
        {manualItems.map((item) => (
          <li key={item.id} className="border border-slate-200 bg-white p-3">
            <div className="text-sm font-medium text-slate-900">{item.name}</div>
            <div className="mt-1 text-xs text-slate-500">
              取证状态：
              {item.dataSources.manualEvidenceStatus === 'uploaded' ? '已取证' : '待现场取证'}
            </div>
            <button
              type="button"
              className="mt-3 w-full bg-slate-900 px-3 py-2 text-sm text-white"
              onClick={() =>
                patchSubElementSources(projectId, item.id, {
                  manualEvidenceStatus: 'uploaded',
                })
              }
            >
              模拟拍照上传
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
