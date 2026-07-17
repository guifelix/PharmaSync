import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Evidence Collection Process
 *
 * Automatically collects audit evidence from platform events
 */

const defs = Bpmn.createProcess("evidence-collection")
  .name("Evidence Collection")
  .executable(true)

  .startEvent("collection-started", { name: "Collection Started" })

  // Collect inventory events
  .serviceTask("collect-inventory-events", {
    name: "Collect Inventory Events",
    taskType: "inventory-event-collector",
    retries: "3",
  })

  // Collect integration events
  .serviceTask("collect-integration-events", {
    name: "Collect Integration Events",
    taskType: "integration-event-collector",
    retries: "3",
  })

  // Collect signal events
  .serviceTask("collect-signal-events", {
    name: "Collect Signal Events",
    taskType: "signal-event-collector",
    retries: "3",
  })

  // Collect correction events
  .serviceTask("collect-correction-events", {
    name: "Collect Correction Events",
    taskType: "correction-event-collector",
    retries: "3",
  })

  // Enrich with trace IDs
  .serviceTask("enrich-trace-ids", {
    name: "Enrich with Trace IDs",
    taskType: "trace-enricher",
    retries: "3",
  })

  .endEvent("collection-complete", { name: "Collection Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
