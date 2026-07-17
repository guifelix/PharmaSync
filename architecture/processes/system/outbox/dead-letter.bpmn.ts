import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Dead Letter Process
 *
 * Handles messages that have exhausted all retries
 */

const defs = Bpmn.createProcess("dead-letter")
  .name("Dead Letter Handler")
  .executable(true)

  .startEvent("dead-letter-received", { name: "Dead Letter Received" })

  // Store in dead letter queue
  .serviceTask("store-dead-letter", {
    name: "Store in Dead Letter Queue",
    taskType: "dead-letter-store",
    retries: "3",
  })

  // Alert operations team
  .serviceTask("alert-operations", {
    name: "Alert Operations Team",
    taskType: "alert-sender",
    retries: "3",
  })

  // Log for audit
  .serviceTask("log-audit", {
    name: "Log for Audit",
    taskType: "audit-logger",
    retries: "3",
  })

  .endEvent("dead-letter-handled", { name: "Dead Letter Handled" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
