import { useEffect, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { AiExecutionPanel } from '@/components/business/AiExecutionPanel'

import { AuditPeriodSelector } from '@/components/business/AuditPeriodSelector'

import { ProjectStatusBadge } from '@/components/business/ProjectStatusBadge'

import { ScopeTreePanel } from '@/components/business/ScopeTreePanel'

import { SubElementConfigPanel } from '@/components/business/SubElementConfigPanel'

import { WorkspacePhaseRail } from '@/components/business/WorkspacePhaseRail'

import {

  countConfigured,

  getSubElementById,

  hasWorkspaceBasics,

} from '@/features/audit-project/workspace-utils'

import {

  AUDIT_PLANT_OPTIONS,

  isPlantDigitized,

} from '@/mocks/seed/plants'

import { useAuditStore } from '@/stores/auditStore'



export function ProjectWorkspacePage() {

  const { projectId = '' } = useParams()

  const navigate = useNavigate()

  const [startError, setStartError] = useState<string | null>(null)

  const [showStartConfirm, setShowStartConfirm] = useState(false)



  const project = useAuditStore((s) => s.projects.find((p) => p.id === projectId))

  const workspace = useAuditStore((s) => (projectId ? s.workspaces[projectId] : undefined))

  const selectSubElement = useAuditStore((s) => s.selectSubElement)

  const toggleSubElementSelected = useAuditStore((s) => s.toggleSubElementSelected)

  const patchSubElementSources = useAuditStore((s) => s.patchSubElementSources)

  const addSubElementFile = useAuditStore((s) => s.addSubElementFile)

  const updateWorkspaceBasics = useAuditStore((s) => s.updateWorkspaceBasics)

  const startAiAudit = useAuditStore((s) => s.startAiAudit)



  useEffect(() => {

    if (!projectId || !project) return

    if (project.status === 'pending_review') {

      navigate(`/projects/${projectId}/results`, { replace: true })

    }

    if (project.status === 'report_ready') {

      navigate(`/projects/${projectId}/report`, { replace: true })

    }

  }, [project?.status, projectId, navigate])



  if (!projectId || !workspace || !project) {

    return (

      <section className="border border-slate-200 bg-white px-5 py-8 text-center">

        <p className="text-sm text-slate-600">未找到该审核项目</p>

        <Link to="/projects" className="mt-3 inline-block text-sm underline">

          返回列表

        </Link>

      </section>

    )

  }



  const selectedNode = getSubElementById(workspace.scopeTree, workspace.selectedSubElementId)

  const counts = countConfigured(workspace.scopeTree)

  const isAiRunning = workspace.phase === 'ai_running' || project.status === 'ai_running'

  const basicsReady = hasWorkspaceBasics(workspace)

  const systemDataAvailable = isPlantDigitized(workspace.plant)

  const activePhase = isAiRunning ? 'ai' : 'config'



  return (

    <div className="space-y-5">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <Link to="/projects" className="text-xs font-medium text-slate-500 hover:text-slate-800">

          ← 返回审核项目

        </Link>

      </div>



      <header className="space-y-3 border border-slate-200 bg-white px-5 py-4">

        <div className="text-xs font-medium tracking-wide text-slate-500">审核项目工作台</div>

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div className="space-y-3">

            <div className="flex flex-wrap items-center gap-2">

              <h1 className="text-xl font-semibold text-slate-900">{workspace.name}</h1>

              <ProjectStatusBadge status={project.status} />

            </div>



            <div className="flex flex-wrap items-end gap-4">

              <div className="block text-xs text-slate-500">

                <span className="mb-1 block">审核周期</span>

                <AuditPeriodSelector

                  value={workspace.period}

                  disabled={workspace.locked}

                  onChange={(period) => updateWorkspaceBasics(projectId, { period })}

                />

              </div>



              <label className="block text-xs text-slate-500">

                <span className="mb-1 block">审核基地</span>

                {workspace.locked ? (

                  <span className="text-sm text-slate-800">{workspace.plant}</span>

                ) : (

                  <select

                    value={workspace.plant}

                    onChange={(e) =>

                      updateWorkspaceBasics(projectId, { plant: e.target.value })

                    }

                    className="min-w-[140px] border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800"

                  >

                    <option value="">请选择</option>

                    {AUDIT_PLANT_OPTIONS.map((plant) => (

                      <option key={plant.id} value={plant.name}>

                        {plant.name}

                      </option>

                    ))}

                  </select>

                )}

              </label>



            </div>



            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

              <span>负责人 · {workspace.owner}</span>

              <span>

                子要素配置 · {counts.configured}/{counts.selected}

              </span>

            </div>

          </div>

        </div>



        <WorkspacePhaseRail activeStep={activePhase} />

      </header>



      {isAiRunning ? (

        <AiExecutionPanel ai={workspace.ai} />

      ) : !basicsReady ? (

        <section className="border border-slate-200 bg-white px-5 py-12 text-center">

          <p className="text-sm font-medium text-slate-800">请先选择审核周期和审核基地</p>

        </section>

      ) : (

        <>

          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">

            <ScopeTreePanel

              tree={workspace.scopeTree}

              selectedId={workspace.selectedSubElementId}

              locked={workspace.locked}

              onSelect={(id) => selectSubElement(projectId, id)}

              onToggleSelected={(id) => toggleSubElementSelected(projectId, id)}

            />

            <SubElementConfigPanel

              node={selectedNode}

              locked={workspace.locked}

              systemDataAvailable={systemDataAvailable}

              onToggleSource={(key) => {

                if (!selectedNode) return

                if (key === 'systemEnabled' && !systemDataAvailable) return

                const enabled = !selectedNode.dataSources[key]

                if (key === 'systemEnabled' && enabled && selectedNode.dataSources.systemFields.length === 0) {

                  patchSubElementSources(projectId, selectedNode.id, {

                    systemEnabled: true,

                    systemFields: [

                      { key: 'issue_time', label: '问题记录时间' },

                      { key: 'device_code', label: '设备编号' },

                    ],

                  })

                  return

                }

                if (key === 'manualEnabled') {

                  patchSubElementSources(projectId, selectedNode.id, {

                    manualEnabled: enabled,

                    manualEvidenceStatus: enabled ? 'pending' : 'none',

                  })

                  return

                }

                patchSubElementSources(projectId, selectedNode.id, { [key]: enabled })

              }}

              onAddFile={() => {

                if (!selectedNode) return

                addSubElementFile(projectId, selectedNode.id)

              }}

            />

          </div>



          {!workspace.locked && (

            <div className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-5 py-4">

              <div className="text-sm text-slate-500">

                {startError ? (

                  <span className="text-amber-700">{startError}</span>

                ) : (

                  <span>启动前将确认并锁定审核范围与数据源</span>

                )}

              </div>

              <button

                type="button"

                onClick={() => {

                  setStartError(null)

                  setShowStartConfirm(true)

                }}

                className="bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"

              >

                启动 AI 审核

              </button>

            </div>

          )}

        </>

      )}



      {showStartConfirm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

          <div className="w-full max-w-md border border-slate-200 bg-white p-5 shadow-lg">

            <h3 className="text-base font-semibold text-slate-900">确认启动审核</h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">

              审核启动后，审核范围和数据源不可修改。已选子要素 {counts.selected} 项，其中已完成配置{' '}

              {counts.configured} 项。

            </p>

            <div className="mt-5 flex justify-end gap-2">

              <button

                type="button"

                className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"

                onClick={() => setShowStartConfirm(false)}

              >

                取消

              </button>

              <button

                type="button"

                className="bg-slate-900 px-3 py-2 text-sm font-medium text-white"

                onClick={() => {

                  const error = startAiAudit(projectId)

                  if (error) {

                    setStartError(error)

                    setShowStartConfirm(false)

                    return

                  }

                  setShowStartConfirm(false)

                }}

              >

                确认启动

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

