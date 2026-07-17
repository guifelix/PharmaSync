<script setup lang="ts">
const stockRows = [
  {
    id: "stock_alpha_main_amoxicillin",
    site: "Alpha Main Warehouse",
    lot: "AMX-2026-08-A",
    traceId: "trace-stock-alpha-main-amoxicillin",
    availability: "100 available",
    freshness: "stale 120 min",
  },
  {
    id: "stock_alpha_overflow_atorvastatin",
    site: "Alpha Overflow Pharmacy",
    lot: "ATO-2027-01-B",
    traceId: "trace-stock-alpha-overflow-atorvastatin",
    availability: "14 available",
    freshness: "fresh",
  },
];
</script>

<template>
  <section>
    <header class="page-header">
      <div>
        <h2>Inventory</h2>
        <p>
          Medication stock by product, lot, expiration, site, and trace context.
        </p>
      </div>
    </header>
    <div class="panel table-panel">
      <table class="data-table">
        <caption>
          Stock positions with trace IDs
        </caption>
        <thead>
          <tr>
            <th scope="col">Stock</th>
            <th scope="col">Site</th>
            <th scope="col">Lot</th>
            <th scope="col">Trace ID</th>
            <th scope="col">Availability</th>
            <th scope="col">Freshness</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in stockRows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.site }}</td>
            <td>{{ row.lot }}</td>
            <td>
              <span class="trace-id">{{ row.traceId }}</span>
            </td>
            <td>{{ row.availability }}</td>
            <td>{{ row.freshness }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
