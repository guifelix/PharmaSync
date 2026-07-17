import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Reprocess Decision Process
 *
 * Decision to reprocess or permanently reject a quarantined payload
 */

const defs = Bpmn.createProcess("reprocess-decision")
  .name("Reprocess Decision")
  .executable(true)

  .startEvent("decision-started", { name: "Decision Started" })

  // Present decision options
  .userTask("decide-action", {
    name: "Decide: Reprocess or Reject",
    formId: "reprocess-decision-form",
    zeebeUserTask: true,
  })

  // Gateway: Decision
  .exclusiveGateway("decision", { name: "Reprocess or Reject?" })
  .branch("reprocess", (b) =>
    b
      .condition("= reprocess")
      .serviceTask("trigger-reprocess", {
        name: "Trigger Reprocess",
        taskType: "reprocess-trigger",
        retries: "3",
      })
      .endEvent("reprocess-triggered", { name: "Reprocess Triggered" }),
  )
  .branch("reject", (b) =>
    b
      .condition("= reject")
      .serviceTask("finalize-rejection", {
        name: "Finalize Rejection",
        taskType: "rejection-finalizer",
        retries: "3",
      })
      .endEvent("rejected", { name: "Permanently Rejected" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
