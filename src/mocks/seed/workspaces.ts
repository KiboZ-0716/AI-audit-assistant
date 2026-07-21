import { createInitialAiState } from '@/features/audit-project/workspace-utils'
import { createStaticAiRunningState } from '@/features/ai-execution/build-sub-execution'
import { getDeliverablesForPlant } from '@/mocks/seed/excel-deliverables'

import {

  BIP_SELECTED_IDS,

  buildBipScopeTree,

} from '@/mocks/seed/bip-scope-tree'

import { mockAuditProjects } from '@/mocks/seed/projects'

import type {

  AuditIssue,

  ProjectWorkspace,

  ReportAsset,

} from '@/types/audit'

export { createStaticAiRunningState } from '@/features/ai-execution/build-sub-execution'

export function buildMockIssues(projectId: string): AuditIssue[] {

  const issueSets: Record<string, AuditIssue[]> = {

    'prj-process-issue-2026q2': [

      {

        id: `${projectId}-iss-1`,

        subElementId: 'se-process-qcm-hold',

        subElementName: '质量问题围堵',

        description: '批量问题 HOLD 台账未及时更新，排查闭环记录不完整。',

        score: 6,

        standardRef: 'QCM/HOLD 审核规则 V1.0 · 条款 2.1',

        rationale: '对照 QMS 系统字段与线下台账，发现 3 条 HOLD 记录缺少复检结论。',

        source: 'system',

        modified: false,

      },

      {

        id: `${projectId}-iss-2`,

        subElementId: 'se-process-rework',

        subElementName: '返工返修',

        description: '返修车辆数与故障车辆数不一致，返修数据字段存在空值。',

        score: 7,

        standardRef: '返修闭环审核规则 V1.0 · 条款 1.2',

        rationale: '系统返修记录中 VIN 与复检人员字段缺失 2 条。',

        source: 'system',

        modified: false,

      },

      {

        id: `${projectId}-iss-3`,

        subElementId: 'se-process-improve-mgmt',

        subElementName: '质量改进',

        description: '问题管理表永久措施描述不完善，牵头人与时间节点未明确。',

        score: 5,

        standardRef: '问题管理审核规则 V1.0 · 条款 3.1',

        rationale: '上传的问题管理表 EXCEL 中 4 条记录措施字段为空。',

        source: 'file',

        modified: false,

      },

      {

        id: `${projectId}-iss-4`,

        subElementId: 'se-process-qcm-hold',

        subElementName: '质量问题围堵',

        description: '一页纸报告未随问题关闭同步提交。',

        score: 6,

        standardRef: 'QCM/HOLD 审核规则 V1.0 · 条款 4.3',

        rationale: '审核规则要求问题关闭时必须提交一页纸报告，2 项缺失。',

        source: 'file',

        modified: false,

      },

    ],

    'prj-parts-supplier-2026q2': [

      {

        id: `${projectId}-iss-1`,

        subElementId: 'se-parts-supplier-talk',

        subElementName: '对重点关注供应商开展约谈',

        description: '约谈报告日期与重点关注供应商开启月份不一致。',

        score: 6,

        standardRef: '供应商约谈审核规则 V1.0 · 条款 1.1',

        rationale: '状态表显示 6 月开启，约谈报告日期为 7 月。',

        source: 'file',

        modified: false,

      },

      {

        id: `${projectId}-iss-2`,

        subElementId: 'se-parts-supplier-talk',

        subElementName: '对重点关注供应商开展约谈',

        description: '约谈报告缺少整改措施和时间计划等必填内容。',

        score: 5,

        standardRef: '供应商约谈审核规则 V1.0 · 条款 2.2',

        rationale: 'Word 报告模板校验未包含整改措施章节。',

        source: 'manual',

        modified: false,

      },

    ],

    'prj-function-improve-2026q2': [

      {

        id: `${projectId}-iss-1`,

        subElementId: 'se-function-target-split',

        subElementName: '指标分解',

        description: '过程质量指标分解未覆盖全部上级下达目标。',

        score: 6,

        standardRef: '指标判异审核规则 V1.0 · 条款 1.1',

        rationale: 'DDM 系统对比显示 FTR 指标未纳入分解表。',

        source: 'system',

        modified: false,

      },

      {

        id: `${projectId}-iss-2`,

        subElementId: 'se-function-physical-improve',

        subElementName: '实物质量改进',

        description: '工厂级问题永久措施描述不完善，关闭流程不规范。',

        score: 7,

        standardRef: '工厂级问题闭环审核规则 V1.0 · 条款 2.3',

        rationale: '问题管理规则触发：2 条记录牵头人为空。',

        source: 'file',

        modified: false,

      },

      {

        id: `${projectId}-iss-3`,

        subElementId: 'se-function-physical-improve',

        subElementName: '实物质量改进',

        description: '重大批量问题未按要求提交 8D 报告。',

        score: 8,

        standardRef: '工厂级问题闭环审核规则 V1.0 · 条款 3.2',

        rationale: 'B 类问题单班超过 2 例，未见对应 8D 报告。',

        source: 'file',

        modified: false,

      },

    ],

  }



  return issueSets[projectId] ?? []

}



