import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("joint-recall")
  .name("Joint Recall")
  .executable(true)
  .startEvent("recall-initiated", { name: "Recall Initiated" })
  .serviceTask("notify-all-parties", {
    name: "Notify All Partners",
    taskType: "mass-notifier",
    retries: "3",
  })
  .userTask("coordinate-actions", {
    name: "Coordinate Recall Actions",
    formId: "recall-coordination-form",
    zeebeUserTask: true,
  })
  .serviceTask("track-progress", {
    name: "Track Recall Progress",
    taskType: "progress-tracker",
    retries: "3",
  })
  .exclusiveGateway("complete", { name: "Recall Complete?" })
  .branch("yes", (b) =>
    b
      .condition("= completed")
      .serviceTask("finalize-report", {
        name: "Finalize Recall Report",
        taskType: "report-finalizer",
        retries: "3",
      })
      .endEvent("recall-finalized", { name: "Recall Finalized" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !completed")
      .userTask("follow-up", {
        name: "Follow Up on Outstanding",
        formId: "recall-followup-form",
        zeebeUserTask: true,
      })
      .endEvent("pending-followup", { name: "Pending Follow-Up" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
