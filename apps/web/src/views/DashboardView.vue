<template>
  <section>
    <header class="page-header">
      <div>
        <h2>Network Overview</h2>
        <p>
          Current pilot status across inventory, integrations, signals, and
          evidence.
        </p>
      </div>
    </header>

    <div class="metric-grid">
      <article class="metric">
        <span>Stock positions</span>
        <strong>1,284</strong>
      </article>
      <article class="metric">
        <span>Expiration risks</span>
        <strong>37</strong>
      </article>
      <article class="metric">
        <span>Quarantined feeds</span>
        <strong>4</strong>
      </article>
      <article class="metric">
        <span>Audit events</span>
        <strong>9,812</strong>
      </article>
    </div>

    <div class="panel table-panel">
      <table class="data-table">
        <caption>
          Traceable surfaces in the current pilot snapshot
        </caption>
        <thead>
          <tr>
            <th scope="col">Surface</th>
            <th scope="col">Trace ID</th>
            <th scope="col">Context</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Inventory</td>
            <td>
              <span class="trace-id">trace-stock-alpha-main-amoxicillin</span>
            </td>
            <td>Latest stock update</td>
          </tr>
          <tr>
            <td>Signals</td>
            <td><span class="trace-id">trace-signal-alpha-main</span></td>
            <td>Expiration watch</td>
          </tr>
          <tr>
            <td>Quarantine</td>
            <td><span class="trace-id">trace-quarantine-alpha-main</span></td>
            <td>Remediation queue</td>
          </tr>
          <tr>
            <td>Audit</td>
            <td><span class="trace-id">trace-audit-alpha-org</span></td>
            <td>Evidence request</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
