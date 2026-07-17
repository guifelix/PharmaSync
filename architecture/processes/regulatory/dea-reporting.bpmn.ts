import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * DEA Reporting Process
 *
 * Handles DEA controlled substance transaction reporting,
 * compliance validation, and report submission
 */

const defs = Bpmn.createProcess("dea-reporting")
  .name("DEA Reporting")
  .executable(true)

  .startEvent("reporting-cycle", { name: "Reporting Cycle" })

  // Collect transaction data
  .serviceTask("collect-transactions", {
    name: "Collect Transaction Data",
    taskType: "transaction-collector",
    retries: "3",
  })

  // Validate compliance
  .serviceTask("validate-compliance", {
    name: "Validate Compliance",
    taskType: "compliance-validator",
    retries: "3",
  })

  // Gateway: Data Compliant?
  .exclusiveGateway("compliant", { name: "Data Compliant?" })
  .branch("yes", (b) =>
    b
      .condition("= compliant")
      .serviceTask("submit-report", {
        name: "Submit DEA Report",
        taskType: "dea-submitter",
        retries: "3",
      })
      .serviceTask("archive-report", {
        name: "Archive Report",
        taskType: "report-archiver",
        retries: "3",
      })
      .endEvent("report-filed", { name: "Report Filed" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !compliant")
      .userTask("flag-for-review", {
        name: "Flag for Review",
        formId: "dea-flag-form",
        zeebeUserTask: true,
      })
      .endEvent("flagged", { name: "Flagged for Review" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
