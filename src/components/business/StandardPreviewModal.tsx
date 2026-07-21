import { getAuditStandardPreview } from '@/mocks/seed/audit-standards'

interface StandardPreviewModalProps {
  standardName: string
  standardVersion: string
  onClose: () => void
}

export function StandardPreviewModal({
  standardName,
  standardVersion,
  onClose,
}: StandardPreviewModalProps) {
  const preview = getAuditStandardPreview(standardName, standardVersion)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-slate-200 bg-white shadow-lg">
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">审核标准预览</h3>
            <p className="mt-1 text-sm text-slate-600">
              {preview.name} {preview.version}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-2 py-1 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-800"
          >
            关闭
          </button>
        </div>

        <div className="space-y-5 px-5 py-4 text-sm">
          <section>
            <h4 className="text-xs font-medium text-slate-500">适用范围</h4>
            <p className="mt-1 text-slate-800">{preview.scope}</p>
          </section>

          <section>
            <h4 className="text-xs font-medium text-slate-500">标准摘要</h4>
            <p className="mt-1 leading-relaxed text-slate-700">{preview.summary}</p>
          </section>

          <section>
            <h4 className="text-xs font-medium text-slate-500">审核目标 / 条款</h4>
            <ul className="mt-2 list-inside list-decimal space-y-1.5 text-slate-700">
              {preview.clauses.map((clause) => (
                <li key={clause} className="leading-relaxed">
                  {clause}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-xs font-medium text-slate-500">审核规则（需细化）</h4>
            <ul className="mt-2 list-inside list-decimal space-y-1.5 text-slate-700">
              {preview.rules.map((rule) => (
                <li key={rule} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
