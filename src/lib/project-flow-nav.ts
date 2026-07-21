export const ACTIVE_PROJECT_KEY = 'ai-audit-active-project-id'

export const PROJECT_FLOW_NAV = [
  { segment: 'task', label: '审核任务', desc: '配置 · AI审核' },
  { segment: 'results', label: '审核结果', desc: '人工复审 · 主要问题总结' },
  { segment: 'scores', label: '符合率评分', desc: '符合率评分表' },
  { segment: 'reports', label: '审核报告', desc: '报告列表' },
] as const

export function projectFlowPath(projectId: string, segment: string) {
  return `/projects/${projectId}/${segment}`
}
