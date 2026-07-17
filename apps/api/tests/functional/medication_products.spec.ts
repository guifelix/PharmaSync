import {
  deduplicateMedicationProducts,
  medicationProduct,
  normalizeNdc,
  searchMedicationProducts,
} from '#services/medication_product_reference'
import { test } from '@japa/runner'

test.group('Medication products', () => {
  test('normalizes NDC values for lookup', async ({ assert }) => {
    assert.equal(normalizeNdc('0002-8215-01'), '0002821501')
    assert.equal(normalizeNdc('60505-2671-3'), '6050526713')
  })

  test('deduplicates products by normalized NDC', async ({ assert }) => {
    const first = medicationProduct({
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
    })
    const duplicate = medicationProduct({
      ...first,
      ndc: '0002821501',
      proprietaryName: 'Duplicate Humalog',
    })

    assert.deepEqual(deduplicateMedicationProducts([first, duplicate]), [first])
  })

  test('searches by NDC and product name fields', async ({ assert }) => {
    const products = [
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
    ]

    assert.deepEqual(
      searchMedicationProducts(products, '0378').map((product) => product.proprietaryName),
      ['Amoxicillin']
    )
    assert.deepEqual(
      searchMedicationProducts(products, 'atorvastatin').map((product) => product.proprietaryName),
      ['Atorvastatin Calcium']
    )
  })
})
