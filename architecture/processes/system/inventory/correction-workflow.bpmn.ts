import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Correction Workflow Process
 *
 * Handles inventory corrections with actor, reason, before/after quantities
 */

const defs = Bpmn.createProcess("correction-workflow")
  .name("Correction Workflow")
  .executable(true)

  .startEvent("correction-started", { name: "Correction Started" })

  // Validate correction data
  .serviceTask("validate-correction", {
    name: "Validate Correction Data",
    taskType: "correction-validator",
    retries: "3",
  })

  // Apply correction
  .serviceTask("apply-correction", {
    name: "Apply Correction",
    taskType: "correction-applier",
    retries: "3",
  })

  // Record before/after quantities
  .serviceTask("record-quantities", {
    name: "Record Before/After Quantities",
    taskType: "quantity-recorder",
    retries: "3",
  })

  // Record actor and reason
  .serviceTask("record-actor-reason", {
    name: "Record Actor and Reason",
    taskType: "actor-reason-recorder",
    retries: "3",
  })

  // Emit audit event
  .serviceTask("emit-audit", {
    name: "Emit Audit Event",
    taskType: "audit-emitter",
    retries: "3",
  })

  .endEvent("correction-complete", { name: "Correction Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
