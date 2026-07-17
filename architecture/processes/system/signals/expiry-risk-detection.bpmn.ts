import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Expiry Risk Detection Process
 *
 * Calculates expiration-risk signals using configurable 30/60/90-day windows
 */

const defs = Bpmn.createProcess("expiry-risk-detection")
  .name("Expiry Risk Detection")
  .executable(true)

  .startEvent("detection-started", { name: "Detection Started" })

  // Read lot inventory with expiration dates
  .serviceTask("read-lots", {
    name: "Read Lot Inventory",
    taskType: "lot-reader",
    retries: "3",
  })

  // Apply expiry window rules
  .businessRuleTask("apply-expiry-rules", {
    name: "Apply Expiry Window Rules",
    taskType: "expiry-window-dmn",
    decisionId: "expiry-window-decision",
    resultVariable: "expirySignals",
  })

  // Gateway: Any expiring lots?
  .exclusiveGateway("expiry-check", { name: "Expiring Lots?" })
  .branch("yes", (b) =>
    b
      .condition("= expirySignals.length > 0")
      .serviceTask("create-signals", {
        name: "Create Expiry Signals",
        taskType: "signal-creator",
        retries: "3",
      })
      .serviceTask("publish-signals", {
        name: "Publish Signals to Queue",
        taskType: "signal-publisher",
        retries: "3",
      })
      .endEvent("signals-created", { name: "Signals Created" }),
  )
  .branch("no", (b) =>
    b
      .condition("= expirySignals.length == 0")
      .endEvent("no-expiry-risk", { name: "No Expiry Risk" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
