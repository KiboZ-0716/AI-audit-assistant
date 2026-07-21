import type { AiExecutionStage } from '@/types/audit'

/** AI 审核执行仅三步（对齐页面架构 v3.0） */
export const AI_EXECUTION_STAGES: AiExecutionStage[] = [
  {
    id: 'parse',
    name: '资料解析',
    description: '解析子要素绑定的文件、系统数据与人工录入资料',
  },
  {
    id: 'match',
    name: '标准匹配',
    description: '检索并命中知识库审核标准条款',
  },
  {
    id: 'detect_score',
    name: '问题识别与描述及评分',
    description: '生成问题描述与打分建议，供人工复审修改',
  },
]

export const AI_STAGE_DURATION_MS = 1800

export const AI_STAGE_DETAIL_TEMPLATES: Record<string, string> = {
  parse:
    '已解析子要素资料：检查表 2 份、系统字段「问题记录时间 / 设备编号」、现场照片证据线索 1 组。',
  match: '已匹配标准：质量监视测量设备配置相关条款（设备管理审核规则 V1.0）。',
  detect_score:
    '已识别不符合项并生成问题描述与评分建议；结果将进入人工复审，支持修改描述与打分。',
}
