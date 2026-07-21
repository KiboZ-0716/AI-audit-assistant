import type { AuditReportItem, BipIssueRow, ComplianceScoreRow } from '@/types/audit'

/** 来自 10.制造过程提升流程审核问题清单_20260206140656.xlsx */
export const MOCK_BIP_ISSUES: BipIssueRow[] = [
  {
    id: 'bip-1',
    time: '2025-06-01',
    plant: 'A工厂',
    seq: 1,
    area: '电驱',
    project: '问题管理',
    subElement: '质量检查监控',
    description: '波峰焊设备清洁维护不到位，设备内部和顶部存在脏污。',
    severity: 6,
    attribute: '设备工装类',
  },
  {
    id: 'bip-2',
    time: '2025-06-01',
    plant: 'A工厂',
    seq: 2,
    area: '电驱',
    project: '问题管理',
    subElement: '质量检查监控',
    description: '电控清洁度管控方案中缺失老化小车的控制要求。',
    severity: 6,
    attribute: '标准类',
  },
  {
    id: 'bip-3',
    time: '2025-06-01',
    plant: 'A工厂',
    seq: 3,
    area: '电驱',
    project: '问题管理',
    subElement: '质量信息记录',
    description:
      '电驱三线PLC中ICC与实际故障不对应，例如减速器合箱面/压装高度H不合格与减速器左箱体油封/压装检测不合格两个ICC被对调。',
    severity: 6,
    attribute: '设备工装类',
  },
  {
    id: 'bip-4',
    time: '2025-06-01',
    plant: 'A工厂',
    seq: 4,
    area: '电驱',
    project: '问题改进',
    subElement: '8D/Form4',
    description:
      '车间月会材料中，针对减速器合箱面压装H不合格问题，8月不合格17例，9月不合格为60例，整改措施一致但问题已关闭。',
    severity: 8,
    attribute: '其他',
  },
]

export const MOCK_MAJOR_ISSUE_SUMMARY = `7月14-18日对A工厂开展BIP年度标定及专项审核，累计识别34个问题，其中漏水专项5个问题。
主要问题：（1）问题管理的有效性不足，一关键指标问题未跟踪管理；（2）批量返修管理不规范，重大及换件返修问题未有效执行简道云排查返修流程；（3）漏水正向管控不足，漏水为工厂目前top1问题，但未有效正向梳理控制项目。`

export const MOCK_COMPLIANCE_SCORES: ComplianceScoreRow[] = [
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '指标管理',
    subElement: '指标分解',
    score: 10,
    complianceRate: 90,
  },
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '指标管理',
    subElement: '指标统计',
    score: 6,
    complianceRate: null,
  },
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '指标管理',
    subElement: '改进与提升',
    score: 10,
    complianceRate: null,
  },
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '问题管理',
    subElement: '质量检查监控',
    score: null,
    complianceRate: null,
  },
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '问题管理',
    subElement: '质量信息记录',
    score: null,
    complianceRate: null,
  },
  {
    plant: 'A工厂',
    area: '工厂层级',
    calibrateTime: '2025-11-01',
    project: '问题管理',
    subElement: '质量信息传递',
    score: 10,
    complianceRate: null,
  },
]

export const MOCK_AUDIT_REPORTS: AuditReportItem[] = [
  {
    id: 'rpt-2025q2-a',
    title: 'A工厂 BIP 年度标定审核报告',
    plant: 'A工厂',
    period: '2025 Q2',
    generatedAt: '2025-07-20',
    status: 'published',
    summary: '累计识别 34 个问题，涵盖问题管理、批量返修与漏水专项。',
    content:
      '一、审核概述\n对 A 工厂开展 BIP 年度标定及专项审核，审核周期 2025 Q2。\n\n二、主要发现\n问题管理有效性不足、批量返修管理不规范、漏水正向管控不足。\n\n三、改进建议\n强化 TOP 问题跟踪闭环，推进漏水控制项目标准化传递。',
  },
  {
    id: 'rpt-2025q2-b',
    title: 'B工厂 BIP 年度标定审核报告',
    plant: 'B工厂',
    period: '2025 Q2',
    generatedAt: '2025-07-28',
    status: 'published',
    summary: '累计识别 19 个问题，数据录入与错漏装管理需加强。',
    content:
      '一、审核概述\n对 B 工厂开展 BIP 年度标定审核。\n\n二、主要发现\n数据录入不规范、问题整改有效性不足、错漏装管理不到位。',
  },
  {
    id: 'rpt-draft-liangjiang',
    title: '两江工厂 涂装过程审核报告（草稿）',
    plant: '两江工厂',
    period: '2026 Q2',
    generatedAt: '2026-07-21',
    status: 'draft',
    summary: 'AI 审核进行中，报告待生成。',
    content: '审核任务执行中，待 AI 审核完成后自动生成报告正文。',
  },
]

export function getDeliverablesForPlant(plant: string) {
  if (!plant) {
    return {
      bipIssues: [],
      majorIssueSummary: '',
      complianceScores: [],
      auditReports: [],
    }
  }
  const normalized = plant
  const plantKey = normalized.includes('两江') ? '两江工厂' : normalized.includes('A') ? 'A工厂' : normalized
  return {
    bipIssues: MOCK_BIP_ISSUES.map((r) => ({ ...r, plant: plantKey })),
    majorIssueSummary: MOCK_MAJOR_ISSUE_SUMMARY.replace('A工厂', plantKey),
    complianceScores: MOCK_COMPLIANCE_SCORES.map((r) => ({ ...r, plant: plantKey })),
    auditReports: MOCK_AUDIT_REPORTS.filter(
      (r) => r.plant === plantKey || r.status === 'draft',
    ),
  }
}
