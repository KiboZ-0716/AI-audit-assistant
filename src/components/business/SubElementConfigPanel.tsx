import { useState } from 'react'
import { StandardPreviewModal } from '@/components/business/StandardPreviewModal'
import { computeSubElementStatus, type SubElementNode } from '@/types/audit'

interface SubElementConfigPanelProps {
  node: SubElementNode | null
  locked: boolean
  systemDataAvailable: boolean
  onToggleSource: (key: 'fileEnabled' | 'systemEnabled' | 'manualEnabled') => void
  onAddFile: () => void
}

export function SubElementConfigPanel({
  node,
  locked,
  systemDataAvailable,
  onToggleSource,
  onAddFile,
}: SubElementConfigPanelProps) {
  const [showPreview, setShowPreview] = useState(false)

  if (!node) {
    return (
      <div className="border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
        请选择左侧子要素进行配置
      </div>
    )
  }

  const status = computeSubElementStatus(node)

  return (
    <>
      <div className="border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">子要素配置</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {node.areaName} → {node.projectNodeName} → {node.name}
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="text-xs text-slate-500">匹配知识库审核标准</div>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="text-xs font-medium text-slate-800 underline hover:text-slate-600"
              >
                预览标准
              </button>
            </div>
            <div className="mt-1 text-sm font-medium text-slate-900">
              {node.standardName} {node.standardVersion}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              配置状态：
              {status === 'configured' && '已完成配置'}
              {status === 'missing_source' && '缺少数据源'}
              {status === 'unselected' && '未选择（请先勾选纳入审核）'}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-800">审核数据源</div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <div className="border border-slate-200 p-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={node.dataSources.fileEnabled}
                  disabled={locked}
                  onChange={() => onToggleSource('fileEnabled')}
                />
                文件资料
              </label>
              <div className="mt-3 space-y-1.5">
                {node.dataSources.files.map((f) => (
                  <div
                    key={f.id}
                    className="border border-dashed border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-600"
                  >
                    {f.name}
                  </div>
                ))}
                {node.dataSources.files.length === 0 && (
                  <button
                    type="button"
                    disabled={locked}
                    onClick={onAddFile}
                    className="w-full border border-dashed border-slate-200 px-2 py-6 text-center text-xs text-slate-400 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-transparent"
                  >
                    点击模拟添加文件
                  </button>
                )}
              </div>
              {!locked && node.dataSources.files.length > 0 && (
                <button
                  type="button"
                  onClick={onAddFile}
                  className="mt-2 text-xs font-medium text-slate-800 underline"
                >
                  继续添加
                </button>
              )}
            </div>

            <div
              className={[
                'border p-3',
                systemDataAvailable ? 'border-slate-200' : 'border-slate-100 bg-slate-50/80',
              ].join(' ')}
            >
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={node.dataSources.systemEnabled}
                  disabled={locked || !systemDataAvailable}
                  onChange={() => onToggleSource('systemEnabled')}
                />
                系统数据
              </label>
              {!systemDataAvailable && (
                <p className="mt-2 text-xs leading-relaxed text-amber-700">
                  当前基地未接入数字化系统，无法选择系统数据，请使用文件资料或人工录入。
                </p>
              )}
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {node.dataSources.systemFields.map((field) => (
                  <li key={field.key} className="border border-slate-100 bg-slate-50 px-2 py-1.5">
                    字段：{field.label}
                    <span className="ml-1 text-slate-400">({field.key})</span>
                  </li>
                ))}
                {node.dataSources.systemFields.length === 0 && systemDataAvailable && (
                  <li className="text-slate-400">启用后展示取数字段（Mock）</li>
                )}
              </ul>
            </div>

            <div className="border border-slate-200 p-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <input
                  type="checkbox"
                  checked={node.dataSources.manualEnabled}
                  disabled={locked}
                  onChange={() => onToggleSource('manualEnabled')}
                />
                人工录入
              </label>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                适用于无法走文件/系统自动取数、依赖线下表单的子要素。现场拍照取证请使用移动端。
              </p>
              <div className="mt-3 text-xs text-slate-600">
                取证状态：
                {node.dataSources.manualEvidenceStatus === 'pending' && '待现场取证'}
                {node.dataSources.manualEvidenceStatus === 'uploaded' && '已取证'}
                {node.dataSources.manualEvidenceStatus === 'none' && '未启用'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <StandardPreviewModal
          standardName={node.standardName}
          standardVersion={node.standardVersion}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  )
}
