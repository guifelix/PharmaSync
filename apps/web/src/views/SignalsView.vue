<script setup lang="ts">
const signalRows = [
  {
    id: "signal_alpha_main",
    traceId: "trace-signal-alpha-main",
    type: "expiration",
    severity: "medium",
    site: "site_main",
  },
  {
    id: "signal_alpha_overflow",
    traceId: "trace-signal-alpha-overflow",
    type: "overstock",
    severity: "low",
    site: "site_overflow",
  },
];
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h2>Signals</h2>
        <p>
          Shortage, overstock, and expiration-risk recommendations with trace
          IDs.
        </p>
      </div>
    </header>
    <div class="panel table-panel">
      <table class="data-table">
        <caption>
          Traceable signal queue
        </caption>
        <thead>
          <tr>
            <th scope="col">Signal</th>
            <th scope="col">Trace ID</th>
            <th scope="col">Type</th>
            <th scope="col">Severity</th>
            <th scope="col">Site</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in signalRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <span class="trace-id">{{ row.traceId }}</span>
            </td>
            <td>{{ row.type }}</td>
            <td>
              <span class="status-chip" :data-tone="row.severity">{{
                row.severity
              }}</span>
            </td>
            <td>{{ row.site }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
