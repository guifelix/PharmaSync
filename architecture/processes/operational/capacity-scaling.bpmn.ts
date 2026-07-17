import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("capacity-scaling")
  .name("Capacity Scaling")
  .executable(true)
  .startEvent("scaling-check", { name: "Scaling Check" })
  .serviceTask("monitor-metrics", {
    name: "Monitor Infrastructure Metrics",
    taskType: "metrics-monitor",
    retries: "3",
  })
  .exclusiveGateway("threshold", { name: "Threshold Breached?" })
  .branch("over", (b) =>
    b
      .condition("= overThreshold")
      .serviceTask("assess-scale-up", {
        name: "Assess Scale-Up",
        taskType: "scale-up-assessor",
        retries: "3",
      })
      .serviceTask("scale-up", {
        name: "Scale Up Resources",
        taskType: "resource-scaler",
        retries: "3",
      })
      .endEvent("scaled-up", { name: "Scaled Up" }),
  )
  .branch("under", (b) =>
    b
      .condition("= underThreshold")
      .serviceTask("assess-scale-down", {
        name: "Assess Scale-Down",
        taskType: "scale-down-assessor",
        retries: "3",
      })
      .serviceTask("scale-down", {
        name: "Scale Down Resources",
        taskType: "resource-scaler",
        retries: "3",
      })
      .endEvent("scaled-down", { name: "Scaled Down" }),
  )
  .branch("normal", (b) =>
    b
      .condition("= withinThreshold")
      .serviceTask("log-normal", {
        name: "Log Normal State",
        taskType: "normal-logger",
        retries: "3",
      })
      .endEvent("normal", { name: "Within Threshold" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
