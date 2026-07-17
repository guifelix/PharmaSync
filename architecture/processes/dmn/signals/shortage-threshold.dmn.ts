import { Dmn } from "@bpmnkit/core";

/**
 * Shortage Threshold Decision Table
 *
 * Determines if a medication lot is in shortage based on:
 * - Current stock vs. threshold
 * - Demand forecast
 * - Days of supply remaining
 */

const defs = Dmn.createDecisionTable("shortage-threshold")
  .name("Shortage Threshold Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Current Stock",
    expression: "currentStock",
    typeRef: "number",
  })
  .input({
    label: "Shortage Threshold",
    expression: "threshold",
    typeRef: "number",
  })
  .input({
    label: "Demand Forecast (30 days)",
    expression: "demandForecast",
    typeRef: "number",
  })
  .input({
    label: "Days of Supply",
    expression: "daysOfSupply",
    typeRef: "number",
  })
  .output({ label: "Shortage Level", name: "shortageLevel", typeRef: "string" })
  .output({
    label: "Recommended Action",
    name: "recommendedAction",
    typeRef: "string",
  })
  .rule({
    inputs: ["< threshold", "< 7", "-", "-"],
    outputs: ['"CRITICAL"', '"IMMEDIATE_REORDER"'],
  })
  .rule({
    inputs: ["< threshold", ">= 7 && < 14", "-", "-"],
    outputs: ['"HIGH"', '"URGENT_REORDER"'],
  })
  .rule({
    inputs: ["< threshold", ">= 14", "-", "-"],
    outputs: ['"MEDIUM"', '"SCHEDULE_REORDER"'],
  })
  .rule({
    inputs: [">= threshold", "-", "> currentStock * 0.8", "-"],
    outputs: ['"WATCH"', '"MONITOR_CLOSELY"'],
  })
  .rule({ inputs: ["-", "-", "-", "-"], outputs: ['"NONE"', '"NO_ACTION"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
