import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Outbox Publisher Process
 *
 * Reliably publishes events through the outbox pattern
 */

const defs = Bpmn.createProcess("outbox-publisher")
  .name("Outbox Publisher")
  .executable(true)

  .startEvent("publisher-started", { name: "Publisher Started" })

  // Claim outbox batch
  .serviceTask("claim-batch", {
    name: "Claim Outbox Batch",
    taskType: "outbox-claimer",
    retries: "3",
  })

  // Process each record
  .serviceTask("process-record", {
    name: "Process Outbox Record",
    taskType: "outbox-processor",
    retries: "3",
  })

  // Gateway: Processing result
  .exclusiveGateway("process-result", { name: "Success?" })
  .branch("success", (b) =>
    b
      .condition("= success")
      .serviceTask("acknowledge-record", {
        name: "Acknowledge Record",
        taskType: "outbox-acknowledger",
        retries: "3",
      })
      .endEvent("record-acknowledged", { name: "Record Acknowledged" }),
  )
  .branch("failure", (b) =>
    b
      .condition("= failure")
      .serviceTask("handle-failure", {
        name: "Handle Failure",
        taskType: "failure-handler",
        retries: "3",
      })
      // Nested retry decision inside the failure path
      .exclusiveGateway("retry-check", { name: "Retry?" })
      .branch("retry", (b2) =>
        b2
          .condition("= retryable")
          .serviceTask("schedule-retry", {
            name: "Schedule Retry",
            taskType: "retry-scheduler",
            retries: "3",
          })
          .endEvent("retry-scheduled", { name: "Retry Scheduled" }),
      )
      .branch("dead-letter", (b2) =>
        b2
          .condition("= !retryable")
          .serviceTask("move-to-dead-letter", {
            name: "Move to Dead Letter",
            taskType: "dead-letter-mover",
            retries: "3",
          })
          .endEvent("record-dead-lettered", { name: "Record Dead Lettered" }),
      ),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
