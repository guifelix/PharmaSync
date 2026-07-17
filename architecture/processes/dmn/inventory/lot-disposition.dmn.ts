import { Dmn } from "@bpmnkit/core";

/**
 * Lot Disposition Decision Table
 *
 * Determines disposition of medication lots based on:
 * - Expiration status
 * - Quality test results
 * - Regulatory requirements
 */

const defs = Dmn.createDecisionTable("lot-disposition")
  .name("Lot Disposition Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Expiration Status",
    expression: "expirationStatus",
    typeRef: "string",
  })
  .input({
    label: "Quality Test Result",
    expression: "qualityResult",
    typeRef: "string",
  })
  .input({
    label: "Regulatory Hold",
    expression: "regulatoryHold",
    typeRef: "boolean",
  })
  .output({ label: "Disposition", name: "disposition", typeRef: "string" })
  .output({
    label: "Required Actions",
    name: "requiredActions",
    typeRef: "string",
  })
  .rule({
    inputs: ['"EXPIRED"', "-", "-"],
    outputs: ['"DISPOSE"', '"DOCUMENT_DISPOSAL,NOTIFY_REGULATORY"'],
  })
  .rule({
    inputs: ['"NEAR_EXPIRY"', '"FAILED"', "-"],
    outputs: ['"QUARANTINE"', '"QUALITY_REVIEW,NOTIFY_REGULATORY"'],
  })
  .rule({
    inputs: ['"NEAR_EXPIRY"', '"PASSED"', "true"],
    outputs: ['"QUARANTINE"', '"REGULATORY_REVIEW"'],
  })
  .rule({
    inputs: ['"NEAR_EXPIRY"', '"PASSED"', "false"],
    outputs: ['"PRIORITIZE_DISPENSING"', '"ACCELERATE_DISPENSING"'],
  })
  .rule({
    inputs: ['"ACTIVE"', '"FAILED"', "-"],
    outputs: ['"QUARANTINE"', '"QUALITY_INVESTIGATION"'],
  })
  .rule({
    inputs: ['"ACTIVE"', '"PASSED"', "-"],
    outputs: ['"RELEASE"', '"STANDARD_DISTRIBUTION"'],
  })
  .build();

export const xml = Dmn.export(defs);

export default defs;
