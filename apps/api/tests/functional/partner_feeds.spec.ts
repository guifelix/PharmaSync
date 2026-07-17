import { access } from 'node:fs/promises'

import { test } from '@japa/runner'

type PartnerFeedAcceptedBody = {
  data: {
    status: 'accepted'
    traceId: string
    partnerId: string
    feedId: string
    payloadHash: string
    archivePath: string
    receivedAt: string
    format: 'csv' | 'json'
  }
}

test.group('Partner feeds', () => {
  test('accepts JSON batches and archives the raw payload with a trace ID', async ({ client, assert }) => {
    const response = await client
      .post('/v1/integration/feeds')
      .header('x-request-id', 'trace-feed-json-001')
      .json({
        format: 'json',
        partner_id: 'partner_alpha',
        feed_id: 'feed_alpha_001',
        submitted_at: '2026-07-17T12:00:00.000Z',
        movements: [
          {
            source_event_id: 'event-001',
            event_type: 'receipt',
            site_code: 'site_main',
            ndc: '0378615501',
            lot_number: 'AMX-2026-08-A',
            expiration_date: '2026-08-15',
            quantity_delta: 25,
            occurred_at: '2026-07-17T12:00:00.000Z',
          },
        ],
      })

    response.assertStatus(202)
    const body = response.body() as unknown as PartnerFeedAcceptedBody
    assert.deepInclude(body.data, {
      status: 'accepted',
      traceId: 'trace-feed-json-001',
      partnerId: 'partner_alpha',
      feedId: 'feed_alpha_001',
      format: 'json',
    })
    await access(body.data.archivePath)
  })

  test('accepts CSV feeds and archives the raw payload with a trace ID', async ({
    client,
    assert,
  }) => {
    const csv = [
      'partner_id,source_event_id,event_type,site_code,ndc,lot_number,expiration_date,quantity_delta,occurred_at,source_location,destination_location',
      'partner_alpha,event-002,receipt,site_overflow,6050526713,ATO-2027-01-B,2027-01-31,14,2026-07-17T12:00:00.000Z,warehouse-a,pharmacy-b',
    ].join('\n')

    const response = await client
      .post('/v1/integration/feeds')
      .header('x-request-id', 'trace-feed-csv-001')
      .field('format', 'csv')
      .field('partner_id', 'partner_alpha')
      .field('feed_id', 'feed_alpha_002')
      .field('submitted_at', '2026-07-17T12:01:00.000Z')
      .field('csv', csv)

    response.assertStatus(202)
    const body = response.body() as unknown as PartnerFeedAcceptedBody
    assert.deepInclude(body.data, {
      status: 'accepted',
      traceId: 'trace-feed-csv-001',
      partnerId: 'partner_alpha',
      feedId: 'feed_alpha_002',
      format: 'csv',
    })
    await access(body.data.archivePath)
  })
})
