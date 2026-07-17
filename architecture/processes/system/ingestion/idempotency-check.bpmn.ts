import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Idempotency Check Process
 *
 * Deduplicates repeated partner submissions using source IDs,
 * payload hash, and partner event identifiers
 */

const defs = Bpmn.createProcess("idempotency-check")
  .name("Idempotency Check")
  .executable(true)

  .startEvent("idempotency-started", { name: "Idempotency Check Started" })

  // Compute payload hash
  .serviceTask("compute-hash", {
    name: "Compute Payload Hash",
    taskType: "hash-computer",
    retries: "3",
  })

  // Check source event ID
  .serviceTask("check-source-id", {
    name: "Check Source Event ID",
    taskType: "source-id-checker",
    retries: "3",
  })

  // Check partner event ID
  .serviceTask("check-partner-event-id", {
    name: "Check Partner Event ID",
    taskType: "partner-event-id-checker",
    retries: "3",
  })

  // Gateway: Is duplicate?
  .exclusiveGateway("duplicate-check", { name: "Duplicate?" })
  .branch("duplicate", (b) =>
    b
      .condition("= duplicate")
      .serviceTask("mark-duplicate", {
        name: "Mark as Duplicate",
        taskType: "duplicate-marker",
        retries: "3",
      })
      .endEvent("duplicate-found", { name: "Duplicate Found" }),
  )
  .branch("new", (b) =>
    b
      .condition("= new")
      .serviceTask("store-idempotency-key", {
        name: "Store Idempotency Key",
        taskType: "idempotency-key-store",
        retries: "3",
      })
      .endEvent("new-event", { name: "New Event" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
