import { Dmn } from "@bpmnkit/core";

/**
 * Data Quality Decision Table
 *
 * Determines data quality score and required actions
 */

const defs = Dmn.createDecisionTable("data-quality")
  .name("Data Quality Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Completeness %",
    expression: "completenessPercent",
    typeRef: "number",
  })
  .input({
    label: "Accuracy Score",
    expression: "accuracyScore",
    typeRef: "number",
  })
  .input({
    label: "Timeliness (hours)",
    expression: "timelinessHours",
    typeRef: "number",
  })
  .input({
    label: "Consistency Score",
    expression: "consistencyScore",
    typeRef: "number",
  })
  .output({ label: "Quality Grade", name: "qualityGrade", typeRef: "string" })
  .output({
    label: "Required Action",
    name: "requiredAction",
    typeRef: "string",
  })
  .rule({
    inputs: [">= 99", ">= 99", "<= 1", ">= 99"],
    outputs: ['"A"', '"NONE"'],
  })
  .rule({
    inputs: [">= 95", ">= 95", "<= 4", ">= 95"],
    outputs: ['"B"', '"MONITOR"'],
  })
  .rule({
    inputs: [">= 90", ">= 90", "<= 8", ">= 90"],
    outputs: ['"C"', '"REVIEW_REQUIRED"'],
  })
  .rule({
    inputs: [">= 80", ">= 80", "<= 24", ">= 80"],
    outputs: ['"D"', '"REMEDIATION_REQUIRED"'],
  })
  .rule({ inputs: ["-", "-", "-", "-"], outputs: ['"F"', '"QUARANTINE_FEED"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
