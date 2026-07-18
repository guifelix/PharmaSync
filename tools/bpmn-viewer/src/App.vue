<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { ModelEntry } from "./types";
import ModelCanvas from "./ModelCanvas.vue";
import DmnCanvas from "./DmnCanvas.vue";

const models = ref<ModelEntry[]>([]);
const search = ref("");
const selectedId = ref<string | null>(null);
const theme = ref<"light" | "dark">("light");

onMounted(async () => {
  const res = await fetch("/models.json");
  const data = await res.json();
  models.value = data.models;
});

const grouped = computed(() => {
  const map = new Map<string, Map<string | "…", ModelEntry[]>>();
  const query = search.value.toLowerCase();

  const filtered = models.value.filter(
    (m) =>
      m.name.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      (m.subdomain ?? "").toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query),
  );

  for (const m of filtered) {
    const cat = m.category;
    const sub = m.subdomain ?? "…";
    if (!map.has(cat)) map.set(cat, new Map());
    const subs = map.get(cat)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push(m);
  }
  return map;
});

const categories = computed(() => [...grouped.value.entries()]);

const selectedModel = computed(() =>
  models.value.find((m) => m.id === selectedId.value),
);

function select(id: string) {
  selectedId.value = id;
}

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div class="app" :class="theme">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>Model Viewer</h1>
        <span class="badge">{{ models.length }} models</span>
        <button
          class="theme-btn"
          @click="toggleTheme"
          :title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
        >
          {{ theme === "dark" ? "☀️" : "🌙" }}
        </button>
      </div>

      <div class="search-box">
        <input
          v-model="search"
          type="search"
          placeholder="Search models…"
          autofocus
        />
      </div>

      <nav class="tree">
        <details v-for="[cat, subs] in categories" :key="cat" :open="true">
          <summary class="cat-label">
            {{ cat }}
            <span class="count">{{ [...subs.values()].flat().length }}</span>
          </summary>

          <div v-for="[sub, items] in subs" :key="sub">
            <div v-if="sub !== '…'" class="sub-label">{{ sub }}</div>
            <button
              v-for="m in items"
              :key="m.id"
              class="model-btn"
              :class="{ active: selectedId === m.id }"
              @click="select(m.id)"
            >
              <span v-if="m.category === 'dmn'" class="type-badge dmn"
                >DMN</span
              >
              <span v-else class="type-badge bpmn">BPMN</span>
              {{ m.name }}
            </button>
          </div>
        </details>
      </nav>
    </aside>

    <main class="canvas-area">
      <ModelCanvas
        v-if="selectedModel && selectedModel.category !== 'dmn'"
        :key="selectedModel.id"
        :model-id="selectedModel.id"
        :theme="theme"
      />
      <DmnCanvas
        v-else-if="selectedModel && selectedModel.category === 'dmn'"
        :key="selectedModel.id"
        :model-id="selectedModel.id"
        :theme="theme"
      />
      <div v-else class="placeholder">
        <p>Select a model from the sidebar</p>
      </div>
    </main>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/**
:root {
  --bg: #0f1117;
  --surface: #1a1d27;
  --border: #2a2d3a;
  --text: #e1e4ed;
  --text-dim: #8b8fa3;
  --accent: #6244d7;
  --accent-hover: #7558e8;
  --active-bg: #2a204a;
}

.app.light {
  --bg: #f5f6fa;
  --surface: #ffffff;
  --border: #dde0e8;
  --text: #1a1d27;
  --text-dim: #6b7084;
  --accent: #6244d7;
  --accent-hover: #7558e8;
  --active-bg: #eeeaff;
}
 */
:root {
  --bg: #f5f6fa;
  --surface: #ffffff;
  --border: #dde0e8;
  --text: #1a1d27;
  --text-dim: #6b7084;
  --accent: #6244d7;
  --accent-hover: #7558e8;
  --active-bg: #eeeaff;
}

html,
body {
  height: 100%;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
}

#app {
  height: 100%;
}

.app {
  display: flex;
  height: 100%;
}

/* Sidebar */
.sidebar {
  width: 280px;
  min-width: 280px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.sidebar-header h1 {
  font-size: 15px;
  font-weight: 600;
  flex: 1;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-weight: 500;
}

.theme-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.search-box {
  padding: 12px 16px;
}

.search-box input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  outline: none;
}

.search-box input:focus {
  border-color: var(--accent);
}

/* Tree */
.tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.tree details {
  padding: 0 8px;
}

.cat-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 8px 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-dim);
}

.cat-label .count {
  font-size: 10px;
  background: var(--border);
  padding: 0 6px;
  border-radius: 8px;
  color: var(--text-dim);
}

.sub-label {
  font-size: 11px;
  font-weight: 500;
  padding: 6px 8px 2px 16px;
  color: var(--text-dim);
}

.model-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 6px 8px 6px 20px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.model-btn:hover {
  background: var(--border);
}

.model-btn.active {
  background: var(--active-bg);
  color: var(--accent);
  font-weight: 500;
}

.type-badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  margin-right: 6px;
  vertical-align: middle;
  letter-spacing: 0.3px;
}

.type-badge.bpmn {
  background: #2d6a4f;
  color: #d8f3dc;
}

.type-badge.dmn {
  background: #7b2d8b;
  color: #f0d9fa;
}

.app.light .type-badge.bpmn {
  background: #d8f3dc;
  color: #1b4332;
}

.app.light .type-badge.dmn {
  background: #f0d9fa;
  color: #4a0e4f;
}

/* Canvas area */
.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: var(--text-dim);
}
</style>
