<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { BpmnCanvas } from "@bpmnkit/canvas";
import type { CanvasApi } from "@bpmnkit/canvas";

const props = defineProps<{
  modelId: string;
  theme: "light" | "dark";
}>();

const container = ref<HTMLDivElement>();
let canvas: CanvasApi | null = null;

async function loadModel() {
  if (!container.value) return;
  if (canvas) {
    canvas.destroy();
    canvas = null;
  }
  container.value.innerHTML = "";

  try {
    const res = await fetch(`/models/${props.modelId}.xml`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    canvas = new BpmnCanvas({
      container: container.value,
      xml,
      theme: props.theme === "dark" ? "dark" : "light",
      grid: true,
      fit: "contain",
    });
  } catch (e: any) {
    container.value.textContent = `Failed to load model: ${e.message}`;
    container.value.style.padding = "24px";
    container.value.style.color = "#e74c3c";
  }
}

watch(() => props.modelId, loadModel);
watch(
  () => props.theme,
  (t) => canvas?.setTheme(t === "dark" ? "dark" : "light"),
);

onMounted(loadModel);
onUnmounted(() => canvas?.destroy());
</script>

<template>
  <div ref="container" class="canvas-container"></div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
}
</style>
