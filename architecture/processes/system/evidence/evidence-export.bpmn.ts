import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Evidence Export Process
 *
 * Exports evidence packages for authorized review
 */

const defs = Bpmn.createProcess("evidence-export")
  .name("Evidence Export")
  .executable(true)

  .startEvent("export-started", { name: "Export Started" })

  // Validate export request
  .serviceTask("validate-request", {
    name: "Validate Export Request",
    taskType: "export-validator",
    retries: "3",
  })

  // Check authorization
  .serviceTask("check-authorization", {
    name: "Check Authorization",
    taskType: "authorization-checker",
    retries: "3",
  })

  // Gateway: Authorized?
  .exclusiveGateway("auth-check", { name: "Authorized?" })
  .branch("authorized", (b) =>
    b
      .condition("= authorized")
      .serviceTask("prepare-export", {
        name: "Prepare Export",
        taskType: "export-preparer",
        retries: "3",
      })
      .serviceTask("deliver-export", {
        name: "Deliver Export",
        taskType: "export-deliverer",
        retries: "3",
      })
      .endEvent("export-delivered", { name: "Export Delivered" }),
  )
  .branch("unauthorized", (b) =>
    b
      .condition("= !authorized")
      .serviceTask("log-denial", {
        name: "Log Access Denial",
        taskType: "denial-logger",
        retries: "3",
      })
      .endEvent("export-denied", { name: "Export Denied" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
