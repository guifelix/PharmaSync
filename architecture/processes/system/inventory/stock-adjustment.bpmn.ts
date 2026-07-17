import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Stock Adjustment Process
 *
 * Handles stock adjustments with validation, application, and audit trail
 */

const defs = Bpmn.createProcess("stock-adjustment")
  .name("Stock Adjustment")
  .executable(true)

  .startEvent("adjustment-started", { name: "Adjustment Started" })

  // Validate adjustment data
  .serviceTask("validate-adjustment", {
    name: "Validate Adjustment Data",
    taskType: "adjustment-validator",
    retries: "3",
  })

  // Apply adjustment
  .serviceTask("apply-adjustment", {
    name: "Apply Adjustment",
    taskType: "adjustment-applier",
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

  // Gateway: Adjustment successful?
  .exclusiveGateway("adjustment-check", { name: "Adjustment Successful?" })
  .branch("yes", (b) =>
    b
      .condition("= adjustmentSuccess == true")
      .endEvent("adjustment-complete", { name: "Adjustment Complete" }),
  )
  .branch("no", (b) =>
    b
      .condition("= adjustmentSuccess == false")
      .serviceTask("reject-adjustment", {
        name: "Reject Adjustment",
        taskType: "adjustment-rejecter",
        retries: "3",
      })
      .endEvent("rejected", { name: "Rejected" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
