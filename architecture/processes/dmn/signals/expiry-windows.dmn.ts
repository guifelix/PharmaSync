import { Dmn } from "@bpmnkit/core";

/**
 * Expiry Window Decision Table
 *
 * Determines expiry risk level based on:
 * - Days until expiration
 * - Lot quantity
 * - Demand forecast
 */

const defs = Dmn.createDecisionTable("expiry-windows")
  .name("Expiry Window Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Days Until Expiry",
    expression: "daysUntilExpiry",
    typeRef: "number",
  })
  .input({
    label: "Lot Quantity",
    expression: "lotQuantity",
    typeRef: "number",
  })
  .input({
    label: "30-Day Demand Forecast",
    expression: "demandForecast",
    typeRef: "number",
  })
  .output({ label: "Expiry Risk Level", name: "expiryRisk", typeRef: "string" })
  .output({
    label: "Recommended Action",
    name: "recommendedAction",
    typeRef: "string",
  })
  .rule({
    inputs: ["<= 30", "> demandForecast * 2", "-"],
    outputs: ['"CRITICAL"', '"IMMEDIATE_DISPOSAL_OR_DONATION"'],
  })
  .rule({
    inputs: ["<= 30", "> demandForecast", "-"],
    outputs: ['"HIGH"', '"PRIORITIZE_DISPENSING"'],
  })
  .rule({
    inputs: ["<= 60", "> demandForecast * 1.5", "-"],
    outputs: ['"MEDIUM"', '"ACCELERATE_DISPENSING"'],
  })
  .rule({
    inputs: ["<= 90", "> demandForecast", "-"],
    outputs: ['"WATCH"', '"MONITOR_CLOSELY"'],
  })
  .rule({ inputs: ["-", "-", "-"], outputs: ['"NONE"', '"NO_ACTION"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
