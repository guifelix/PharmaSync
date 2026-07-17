import { expirationStatus, requireLotTracking } from '#services/medication_lot_reference'
import { signLocalWorkforceToken } from '#services/workforce_auth_service'
import { test } from '@japa/runner'

const expiresAt = Math.floor(Date.now() / 1000) + 300

test.group('Medication lots', () => {
  test('requires lot number and expiration date for lot-tracked records', async ({ assert }) => {
    assert.isTrue(requireLotTracking({ lotNumber: 'AMX-2026-08-A', expirationDate: '2026-08-15' }))
    assert.isFalse(requireLotTracking({ lotNumber: 'AMX-2026-08-A', expirationDate: null }))
    assert.isFalse(requireLotTracking({ lotNumber: ' ', expirationDate: '2026-08-15' }))
  })

  test('classifies expired, near-expiry, and ok lots', async ({ assert }) => {
    const observedAt = new Date('2026-07-17T12:00:00.000Z')

    assert.equal(expirationStatus('2026-07-16', observedAt), 'expired')
    assert.equal(expirationStatus('2026-08-15', observedAt), 'near-expiry')
    assert.equal(expirationStatus('2027-01-31', observedAt), 'ok')
  })

  test('includes lot and expiration status in inventory responses', async ({ client, assert }) => {
    const response = await client.get('/api/v1/inventory/stock').bearerToken(
      signLocalWorkforceToken({
        iss: 'https://auth.local.pharmasync.test',
        sub: 'usr_lot_visibility',
        aud: 'pharmasync-api',
        exp: expiresAt,
        org_id: 'org_alpha',
        site_ids: ['site_main', 'site_overflow'],
        roles: ['operations'],
      })
    )

    response.assertStatus(200)
    assert.deepEqual(
      response
        .body()
        .data.map(
          (stockPosition: {
            lotNumber: string
            expirationDate: string
            expirationStatus: string
          }) => ({
            lotNumber: stockPosition.lotNumber,
            expirationDate: stockPosition.expirationDate,
            expirationStatus: stockPosition.expirationStatus,
          })
        ),
      [
        {
          lotNumber: 'AMX-2026-08-A',
          expirationDate: '2026-08-15',
          expirationStatus: 'near-expiry',
        },
        {
          lotNumber: 'ATO-2027-01-B',
          expirationDate: '2027-01-31',
          expirationStatus: 'ok',
        },
      ]
    )
  })
})
