<script setup lang="ts">
const auditRows = [
  {
    id: "audit_alpha_org",
    traceId: "trace-audit-alpha-org",
    action: "evidence_package_requested",
    scope: "organization",
  },
  {
    id: "audit_alpha_main",
    traceId: "trace-audit-alpha-main",
    action: "inventory_stock_viewed",
    scope: "site_main",
  },
  {
    id: "audit_alpha_overflow",
    traceId: "trace-audit-alpha-overflow",
    action: "quarantine_record_viewed",
    scope: "site_overflow",
  },
];
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h2>Audit Trail</h2>
        <p>
          Traceable inventory actions, imports, corrections, and evidence
          packages.
        </p>
      </div>
    </header>
    <div class="panel table-panel">
      <table class="data-table">
        <caption>
          Audit events with request trace IDs
        </caption>
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Trace ID</th>
            <th scope="col">Action</th>
            <th scope="col">Scope</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in auditRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>
              <span class="trace-id">{{ row.traceId }}</span>
            </td>
            <td>{{ row.action }}</td>
            <td>{{ row.scope }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
