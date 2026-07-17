import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("data-sharing-agreement")
  .name("Data Sharing Agreement")
  .executable(true)
  .startEvent("agreement-started", { name: "Agreement Initiated" })
  .userTask("draft-agreement", {
    name: "Draft Agreement",
    formId: "agreement-draft-form",
    zeebeUserTask: true,
  })
  .userTask("review-party-a", {
    name: "Review by Party A",
    formId: "party-a-review-form",
    zeebeUserTask: true,
  })
  .userTask("review-party-b", {
    name: "Review by Party B",
    formId: "party-b-review-form",
    zeebeUserTask: true,
  })
  .exclusiveGateway("signed", { name: "Signed by All?" })
  .branch("yes", (b) =>
    b
      .condition("= signed")
      .serviceTask("activate-agreement", {
        name: "Activate Agreement",
        taskType: "agreement-activator",
        retries: "3",
      })
      .endEvent("activated", { name: "Agreement Active" }),
  )
  .branch("no", (b) =>
    b
      .condition("= !signed")
      .userTask("renegotiate", {
        name: "Renegotiate Terms",
        formId: "renegotiation-form",
        zeebeUserTask: true,
      })
      .endEvent("renegotiating", { name: "Renegotiating" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
