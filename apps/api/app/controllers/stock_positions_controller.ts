import {
  demoStockPositions,
  filterStockPositions,
  parseStockPositionQuery,
  stockPositionMeta,
  stockPositionFreshnessThresholdMinutes,
  toStockPositionView,
} from '#services/stock_position_reference'
import type { HttpContext } from '@adonisjs/core/http'

export default class StockPositionsController {
  async index({ request, workforceAuth }: HttpContext) {
    const filters = parseStockPositionQuery({
      siteId: request.input('siteId'),
      medicationProductId: request.input('medicationProductId'),
      expirationWindowDays: request.input('expirationWindowDays'),
      lowStock: request.input('lowStock'),
      staleOnly: request.input('staleOnly'),
    })
    const observedAt = new Date()

    return {
      data: filterStockPositions(demoStockPositions, workforceAuth, filters, observedAt).map(
        (stockPosition) => toStockPositionView(stockPosition, observedAt, stockPositionFreshnessThresholdMinutes)
      ),
      meta: stockPositionMeta({
        organizationId: workforceAuth.organizationId,
        permittedSiteIds: workforceAuth.permittedSiteIds,
        traceId: workforceAuth.traceId,
        filters,
      }),
    }
  }
}
