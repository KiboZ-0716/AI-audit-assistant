import { computeSubElementStatus, type ScopeAreaNode, type SubElementConfigStatus } from '@/types/audit'

const STATUS_LABEL: Record<SubElementConfigStatus, string> = {
  unselected: '未选择',
  missing_source: '缺少数据源',
  configured: '已完成配置',
}

interface ScopeTreePanelProps {
  tree: ScopeAreaNode[]
  selectedId: string | null
  locked: boolean
  onSelect: (id: string) => void
  onToggleSelected: (id: string) => void
}

export function ScopeTreePanel({
  tree,
  selectedId,
  locked,
  onSelect,
  onToggleSelected,
}: ScopeTreePanelProps) {
  return (
    <div className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">审核对象树</h2>
        <p className="mt-0.5 text-xs text-slate-500">区域 → 项目 → 子要素</p>
      </div>
      <div className="max-h-[32rem] space-y-3 overflow-auto p-3">
        {tree.map((area) => (
          <div key={area.id}>
            <div className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {area.name}
            </div>
            <div className="mt-1 space-y-2">
              {area.projects.map((project) => (
                <div key={project.id} className="border border-slate-100 bg-slate-50/80 p-2">
                  <div className="px-1 text-xs font-medium text-slate-700">{project.name}</div>
                  <ul className="mt-1 space-y-1">
                    {project.subElements.map((se) => {
                      const status = computeSubElementStatus(se)
                      const active = selectedId === se.id
                      return (
                        <li key={se.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(se.id)}
                            className={[
                              'flex w-full items-start gap-2 px-2 py-2 text-left text-sm',
                              active ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 hover:bg-slate-100',
                            ].join(' ')}
                          >
                            <input
                              type="checkbox"
                              className="mt-1"
                              checked={se.selected}
                              disabled={locked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => onToggleSelected(se.id)}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium">{se.name}</span>
                              <span
                                className={[
                                  'mt-0.5 block text-[11px]',
                                  active ? 'text-slate-300' : 'text-slate-500',
                                ].join(' ')}
                              >
                                {STATUS_LABEL[status]}
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
