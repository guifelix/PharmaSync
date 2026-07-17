import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * HIPAA Breach Notification Process
 *
 * Handles breach detection, assessment, and notification per HIPAA requirements
 */

const defs = Bpmn.createProcess("hipaa-breach-notification")
  .name("HIPAA Breach Notification")
  .executable(true)

  .startEvent("breach-detected", { name: "Breach Detected" })

  // Initial assessment
  .serviceTask("assess-breach", {
    name: "Assess Breach Scope",
    taskType: "breach-assessor",
    retries: "3",
  })

  // Gateway: Is PHI involved?
  .exclusiveGateway("phi-check", { name: "PHI Involved?" })
  .branch("yes", (b) =>
    b
      .condition("= phiInvolved")
      .serviceTask("assess-risk", {
        name: "Assess Risk of Harm",
        taskType: "risk-assessor",
        retries: "3",
      })
      .exclusiveGateway("risk-level", { name: "Risk Level?" })
      .branch("high", (b) =>
        b
          .condition('= riskLevel = "HIGH"')
          .serviceTask("notify-individuals", {
            name: "Notify Affected Individuals",
            taskType: "notification-sender",
            retries: "3",
          })
          .serviceTask("notify-hhs", {
            name: "Notify HHS (60 days)",
            taskType: "hhs-notifier",
            retries: "3",
          })
          .serviceTask("notify-media", {
            name: "Notify Media (if >500)",
            taskType: "media-notifier",
            retries: "3",
          })
          .endEvent("notification-complete", {
            name: "Notifications Complete",
          }),
      )
      .branch("low", (b) =>
        b
          .condition('= riskLevel = "LOW"')
          .serviceTask("document-assessment", {
            name: "Document Risk Assessment",
            taskType: "documentation-writer",
            retries: "3",
          })
          .endEvent("documented", { name: "Assessment Documented" }),
      ),
  )

  .branch("no", (b) =>
    b
      .condition("= !phiInvolved")
      .serviceTask("document-no-phi", {
        name: "Document No PHI Breach",
        taskType: "documentation-writer",
        retries: "3",
      })
      .endEvent("no-phi-breach", { name: "No PHI Breach" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