export function buildMockReports(projectId: string, generated: boolean): ReportAsset[] {

  const issues = buildMockIssues(projectId)

  return [

    {

      type: 'bip',

      title: 'BIP 问题管理表',

      generated,

      content: issues

        .map((i, idx) => `${idx + 1}. 【${i.subElementName}】${i.description}`)

        .join('\n'),

    },

    {

      type: 'score',

      title: '问题打分结果',

      generated,

      content: issues.map((i) => `${i.subElementName}：评分 ${i.score}/10`).join('\n'),

    },

    {

      type: 'common_issues',

      title: '共性问题总结（区域/工厂/集团）',

      generated,

      content: generated

        ? '工厂级：过程问题围堵与返修闭环管理不足。\n区域级：问题管理表规范性偏弱。\n集团级：建议统一 QMS 与线下台账同步机制。'

        : '尚未生成。可在报告中心手动触发生成。',

    },

    {

      type: 'comprehensive',

      title: '综合性报告',

      generated,

      content: generated

        ? '审核概述：覆盖过程（车间）过程问题管理与质量改进子要素。\n亮点工作：系统取数路径清晰。\n主要问题：HOLD 闭环不完整、返修数据缺失、措施描述不规范。\n下一步要求：完成复检闭环并推进台账电子化。'

        : '尚未生成。可在报告中心手动触发生成。',

    },

  ]

}



function baseWorkspace(

  projectId: string,

  patch: Partial<ProjectWorkspace>,

): ProjectWorkspace {

  const project = mockAuditProjects.find((p) => p.id === projectId)

  const tree = buildBipScopeTree()

  const firstSe = tree[0]?.projects[0]?.subElements[0]



  const plant = patch.plant ?? project?.plant ?? '渝北工厂'
  const deliverables = getDeliverablesForPlant(plant)

  return {

    projectId,

    phase: 'configuring',

    locked: false,

    name: project?.name ?? `AUD-NEW-${projectId.slice(-4)}`,

    period: project?.period ?? '2026 Q2',

    plant,

    owner: project?.owner ?? '审核工程师',

    scopeTree: tree,

    selectedSubElementId: firstSe?.id ?? null,

    ai: createInitialAiState(0),

    issues: [],

    reports: buildMockReports(projectId, false),

    bipIssues: deliverables.bipIssues,

    majorIssueSummary: deliverables.majorIssueSummary,

    complianceScores: deliverables.complianceScores,

    auditReports: deliverables.auditReports,

    ...patch,

  }

}



export const mockWorkspacesById: Record<string, ProjectWorkspace> = {

  'prj-liangjiang-paint-2026q2': (() => {
    const tree = buildBipScopeTree(BIP_SELECTED_IDS.liangjiangPaint)
    return baseWorkspace('prj-liangjiang-paint-2026q2', {
      phase: 'ai_running',
      locked: true,
      scopeTree: tree,
      selectedSubElementId: 'se-process-measure-device',
      ai: createStaticAiRunningState(tree),
    })
  })(),

  'prj-parts-quality-2026q2': (() => {
    const tree = buildBipScopeTree(BIP_SELECTED_IDS.partsConfiguring)
    for (const area of tree) {
      for (const proj of area.projects) {
        for (const se of proj.subElements) {
          if (se.id === 'se-parts-issue-record') {
            se.dataSources = {
              fileEnabled: false,
              files: [],
              systemEnabled: false,
              systemFields: [],
              manualEnabled: false,
              manualEvidenceStatus: 'none',
            }
          }
        }
      }
    }
    return baseWorkspace('prj-parts-quality-2026q2', {
      phase: 'configuring',
      locked: false,
      scopeTree: tree,
      selectedSubElementId: 'se-parts-info-transfer',
    })
  })(),

  'prj-process-issue-2026q2': baseWorkspace('prj-process-issue-2026q2', {

    phase: 'configuring',

    locked: true,

    scopeTree: buildBipScopeTree(BIP_SELECTED_IDS.processReview),

    selectedSubElementId: 'se-process-qcm-hold',

    issues: buildMockIssues('prj-process-issue-2026q2'),

    reports: buildMockReports('prj-process-issue-2026q2', false),

  }),

  'prj-function-improve-2026q2': baseWorkspace('prj-function-improve-2026q2', {

    phase: 'configuring',

    locked: true,

    scopeTree: buildBipScopeTree(BIP_SELECTED_IDS.functionReport),

    selectedSubElementId: 'se-function-target-split',

    issues: buildMockIssues('prj-function-improve-2026q2'),

    reports: buildMockReports('prj-function-improve-2026q2', true),

  }),

  'prj-parts-supplier-2026q2': baseWorkspace('prj-parts-supplier-2026q2', {

    phase: 'configuring',

    locked: true,

    scopeTree: buildBipScopeTree(new Set(['se-parts-supplier-talk'])),

    selectedSubElementId: 'se-parts-supplier-talk',

    issues: buildMockIssues('prj-parts-supplier-2026q2'),

    reports: buildMockReports('prj-parts-supplier-2026q2', false),

  }),

}



export function getMockWorkspace(projectId: string): ProjectWorkspace {

  if (mockWorkspacesById[projectId]) {

    return structuredClone(mockWorkspacesById[projectId])

  }

  return structuredClone(baseWorkspace(projectId, {}))

}



export function createNewProjectSeed(seq: number): {

  project: import('@/types/audit').AuditProject

  workspace: ProjectWorkspace

} {

  const id = `prj-new-${Date.now()}`

  const name = `AUD-2026Q2-渝北-新建-${String(seq).padStart(3, '0')}`

  const project: import('@/types/audit').AuditProject = {

    id,

    name,

    period: '',

    plant: '',

    area: '零部件',

    scopeSummary: '待选择审核范围',

    owner: '张敏',

    status: 'configuring',

    progress: { percent: 5, label: '请先选择审核周期与基地' },

    updatedAt: formatNow(),

  }

  const workspace = baseWorkspace(id, {

    name,

    period: '',

    plant: '',

    phase: 'configuring',

    locked: false,

  })

  return { project, workspace }

}



function formatNow() {

  const d = new Date()

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`

}

