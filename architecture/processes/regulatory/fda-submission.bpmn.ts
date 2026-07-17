import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * FDA Submission Process
 *
 * Handles FDA submission preparation, internal review, submission, and tracking
 */

const defs = Bpmn.createProcess("fda-submission")
  .name("FDA Submission")
  .executable(true)

  .startEvent("submission-req", { name: "Submission Required" })

  // Gather compliance evidence
  .serviceTask("gather-evidence", {
    name: "Gather Compliance Evidence",
    taskType: "evidence-gatherer",
    retries: "3",
  })

  // Prepare FDA submission
  .serviceTask("prepare-submission", {
    name: "Prepare FDA Submission",
    taskType: "submission-preparer",
    retries: "3",
  })

  // Internal review by human
  .userTask("internal-review", {
    name: "Internal Review",
    formId: "fda-review-form",
    zeebeUserTask: true,
  })

  // Gateway: Review Approved?
  .exclusiveGateway("approved", { name: "Review Approved?" })
  .branch("yes", (b) =>
    b
      .condition("= approved")
      // Submit to FDA
      .serviceTask("submit-to-fda", {
        name: "Submit to FDA",
        taskType: "fda-submitter",
        retries: "3",
      })
      // Track submission status
      .serviceTask("track-status", {
        name: "Track Submission Status",
        taskType: "status-tracker",
        retries: "3",
      })
      // Gateway: Accepted?
      .exclusiveGateway("accepted", { name: "Accepted?" })
      .branch("accepted", (b2) =>
        b2
          .condition("= accepted")
          .serviceTask("archive-submission", {
            name: "Archive Submission",
            taskType: "submission-archiver",
            retries: "3",
          })
          .endEvent("submission-complete", { name: "Submission Complete" }),
      )
      .branch("questions", (b2) =>
        b2
          .condition("= questions")
          .userTask("respond-to-questions", {
            name: "Respond to FDA Questions",
            formId: "fda-response-form",
            zeebeUserTask: true,
          })
          .endEvent("response-sent", { name: "Response Sent" }),
      ),
  )
  .branch("no", (b) =>
    b
      .condition("= !approved")
      .userTask("revise-submission", {
        name: "Revise Submission",
        formId: "submission-revision-form",
        zeebeUserTask: true,
      })
      .endEvent("revision-needed", { name: "Revision Needed" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
