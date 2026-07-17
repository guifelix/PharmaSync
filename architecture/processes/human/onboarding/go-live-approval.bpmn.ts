import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Go-Live Approval Process
 *
 * Final approval gate before partner goes live
 */

const defs = Bpmn.createProcess("go-live-approval")
  .name("Go-Live Approval")
  .executable(true)

  .startEvent("go-live-started", { name: "Go-Live Started" })

  // Verify certification
  .serviceTask("verify-certification", {
    name: "Verify Certification",
    taskType: "certification-verifier",
    retries: "3",
  })

  // Verify feed test
  .serviceTask("verify-feed", {
    name: "Verify Feed Test",
    taskType: "feed-verifier",
    retries: "3",
  })

  // Verify SLA commitments
  .serviceTask("verify-sla", {
    name: "Verify SLA Commitments",
    taskType: "sla-verifier",
    retries: "3",
  })

  // Gateway: All Clear?
  .exclusiveGateway("all-clear", { name: "All Clear?" })
  .branch("yes", (b) =>
    b
      .condition("= approved")
      .userTask("schedule-go-live", {
        name: "Schedule Go-Live",
        formId: "go-live-schedule-form",
        zeebeUserTask: true,
      })
      .serviceTask("notify-partner", {
        name: "Notify Partner",
        taskType: "partner-notifier",
        retries: "3",
      })
      .endEvent("go-live-complete", { name: "Go-Live Complete" }),
  )
  .branch("issues", (b) =>
    b
      .condition("= !approved")
      .userTask("escalate-issues", {
        name: "Escalate Blocking Issues",
        formId: "escalation-form",
        zeebeUserTask: true,
      })
      .endEvent("issues-escalated", { name: "Issues Escalated" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
