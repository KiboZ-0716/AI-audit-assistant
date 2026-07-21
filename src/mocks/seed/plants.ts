export interface AuditPlantOption {
  id: string
  name: string
  /** 是否已接入 IQS/QMS/DDM 等系统，决定能否选择系统数据 */
  digitized: boolean
}

export const AUDIT_PLANT_OPTIONS: AuditPlantOption[] = [
  { id: 'liangjiang', name: '两江工厂', digitized: true },
  { id: 'yubei', name: '渝北工厂', digitized: true },
  { id: 'longxing', name: '龙兴工厂', digitized: true },
  { id: 'xindongli', name: '新动力工厂', digitized: true },
  { id: 'kd', name: 'KD工厂', digitized: false },
  { id: 'hefei', name: '合肥基地', digitized: false },
]

export function getPlantByName(name: string): AuditPlantOption | undefined {
  return AUDIT_PLANT_OPTIONS.find((p) => p.name === name)
}

export function isPlantDigitized(plantName: string): boolean {
  if (!plantName) return false
  return getPlantByName(plantName)?.digitized ?? false
}
