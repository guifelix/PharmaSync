import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Quarantine Review Process
 *
 * Human-in-the-loop review of quarantined payloads
 */

const defs = Bpmn.createProcess("quarantine-review")
  .name("Quarantine Review")
  .executable(true)

  .startEvent("review-requested", { name: "Review Requested" })

  // Assign to integration engineer
  .userTask("assign-engineer", {
    name: "Assign Integration Engineer",
    formId: "quarantine-review-form",
    zeebeUserTask: true,
  })

  // Engineer reviews payload
  .userTask("review-payload", {
    name: "Review Quarantined Payload",
    formId: "payload-review-form",
    zeebeUserTask: true,
  })

  // Gateway: Remediate or reject?
  .exclusiveGateway("remediation-decision", { name: "Remediate or Reject?" })
  .branch("remediate", (b) =>
    b
      .condition("= remediate")
      .userTask("remediate-payload", {
        name: "Remediate Payload",
        formId: "remediation-form",
        zeebeUserTask: true,
      })
      .serviceTask("reprocess-payload", {
        name: "Reprocess Payload",
        taskType: "payload-reprocessor",
        retries: "3",
      })
      .endEvent("reprocessed", { name: "Reprocessed" }),
  )
  .branch("reject", (b) =>
    b
      .condition("= reject")
      .serviceTask("mark-rejected", {
        name: "Mark as Rejected",
        taskType: "rejection-marker",
        retries: "3",
      })
      .endEvent("rejected", { name: "Rejected" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
