import { create } from 'zustand'
import {
  buildProgressFromWorkspace,
  createInitialAiState,
  flattenSubElements,
  validateWorkspaceForStart,
} from '@/features/audit-project/workspace-utils'
import { isPlantDigitized } from '@/mocks/seed/plants'
import { getDeliverablesForPlant } from '@/mocks/seed/excel-deliverables'
import { mockAuditProjects } from '@/mocks/seed/projects'
import {
  enrichAiExecutionState,
} from '@/features/ai-execution/build-sub-execution'
import {
  buildMockIssues,
  buildMockReports,
  createNewProjectSeed,
  getMockWorkspace,
} from '@/mocks/seed/workspaces'
import type {
  AuditIssue,
  AuditProject,
  ProjectWorkspace,
  ReportAssetType,
  ScopeAreaNode,
  SubElementNode,
} from '@/types/audit'

interface AuditDemoState {
  projects: AuditProject[]
  workspaces: Record<string, ProjectWorkspace>
  createSeq: number
  ensureWorkspace: (projectId: string) => ProjectWorkspace
  createProject: () => string
  selectSubElement: (projectId: string, subElementId: string) => void
  toggleSubElementSelected: (projectId: string, subElementId: string) => void
  patchSubElementSources: (
    projectId: string,
    subElementId: string,
    patch: Partial<SubElementNode['dataSources']>,
  ) => void
  addSubElementFile: (projectId: string, subElementId: string) => void
  updateWorkspaceBasics: (
    projectId: string,
    patch: { period?: string; plant?: string },
  ) => void
  startAiAudit: (projectId: string) => string | null
  advanceAiStage: () => void
  /** AI 完成后写入问题并切到 pending_review；由页面负责跳转 */
  completeAiAudit: (projectId: string) => void
  updateIssue: (projectId: string, issueId: string, patch: Partial<AuditIssue>) => void
  generateReport: (projectId: string, type: ReportAssetType) => void
  updateReportContent: (projectId: string, type: ReportAssetType, content: string) => void
  updateMajorSummary: (projectId: string, content: string) => void
  updateReportItem: (
    projectId: string,
    reportId: string,
    patch: Partial<import('@/types/audit').AuditReportItem>,
  ) => void
  markReportReady: (projectId: string) => void
}

function formatNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function syncProject(project: AuditProject, workspace: ProjectWorkspace): AuditProject {
  let status = project.status
  if (workspace.phase === 'ai_running') {
    status = 'ai_running'
  } else if (status !== 'report_ready' && status !== 'pending_review') {
    status = 'configuring'
  }

  const progress = buildProgressFromWorkspace(workspace, status)
  const selected = flattenSubElements(workspace.scopeTree).filter((s) => s.selected)

  return {
    ...project,
    name: workspace.name,
    period: workspace.period,
    plant: workspace.plant,
    owner: workspace.owner,
    area: selected[0]?.areaName ?? project.area,
    scopeSummary: `${selected[0]?.projectNodeName ?? '审核范围'} · 已选 ${selected.length} 个子要素`,
    status,
    progress,
    updatedAt: formatNow(),
    issueCount: workspace.issues.length || project.issueCount,
  }
}

function updateTreeSubElement(
  tree: ScopeAreaNode[],
  subElementId: string,
  updater: (node: SubElementNode) => SubElementNode,
): ScopeAreaNode[] {
  return tree.map((area) => ({
    ...area,
    projects: area.projects.map((project) => ({
      ...project,
      subElements: project.subElements.map((se) =>
        se.id === subElementId ? updater(se) : se,
      ),
    })),
  }))
}

function stripSystemSources(tree: ScopeAreaNode[]): ScopeAreaNode[] {
  return tree.map((area) => ({
    ...area,
    projects: area.projects.map((project) => ({
      ...project,
      subElements: project.subElements.map((se) => ({
        ...se,
        dataSources: {
          ...se.dataSources,
          systemEnabled: false,
          systemFields: [],
        },
      })),
    })),
  }))
}

