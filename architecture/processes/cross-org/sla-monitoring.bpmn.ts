import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("sla-monitoring")
  .name("SLA Monitoring")
  .executable(true)
  .startEvent("monitoring-start", { name: "Monitoring Start" })
  .serviceTask("collect-metrics", {
    name: "Collect Partner Metrics",
    taskType: "metrics-collector",
    retries: "3",
  })
  .serviceTask("compare-vs-sla", {
    name: "Compare vs SLA Targets",
    taskType: "sla-comparator",
    retries: "3",
  })
  .exclusiveGateway("breach", { name: "SLA Breach?" })
  .branch("yes", (b) =>
    b
      .condition("= breached")
      .serviceTask("alert-parties", {
        name: "Alert All Parties",
        taskType: "party-alerter",
        retries: "3",
      })
      .userTask("escalate-breach", {
        name: "Escalate Breach",
        formId: "breach-escalation-form",
        zeebeUserTask: true,
      })
      .endEvent("breach-escalated", { name: "Breach Escalated" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !breached")
      .serviceTask("log-report", {
        name: "Log Compliance Report",
        taskType: "report-logger",
        retries: "3",
      })
      .endEvent("compliant", { name: "Compliant" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
