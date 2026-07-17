import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Shortage Detection Process
 *
 * Calculates shortage signals using transparent rules for the POC
 */

const defs = Bpmn.createProcess("shortage-detection")
  .name("Shortage Detection")
  .executable(true)

  .startEvent("detection-started", { name: "Detection Started" })

  // Read current stock levels
  .serviceTask("read-stock", {
    name: "Read Current Stock Levels",
    taskType: "stock-reader",
    retries: "3",
  })

  // Read demand forecasts
  .serviceTask("read-demand", {
    name: "Read Demand Forecasts",
    taskType: "demand-reader",
    retries: "3",
  })

  // Apply shortage threshold rules
  .businessRuleTask("apply-thresholds", {
    name: "Apply Shortage Thresholds",
    taskType: "shortage-threshold-dmn",
    decisionId: "shortage-threshold-decision",
    resultVariable: "shortageSignals",
  })

  // Gateway: Any shortages detected?
  .exclusiveGateway("shortage-check", { name: "Shortages Detected?" })
  .branch("yes", (b) =>
    b
      .condition("= shortageSignals.length > 0")
      .serviceTask("create-signals", {
        name: "Create Shortage Signals",
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
      .condition("= shortageSignals.length == 0")
      .endEvent("no-shortages", { name: "No Shortages" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
