export type AuditPeriodGranularity = 'monthly' | 'quarterly' | 'half' | 'annual' | 'custom'

export interface AuditPeriodValue {
  granularity: AuditPeriodGranularity
  year: number
  month?: number
  quarter?: 1 | 2 | 3 | 4
  half?: 'H1' | 'H2'
  rangeStart?: string
  rangeEnd?: string
}

export const AUDIT_PERIOD_GRANULARITY_OPTIONS: {
  id: AuditPeriodGranularity
  label: string
}[] = [
  { id: 'monthly', label: '月度' },
  { id: 'quarterly', label: '季度' },
  { id: 'half', label: '半年度' },
  { id: 'annual', label: '年度' },
  { id: 'custom', label: '自定义范围' },
]

export const AUDIT_YEAR_OPTIONS = [2026, 2025, 2024, 2023]

const MONTH_LABELS = [
  '01月',
  '02月',
  '03月',
  '04月',
  '05月',
  '06月',
  '07月',
  '08月',
  '09月',
  '10月',
  '11月',
  '12月',
]

export function formatAuditPeriod(value: AuditPeriodValue): string {
  switch (value.granularity) {
    case 'monthly':
      return `${value.year}年${MONTH_LABELS[(value.month ?? 1) - 1]}`
    case 'quarterly':
      return `${value.year} Q${value.quarter ?? 1}`
    case 'half':
      return `${value.year} ${value.half === 'H2' ? '下半年' : '上半年'}`
    case 'annual':
      return `${value.year}年度`
    case 'custom': {
      const start = value.rangeStart ? formatMonthLabel(value.rangeStart) : ''
      const end = value.rangeEnd ? formatMonthLabel(value.rangeEnd) : ''
      if (!start || !end) return ''
      return `${start} - ${end}`
    }
    default:
      return ''
  }
}

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  if (!year || !month) return ym
  return `${year}年${month}月`
}

export function parseAuditPeriod(period: string): AuditPeriodValue | null {
  if (!period) return null

  const quarterly = period.match(/^(\d{4})\s*Q([1-4])$/)
  if (quarterly) {
    return {
      granularity: 'quarterly',
      year: Number(quarterly[1]),
      quarter: Number(quarterly[2]) as 1 | 2 | 3 | 4,
    }
  }

  const monthly = period.match(/^(\d{4})年(\d{2})月$/)
  if (monthly) {
    return {
      granularity: 'monthly',
      year: Number(monthly[1]),
      month: Number(monthly[2]),
    }
  }

  const half = period.match(/^(\d{4})\s*(上半年|下半年)$/)
  if (half) {
    return {
      granularity: 'half',
      year: Number(half[1]),
      half: half[2] === '下半年' ? 'H2' : 'H1',
    }
  }

  const annual = period.match(/^(\d{4})年度$/)
  if (annual) {
    return { granularity: 'annual', year: Number(annual[1]) }
  }

  const custom = period.match(/^(\d{4})年(\d{2})月\s*-\s*(\d{4})年(\d{2})月$/)
  if (custom) {
    return {
      granularity: 'custom',
      year: Number(custom[1]),
      rangeStart: `${custom[1]}-${custom[2]}`,
      rangeEnd: `${custom[3]}-${custom[4]}`,
    }
  }

  return null
}

export function createDefaultPeriodValue(
  granularity: AuditPeriodGranularity = 'quarterly',
): AuditPeriodValue {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const quarter = (Math.ceil(month / 3) as 1 | 2 | 3 | 4)

  switch (granularity) {
    case 'monthly':
      return { granularity, year, month }
    case 'quarterly':
      return { granularity, year, quarter }
    case 'half':
      return { granularity, year, half: month > 6 ? 'H2' : 'H1' }
    case 'annual':
      return { granularity, year }
    case 'custom':
      return {
        granularity,
        year,
        rangeStart: `${year}-${String(month).padStart(2, '0')}`,
        rangeEnd: `${year}-${String(month).padStart(2, '0')}`,
      }
    default:
      return { granularity: 'quarterly', year, quarter }
  }
}

export function isAuditPeriodComplete(value: AuditPeriodValue): boolean {
  if (value.granularity === 'custom') {
    return Boolean(value.rangeStart && value.rangeEnd && value.rangeStart <= value.rangeEnd)
  }
  return true
}

export { MONTH_LABELS }
