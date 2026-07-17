import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Feed Testing Process
 *
 * Tests partner feed integration with test payloads
 */

const defs = Bpmn.createProcess("feed-testing")
  .name("Feed Testing")
  .executable(true)

  .startEvent("test-started", { name: "Feed Testing Started" })

  // Setup test feed
  .serviceTask("setup-test-feed", {
    name: "Setup Test Feed",
    taskType: "test-feed-setup",
    retries: "3",
  })

  // Send test payload
  .serviceTask("send-test-payload", {
    name: "Send Test Payload",
    taskType: "test-payload-sender",
    retries: "3",
  })

  // Validate delivery
  .serviceTask("validate-delivery", {
    name: "Validate Delivery",
    taskType: "delivery-validator",
    retries: "3",
  })

  // Gateway: Test Pass?
  .exclusiveGateway("test-pass", { name: "Test Pass?" })
  .branch("pass", (b) =>
    b
      .condition("= approved")
      .serviceTask("approve-feed", {
        name: "Approve Feed",
        taskType: "feed-approver",
        retries: "3",
      })
      .endEvent("feed-approved", { name: "Feed Approved" }),
  )
  .branch("fail", (b) =>
    b
      .condition("= !approved")
      .userTask("debug-and-retry", {
        name: "Debug and Retry",
        formId: "debug-retry-form",
        zeebeUserTask: true,
      })
      .endEvent("retry-needed", { name: "Retry Needed" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
