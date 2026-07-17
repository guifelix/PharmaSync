import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("backup-restore")
  .name("Backup and Restore")
  .executable(true)
  .startEvent("backup-triggered", { name: "Backup Triggered" })
  .serviceTask("determine-scope", {
    name: "Determine Backup Scope",
    taskType: "scope-determiner",
    retries: "3",
  })
  .serviceTask("run-backup", {
    name: "Run Backup",
    taskType: "backup-runner",
    retries: "3",
  })
  .serviceTask("verify-backup", {
    name: "Verify Backup Integrity",
    taskType: "backup-verifier",
    retries: "3",
  })
  .exclusiveGateway("success", { name: "Backup Successful?" })
  .branch("yes", (b) =>
    b
      .condition("= success")
      .serviceTask("log-result", {
        name: "Log Backup Result",
        taskType: "result-logger",
        retries: "3",
      })
      .endEvent("backup-complete", { name: "Backup Complete" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !success")
      .serviceTask("retry-backup", {
        name: "Retry Backup",
        taskType: "backup-retry",
        retries: "3",
      })
      .endEvent("retry-initiated", { name: "Retry Initiated" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
