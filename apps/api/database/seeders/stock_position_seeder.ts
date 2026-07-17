import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

import MedicationLot from '#models/medication_lot'
import MedicationProduct from '#models/medication_product'
import Organization from '#models/organization'
import Site from '#models/site'
import StockPosition from '#models/stock_position'
import { demoStockPositions } from '#services/stock_position_reference'

export default class extends BaseSeeder {
  async run() {
    const [organizations, sites, products, lots] = await Promise.all([
      Organization.query().select(['id', 'organizationKey']),
      Site.query().select(['id', 'organizationId', 'siteKey']),
      MedicationProduct.query().select(['id', 'normalizedNdc']),
      MedicationLot.query().select(['id', 'medicationProductId', 'lotNumber']),
    ])

    const organizationIdsByKey = new Map(
      organizations.map((organization) => [organization.organizationKey, organization.id])
    )
    const siteIdsByOrganizationAndKey = new Map(
      sites.map((site) => [`${site.organizationId}:${site.siteKey}`, site.id])
    )
    const productIdsByNdc = new Map(products.map((product) => [product.normalizedNdc, product.id]))
    const lotIdsByProductAndNumber = new Map(
      lots.map((lot) => [`${lot.medicationProductId}:${lot.lotNumber}`, lot.id])
    )

    await StockPosition.updateOrCreateMany(
      ['organizationId', 'siteId', 'medicationProductId', 'medicationLotId'],
      demoStockPositions.map((stockPosition) => {
        const organizationId = organizationIdsByKey.get(stockPosition.organizationId)!
        const siteId = siteIdsByOrganizationAndKey.get(
          `${stockPosition.organizationId}:${stockPosition.siteId}`
        )!
        const medicationProductId = productIdsByNdc.get(stockPosition.medicationProductNdc)!
        const medicationLotId = lotIdsByProductAndNumber.get(
          `${medicationProductId}:${stockPosition.lotNumber}`
        )!

        return {
          organizationId,
          siteId,
          medicationProductId,
          medicationLotId,
          quantityOnHand: stockPosition.quantityOnHand,
          quantityReserved: stockPosition.quantityReserved,
          lowStockThreshold: stockPosition.lowStockThreshold,
          transferCorrelationId: stockPosition.transferCorrelationId,
          lastCountedAt: DateTime.fromISO(stockPosition.updatedAt),
        }
      })
    )
  }
}
