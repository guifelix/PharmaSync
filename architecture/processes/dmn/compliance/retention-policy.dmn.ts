import { Dmn } from "@bpmnkit/core";

/**
 * Retention Policy Decision Table
 *
 * Determines retention period for different evidence types
 */

const defs = Dmn.createDecisionTable("retention-policy")
  .name("Retention Policy Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Evidence Type",
    expression: "evidenceType",
    typeRef: "string",
  })
  .input({
    label: "Regulatory Domain",
    expression: "regulatoryDomain",
    typeRef: "string",
  })
  .input({ label: "Risk Level", expression: "riskLevel", typeRef: "string" })
  .output({
    label: "Retention Period",
    name: "retentionPeriod",
    typeRef: "string",
  })
  .output({
    label: "Archive Location",
    name: "archiveLocation",
    typeRef: "string",
  })
  .rule({
    inputs: ['"AUDIT_PACKAGE"', '"FDA"', '"HIGH"'],
    outputs: ['"10_YEARS"', '"COLD_STORAGE"'],
  })
  .rule({
    inputs: ['"AUDIT_PACKAGE"', '"STATE"', '"HIGH"'],
    outputs: ['"7_YEARS"', '"COLD_STORAGE"'],
  })
  .rule({
    inputs: ['"AUDIT_PACKAGE"', "-", '"MEDIUM"'],
    outputs: ['"5_YEARS"', '"WARM_STORAGE"'],
  })
  .rule({
    inputs: ['"QUARANTINE_RECORD"', "-", '"HIGH"'],
    outputs: ['"7_YEARS"', '"COLD_STORAGE"'],
  })
  .rule({
    inputs: ['"QUARANTINE_RECORD"', "-", '"MEDIUM"'],
    outputs: ['"5_YEARS"', '"WARM_STORAGE"'],
  })
  .rule({
    inputs: ['"CORRECTION_RECORD"', "-", "-"],
    outputs: ['"10_YEARS"', '"COLD_STORAGE"'],
  })
  .rule({
    inputs: ['"DISPENSE_RECORD"', "-", "-"],
    outputs: ['"7_YEARS"', '"WARM_STORAGE"'],
  })
  .rule({
    inputs: ['"RECEIPT_RECORD"', "-", "-"],
    outputs: ['"5_YEARS"', '"WARM_STORAGE"'],
  })
  .rule({ inputs: ["-", "-", "-"], outputs: ['"3_YEARS"', '"WARM_STORAGE"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
