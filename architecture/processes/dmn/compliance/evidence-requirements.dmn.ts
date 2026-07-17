import { Dmn } from "@bpmnkit/core";

/**
 * Evidence Requirements Decision Table
 *
 * Determines what evidence is required for different audit scenarios
 */

const defs = Dmn.createDecisionTable("evidence-requirements")
  .name("Evidence Requirements Decision")
  .hitPolicy("FIRST")
  .input({ label: "Audit Type", expression: "auditType", typeRef: "string" })
  .input({ label: "Risk Level", expression: "riskLevel", typeRef: "string" })
  .input({
    label: "Regulatory Domain",
    expression: "regulatoryDomain",
    typeRef: "string",
  })
  .output({
    label: "Evidence Package",
    name: "evidencePackage",
    typeRef: "string",
  })
  .output({
    label: "Retention Period",
    name: "retentionPeriod",
    typeRef: "string",
  })
  .rule({
    inputs: ['"FDA_INSPECTION"', '"HIGH"', '"DRUG_SUPPLY"'],
    outputs: ['"FULL_PACKAGE"', '"10_YEARS"'],
  })
  .rule({
    inputs: ['"STATE_INSPECTION"', '"HIGH"', '"DRUG_SUPPLY"'],
    outputs: ['"FULL_PACKAGE"', '"7_YEARS"'],
  })
  .rule({
    inputs: ['"INTERNAL_AUDIT"', '"MEDIUM"', '"DRUG_SUPPLY"'],
    outputs: ['"STANDARD_PACKAGE"', '"5_YEARS"'],
  })
  .rule({
    inputs: ['"INTERNAL_AUDIT"', '"LOW"', '"DRUG_SUPPLY"'],
    outputs: ['"MINIMAL_PACKAGE"', '"3_YEARS"'],
  })
  .rule({
    inputs: ['"COMPLIANCE_REVIEW"', "-", '"DRUG_SUPPLY"'],
    outputs: ['"TARGETED_PACKAGE"', '"5_YEARS"'],
  })
  .rule({
    inputs: ["-", "-", "-"],
    outputs: ['"STANDARD_PACKAGE"', '"5_YEARS"'],
  })
  .build();

export const xml = Dmn.export(defs);

export default defs;
