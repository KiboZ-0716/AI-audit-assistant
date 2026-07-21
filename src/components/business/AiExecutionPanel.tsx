import { useState } from 'react'
import type {
  AiDetectSubResult,
  AiExecutionState,
  AiMatchSubResult,
  AiParseSubResult,
  AiStageStatus,
  AiSubStepStatus,
} from '@/types/audit'

interface AiExecutionPanelProps {
  ai: AiExecutionState
}

const SUB_STATUS_LABEL: Record<AiSubStepStatus, string> = {
  pending: '待执行',
  running: '进行中',
  done: '已完成',
  error: '解析失败',
}

const SUB_STATUS_CLASS: Record<AiSubStepStatus, string> = {
  pending: 'text-slate-400',
  running: 'text-sky-700',
  done: 'text-emerald-700',
  error: 'text-amber-700',
}

const STAGE_STATUS_LABEL: Record<AiStageStatus, string> = {
  pending: '待执行',
  running: '进行中',
  done: '已完成',
}

export function AiExecutionPanel({ ai }: AiExecutionPanelProps) {
  const doneCount = ai.stageStatuses.filter((s) => s === 'done').length
  const [expandedParse, setExpandedParse] = useState<Set<string>>(new Set())
  const [expandedMatch, setExpandedMatch] = useState<Set<string>>(new Set())

  const toggle = (set: Set<string>, id: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setter(next)
  }

  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">AI 审核执行</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              资料解析 → 标准匹配 → 问题识别与描述及评分（按子要素展开）
            </p>
          </div>
          <div className="text-xs text-slate-500">
            {doneCount}/{ai.stages.length} 步
          </div>
        </div>
      </div>

      <ol className="space-y-3 px-5 py-4">
        {ai.stages.map((stage, index) => {
          const status = ai.stageStatuses[index]
          const detail = ai.stageDetails[stage.id]
          const subResults =
            stage.id === 'parse'
              ? ai.parseBySub
              : stage.id === 'match'
                ? ai.matchBySub
                : ai.detectBySub

          return (
            <li
              key={stage.id}
              className={[
                'border',
                status === 'running'
                  ? 'border-slate-800 bg-slate-50'
                  : status === 'done'
                    ? 'border-slate-200 bg-white'
                    : 'border-slate-100 bg-slate-50/50',
              ].join(' ')}
            >
              <div className="px-4 py-3">
                <div className="flex gap-3">
                  <div className="w-14 shrink-0 text-xs font-medium text-slate-500">
                    {STAGE_STATUS_LABEL[status]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {index + 1}. {stage.name}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{stage.description}</p>
                    {(status === 'running' || status === 'done') && detail && (
                      <div className="mt-2 border border-sky-100 bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-900">
                        <span className="font-medium">过程摘要：</span>
                        {detail}
                      </div>
                    )}
                  </div>
                </div>

                {subResults && subResults.length > 0 && status !== 'pending' && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    <div className="text-xs font-medium text-slate-500">
                      子要素执行明细（{subResults.length} 项）
                    </div>
                    {stage.id === 'parse' &&
                      (ai.parseBySub ?? []).map((item) => (
                        <ParseSubCard
                          key={item.subElementId}
                          item={item}
                          expanded={expandedParse.has(item.subElementId)}
                          onToggle={() =>
                            toggle(expandedParse, item.subElementId, setExpandedParse)
                          }
                        />
                      ))}
                    {stage.id === 'match' &&
                      (ai.matchBySub ?? []).map((item) => (
                        <MatchSubCard
                          key={item.subElementId}
                          item={item}
                          expanded={expandedMatch.has(item.subElementId)}
                          onToggle={() =>
                            toggle(expandedMatch, item.subElementId, setExpandedMatch)
                          }
                        />
                      ))}
                    {stage.id === 'detect_score' &&
                      (ai.detectBySub ?? []).map((item) => (
                        <DetectSubCard key={item.subElementId} item={item} />
                      ))}
                  </div>
                )}

                {subResults && subResults.length === 0 && status !== 'pending' && (
                  <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-400">
                    暂无已选子要素
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function SubStatusBadge({ status }: { status: AiSubStepStatus }) {
  return (
    <span className={['text-xs font-medium', SUB_STATUS_CLASS[status]].join(' ')}>
      {SUB_STATUS_LABEL[status]}
    </span>
  )
}

function ParseSubCard({
  item,
  expanded,
  onToggle,
}: {
  item: AiParseSubResult
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-800">{item.subElementName}</div>
        <SubStatusBadge status={item.status} />
      </div>
      {item.summary && <p className="mt-1 text-xs text-slate-500">{item.summary}</p>}
      {item.errorMessage && (
        <p className="mt-1 text-xs text-amber-700">解析错误：{item.errorMessage}</p>
      )}
      {item.parsedItems && item.parsedItems.length > 0 && item.status !== 'pending' && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onToggle}
            className="text-xs font-medium text-slate-800 underline"
          >
            {expanded ? '收起解析结果' : '查看解析结果'}
          </button>
          {expanded && (
            <ul className="mt-2 space-y-1.5">
              {item.parsedItems.map((p, i) => (
                <li
                  key={`${p.label}-${i}`}
                  className="border border-slate-100 bg-slate-50 px-2.5 py-2 text-xs text-slate-700"
                >
                  <span className="font-medium">
                    {p.type === 'file' ? '文件' : p.type === 'system' ? '系统' : '人工'} ·{' '}
                    {p.label}
                  </span>
                  {p.detail && <span className="mt-0.5 block text-slate-500">{p.detail}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

function MatchSubCard({
  item,
  expanded,
  onToggle,
}: {
  item: AiMatchSubResult
  expanded: boolean
  onToggle: () => void
}) {
  const basis = item.matchedClauses.find((c) => c.isAiBasis)
  return (
    <div className="border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-800">{item.subElementName}</div>
        <SubStatusBadge status={item.status} />
      </div>
      {item.status !== 'pending' && (
        <>
          <p className="mt-1 text-xs text-slate-600">
            匹配标准：{item.standardName} {item.standardVersion}
          </p>
          {basis && (
            <div className="mt-2 border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
              <span className="font-medium">AI 判断依据：</span>
              {basis.text}
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 text-xs font-medium text-slate-800 underline"
          >
            {expanded ? '收起匹配条款' : '查看全部匹配条款'}
          </button>
          {expanded && (
            <ol className="mt-2 list-inside list-decimal space-y-1.5 text-xs text-slate-700">
              {item.matchedClauses.map((clause) => (
                <li
                  key={clause.id}
                  className={[
                    'rounded px-2 py-1.5',
                    clause.isAiBasis ? 'bg-amber-50 text-amber-900' : 'bg-slate-50',
                  ].join(' ')}
                >
                  {clause.text}
                  {clause.isAiBasis && (
                    <span className="ml-2 text-[10px] font-medium text-amber-700">AI依据</span>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  )
}

function DetectSubCard({ item }: { item: AiDetectSubResult }) {
  return (
    <div className="border border-slate-200 bg-white px-3 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-800">{item.subElementName}</div>
        <SubStatusBadge status={item.status} />
      </div>
      {item.status === 'running' && (
        <p className="mt-1 text-xs text-sky-700">{item.previewDescription}</p>
      )}
      {item.status === 'done' && (
        <div className="mt-2 space-y-1 text-xs text-slate-700">
          <p>识别问题 {item.issueCount ?? 0} 项</p>
          {item.previewDescription && <p>{item.previewDescription}</p>}
          {item.suggestedScore != null && (
            <p className="text-slate-500">建议评分：{item.suggestedScore}/10</p>
          )}
        </div>
      )}
      {item.status === 'pending' && (
        <p className="mt-1 text-xs text-slate-400">等待前序步骤完成后开始生成</p>
      )}
    </div>
  )
}
