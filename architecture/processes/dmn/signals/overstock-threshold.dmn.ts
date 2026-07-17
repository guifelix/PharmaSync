import { Dmn } from "@bpmnkit/core";

/**
 * Overstock Threshold Decision Table
 *
 * Determines if a medication lot is overstocked based on:
 * - Current stock vs. upper threshold
 * - Demand forecast
 * - Shelf life remaining
 */

const defs = Dmn.createDecisionTable("overstock-threshold")
  .name("Overstock Threshold Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Current Stock",
    expression: "currentStock",
    typeRef: "number",
  })
  .input({
    label: "Upper Threshold",
    expression: "upperThreshold",
    typeRef: "number",
  })
  .input({
    label: "Demand Forecast (30 days)",
    expression: "demandForecast",
    typeRef: "number",
  })
  .input({
    label: "Shelf Life Remaining (days)",
    expression: "shelfLifeRemaining",
    typeRef: "number",
  })
  .output({
    label: "Overstock Level",
    name: "overstockLevel",
    typeRef: "string",
  })
  .output({
    label: "Recommended Action",
    name: "recommendedAction",
    typeRef: "string",
  })
  .rule({
    inputs: ["> upperThreshold", "<= 30", "-", "-"],
    outputs: ['"CRITICAL"', '"IMMEDIATE_REDUCTION"'],
  })
  .rule({
    inputs: ["> upperThreshold", "<= 90", "-", "-"],
    outputs: ['"HIGH"', '"ACCELERATE_DISPENSING"'],
  })
  .rule({
    inputs: ["> upperThreshold", "> 90", "-", "-"],
    outputs: ['"MEDIUM"', '"SCHEDULE_REDUCTION"'],
  })
  .rule({
    inputs: ["<= upperThreshold", "-", "-", "-"],
    outputs: ['"NONE"', '"NO_ACTION"'],
  })
  .build();

export const xml = Dmn.export(defs);

export default defs;