function buildInitialWorkspaces() {
  const map: Record<string, ProjectWorkspace> = {}
  for (const project of mockAuditProjects) {
    map[project.id] = getMockWorkspace(project.id)
  }
  return map
}

function patchWorkspace(
  set: (
    partial: Partial<AuditDemoState> | ((state: AuditDemoState) => Partial<AuditDemoState>),
  ) => void,
  projectId: string,
  workspace: ProjectWorkspace,
  statusOverride?: AuditProject['status'],
) {
  set((state) => {
    const projects = state.projects.map((project) => {
      if (project.id !== projectId) return project
      const synced = syncProject(project, workspace)
      return statusOverride ? { ...synced, status: statusOverride } : synced
    })
    return {
      workspaces: { ...state.workspaces, [projectId]: workspace },
      projects,
    }
  })
}

export const useAuditStore = create<AuditDemoState>((set, get) => ({
  projects: structuredClone(mockAuditProjects),
  workspaces: buildInitialWorkspaces(),
  createSeq: 6,

  ensureWorkspace: (projectId) => {
    const existing = get().workspaces[projectId]
    if (existing) return existing
    const workspace = getMockWorkspace(projectId)
    set((state) => ({
      workspaces: { ...state.workspaces, [projectId]: workspace },
    }))
    return workspace
  },

  createProject: () => {
    const seq = get().createSeq
    const { project, workspace } = createNewProjectSeed(seq)
    set((state) => ({
      createSeq: seq + 1,
      projects: [project, ...state.projects],
      workspaces: { ...state.workspaces, [project.id]: workspace },
    }))
    return project.id
  },

  selectSubElement: (projectId, subElementId) => {
    const workspace = get().ensureWorkspace(projectId)
    patchWorkspace(set, projectId, { ...workspace, selectedSubElementId: subElementId })
  },

  toggleSubElementSelected: (projectId, subElementId) => {
    const workspace = get().ensureWorkspace(projectId)
    if (workspace.locked) return
    const scopeTree = updateTreeSubElement(workspace.scopeTree, subElementId, (se) => ({
      ...se,
      selected: !se.selected,
    }))
    patchWorkspace(set, projectId, { ...workspace, scopeTree })
  },

  patchSubElementSources: (projectId, subElementId, patch) => {
    const workspace = get().ensureWorkspace(projectId)
    if (workspace.locked) return
    const scopeTree = updateTreeSubElement(workspace.scopeTree, subElementId, (se) => ({
      ...se,
      dataSources: {
        ...se.dataSources,
        ...patch,
        systemFields: patch.systemFields ?? se.dataSources.systemFields,
        files: patch.files ?? se.dataSources.files,
      },
    }))
    patchWorkspace(set, projectId, { ...workspace, scopeTree })
  },

  addSubElementFile: (projectId, subElementId) => {
    const workspace = get().ensureWorkspace(projectId)
    if (workspace.locked) return
    const scopeTree = updateTreeSubElement(workspace.scopeTree, subElementId, (se) => {
      const mockNames = [
        `${se.name}检查表.xlsx`,
        `${se.name}台账.xlsx`,
        `${se.name}证明材料.pdf`,
      ]
      const nextIndex = se.dataSources.files.length
      return {
        ...se,
        dataSources: {
          ...se.dataSources,
          fileEnabled: true,
          files: [
            ...se.dataSources.files,
            {
              id: `file-${Date.now()}`,
              name: mockNames[nextIndex % mockNames.length],
            },
          ],
        },
      }
    })
    patchWorkspace(set, projectId, { ...workspace, scopeTree })
  },

  updateWorkspaceBasics: (projectId, patch) => {
    const workspace = get().ensureWorkspace(projectId)
    if (workspace.locked) return

    const nextPlant = patch.plant ?? workspace.plant
    const nextPeriod = patch.period ?? workspace.period
    let scopeTree = workspace.scopeTree

    if (patch.plant !== undefined && !isPlantDigitized(nextPlant)) {
      scopeTree = stripSystemSources(scopeTree)
    }

    const deliverables =
      patch.plant !== undefined ? getDeliverablesForPlant(nextPlant) : null

    patchWorkspace(set, projectId, {
      ...workspace,
      period: nextPeriod,
      plant: nextPlant,
      scopeTree,
      ...(deliverables
        ? {
            bipIssues: deliverables.bipIssues,
            majorIssueSummary: deliverables.majorIssueSummary,
            complianceScores: deliverables.complianceScores,
            auditReports: deliverables.auditReports,
          }
        : {}),
    })
  },

  startAiAudit: (projectId) => {
    const workspace = get().ensureWorkspace(projectId)
    const error = validateWorkspaceForStart(workspace)
    if (error) return error

    const next: ProjectWorkspace = {
      ...workspace,
      phase: 'ai_running',
      locked: true,
      ai: enrichAiExecutionState(createInitialAiState(0), workspace.scopeTree),
    }
    patchWorkspace(set, projectId, next, 'ai_running')
    return null
  },

  advanceAiStage: () => {
    // Demo 模式：AI 审核步骤保持静态，不自动推进
  },

  completeAiAudit: (projectId) => {
    const workspace = get().ensureWorkspace(projectId)
    const issues = buildMockIssues(projectId)
    const next: ProjectWorkspace = {
      ...workspace,
      phase: 'configuring',
      locked: true,
      ai: {
        ...createInitialAiState(3),
        currentIndex: 3,
        stageStatuses: ['done', 'done', 'done'],
      },
      issues,
      reports: buildMockReports(projectId, false),
    }
    // Keep phase as configuring visually locked; status is pending_review for routing
    patchWorkspace(set, projectId, next, 'pending_review')
  },

  updateIssue: (projectId, issueId, patch) => {
    const workspace = get().ensureWorkspace(projectId)
    const issues = workspace.issues.map((issue) =>
      issue.id === issueId ? { ...issue, ...patch, modified: true } : issue,
    )
    patchWorkspace(set, projectId, { ...workspace, issues }, 'pending_review')
  },

  generateReport: (projectId, type) => {
    const workspace = get().ensureWorkspace(projectId)
    const fresh = buildMockReports(projectId, true)
    const reports = workspace.reports.map((r) => {
      if (r.type !== type) return r
      const generated = fresh.find((f) => f.type === type)!
      // sync score/bip from current issues if needed
      if (type === 'bip') {
        return {
          ...generated,
          content: workspace.issues
            .map((i, idx) => `${idx + 1}. 【${i.subElementName}】${i.description}`)
            .join('\n'),
          generated: true,
        }
      }
      if (type === 'score') {
        return {
          ...generated,
          content: workspace.issues
            .map((i) => `${i.subElementName}：评分 ${i.score}/10`)
            .join('\n'),
          generated: true,
        }
      }
      return { ...generated, generated: true }
    })
    patchWorkspace(set, projectId, { ...workspace, reports }, 'report_ready')
  },

  updateReportContent: (projectId, type, content) => {
    const workspace = get().ensureWorkspace(projectId)
    const reports = workspace.reports.map((r) =>
      r.type === type ? { ...r, content, generated: true } : r,
    )
    patchWorkspace(set, projectId, { ...workspace, reports })
  },

  updateMajorSummary: (projectId, content) => {
    const workspace = get().ensureWorkspace(projectId)
    patchWorkspace(set, projectId, { ...workspace, majorIssueSummary: content })
  },

  updateReportItem: (projectId, reportId, patch) => {
    const workspace = get().ensureWorkspace(projectId)
    const auditReports = workspace.auditReports.map((r) =>
      r.id === reportId ? { ...r, ...patch } : r,
    )
    patchWorkspace(set, projectId, { ...workspace, auditReports })
  },

  markReportReady: (projectId) => {
    const workspace = get().ensureWorkspace(projectId)
    patchWorkspace(set, projectId, workspace, 'report_ready')
  },
}))
