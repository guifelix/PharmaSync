import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("escalation")
  .name("Escalation")
  .executable(true)
  .startEvent("escalation-triggered", { name: "Escalation Triggered" })
  .userTask("triage-issue", {
    name: "Triage Issue",
    formId: "triage-form",
    zeebeUserTask: true,
  })
  .serviceTask("assign-level", {
    name: "Assign Escalation Level",
    taskType: "level-assigner",
    retries: "3",
  })
  .exclusiveGateway("level", { name: "Escalation Level?" })
  .branch("level1", (b) =>
    b
      .condition('= level = "L1"')
      .userTask("level1-resolve", {
        name: "Level 1 Resolution",
        formId: "level1-resolution-form",
        zeebeUserTask: true,
      })
      .endEvent("level1-resolved", { name: "Level 1 Resolved" }),
  )
  .branch("level2", (b) =>
    b
      .condition('= level = "L2"')
      .userTask("level2-resolve", {
        name: "Level 2 Resolution",
        formId: "level2-resolution-form",
        zeebeUserTask: true,
      })
      .endEvent("level2-resolved", { name: "Level 2 Resolved" }),
  )
  .branch("level3", (b) =>
    b
      .condition('= level = "L3"')
      .userTask("level3-resolve", {
        name: "Level 3 Resolution",
        formId: "level3-resolution-form",
        zeebeUserTask: true,
      })
      .endEvent("level3-resolved", { name: "Level 3 Resolved" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
