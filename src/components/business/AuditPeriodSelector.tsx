import { useEffect, useState } from 'react'
import {
  AUDIT_PERIOD_GRANULARITY_OPTIONS,
  AUDIT_YEAR_OPTIONS,
  createDefaultPeriodValue,
  formatAuditPeriod,
  isAuditPeriodComplete,
  MONTH_LABELS,
  parseAuditPeriod,
  type AuditPeriodGranularity,
  type AuditPeriodValue,
} from '@/features/audit-period/period-utils'

interface AuditPeriodSelectorProps {
  value: string
  disabled?: boolean
  onChange?: (period: string) => void
}

const selectClass =
  'border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800'

export function AuditPeriodSelector({ value, disabled, onChange }: AuditPeriodSelectorProps) {
  const parsed = parseAuditPeriod(value)
  const [draft, setDraft] = useState<AuditPeriodValue | null>(parsed)

  useEffect(() => {
    setDraft(parseAuditPeriod(value))
  }, [value])

  if (disabled) {
    return <span className="text-sm text-slate-800">{value || '未选择'}</span>
  }

  const updateDraft = (next: AuditPeriodValue) => {
    setDraft(next)
    if (isAuditPeriodComplete(next)) {
      onChange?.(formatAuditPeriod(next))
    } else {
      onChange?.('')
    }
  }

  const setGranularity = (granularity: AuditPeriodGranularity) => {
    updateDraft(createDefaultPeriodValue(granularity))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {AUDIT_PERIOD_GRANULARITY_OPTIONS.map((option) => {
          const active = draft?.granularity === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setGranularity(option.id)}
              className={[
                'border px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {draft && (
        <div className="flex flex-wrap items-center gap-2">
          {draft.granularity !== 'custom' && (
            <select
              value={draft.year}
              onChange={(e) => updateDraft({ ...draft, year: Number(e.target.value) })}
              className={selectClass}
            >
              {AUDIT_YEAR_OPTIONS.map((year) => (
                <option key={year} value={year}>
                  {year}年
                </option>
              ))}
            </select>
          )}

          {draft.granularity === 'monthly' && (
            <select
              value={draft.month ?? 1}
              onChange={(e) => updateDraft({ ...draft, month: Number(e.target.value) })}
              className={selectClass}
            >
              {MONTH_LABELS.map((label, index) => (
                <option key={label} value={index + 1}>
                  {label}
                </option>
              ))}
            </select>
          )}

          {draft.granularity === 'quarterly' && (
            <select
              value={draft.quarter ?? 1}
              onChange={(e) =>
                updateDraft({ ...draft, quarter: Number(e.target.value) as 1 | 2 | 3 | 4 })
              }
              className={selectClass}
            >
              <option value={1}>Q1（1-3月）</option>
              <option value={2}>Q2（4-6月）</option>
              <option value={3}>Q3（7-9月）</option>
              <option value={4}>Q4（10-12月）</option>
            </select>
          )}

          {draft.granularity === 'half' && (
            <select
              value={draft.half ?? 'H1'}
              onChange={(e) =>
                updateDraft({ ...draft, half: e.target.value as 'H1' | 'H2' })
              }
              className={selectClass}
            >
              <option value="H1">上半年（1-6月）</option>
              <option value="H2">下半年（7-12月）</option>
            </select>
          )}

          {draft.granularity === 'custom' && (
            <>
              <input
                type="month"
                value={draft.rangeStart ?? ''}
                onChange={(e) => updateDraft({ ...draft, rangeStart: e.target.value })}
                className={selectClass}
              />
              <span className="text-xs text-slate-400">至</span>
              <input
                type="month"
                value={draft.rangeEnd ?? ''}
                onChange={(e) => updateDraft({ ...draft, rangeEnd: e.target.value })}
                className={selectClass}
              />
            </>
          )}

          {isAuditPeriodComplete(draft) && (
            <span className="text-xs text-slate-500">
              已选：{formatAuditPeriod(draft)}
            </span>
          )}
        </div>
      )}

      {!draft && (
        <p className="text-xs text-slate-400">请先选择周期类型，再指定具体时间范围</p>
      )}
    </div>
  )
}
