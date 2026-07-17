import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Partner Certification Process
 *
 * Human-in-the-loop certification of partner onboarding
 */

const defs = Bpmn.createProcess("partner-certification")
  .name("Partner Certification")
  .executable(true)

  .startEvent("certification-started", { name: "Certification Started" })

  // Assign certification reviewer
  .userTask("assign-reviewer", {
    name: "Assign Certification Reviewer",
    formId: "certification-reviewer-form",
    zeebeUserTask: true,
  })

  // Reviewer evaluates partner documentation
  .userTask("evaluate-documentation", {
    name: "Evaluate Partner Documentation",
    formId: "documentation-evaluation-form",
    zeebeUserTask: true,
  })

  // Gateway: Certify or request improvements?
  .exclusiveGateway("certification-decision", {
    name: "Certify or Request Improvements?",
  })
  .branch("certify", (b) =>
    b
      .condition("= certify")
      .serviceTask("issue-certificate", {
        name: "Issue Certificate",
        taskType: "certificate-issuer",
        retries: "3",
      })
      .endEvent("certified", { name: "Partner Certified" }),
  )
  .branch("improvements", (b) =>
    b
      .condition("= improvements")
      .userTask("request-improvements", {
        name: "Request Improvements",
        formId: "improvement-request-form",
        zeebeUserTask: true,
      })
      .endEvent("improvements-needed", { name: "Improvements Needed" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
