import type { AuditProject, AuditProjectStatus } from '@/types/audit'

export const AUDIT_STATUS_LABEL: Record<AuditProjectStatus, string> = {
  configuring: '配置中',
  ai_running: 'AI审核中',
  pending_review: '人工复审中',
  report_ready: '报告已生成',
}

export function getProjectDetailPath(project: Pick<AuditProject, 'id' | 'status'>): string {
  const base = `/projects/${project.id}`
  switch (project.status) {
    case 'configuring':
    case 'ai_running':
      return `${base}/task`
    case 'pending_review':
      return `${base}/results`
    case 'report_ready':
      return `${base}/reports`
  }
}

export function getProjectActionLabel(status: AuditProjectStatus): string {
  switch (status) {
    case 'configuring':
      return '继续配置'
    case 'ai_running':
      return '查看审核任务'
    case 'pending_review':
      return '审核结果'
    case 'report_ready':
      return '审核报告'
  }
}
