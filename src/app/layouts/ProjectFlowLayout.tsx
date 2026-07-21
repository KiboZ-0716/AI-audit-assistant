import { Link, Outlet, useParams } from 'react-router-dom'
import { ProjectStatusBadge } from '@/components/business/ProjectStatusBadge'
import { useAuditStore } from '@/stores/auditStore'

export function ProjectFlowLayout() {
  const { projectId = '' } = useParams()
  const project = useAuditStore((s) => s.projects.find((p) => p.id === projectId))
  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))

  if (!project || !workspace) {
    return (
      <section className="border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-600">
        未找到该审核项目
        <div className="mt-3">
          <Link to="/projects" className="underline">
            返回列表
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <header className="border border-slate-200 bg-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{workspace.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>周期 · {workspace.period || '待选择'}</span>
          <span>基地 · {workspace.plant || '待选择'}</span>
          <span>负责人 · {workspace.owner}</span>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
