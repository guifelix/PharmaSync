import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("override-approval")
  .name("Override Approval")
  .executable(true)
  .startEvent("override-req", { name: "Override Requested" })
  .userTask("request-override", {
    name: "Request Override",
    formId: "override-request-form",
    zeebeUserTask: true,
  })
  .serviceTask("validate-context", {
    name: "Validate Context",
    taskType: "context-validator",
    retries: "3",
  })
  .serviceTask("assess-risk", {
    name: "Assess Risk",
    taskType: "risk-assessor",
    retries: "3",
  })
  .exclusiveGateway("approved", { name: "Approved?" })
  .branch("yes", (b) =>
    b
      .condition("= approved")
      .userTask("apply-override", {
        name: "Apply Override",
        formId: "override-apply-form",
        zeebeUserTask: true,
      })
      .endEvent("override-applied", { name: "Override Applied" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !approved")
      .userTask("notify-requester", {
        name: "Notify Requester",
        formId: "denial-notification-form",
        zeebeUserTask: true,
      })
      .endEvent("denied", { name: "Denied" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
