export interface AuditStandardPreview {
  name: string
  version: string
  scope: string
  summary: string
  clauses: string[]
  rules: string[]
}

const STANDARD_PREVIEWS: Record<string, Omit<AuditStandardPreview, 'name' | 'version'>> = {
  'IQS/QMS 问题传递审核规则': {
    scope: '零部件 · 质量数据采集 · 质量信息传递',
    summary: '审核零部件质量问题从发生到 CR 开启的传递及时性与信息完整性。',
    clauses: [
      '零部件质量（含KD件）问题应及时传递并得到 IQ/STA 确认',
      'IQ 进行责任判定并将信息传递至责任单位（供应商、长安、SI）',
    ],
    rules: [
      '问题传递及时性：问题发生日期与 CR 问题开启日期相差不超过 2 个工作日，超过则扣分',
      '问题基础信息审核（5W2H）完整性检查',
    ],
  },
  'CR/ECR 闭环审核规则': {
    scope: '零部件 · 质量数据采集 · 质量问题记录',
    summary: '审核 CR 记录及时性、问题上线率及 ECR 修改闭环完整性。',
    clauses: [
      '初判为供应商责任的问题全部及时在 IQS 系统中记录 CR',
      'CR 内容修改时 ECR 必须有新的 CR 记录支撑',
    ],
    rules: [
      '质量问题基础信息审核（5W2H）',
      '问题上线率：CR 问题数 / 前工序问题中供应商责任问题数 < 80% 则扣分',
      'ECR 问题闭环完整性：ECR 问题数必须有新开 CR 记录',
    ],
  },
  '设备管理审核规则': {
    scope: '过程（车间） · 质量数据采集 · 质量监视测量设备配置',
    summary: '审核生产设备与质量监视测量设备配置及 MSA 分析有效性。',
    clauses: [
      '生产设备、质量监视测量设备配置满足生产检测与质量监控需求',
      '关键测量设备开展 MSA 分析并满足使用要求',
    ],
    rules: [
      '判别 MSA 报告类型：计量型、计数型、前期能力分析、特殊 MSA',
      '审核报告内容完整性，结论是否清晰',
      '台账与现场实物一致性检查',
    ],
  },
  '工艺文件两两审核规则': {
    scope: '过程（车间） · 质量数据采集 · 质量检查监控项目',
    summary: '审核作业指导书等文件对检查/测量活动的有效指导与持续优化。',
    clauses: [
      '有作业指导书等文件有效指导员工进行检查/测量以识别质量问题',
      '结合质量问题进行持续更新优化检查项目',
    ],
    rules: [
      '8 大工艺文件两两审核（主要关注控制计划 → 作业指导书）',
      '检查项目与现场实际问题关联性审核',
    ],
  },
}

const DEFAULT_PREVIEW: Omit<AuditStandardPreview, 'name' | 'version'> = {
  scope: 'BIP 930 上线项目子要素',
  summary: '按知识库匹配的审核标准条款，对子要素绑定的数据源执行规则化审核。',
  clauses: ['审核目标与条款内容以知识库发布版本为准'],
  rules: ['按审核规则（需细化）章节逐条比对数据源', '不符合项生成问题描述与评分建议'],
}

export function getAuditStandardPreview(
  standardName: string,
  standardVersion: string,
): AuditStandardPreview {
  const preset = STANDARD_PREVIEWS[standardName] ?? DEFAULT_PREVIEW
  return {
    name: standardName,
    version: standardVersion,
    ...preset,
  }
}
