import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const expiresAt = Math.floor(Date.now() / 1000) + 300

test.group('Stock positions', () => {
  test('returns permitted stock positions with site, product, lot, quantities, and update metadata', async ({
    client,
    assert,
  }) => {
    const response = await client.get('/api/v1/inventory/stock').bearerToken(tokenFor())

    response.assertStatus(200)
    assert.deepEqual(
      response.body().data.map(
        (stockPosition: {
          id: string
          siteId: string
          medicationProductId: string
          lotNumber: string
          traceId: string
          quantityOnHand: number
          quantityReserved: number
          availableQuantity: number
          updatedAt: string
        }) => ({
          id: stockPosition.id,
          siteId: stockPosition.siteId,
          medicationProductId: stockPosition.medicationProductId,
          lotNumber: stockPosition.lotNumber,
          traceId: stockPosition.traceId,
          quantityOnHand: stockPosition.quantityOnHand,
          quantityReserved: stockPosition.quantityReserved,
          availableQuantity: stockPosition.availableQuantity,
          updatedAt: stockPosition.updatedAt,
        }),
      ),
      [
        {
          id: 'stock_alpha_main_amoxicillin',
          siteId: 'site_main',
          medicationProductId: 'med_amoxicillin_500',
          lotNumber: 'AMX-2026-08-A',
          traceId: 'trace-stock-alpha-main-amoxicillin',
          quantityOnHand: 120,
          quantityReserved: 20,
          availableQuantity: 100,
          updatedAt: response.body().data[0].updatedAt,
        },
        {
          id: 'stock_alpha_overflow_atorvastatin',
          siteId: 'site_overflow',
          medicationProductId: 'med_atorvastatin_20',
          lotNumber: 'ATO-2027-01-B',
          traceId: 'trace-stock-alpha-overflow-atorvastatin',
          quantityOnHand: 18,
          quantityReserved: 4,
          availableQuantity: 14,
          updatedAt: response.body().data[1].updatedAt,
        },
      ]
    )
    assert.equal(response.body().meta.freshnessThresholdMinutes, 30)
  })

  test('supports site, product, expiration window, low-stock, and stale-data filters', async ({
    client,
    assert,
  }) => {
    const siteFiltered = await client
      .get('/api/v1/inventory/stock?siteId=site_main')
      .bearerToken(tokenFor())

    const productFiltered = await client
      .get('/api/v1/inventory/stock?medicationProductId=med_atorvastatin_20')
      .bearerToken(tokenFor())

    const expirationFiltered = await client
      .get('/api/v1/inventory/stock?expirationWindowDays=120')
      .bearerToken(tokenFor())

    const lowStockFiltered = await client
      .get('/api/v1/inventory/stock?lowStock=true')
      .bearerToken(tokenFor())

    const staleFiltered = await client
      .get('/api/v1/inventory/stock?staleOnly=true')
      .bearerToken(tokenFor())

    siteFiltered.assertStatus(200)
    productFiltered.assertStatus(200)
    expirationFiltered.assertStatus(200)
    lowStockFiltered.assertStatus(200)
    staleFiltered.assertStatus(200)

    assert.deepEqual(siteFiltered.body().data.map((item: { id: string }) => item.id), [
      'stock_alpha_main_amoxicillin',
    ])
    assert.deepEqual(productFiltered.body().data.map((item: { id: string }) => item.id), [
      'stock_alpha_overflow_atorvastatin',
    ])
    assert.deepEqual(expirationFiltered.body().data.map((item: { id: string }) => item.id), [
      'stock_alpha_main_amoxicillin',
    ])
    assert.deepEqual(lowStockFiltered.body().data.map((item: { id: string }) => item.id), [
      'stock_alpha_overflow_atorvastatin',
    ])
    assert.deepEqual(staleFiltered.body().data.map((item: { id: string }) => item.id), [
      'stock_alpha_main_amoxicillin',
    ])
  })

  test('keeps available quantity non-negative and exposes stale metadata only when applicable', async ({
    client,
    assert,
  }) => {
    const response = await client.get('/api/v1/inventory/stock').bearerToken(tokenFor())

    response.assertStatus(200)
    assert.isTrue(response.body().data.every((item: { availableQuantity: number }) => item.availableQuantity >= 0))
    assert.isTrue(Boolean(response.body().data[0].freshness))
    assert.isNull(response.body().data[1].freshness)
  })
})

function tokenFor() {
  return signLocalWorkforceToken({
    iss: 'https://auth.local.pharmasync.test',
    sub: 'usr_org_alpha_operations',
    aud: 'pharmasync-api',
    exp: expiresAt,
    org_id: 'org_alpha',
    site_ids: ['site_main', 'site_overflow'],
    roles: ['operations'],
  })
}
