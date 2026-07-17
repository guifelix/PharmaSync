import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("secret-rotation")
  .name("Secret Rotation")
  .executable(true)
  .startEvent("rotation-triggered", { name: "Rotation Triggered" })
  .serviceTask("identify-expiring", {
    name: "Identify Expiring Secrets",
    taskType: "secret-scanner",
    retries: "3",
  })
  .serviceTask("generate-new-secrets", {
    name: "Generate New Secrets",
    taskType: "secret-generator",
    retries: "3",
  })
  .serviceTask("update-services", {
    name: "Update Services",
    taskType: "service-updater",
    retries: "3",
  })
  .exclusiveGateway("success", { name: "Rotation Successful?" })
  .branch("yes", (b) =>
    b
      .condition("= success")
      .serviceTask("revoke-old", {
        name: "Revoke Old Secrets",
        taskType: "secret-revoker",
        retries: "3",
      })
      .serviceTask("audit-rotation", {
        name: "Audit Rotation",
        taskType: "rotation-auditor",
        retries: "3",
      })
      .endEvent("rotation-complete", { name: "Rotation Complete" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !success")
      .serviceTask("rollback", {
        name: "Rollback Changes",
        taskType: "rollback-executor",
        retries: "3",
      })
      .endEvent("rolled-back", { name: "Rolled Back" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
