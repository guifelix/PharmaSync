import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Integration Gateway — Feed Ingestion Process
 *
 * Matches Structurizr dynamic view "inventory-ingestion-flow" and
 * D2 component-integration-gateway.d2
 *
 * Partner System → Feed Adapter → Validation → Canonical Mapping →
 * Idempotency → (Publisher → Queue + Inventory API) | Quarantine
 */

const defs = Bpmn.createProcess("integration-gateway-ingestion")
  .name("Integration Gateway Feed Ingestion")
  .executable(true)

  // Start: Feed received from partner
  .startEvent("feed-received", { name: "Feed Received" })

  // Feed Adapter: Receive and parse partner feed
  .serviceTask("receive-feed", {
    name: "Receive Partner Feed",
    taskType: "feed-adapter",
    retries: "3",
  })

  // Validation: Validate payload schema, required fields, data types, business constraints
  .serviceTask("validate-payload", {
    name: "Validate Payload",
    taskType: "payload-validator",
    retries: "3",
  })

  // Gateway: Validation result
  .exclusiveGateway("validation-result", { name: "Valid?" })
  .branch("valid", (b) =>
    b
      .condition("= valid")
      .serviceTask("map-canonical", {
        name: "Map to Canonical Model",
        taskType: "canonical-mapper",
        retries: "3",
      })
      .serviceTask("check-idempotency", {
        name: "Check Idempotency",
        taskType: "idempotency-checker",
        retries: "3",
      })
      .exclusiveGateway("idempotency-result", { name: "New Event?" })
      .branch("new", (b) =>
        b
          .condition("= new")
          .parallelGateway("publish-fork")
          .branch("queue", (b) =>
            b.serviceTask("publish-queue", {
              name: "Publish to Queue/Outbox",
              taskType: "integration-event-publisher",
              retries: "3",
            }),
          )
          .branch("inventory", (b) =>
            b.serviceTask("submit-inventory", {
              name: "Submit to Inventory API",
              taskType: "inventory-api-client",
              retries: "3",
            }),
          )
          .parallelGateway("publish-join")
          .endEvent("ingested", { name: "Ingested" }),
      )
      .branch("duplicate", (b) =>
        b
          .condition("= duplicate")
          .serviceTask("quarantine-duplicate", {
            name: "Quarantine as Duplicate",
            taskType: "quarantine-writer",
            retries: "3",
          })
          .endEvent("duplicate-quarantined", { name: "Duplicate Quarantined" }),
      ),
  )
  .branch("invalid", (b) =>
    b
      .condition("= invalid")
      .serviceTask("quarantine-invalid", {
        name: "Quarantine Invalid Payload",
        taskType: "quarantine-writer",
        retries: "3",
      })
      .endEvent("invalid-quarantined", { name: "Invalid Quarantined" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
