<script setup lang="ts">
const queueRows = [
  {
    id: 'feed_alpha_asn_001',
    traceId: 'trace-feed-alpha-asn-001',
    status: 'accepted',
    detail: 'Published to outbox',
  },
  {
    id: 'feed_alpha_quarantine_002',
    traceId: 'trace-feed-alpha-quarantine-002',
    status: 'quarantined',
    detail: 'Missing lot number',
  },
]
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h2>Integration Health</h2>
        <p>Partner feed status, validation errors, idempotency outcomes, quarantine records, and trace IDs.</p>
      </div>
    </header>
    <div class="panel table-panel">
      <table class="data-table">
        <caption>
          Integration queue samples with trace IDs
        </caption>
        <thead>
          <tr>
            <th scope="col">Feed</th>
            <th scope="col">Trace ID</th>
            <th scope="col">Status</th>
            <th scope="col">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in queueRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td><span class="trace-id">{{ row.traceId }}</span></td>
            <td>
              <span class="status-chip" :data-tone="row.status">{{ row.status }}</span>
            </td>
            <td>{{ row.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
