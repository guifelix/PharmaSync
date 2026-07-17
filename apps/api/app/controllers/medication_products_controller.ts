import MedicationProduct from '#models/medication_product'
import { normalizeNdc } from '#services/medication_product_reference'
import type { HttpContext } from '@adonisjs/core/http'

export default class MedicationProductsController {
  async index({ request, workforceAuth }: HttpContext) {
    const query = request.input('q')?.toString().trim()
    const normalizedNdc = query ? normalizeNdc(query) : ''
    const products = MedicationProduct.query().orderBy('proprietaryName', 'asc').limit(25)

    if (query) {
      products.where((builder) => {
        if (normalizedNdc) {
          builder.whereILike('normalized_ndc', `%${normalizedNdc}%`)
        }

        builder
          .orWhereILike('proprietary_name', `%${query}%`)
          .orWhereILike('nonproprietary_name', `%${query}%`)
          .orWhereILike('active_ingredient', `%${query}%`)
          .orWhereILike('labeler_name', `%${query}%`)
      })
    }

    return {
      data: await products,
      meta: {
        query: query ?? null,
        organizationId: workforceAuth.organizationId,
        traceId: workforceAuth.traceId,
      },
    }
  }
}
