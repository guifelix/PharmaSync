import { Dmn } from "@bpmnkit/core";

/**
 * Replenishment Priority Decision Table
 *
 * Determines replenishment priority based on:
 * - Shortage severity
 * - Clinical criticality
 * - Supply chain lead time
 */

const defs = Dmn.createDecisionTable("replenishment-priority")
  .name("Replenishment Priority Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Shortage Level",
    expression: "shortageLevel",
    typeRef: "string",
  })
  .input({
    label: "Clinical Criticality",
    expression: "clinicalCriticality",
    typeRef: "string",
  })
  .input({
    label: "Lead Time (days)",
    expression: "leadTimeDays",
    typeRef: "number",
  })
  .output({ label: "Priority", name: "priority", typeRef: "string" })
  .output({ label: "Action", name: "action", typeRef: "string" })
  .rule({
    inputs: ['"CRITICAL"', '"LIFE_SAVING"', "<= 7"],
    outputs: ['"P1"', '"EMERGENCY_AIR_SHIPMENT"'],
  })
  .rule({
    inputs: ['"CRITICAL"', '"HIGH"', "<= 14"],
    outputs: ['"P1"', '"EXPEDITED_SHIPMENT"'],
  })
  .rule({
    inputs: ['"HIGH"', '"LIFE_SAVING"', "<= 14"],
    outputs: ['"P2"', '"PRIORITY_SHIPMENT"'],
  })
  .rule({
    inputs: ['"HIGH"', '"HIGH"', "<= 30"],
    outputs: ['"P2"', '"STANDARD_EXPEDITED"'],
  })
  .rule({
    inputs: ['"MEDIUM"', "-", "<= 30"],
    outputs: ['"P3"', '"STANDARD_SHIPMENT"'],
  })
  .rule({ inputs: ['"WATCH"', "-", "-"], outputs: ['"P4"', '"MONITOR"'] })
  .rule({ inputs: ['"NONE"', "-", "-"], outputs: ['"P5"', '"NO_ACTION"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
