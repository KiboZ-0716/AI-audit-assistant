import { Link, useNavigate } from 'react-router-dom'
import { ProjectProgress } from '@/components/business/ProjectProgress'
import { ProjectStatusBadge } from '@/components/business/ProjectStatusBadge'
import { getProjectDetailPath } from '@/lib/project-navigation'
import { ACTIVE_PROJECT_KEY } from '@/lib/project-flow-nav'
import { useAuditStore } from '@/stores/auditStore'
import type { AuditProject, AuditProjectStatus } from '@/types/audit'

const STATUS_ORDER: AuditProjectStatus[] = [
  'ai_running',
  'pending_review',
  'configuring',
  'report_ready',
]

function sortProjects(projects: AuditProject[]) {
  return [...projects].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  )
}

export function ProjectsPage() {
  const navigate = useNavigate()
  const projectList = useAuditStore((s) => s.projects)
  const createProject = useAuditStore((s) => s.createProject)
  const projects = sortProjects(projectList)

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">审核项目</h1>
          <p className="mt-1 text-sm text-slate-500">
            选择项目进入后，使用顶部导航切换：审核任务 / 审核结果 / 符合率评分 / 审核报告
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const id = createProject()
            sessionStorage.setItem(ACTIVE_PROJECT_KEY, id)
            navigate(`/projects/${id}/task`)
          }}
          className="bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          创建审核项目
        </button>
      </header>

      <section className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-800">项目列表</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {projects.map((project) => {
            const detailPath = getProjectDetailPath(project)
            return (
              <li key={project.id}>
                <Link
                  to={detailPath}
                  onClick={() => sessionStorage.setItem(ACTIVE_PROJECT_KEY, project.id)}
                  className="group block px-5 py-4 transition-colors hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-6">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{project.name}</h3>
                        <ProjectStatusBadge status={project.status} />
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>周期 · {project.period || '待选择'}</span>
                        <span>基地 · {project.plant || '待选择'}</span>
                        <span>区域 · {project.area}</span>
                        <span>负责人 · {project.owner}</span>
                      </div>
                      <p className="text-xs text-slate-600">{project.scopeSummary}</p>
                      <div className="max-w-xl pt-1">
                        <ProjectProgress progress={project.progress} />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-start justify-between gap-3 lg:w-36 lg:items-end">
                      <div className="text-right text-xs text-slate-400">
                        <div>更新于</div>
                        <div className="tabular-nums text-slate-500">{project.updatedAt}</div>
                      </div>
                      {project.issueCount != null && (
                        <div className="text-xs text-slate-500">
                          问题 <span className="font-medium text-slate-700">{project.issueCount}</span> 项
                        </div>
                      )}
                      <span className="text-sm font-medium text-slate-800 group-hover:underline">
                        进入项目 →
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
