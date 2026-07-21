import { AI_STAGE_DETAIL_TEMPLATES } from '@/features/ai-execution/stages'
import type {
  AiDetectSubResult,
  AiExecutionState,
  AiMatchSubResult,
  AiParseSubResult,
  AiStageStatus,
  AiSubStepStatus,
  ScopeAreaNode,
  SubElementNode,
} from '@/types/audit'

function selectedSubs(tree: ScopeAreaNode[]): SubElementNode[] {
  return tree.flatMap((a) => a.projects.flatMap((p) => p.subElements.filter((s) => s.selected)))
}

function subStepStatus(
  stageStatus: AiStageStatus,
  index: number,
  total: number,
): AiSubStepStatus {
  if (stageStatus === 'pending') return 'pending'
  if (stageStatus === 'done') return 'done'
  const activeIndex = Math.max(0, total - 2)
  if (index < activeIndex) return 'done'
  if (index === activeIndex) return 'running'
  return 'pending'
}

function buildParseItems(se: SubElementNode): AiParseSubResult['parsedItems'] {
  const items: AiParseSubResult['parsedItems'] = []
  const ds = se.dataSources

  for (const file of ds.files) {
    items.push({ type: 'file', label: file.name, detail: '已提取表格字段 12 项' })
  }
  for (const field of ds.systemFields) {
    items.push({
      type: 'system',
      label: field.label,
      detail: `系统字段 ${field.key} · 近 90 天记录 48 条`,
    })
  }
  if (ds.manualEnabled) {
    items.push({
      type: 'manual',
      label: '现场取证资料',
      detail:
        ds.manualEvidenceStatus === 'uploaded'
          ? '照片 3 张、表单扫描 1 份'
          : '待现场取证（已登记线索）',
    })
  }
  if (items.length === 0) {
    items.push({ type: 'file', label: '待解析资料', detail: '未绑定数据源' })
  }
  return items
}

function buildMatchClauses(se: SubElementNode): AiMatchSubResult['matchedClauses'] {
  const presets: Record<string, AiMatchSubResult['matchedClauses']> = {
    'se-process-check-monitor': [
      {
        id: 'c1',
        text: '有作业指导书等文件有效指导员工进行检查/测量以识别质量问题',
      },
      {
        id: 'c2',
        text: '结合质量问题进行持续更新优化检查项目',
        isAiBasis: true,
      },
    ],
    'se-process-measure-device': [
      {
        id: 'c1',
        text: '生产设备、质量监视测量设备配置能够满足产品的生产检测、质量监控需求',
      },
      {
        id: 'c2',
        text: '关键测量设备开展了 MSA 分析并满足使用要求',
        isAiBasis: true,
      },
      {
        id: 'c3',
        text: '审核报告内容是否完整，结论是否清晰',
      },
    ],
    'se-process-target-path': [
      {
        id: 'c1',
        text: '根据工厂下发的质量目标，对本区域的目标进行分解并制定目标达成路径及关键举措',
        isAiBasis: true,
      },
      {
        id: 'c2',
        text: '当指标触发判异规则，需对比问题管理的项目与系统中的 TOP 项目是否一致',
      },
    ],
  }

  return (
    presets[se.id] ?? [
      {
        id: 'c1',
        text: `按「${se.standardName}」对子要素「${se.name}」执行条款匹配`,
        isAiBasis: true,
      },
      { id: 'c2', text: '审核规则（需细化）章节逐条比对数据源' },
    ]
  )
}

