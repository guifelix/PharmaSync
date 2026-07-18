<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import DmnNavigatedViewer from "dmn-js/lib/NavigatedViewer";

const props = defineProps<{
  modelId: string;
  theme: "light" | "dark";
}>();

const container = ref<HTMLDivElement>();
let viewer: DmnNavigatedViewer | null = null;

async function loadModel() {
  if (!container.value) return;
  if (viewer) {
    viewer.destroy();
    viewer = null;
  }
  container.value.innerHTML = "";

  try {
    const res = await fetch(`/models/${props.modelId}.xml`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    viewer = new DmnNavigatedViewer({
      container: container.value,
    });

    const { warnings } = await viewer.importXML(xml);
    if (warnings?.length) {
      console.warn("DMN import warnings:", warnings);
    }

    viewer.getActiveViewer()?.get("canvas")?.zoom("fit-viewport");
  } catch (e: any) {
    container.value.textContent = `Failed to load DMN model: ${e.message}`;
    container.value.style.padding = "24px";
    container.value.style.color = "#e74c3c";
  }
}

watch(() => props.modelId, loadModel);

onMounted(loadModel);
onUnmounted(() => viewer?.destroy());
</script>

<template>
  <div ref="container" class="canvas-container"></div>
</template>

<style>
@import "dmn-js/dist/assets/diagram-js.css";
@import "dmn-js/dist/assets/dmn-js-shared.css";
@import "dmn-js/dist/assets/dmn-js-drd.css";
@import "dmn-js/dist/assets/dmn-js-decision-table.css";
@import "dmn-js/dist/assets/dmn-js-literal-expression.css";
@import "dmn-js/dist/assets/dmn-font/css/dmn.css";
</style>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
}
.canvas-container :deep(.djs-container) {
  overflow: hidden;
}
</style>
