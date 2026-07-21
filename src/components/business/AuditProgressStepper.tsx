import type { AiExecutionState, AiStageStatus } from '@/types/audit'

export interface AuditProgressStep {
  id: string
  label: string
  status: AiStageStatus
  description: string
}

export function buildAuditProgressSteps(ai: AiExecutionState): AuditProgressStep[] {
  const parse = ai.stageStatuses[0] ?? 'pending'
  const match = ai.stageStatuses[1] ?? 'pending'
  const detect = ai.stageStatuses[2] ?? 'pending'

  const fetchStatus: AiStageStatus = parse !== 'pending' ? 'done' : 'running'

  return [
    {
      id: 'fetch',
      label: '数据获取',
      status: fetchStatus,
      description:
        fetchStatus === 'done'
          ? '成功获取 QMS 系统数据，共获取质量记录 412 条'
          : '正在连接系统并拉取数据…',
    },
    {
      id: 'parse',
      label: '资料解析',
      status: parse,
      description:
        parse === 'done'
          ? '识别上传文件内容，已解析 3 份质量管理资料'
          : parse === 'running'
            ? '正在按子要素解析文件与系统数据…'
            : '等待数据获取完成',
    },
    {
      id: 'match',
      label: '审核标准匹配',
      status: match,
      description:
        match === 'done'
          ? '已匹配质量审核知识库规则 (v2.3)，共 28 条适用规则'
          : match === 'running'
            ? '正在检索并命中知识库审核标准条款…'
            : '等待资料解析完成',
    },
    {
      id: 'detect',
      label: 'AI 智能审核',
      status: detect,
      description:
        detect === 'done'
          ? '已完成问题识别与描述及评分'
          : detect === 'running'
            ? 'AI 正在分析质量数据，请稍候…'
            : '等待标准匹配完成',
    },
    {
      id: 'report',
      label: '生成审核报告',
      status: detect === 'done' ? 'running' : 'pending',
      description: '等待审核完成后自动生成',
    },
  ]
}

interface AuditProgressStepperProps {
  ai: AiExecutionState
}

export function AuditProgressStepper({ ai }: AuditProgressStepperProps) {
  const steps = buildAuditProgressSteps(ai)

  return (
    <aside className="border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">审核进度</h2>
      <ol className="mt-4 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          return (
            <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className={[
                    'absolute left-[11px] top-6 h-[calc(100%-12px)] w-px',
                    step.status === 'done' ? 'bg-emerald-300' : 'bg-slate-200',
                  ].join(' ')}
                />
              )}
              <StepIcon status={step.status} index={index} />
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{step.label}</span>
                  <StatusTag status={step.status} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
        预计完成时间：约 3 分钟
      </p>
    </aside>
  )
}

function StepIcon({ status, index }: { status: AiStageStatus; index: number }) {
  if (status === 'done') {
    return (
      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
        ✓
      </span>
    )
  }
  if (status === 'running') {
    return (
      <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-sky-500 bg-white">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
      </span>
    )
  }
  return (
    <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-[11px] text-slate-400">
      {index + 1}
    </span>
  )
}

function StatusTag({ status }: { status: AiStageStatus }) {
  const map = {
    done: 'bg-emerald-50 text-emerald-700',
    running: 'bg-sky-50 text-sky-700',
    pending: 'bg-slate-100 text-slate-500',
  }
  const label = { done: '已完成', running: '进行中', pending: '等待' }
  return (
    <span className={['rounded px-1.5 py-0.5 text-[10px] font-medium', map[status]].join(' ')}>
      {label[status]}
    </span>
  )
}
