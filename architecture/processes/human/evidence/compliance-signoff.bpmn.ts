import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Compliance Signoff Process
 *
 * Formal compliance officer signoff on evidence packages
 */

const defs = Bpmn.createProcess("compliance-signoff")
  .name("Compliance Signoff")
  .executable(true)

  .startEvent("signoff-requested", { name: "Signoff Requested" })

  // Load evidence package
  .serviceTask("load-evidence", {
    name: "Load Evidence Package",
    taskType: "evidence-loader",
    retries: "3",
  })

  // Compliance officer reviews and signs
  .userTask("signoff", {
    name: "Compliance Officer Signoff",
    formId: "compliance-signoff-form",
    zeebeUserTask: true,
  })

  // Gateway: Signed or rejected?
  .exclusiveGateway("signoff-decision", { name: "Signed or Rejected?" })
  .branch("signed", (b) =>
    b
      .condition("= signed")
      .serviceTask("record-signoff", {
        name: "Record Signoff",
        taskType: "signoff-recorder",
        retries: "3",
      })
      .endEvent("signed", { name: "Signed" }),
  )
  .branch("rejected", (b) =>
    b
      .condition("= rejected")
      .serviceTask("record-rejection", {
        name: "Record Rejection",
        taskType: "rejection-recorder",
        retries: "3",
      })
      .endEvent("rejected", { name: "Rejected" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