function buildParseResults(
  subs: SubElementNode[],
  stageStatus: AiStageStatus,
): AiParseSubResult[] {
  return subs.map((se, index) => {
    const status = subStepStatus(stageStatus, index, subs.length)
    if (status === 'pending') {
      return { subElementId: se.id, subElementName: se.name, status }
    }

    // Demo: first sub-element of measure-device project gets a parse warning on static demo
    if (se.id === 'se-process-check-monitor' && status === 'done') {
      return {
        subElementId: se.id,
        subElementName: se.name,
        status: 'error',
        summary: '作业指导书 PDF 第 3 页 OCR 置信度偏低',
        parsedItems: buildParseItems(se),
        errorMessage: '「控制计划对照表.xlsx」Sheet2 存在合并单元格，部分检查项未能自动映射。',
      }
    }

    const parsedItems = buildParseItems(se) ?? []
    return {
      subElementId: se.id,
      subElementName: se.name,
      status,
      summary:
        status === 'running'
          ? `正在解析 ${parsedItems.length} 类资料…`
          : `已解析 ${parsedItems.length} 类资料`,
      parsedItems,
    }
  })
}

function buildMatchResults(
  subs: SubElementNode[],
  stageStatus: AiStageStatus,
): AiMatchSubResult[] {
  return subs.map((se, index) => {
    const status = subStepStatus(stageStatus, index, subs.length)
    const matchedClauses = buildMatchClauses(se)
    return {
      subElementId: se.id,
      subElementName: se.name,
      status,
      standardName: se.standardName,
      standardVersion: se.standardVersion,
      matchedClauses,
    }
  })
}

function buildDetectResults(
  subs: SubElementNode[],
  stageStatus: AiStageStatus,
): AiDetectSubResult[] {
  const previews: Record<string, { description: string; score: number }> = {
    'se-process-measure-device': {
      description: '部分计量设备超期未检定，台账与现场实物不一致。',
      score: 6,
    },
    'se-process-check-monitor': {
      description: '检查表与现场实际问题关联性不足，漏检项 2 处。',
      score: 5,
    },
    'se-process-target-path': {
      description: '指标分解未覆盖全部上级下达目标，TOP 问题管理不一致。',
      score: 7,
    },
  }

  return subs.map((se, index) => {
    const status = subStepStatus(stageStatus, index, subs.length)
    const preview = previews[se.id]
    if (status === 'pending') {
      return { subElementId: se.id, subElementName: se.name, status }
    }
    if (status === 'running') {
      return {
        subElementId: se.id,
        subElementName: se.name,
        status,
        previewDescription: '正在生成问题描述与评分建议…',
      }
    }
    return {
      subElementId: se.id,
      subElementName: se.name,
      status,
      issueCount: 1,
      previewDescription: preview?.description,
      suggestedScore: preview?.score,
    }
  })
}

/** 按子要素生成三步 AI 执行明细（Mock） */
export function buildAiSubExecutionDetails(
  scopeTree: ScopeAreaNode[],
  stageStatuses: AiStageStatus[],
): Pick<AiExecutionState, 'parseBySub' | 'matchBySub' | 'detectBySub'> {
  const subs = selectedSubs(scopeTree)
  return {
    parseBySub: buildParseResults(subs, stageStatuses[0] ?? 'pending'),
    matchBySub: buildMatchResults(subs, stageStatuses[1] ?? 'pending'),
    detectBySub: buildDetectResults(subs, stageStatuses[2] ?? 'pending'),
  }
}

export function enrichAiExecutionState(
  ai: AiExecutionState,
  scopeTree: ScopeAreaNode[],
): AiExecutionState {
  return {
    ...ai,
    ...buildAiSubExecutionDetails(scopeTree, ai.stageStatuses),
  }
}

export function createStaticAiRunningState(scopeTree: ScopeAreaNode[]): AiExecutionState {
  const stageStatuses: AiStageStatus[] = ['done', 'running', 'pending']
  return enrichAiExecutionState(
    {
      stages: [
        { id: 'parse', name: '资料解析', description: '解析子要素绑定的文件、系统数据与人工录入资料' },
        { id: 'match', name: '标准匹配', description: '检索并命中知识库审核标准条款' },
        {
          id: 'detect_score',
          name: '问题识别与描述及评分',
          description: '生成问题描述与打分建议，供人工复审修改',
        },
      ],
      currentIndex: 1,
      stageStatuses,
      stageDetails: { ...AI_STAGE_DETAIL_TEMPLATES },
    },
    scopeTree,
  )
}
