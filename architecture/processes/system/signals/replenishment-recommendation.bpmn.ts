import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Replenishment Recommendation Process
 *
 * Generates replenishment recommendations based on shortage signals and inventory levels
 */

const defs = Bpmn.createProcess("replenishment-recommendation")
  .name("Replenishment Recommendation")
  .executable(true)

  .startEvent("recommendation-started", { name: "Recommendation Started" })

  // Read shortage signals and current inventory
  .serviceTask("read-signals", {
    name: "Read Shortage Signals",
    taskType: "signal-reader",
    retries: "3",
  })

  .serviceTask("read-inventory", {
    name: "Read Current Inventory",
    taskType: "inventory-reader",
    retries: "3",
  })

  // Apply replenishment priority rules
  .businessRuleTask("apply-priority-rules", {
    name: "Apply Replenishment Priority Rules",
    taskType: "replenishment-priority-dmn",
    decisionId: "replenishment-priority-decision",
    resultVariable: "recommendations",
  })

  // Gateway: Any recommendations?
  .exclusiveGateway("recommendation-check", {
    name: "Recommendations Generated?",
  })
  .branch("yes", (b) =>
    b
      .condition("= recommendations.length > 0")
      .serviceTask("create-recommendations", {
        name: "Create Replenishment Recommendations",
        taskType: "recommendation-creator",
        retries: "3",
      })
      .serviceTask("publish-recommendations", {
        name: "Publish Recommendations",
        taskType: "recommendation-publisher",
        retries: "3",
      })
      .endEvent("recommendations-created", { name: "Recommendations Created" }),
  )
  .branch("no", (b) =>
    b
      .condition("= recommendations.length == 0")
      .endEvent("no-recommendations", { name: "No Recommendations Needed" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
