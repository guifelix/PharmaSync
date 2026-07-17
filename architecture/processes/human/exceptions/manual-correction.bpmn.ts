import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Manual Correction Process
 *
 * Human-in-the-loop correction workflow with auto-fix branching and audit logging
 */

const defs = Bpmn.createProcess("manual-correction")
  .name("Manual Correction")
  .executable(true)

  .startEvent("correction-req", { name: "Correction Requested" })

  .userTask("identify-issue", {
    name: "Identify Issue",
    formId: "issue-identification-form",
    zeebeUserTask: true,
  })

  .exclusiveGateway("auto-fixable", { name: "Auto-Fixable?" })
  .branch("yes", (b) =>
    b
      .condition("= autoFixable")
      .serviceTask("apply-auto-correction", {
        name: "Apply Auto-Correction",
        taskType: "auto-correction-applier",
        retries: "3",
      })
      .endEvent("auto-corrected", { name: "Auto-Corrected" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !autoFixable")
      .userTask("manual-correction", {
        name: "Manual Correction",
        formId: "manual-correction-form",
        zeebeUserTask: true,
      })
      .endEvent("manually-corrected", { name: "Manually Corrected" }),
  )

  // After both branches converge - log audit and complete
  .serviceTask("log-audit", {
    name: "Log Audit Trail",
    taskType: "audit-logger",
    retries: "3",
  })
  .endEvent("correction-complete", { name: "Correction Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
