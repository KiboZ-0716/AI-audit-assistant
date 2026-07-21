/** 全局项目四态（对齐页面架构 v3.0） */
export type AuditProjectStatus =
  | 'configuring'
  | 'ai_running'
  | 'pending_review'
  | 'report_ready'

/** P3 工作台阶段：无「分析完成」中转 */
export type WorkspacePhase = 'configuring' | 'ai_running'

export type AiStageStatus = 'pending' | 'running' | 'done'

export type SubElementConfigStatus = 'unselected' | 'missing_source' | 'configured'

export type DataSourceKind = 'file' | 'system' | 'manual'

export interface AuditProjectProgress {
  percent: number
  label: string
}

export interface AuditProject {
  id: string
  name: string
  period: string
  plant: string
  area: string
  scopeSummary: string
  owner: string
  status: AuditProjectStatus
  progress: AuditProjectProgress
  updatedAt: string
  issueCount?: number
}

export interface MockUploadedFile {
  id: string
  name: string
}

export interface SystemFieldRef {
  key: string
  label: string
}

export interface SubElementDataSources {
  fileEnabled: boolean
  files: MockUploadedFile[]
  systemEnabled: boolean
  systemFields: SystemFieldRef[]
  /** 人工录入：线下表单，现场取证走移动端 */
  manualEnabled: boolean
  manualEvidenceStatus: 'none' | 'pending' | 'uploaded'
}

export interface SubElementNode {
  id: string
  name: string
  areaId: string
  areaName: string
  projectNodeId: string
  projectNodeName: string
  /** 是否纳入本次审核 */
  selected: boolean
  standardName: string
  standardVersion: string
  dataSources: SubElementDataSources
}

export interface ScopeAreaNode {
  id: string
  name: string
  projects: ScopeProjectNode[]
}

export interface ScopeProjectNode {
  id: string
  name: string
  subElements: SubElementNode[]
}

export interface AiExecutionStage {
  id: string
  name: string
  description: string
}

export type AiSubStepStatus = 'pending' | 'running' | 'done' | 'error'

export interface AiParsedItem {
  type: 'file' | 'system' | 'manual'
  label: string
  detail?: string
}

export interface AiParseSubResult {
  subElementId: string
  subElementName: string
  status: AiSubStepStatus
  summary?: string
  parsedItems?: AiParsedItem[]
  errorMessage?: string
}

export interface AiMatchedClause {
  id: string
  text: string
  isAiBasis?: boolean
}

export interface AiMatchSubResult {
  subElementId: string
  subElementName: string
  status: AiSubStepStatus
  standardName: string
  standardVersion: string
  matchedClauses: AiMatchedClause[]
}

export interface AiDetectSubResult {
  subElementId: string
  subElementName: string
  status: AiSubStepStatus
  issueCount?: number
  previewDescription?: string
  suggestedScore?: number
}

export interface AiExecutionState {
  stages: AiExecutionStage[]
  currentIndex: number
  stageStatuses: AiStageStatus[]
  /** 每步过程详情（Mock，供讲解） */
  stageDetails: Record<string, string>
  parseBySub?: AiParseSubResult[]
  matchBySub?: AiMatchSubResult[]
  detectBySub?: AiDetectSubResult[]
}

export interface AuditIssue {
  id: string
  subElementId: string
  subElementName: string
  description: string
  score: number
  standardRef: string
  rationale: string
  source: DataSourceKind
  modified: boolean
}

export type ReportAssetType = 'bip' | 'score' | 'common_issues' | 'comprehensive'

export interface ReportAsset {
  type: ReportAssetType
  title: string
  content: string
  generated: boolean
}

export interface ProjectWorkspace {
  projectId: string
  phase: WorkspacePhase
  locked: boolean
  /** 展示用自动生成名称 */
  name: string
  period: string
  plant: string
  owner: string
  /** 左树：区域 → 项目 → 子要素 */
  scopeTree: ScopeAreaNode[]
  selectedSubElementId: string | null
  ai: AiExecutionState
  issues: AuditIssue[]
  reports: ReportAsset[]
  /** BIP 问题管理表（Excel 结构） */
  bipIssues: BipIssueRow[]
  /** 主要问题总结 */
  majorIssueSummary: string
  /** 符合率评分表 */
  complianceScores: ComplianceScoreRow[]
  /** 审核报告列表 */
  auditReports: AuditReportItem[]
}

export interface BipIssueRow {
  id: string
  time: string
  plant: string
  seq: number
  area: string
  project: string
  subElement: string
  description: string
  severity: number
  attribute: string
}

export interface ComplianceScoreRow {
  plant: string
  area: string
  calibrateTime: string
  project: string
  subElement: string
  score: number | null
  complianceRate: number | null
}

export interface AuditReportItem {
  id: string
  title: string
  plant: string
  period: string
  generatedAt: string
  status: 'draft' | 'published'
  summary: string
  content: string
}

export function computeSubElementStatus(node: SubElementNode): SubElementConfigStatus {
  if (!node.selected) return 'unselected'
  const ds = node.dataSources
  const hasSource =
    (ds.fileEnabled && ds.files.length > 0) ||
    (ds.systemEnabled && ds.systemFields.length > 0) ||
    ds.manualEnabled
  return hasSource ? 'configured' : 'missing_source'
}
