import { Dmn } from "@bpmnkit/core";

/**
 * Allocation Rules Decision Table
 *
 * Determines inventory allocation priority based on:
 * - Site type (hospital, pharmacy, distribution center)
 * - Patient acuity
 * - Current stock levels
 */

const defs = Dmn.createDecisionTable("allocation-rules")
  .name("Allocation Rules Decision")
  .hitPolicy("FIRST")
  .input({ label: "Site Type", expression: "siteType", typeRef: "string" })
  .input({
    label: "Patient Acuity",
    expression: "patientAcuity",
    typeRef: "string",
  })
  .input({
    label: "Current Stock %",
    expression: "stockPercent",
    typeRef: "number",
  })
  .output({
    label: "Allocation Priority",
    name: "allocationPriority",
    typeRef: "string",
  })
  .output({
    label: "Allocation %",
    name: "allocationPercent",
    typeRef: "number",
  })
  .rule({
    inputs: ['"HOSPITAL"', '"CRITICAL"', "<= 20"],
    outputs: ['"P1"', "100"],
  })
  .rule({ inputs: ['"HOSPITAL"', '"HIGH"', "<= 30"], outputs: ['"P2"', "80"] })
  .rule({
    inputs: ['"HOSPITAL"', '"MEDIUM"', "<= 50"],
    outputs: ['"P3"', "60"],
  })
  .rule({
    inputs: ['"PHARMACY"', '"CRITICAL"', "<= 30"],
    outputs: ['"P2"', "90"],
  })
  .rule({ inputs: ['"PHARMACY"', '"HIGH"', "<= 50"], outputs: ['"P3"', "70"] })
  .rule({
    inputs: ['"DISTRIBUTION_CENTER"', "-", "<= 40"],
    outputs: ['"P3"', "70"],
  })
  .rule({ inputs: ["-", "-", "> 80"], outputs: ['"P5"', "10"] })
  .rule({ inputs: ["-", "-", "-"], outputs: ['"P4"', "50"] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
