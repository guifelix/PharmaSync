import { Dmn } from "@bpmnkit/core";

/**
 * Certification Criteria Decision Table
 *
 * Determines if partner meets certification requirements
 */

const defs = Dmn.createDecisionTable("certification-criteria")
  .name("Certification Criteria Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Feed Quality Score",
    expression: "feedQualityScore",
    typeRef: "number",
  })
  .input({
    label: "SLA Compliance %",
    expression: "slaCompliancePercent",
    typeRef: "number",
  })
  .input({
    label: "Issue Resolution Time (days)",
    expression: "resolutionTimeDays",
    typeRef: "number",
  })
  .input({
    label: "Regulatory Compliance",
    expression: "regulatoryCompliance",
    typeRef: "boolean",
  })
  .output({
    label: "Certification Level",
    name: "certificationLevel",
    typeRef: "string",
  })
  .output({
    label: "Validity Period (months)",
    name: "validityMonths",
    typeRef: "number",
  })
  .rule({
    inputs: [">= 95", ">= 99", "<= 2", "true"],
    outputs: ['"PLATINUM"', "24"],
  })
  .rule({
    inputs: [">= 90", ">= 95", "<= 5", "true"],
    outputs: ['"GOLD"', "18"],
  })
  .rule({
    inputs: [">= 85", ">= 90", "<= 10", "true"],
    outputs: ['"SILVER"', "12"],
  })
  .rule({
    inputs: [">= 80", ">= 85", "<= 15", "true"],
    outputs: ['"BRONZE"', "6"],
  })
  .rule({ inputs: ["-", "-", "-", "-"], outputs: ['"PROVISIONAL"', "3"] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
