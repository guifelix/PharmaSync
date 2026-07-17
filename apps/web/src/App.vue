<script setup lang="ts">
const navItems = [
  { label: 'Overview', to: '/' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Signals', to: '/signals' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'Audit', to: '/audit' },
]
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <aside class="sidebar" aria-label="Primary navigation">
      <div>
        <p class="eyebrow">PharmaSync</p>
        <h1>Operations</h1>
      </div>
      <nav>
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to">
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <main id="main-content" class="content" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>
