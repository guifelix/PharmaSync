import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Audit Package Approval Process
 *
 * Final approval of audit packages for external review
 */

const defs = Bpmn.createProcess("audit-package-approval")
  .name("Audit Package Approval")
  .executable(true)

  .startEvent("approval-requested", { name: "Approval Requested" })

  // Load audit package
  .serviceTask("load-package", {
    name: "Load Audit Package",
    taskType: "audit-package-loader",
    retries: "3",
  })

  // Compliance officer reviews
  .userTask("review-package", {
    name: "Review Audit Package",
    formId: "audit-package-review-form",
    zeebeUserTask: true,
  })

  // Gateway: Approve or return?
  .exclusiveGateway("approval-decision", { name: "Approve or Return?" })
  .branch("approve", (b) =>
    b
      .condition("= approve")
      .serviceTask("finalize-package", {
        name: "Finalize Audit Package",
        taskType: "package-finalizer",
        retries: "3",
      })
      .serviceTask("distribute-package", {
        name: "Distribute to Auditors",
        taskType: "package-distributor",
        retries: "3",
      })
      .endEvent("approved", { name: "Approved & Distributed" }),
  )
  .branch("return", (b) =>
    b
      .condition("= return")
      .userTask("request-revisions", {
        name: "Request Revisions",
        formId: "revision-request-form",
        zeebeUserTask: true,
      })
      .endEvent("returned", { name: "Returned for Revisions" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
