import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { useEffect } from 'react'
import { PROJECT_FLOW_NAV, projectFlowPath, ACTIVE_PROJECT_KEY } from '@/lib/project-flow-nav'

export function WebLayout() {
  const projectMatch = useMatch({ path: '/projects/:projectId', end: false })
  const projectIdFromPath = projectMatch?.params.projectId

  useEffect(() => {
    if (projectIdFromPath) {
      sessionStorage.setItem(ACTIVE_PROJECT_KEY, projectIdFromPath)
    }
  }, [projectIdFromPath])

  const projectId =
    projectIdFromPath ?? sessionStorage.getItem(ACTIVE_PROJECT_KEY) ?? undefined

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="text-sm font-semibold tracking-wide text-slate-800">
            AI 智能审核助手
          </div>
          <nav className="flex flex-wrap items-center gap-1">
            <NavLink
              to="/projects"
              end
              className={({ isActive }) =>
                [
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              审核项目
            </NavLink>
            {projectId &&
              PROJECT_FLOW_NAV.map((item) => (
                <NavLink
                  key={item.segment}
                  to={projectFlowPath(projectId, item.segment)}
                  className={({ isActive }) =>
                    [
                      'rounded-md px-3 py-1.5 text-sm transition-colors',
                      !projectId
                        ? 'pointer-events-none text-slate-300'
                        : projectIdFromPath && isActive
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
