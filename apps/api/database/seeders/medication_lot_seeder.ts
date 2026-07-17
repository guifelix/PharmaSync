import MedicationLot from '#models/medication_lot'
import MedicationProduct from '#models/medication_product'
import { demoMedicationLots } from '#services/medication_lot_reference'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    const products = await MedicationProduct.query().select(['id', 'normalizedNdc'])
    const productIdsByNdc = new Map(products.map((product) => [product.normalizedNdc, product.id]))

    await MedicationLot.updateOrCreateMany(
      ['medicationProductId', 'lotNumber'],
      demoMedicationLots.map((lot) => ({
        medicationProductId: productIdsByNdc.get(lot.medicationProductNdc)!,
        lotNumber: lot.lotNumber,
        expirationDate: DateTime.fromISO(lot.expirationDate),
        source: lot.source,
      }))
    )
  }
}
