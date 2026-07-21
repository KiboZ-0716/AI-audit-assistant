export type WorkspacePhaseStep = 'config' | 'ai' | 'review'

interface WorkspacePhaseRailProps {
  activeStep: WorkspacePhaseStep
}

const STEPS: { id: WorkspacePhaseStep; label: string }[] = [
  { id: 'config', label: '配置' },
  { id: 'ai', label: 'AI审核' },
  { id: 'review', label: '人工复审' },
]

export function WorkspacePhaseRail({ activeStep }: WorkspacePhaseRailProps) {
  const activeIndex = STEPS.findIndex((s) => s.id === activeStep)

  return (
    <div className="grid grid-cols-3 gap-2 text-center text-xs">
      {STEPS.map((step, index) => {
        const isActive = step.id === activeStep
        const isDone = index < activeIndex

        return (
          <div
            key={step.id}
            className={[
              'border px-2 py-2 font-medium transition-colors',
              isActive
                ? 'border-slate-900 bg-slate-900 text-white'
                : isDone
                  ? 'border-slate-400 bg-white text-slate-700'
                  : 'border-slate-200 bg-slate-50 text-slate-400',
            ].join(' ')}
          >
            {step.label}
          </div>
        )
      })}
    </div>
  )
}
