import type { ScopeAreaNode, SubElementNode } from '@/types/audit'

/** 来自 BIP AI审核_0715_1.xlsx · 930上线项目 */
interface BipSubSeed {
  id: string
  name: string
  standardName: string
  standardVersion: string
  hasSystem?: boolean
  hasFile?: boolean
  hasManual?: boolean
  fileNames?: string[]
  systemFields?: { key: string; label: string }[]
}

interface BipProjectSeed {
  id: string
  name: string
  subElements: BipSubSeed[]
}

interface BipAreaSeed {
  id: string
  name: string
  projects: BipProjectSeed[]
}

const BIP_SCOPE_SEED: BipAreaSeed[] = [
  {
    id: 'area-parts',
    name: '零部件',
    projects: [
      {
        id: 'proj-parts-quality-collect',
        name: '质量数据采集',
        subElements: [
          {
            id: 'se-parts-info-transfer',
            name: '质量信息传递',
            standardName: 'IQS/QMS 问题传递审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            systemFields: [{ key: 'cr_open_time', label: 'CR问题开启日期' }],
          },
          {
            id: 'se-parts-issue-record',
            name: '质量问题记录',
            standardName: 'CR/ECR 闭环审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['前工序问题表.xlsx', 'ECR修改记录.xlsx'],
            systemFields: [{ key: 'cr_count', label: 'CR问题数' }],
          },
          {
            id: 'se-parts-qr-upgrade',
            name: 'QR升级管理',
            standardName: 'QR/EQR 审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['申诉报告.docx'],
          },
        ],
      },
      {
        id: 'proj-parts-quality-apply',
        name: '质量数据运用',
        subElements: [
          {
            id: 'se-parts-indicator-stat',
            name: '指标统计',
            standardName: 'PPM 指标统计审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            systemFields: [{ key: 'ppm', label: '零部件PPM' }],
          },
          {
            id: 'se-parts-monitor',
            name: '监控分析',
            standardName: 'PPM 趋势监控审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            systemFields: [{ key: 'ppm_trend', label: '年度PPM趋势' }],
          },
        ],
      },
      {
        id: 'proj-parts-improve',
        name: '质量改进',
        subElements: [
          {
            id: 'se-parts-supplier-mgmt',
            name: '供应商责任问题的管理',
            standardName: 'QR整改与8D审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            fileNames: ['QR延期申请流程.pdf'],
            hasFile: true,
          },
        ],
      },
      {
        id: 'proj-parts-supplier-meeting',
        name: '供应商会议',
        subElements: [
          {
            id: 'se-parts-supplier-talk',
            name: '对重点关注供应商开展约谈',
            standardName: '供应商约谈审核规则',
            standardVersion: 'V1.0',
            hasFile: true,
            fileNames: ['约谈报告.docx', '重点关注供应商状态表.xlsx'],
            hasSystem: true,
          },
        ],
      },
    ],
  },
  {
    id: 'area-process',
    name: '过程（车间）',
    projects: [
      {
        id: 'proj-process-quality-collect',
        name: '质量数据采集',
        subElements: [
          {
            id: 'se-process-check-monitor',
            name: '质量检查监控项目',
            standardName: '工艺文件两两审核规则',
            standardVersion: 'V1.0',
            hasManual: true,
            hasFile: true,
            fileNames: ['作业指导书检查表.xlsx', '控制计划对照表.xlsx'],
          },
          {
            id: 'se-process-measure-device',
            name: '质量监视测量设备配置',
            standardName: '设备管理审核规则',
            standardVersion: 'V1.0',
            hasFile: true,
            fileNames: ['MSA分析报告-计量型.pdf', 'MSA分析报告-计数型.pdf'],
            hasSystem: true,
            systemFields: [
              { key: 'issue_time', label: '问题记录时间' },
              { key: 'device_code', label: '设备编号' },
            ],
          },
        ],
      },
      {
        id: 'proj-process-quality-apply',
        name: '质量数据运用',
        subElements: [
          {
            id: 'se-process-target-path',
            name: '指标分解及路径',
            standardName: '指标判异审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['目标分解管理表.xlsx'],
            systemFields: [{ key: 'mis', label: '0MIS' }],
          },
          {
            id: 'se-process-indicator-stat',
            name: '指标统计',
            standardName: '指标统计审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
          },
          {
            id: 'se-process-monitor',
            name: '指标监控分析',
            standardName: '指标监控审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
          },
        ],
      },
      {
        id: 'proj-process-improve',
        name: '质量改进',
        subElements: [
          {
            id: 'se-process-improve-mgmt',
            name: '质量改进',
            standardName: '问题管理审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['问题管理表.xlsx'],
          },
        ],
      },
      {
        id: 'proj-process-issue-mgmt',
        name: '过程问题管理',
        subElements: [
          {
            id: 'se-process-qcm-hold',
            name: '质量问题围堵',
            standardName: 'QCM/HOLD 审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['批量问题管理台账.xlsx'],
          },
          {
            id: 'se-process-rework',
            name: '返工返修',
            standardName: '返修闭环审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
          },
        ],
      },
    ],
  },
  {
    id: 'area-function',
    name: '职能',
    projects: [
      {
        id: 'proj-function-quality-apply',
        name: '质量数据运用',
        subElements: [
          {
            id: 'se-function-target-split',
            name: '指标分解',
            standardName: '指标判异审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['过程质量指标分解表.xlsx'],
          },
          {
            id: 'se-function-indicator-stat',
            name: '指标统计',
            standardName: '指标统计审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
          },
          {
            id: 'se-function-monitor',
            name: '指标监控与分析',
            standardName: '指标监控审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
          },
        ],
      },
      {
        id: 'proj-function-improve',
        name: '质量改进',
        subElements: [
          {
            id: 'se-function-physical-improve',
            name: '实物质量改进',
            standardName: '工厂级问题闭环审核规则',
            standardVersion: 'V1.0',
            hasSystem: true,
            hasFile: true,
            fileNames: ['8D报告模板.xlsx'],
          },
        ],
      },
    ],
  },
]

