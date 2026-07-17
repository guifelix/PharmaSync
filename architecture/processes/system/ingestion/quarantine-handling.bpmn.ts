import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Quarantine Handling Process
 *
 * Stores rejected payloads with error reasons, source metadata,
 * and trace IDs for remediation
 */

const defs = Bpmn.createProcess("quarantine-handling")
  .name("Quarantine Handling")
  .executable(true)

  .startEvent("quarantine-started", { name: "Quarantine Started" })

  // Store rejected payload
  .serviceTask("store-payload", {
    name: "Store Rejected Payload",
    taskType: "payload-store",
    retries: "3",
  })

  // Record error details
  .serviceTask("record-error", {
    name: "Record Error Details",
    taskType: "error-recorder",
    retries: "3",
  })

  // Store trace metadata
  .serviceTask("store-trace", {
    name: "Store Trace Metadata",
    taskType: "trace-store",
    retries: "3",
  })

  // Notify integration engineer
  .serviceTask("notify-engineer", {
    name: "Notify Integration Engineer",
    taskType: "notification-sender",
    retries: "3",
  })

  .endEvent("quarantine-complete", { name: "Quarantine Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
