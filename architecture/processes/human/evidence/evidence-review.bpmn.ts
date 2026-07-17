import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Evidence Review Process
 *
 * Human review of compliance evidence packages
 */

const defs = Bpmn.createProcess("evidence-review")
  .name("Evidence Review")
  .executable(true)

  .startEvent("review-started", { name: "Review Started" })

  // Load evidence package
  .serviceTask("load-evidence", {
    name: "Load Evidence Package",
    taskType: "evidence-loader",
    retries: "3",
  })

  // Compliance officer reviews
  .userTask("review-evidence", {
    name: "Review Evidence Package",
    formId: "evidence-review-form",
    zeebeUserTask: true,
  })

  // Gateway: Approve or request changes?
  .exclusiveGateway("review-decision", { name: "Approve or Request Changes?" })
  .branch("approve", (b) =>
    b
      .condition("= approve")
      .serviceTask("mark-approved", {
        name: "Mark as Approved",
        taskType: "approval-marker",
        retries: "3",
      })
      .endEvent("approved", { name: "Approved" }),
  )
  .branch("changes", (b) =>
    b
      .condition("= changes")
      .userTask("request-changes", {
        name: "Request Changes",
        formId: "change-request-form",
        zeebeUserTask: true,
      })
      .endEvent("changes-requested", { name: "Changes Requested" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
