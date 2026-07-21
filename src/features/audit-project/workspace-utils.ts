import {
  AI_EXECUTION_STAGES,
  AI_STAGE_DETAIL_TEMPLATES,
} from '@/features/ai-execution/stages'
import type {
  AiExecutionState,
  AiStageStatus,
  ProjectWorkspace,
  ScopeAreaNode,
  SubElementNode,
} from '@/types/audit'
import { computeSubElementStatus } from '@/types/audit'

export function createInitialAiState(currentIndex = 0): AiExecutionState {
  const stageStatuses: AiStageStatus[] = AI_EXECUTION_STAGES.map((_, index) => {
    if (index < currentIndex) return 'done'
    if (index === currentIndex) return 'running'
    return 'pending'
  })

  return {
    stages: AI_EXECUTION_STAGES,
    currentIndex,
    stageStatuses,
    stageDetails: { ...AI_STAGE_DETAIL_TEMPLATES },
  }
}

export function flattenSubElements(tree: ScopeAreaNode[]): SubElementNode[] {
  return tree.flatMap((area) => area.projects.flatMap((p) => p.subElements))
}

export function countConfigured(tree: ScopeAreaNode[]) {
  const all = flattenSubElements(tree)
  const selected = all.filter((s) => s.selected)
  const configured = selected.filter((s) => computeSubElementStatus(s) === 'configured')
  return { selected: selected.length, configured: configured.length, total: all.length }
}

export function validateWorkspaceForStart(workspace: ProjectWorkspace): string | null {
  if (!workspace.period) return '请先选择审核周期'
  if (!workspace.plant) return '请先选择审核基地'
  const { selected, configured } = countConfigured(workspace.scopeTree)
  if (selected === 0) return '请至少选择一个子要素纳入本次审核'
  if (configured < selected) return '存在已选子要素缺少数据源，请完成一对一配置'
  return null
}

export function hasWorkspaceBasics(workspace: ProjectWorkspace): boolean {
  return Boolean(workspace.period && workspace.plant)
}

export function buildProgressFromWorkspace(
  workspace: ProjectWorkspace,
  projectStatus?: import('@/types/audit').AuditProjectStatus,
): {
  percent: number
  label: string
} {
  if (projectStatus === 'report_ready') {
    return { percent: 100, label: '报告已生成，可在报告中心下载' }
  }
  if (projectStatus === 'pending_review') {
    const n = workspace.issues.length
    return {
      percent: 78,
      label: n > 0 ? `待人工复审 ${n} 项问题` : 'AI 已完成，待人工复审',
    }
  }

  if (workspace.phase === 'configuring') {
    if (!hasWorkspaceBasics(workspace)) {
      return { percent: 5, label: '请先选择审核周期与基地' }
    }
    const { selected, configured } = countConfigured(workspace.scopeTree)
    const percent =
      selected === 0 ? 15 : Math.min(85, 30 + Math.round((configured / selected) * 50))
    return {
      percent,
      label:
        configured >= selected && selected > 0
          ? '子要素数据源已配齐，可启动 AI 审核'
          : `已配置 ${configured}/${selected || 0} 个子要素数据源`,
    }
  }

  const total = workspace.ai.stages.length
  const done = workspace.ai.stageStatuses.filter((s) => s === 'done').length
  const current = workspace.ai.stages[workspace.ai.currentIndex]
  return {
    percent: Math.min(95, Math.round(((done + 0.4) / total) * 100)),
    label: current
      ? `AI 审核中：${current.name}（${Math.min(done + 1, total)}/${total}）`
      : 'AI 审核中',
  }
}

export function getSubElementById(
  tree: ScopeAreaNode[],
  id: string | null,
): SubElementNode | null {
  if (!id) return null
  return flattenSubElements(tree).find((s) => s.id === id) ?? null
}
