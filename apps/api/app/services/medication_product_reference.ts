export type MedicationProductReference = {
  ndc: string
  normalizedNdc: string
  proprietaryName: string
  nonproprietaryName: string
  dosageForm: string
  route: string
  labelerName: string
  productType: string
  marketingCategory: string
  activeIngredient: string
  strength: string
  source: string
}

export const demoMedicationProducts = deduplicateMedicationProducts([
  medicationProduct({
    ndc: '0002-8215-01',
    proprietaryName: 'Humalog',
    nonproprietaryName: 'Insulin Lispro',
    dosageForm: 'Injection',
    route: 'Subcutaneous',
    labelerName: 'Eli Lilly and Company',
    productType: 'Human Prescription Drug',
    marketingCategory: 'BLA',
    activeIngredient: 'Insulin Lispro',
    strength: '100 [iU]/mL',
  }),
  medicationProduct({
    ndc: '0378-6155-01',
    proprietaryName: 'Amoxicillin',
    nonproprietaryName: 'Amoxicillin',
    dosageForm: 'Capsule',
    route: 'Oral',
    labelerName: 'Mylan Pharmaceuticals Inc.',
    productType: 'Human Prescription Drug',
    marketingCategory: 'ANDA',
    activeIngredient: 'Amoxicillin',
    strength: '500 mg',
  }),
  medicationProduct({
    ndc: '60505-2671-3',
    proprietaryName: 'Atorvastatin Calcium',
    nonproprietaryName: 'Atorvastatin Calcium',
    dosageForm: 'Tablet',
    route: 'Oral',
    labelerName: 'Apotex Corp.',
    productType: 'Human Prescription Drug',
    marketingCategory: 'ANDA',
    activeIngredient: 'Atorvastatin Calcium',
    strength: '20 mg',
  }),
])

export function medicationProduct(
  input: Omit<MedicationProductReference, 'normalizedNdc' | 'source'> & { source?: string }
): MedicationProductReference {
  return {
    ...input,
    normalizedNdc: normalizeNdc(input.ndc),
    source: input.source ?? 'demo-public-reference',
  }
}

export function normalizeNdc(ndc: string) {
  return ndc.replaceAll(/\D/g, '')
}

export function deduplicateMedicationProducts(products: readonly MedicationProductReference[]) {
  const byNdc = new Map<string, MedicationProductReference>()

  for (const product of products) {
    if (!byNdc.has(product.normalizedNdc)) {
      byNdc.set(product.normalizedNdc, product)
    }
  }

  return [...byNdc.values()]
}

export function searchMedicationProducts(
  products: readonly MedicationProductReference[],
  query: string | undefined
) {
  const searchTerm = query?.trim().toLowerCase()
  if (!searchTerm) {
    return [...products]
  }

  const normalizedQuery = normalizeNdc(searchTerm)

  return products.filter((product) => {
    if (normalizedQuery && product.normalizedNdc.includes(normalizedQuery)) {
      return true
    }

    return [
      product.proprietaryName,
      product.nonproprietaryName,
      product.activeIngredient,
      product.labelerName,
    ].some((value) => value.toLowerCase().includes(searchTerm))
  })
}
