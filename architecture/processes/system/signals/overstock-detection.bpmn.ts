import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Overstock Detection Process
 *
 * Calculates overstock signals using configurable thresholds
 */

const defs = Bpmn.createProcess("overstock-detection")
  .name("Overstock Detection")
  .executable(true)

  .startEvent("detection-started", { name: "Detection Started" })

  // Read current stock levels
  .serviceTask("read-stock", {
    name: "Read Current Stock Levels",
    taskType: "stock-reader",
    retries: "3",
  })

  // Apply overstock threshold rules
  .businessRuleTask("apply-thresholds", {
    name: "Apply Overstock Thresholds",
    taskType: "overstock-threshold-dmn",
    decisionId: "overstock-threshold-decision",
    resultVariable: "overstockSignals",
  })

  // Gateway: Any overstock detected?
  .exclusiveGateway("overstock-check", { name: "Overstock Detected?" })
  .branch("yes", (b) =>
    b
      .condition("= overstockSignals.length > 0")
      .serviceTask("create-signals", {
        name: "Create Overstock Signals",
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
      .condition("= overstockSignals.length == 0")
      .endEvent("no-overstock", { name: "No Overstock" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
