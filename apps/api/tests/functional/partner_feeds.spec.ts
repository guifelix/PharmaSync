import { access } from 'node:fs/promises'

import { test } from '@japa/runner'
import {
  clearQuarantineRecords,
  loadQuarantineRecords,
} from '#services/quarantine_record_reference'

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
    acceptedCount: number
    quarantinedCount: number
    issues: Array<{
      code: string
      category: string
      fieldPath: string
      message: string
      sourceEventId: string | null
      rowIndex: number
    }>
  }
}

type PartnerFeedRejectedBody = {
  data: {
    status: 'rejected'
    traceId: string
    partnerId: string
    feedId: string
    issues: Array<{
      code: string
      category: string
      fieldPath: string
      message: string
      sourceEventId: string | null
      rowIndex: number
    }>
  }
}

test.group('Partner feeds', () => {
  test('accepts JSON batches and archives the raw payload with a trace ID', async ({
    client,
    assert,
  }) => {
    await clearQuarantineRecords()

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
      acceptedCount: 1,
      quarantinedCount: 0,
    })
    assert.deepEqual(body.data.issues, [])
    await access(body.data.archivePath)
  })

  test('accepts CSV feeds and archives the raw payload with a trace ID', async ({
    client,
    assert,
  }) => {
    await clearQuarantineRecords()

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
      acceptedCount: 1,
      quarantinedCount: 0,
    })
    assert.deepEqual(body.data.issues, [])
    await access(body.data.archivePath)
  })

  test('rejects malformed batches with structured validation issues and quarantines them', async ({
    client,
    assert,
  }) => {
    await clearQuarantineRecords()

    const response = await client
      .post('/v1/integration/feeds')
      .header('x-request-id', 'trace-feed-invalid-001')
      .json({
        format: 'json',
        partner_id: 'partner_delta',
        feed_id: 'feed_delta_001',
        submitted_at: 'not-a-date',
        movements: [
          {
            source_event_id: '',
            event_type: 'unknown',
            site_code: 'site_missing',
            ndc: '9999999999',
            lot_number: '',
            expiration_date: 'not-a-date',
            quantity_delta: 0,
            occurred_at: 'bad-timestamp',
          },
        ],
      })

    response.assertStatus(422)
    const body = response.body() as unknown as PartnerFeedRejectedBody
    assert.equal(body.data.status, 'rejected')
    assert.equal(body.data.traceId, 'trace-feed-invalid-001')
    assert.equal(body.data.partnerId, 'partner_delta')
    assert.equal(body.data.feedId, 'feed_delta_001')
    assert.isTrue(body.data.issues.some((issue) => issue.code === 'INVALID_DATE'))
    assert.isTrue(body.data.issues.some((issue) => issue.code === 'INVALID_EVENT_TYPE'))

    const quarantined = await loadQuarantineRecords()
    assert.isAtLeast(quarantined.length, 1)
    assert.equal(quarantined[0]?.partnerId, 'partner_delta')
    assert.equal(quarantined[0]?.traceId, 'trace-feed-invalid-001')
    await clearQuarantineRecords()
  })

  test('accepts mixed batches while quarantining rejected rows', async ({ client, assert }) => {
    await clearQuarantineRecords()

    const response = await client
      .post('/v1/integration/feeds')
      .header('x-request-id', 'trace-feed-mixed-001')
      .json({
        format: 'json',
        partner_id: 'partner_alpha',
        feed_id: 'feed_alpha_mixed_001',
        submitted_at: '2026-07-17T12:02:00.000Z',
        movements: [
          {
            source_event_id: 'event-003',
            event_type: 'receipt',
            site_code: 'site_main',
            ndc: '0378615501',
            lot_number: 'AMX-2026-08-A',
            expiration_date: '2026-08-15',
            quantity_delta: 10,
            occurred_at: '2026-07-17T12:02:00.000Z',
          },
          {
            source_event_id: 'event-004',
            event_type: 'receipt',
            site_code: 'site_main',
            ndc: '0378615501',
            lot_number: 'AMX-2026-08-A',
            expiration_date: '2026-08-15',
            quantity_delta: 0,
            occurred_at: '2026-07-17T12:02:01.000Z',
          },
        ],
      })

    response.assertStatus(202)
    const body = response.body() as unknown as PartnerFeedAcceptedBody
    assert.equal(body.data.status, 'accepted')
    assert.equal(body.data.acceptedCount, 1)
    assert.equal(body.data.quarantinedCount, 1)
    assert.isTrue(body.data.issues.some((issue) => issue.code === 'INVALID_QUANTITY'))

    const quarantined = await loadQuarantineRecords()
    assert.isAtLeast(quarantined.length, 1)
    assert.equal(quarantined[0]?.traceId, 'trace-feed-mixed-001')
    await clearQuarantineRecords()
  })
})
