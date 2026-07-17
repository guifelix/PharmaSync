import MedicationProduct from '#models/medication_product'
import { demoMedicationProducts } from '#services/medication_product_reference'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await MedicationProduct.updateOrCreateMany('normalizedNdc', demoMedicationProducts)
  }
}
