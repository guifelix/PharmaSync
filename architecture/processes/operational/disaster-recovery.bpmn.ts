import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("disaster-recovery")
  .name("Disaster Recovery")
  .executable(true)
  .startEvent("incident-detected", { name: "Incident Detected" })
  .serviceTask("assess-impact", {
    name: "Assess Impact",
    taskType: "impact-assessor",
    retries: "3",
  })
  .exclusiveGateway("dr-needed", { name: "DR Needed?" })
  .branch("yes", (b) =>
    b
      .condition("= drNeeded")
      .serviceTask("activate-dr", {
        name: "Activate DR Plan",
        taskType: "dr-activator",
        retries: "3",
      })
      .serviceTask("restore-services", {
        name: "Restore Services",
        taskType: "service-restorer",
        retries: "3",
      })
      .serviceTask("verify-restoration", {
        name: "Verify Restoration",
        taskType: "restoration-verifier",
        retries: "3",
      })
      .endEvent("services-restored", { name: "Services Restored" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !drNeeded")
      .serviceTask("continue-monitoring", {
        name: "Continue Monitoring",
        taskType: "monitor-continuer",
        retries: "3",
      })
      .endEvent("monitoring", { name: "Monitoring" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
