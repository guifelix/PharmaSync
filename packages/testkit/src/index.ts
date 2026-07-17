import type { MedicationProduct } from '@pharmasync/domain'

export function makeMedicationProduct(overrides: Partial<MedicationProduct> = {}): MedicationProduct {
  return {
    id: 'med_demo_001',
    ndc: '0000-0000-01',
    proprietaryName: 'Demo Medication',
    nonProprietaryName: 'demo ingredient',
    dosageForm: 'tablet',
    route: 'oral',
    labelerName: 'Demo Labeler',
    ...overrides,
  }
}
