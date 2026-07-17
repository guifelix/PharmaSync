import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("partner-feed-certification")
  .name("Partner Feed Certification")
  .executable(true)
  .startEvent("cert-req", { name: "Certification Requested" })
  .userTask("validate-feed-spec", {
    name: "Validate Feed Specification",
    formId: "feed-spec-form",
    zeebeUserTask: true,
  })
  .serviceTask("test-connectivity", {
    name: "Test Connectivity",
    taskType: "connectivity-tester",
    retries: "3",
  })
  .exclusiveGateway("passed", { name: "Tests Passed?" })
  .branch("pass", (b) =>
    b
      .condition("= passed")
      .serviceTask("issue-cert", {
        name: "Issue Certification",
        taskType: "certification-issuer",
        retries: "3",
      })
      .endEvent("certified", { name: "Certified" }),
  )
  .branch("fail", (b) =>
    b
      .condition("= !passed")
      .userTask("notify-partner", {
        name: "Notify Partner of Issues",
        formId: "partner-notification-form",
        zeebeUserTask: true,
      })
      .endEvent("failed", { name: "Certification Failed" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