function buildDataSources(seed: BipSubSeed): SubElementNode['dataSources'] {
  return {
    fileEnabled: Boolean(seed.hasFile),
    files: (seed.fileNames ?? []).map((name, i) => ({ id: `${seed.id}-f${i}`, name })),
    systemEnabled: Boolean(seed.hasSystem),
    systemFields: seed.systemFields ?? [],
    manualEnabled: Boolean(seed.hasManual),
    manualEvidenceStatus: seed.hasManual ? 'pending' : 'none',
  }
}

function buildSubElement(
  seed: BipSubSeed,
  area: BipAreaSeed,
  project: BipProjectSeed,
  selected: boolean,
): SubElementNode {
  return {
    id: seed.id,
    name: seed.name,
    areaId: area.id,
    areaName: area.name,
    projectNodeId: project.id,
    projectNodeName: project.name,
    selected,
    standardName: seed.standardName,
    standardVersion: seed.standardVersion,
    dataSources: buildDataSources(seed),
  }
}

/** 构建完整审核范围树（Excel 930上线项目） */
export function buildBipScopeTree(selectedIds?: Set<string>): ScopeAreaNode[] {
  const selected = selectedIds ?? new Set<string>()
  return BIP_SCOPE_SEED.map((area) => ({
    id: area.id,
    name: area.name,
    projects: area.projects.map((project) => ({
      id: project.id,
      name: project.name,
      subElements: project.subElements.map((se) =>
        buildSubElement(se, area, project, selected.has(se.id)),
      ),
    })),
  }))
}

export const BIP_SELECTED_IDS = {
  /** 两江涂装 Demo：过程（车间）3 个子要素 */
  liangjiangPaint: new Set([
    'se-process-check-monitor',
    'se-process-measure-device',
    'se-process-target-path',
  ]),
  partsConfiguring: new Set(['se-parts-info-transfer', 'se-parts-issue-record']),
  processReview: new Set(['se-process-qcm-hold', 'se-process-rework', 'se-process-improve-mgmt']),
  functionReport: new Set(['se-function-target-split', 'se-function-physical-improve']),
} as const
