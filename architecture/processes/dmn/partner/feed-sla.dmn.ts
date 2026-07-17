import { Dmn } from "@bpmnkit/core";

/**
 * Feed SLA Decision Table
 *
 * Determines if partner feed meets SLA requirements
 */

const defs = Dmn.createDecisionTable("feed-sla")
  .name("Feed SLA Decision")
  .hitPolicy("FIRST")
  .input({ label: "Feed Format", expression: "feedFormat", typeRef: "string" })
  .input({
    label: "Delivery Timeliness (hours)",
    expression: "deliveryTimelinessHours",
    typeRef: "number",
  })
  .input({
    label: "Data Quality Score",
    expression: "dataQualityScore",
    typeRef: "number",
  })
  .input({
    label: "Completeness %",
    expression: "completenessPercent",
    typeRef: "number",
  })
  .output({ label: "SLA Met", name: "slaMet", typeRef: "boolean" })
  .output({ label: "Penalty", name: "penalty", typeRef: "string" })
  .rule({
    inputs: ['"JSON"', "<= 2", ">= 95", ">= 99"],
    outputs: ["true", '"NONE"'],
  })
  .rule({
    inputs: ['"CSV"', "<= 4", ">= 90", ">= 95"],
    outputs: ["true", '"NONE"'],
  })
  .rule({
    inputs: ["-", "<= 8", ">= 80", ">= 90"],
    outputs: ["true", '"WARNING"'],
  })
  .rule({
    inputs: ["-", "<= 24", ">= 70", ">= 80"],
    outputs: ["true", '"PENALTY_5%"'],
  })
  .rule({
    inputs: ["-", "-", "-", "-"],
    outputs: ["false", '"PENALTY_10%_AND_REVIEW"'],
  })
  .build();

export const xml = Dmn.export(defs);

export default defs;
