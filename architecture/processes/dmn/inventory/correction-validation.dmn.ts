import { Dmn } from "@bpmnkit/core";

/**
 * Correction Validation Decision Table
 *
 * Validates inventory corrections before applying
 */

const defs = Dmn.createDecisionTable("correction-validation")
  .name("Correction Validation Decision")
  .hitPolicy("FIRST")
  .input({
    label: "Correction Type",
    expression: "correctionType",
    typeRef: "string",
  })
  .input({
    label: "Quantity Delta",
    expression: "quantityDelta",
    typeRef: "number",
  })
  .input({ label: "Actor Role", expression: "actorRole", typeRef: "string" })
  .input({
    label: "Requires Approval",
    expression: "requiresApproval",
    typeRef: "boolean",
  })
  .output({
    label: "Validation Result",
    name: "validationResult",
    typeRef: "string",
  })
  .output({
    label: "Required Approvers",
    name: "requiredApprovers",
    typeRef: "string",
  })
  .rule({
    inputs: ['"RECEIPT"', "<= 0", "-", "-"],
    outputs: ['"REJECTED"', '"NONE"'],
  })
  .rule({
    inputs: ['"DISPENSE"', "< 0", "-", "-"],
    outputs: ['"REJECTED"', '"NONE"'],
  })
  .rule({
    inputs: ['"CORRECTION"', "> 1000", "-", "true"],
    outputs: ['"REQUIRES_APPROVAL"', '"PHARMACY_MANAGER,COMPLIANCE_OFFICER"'],
  })
  .rule({
    inputs: ['"CORRECTION"', "> 1000", "-", "false"],
    outputs: ['"REJECTED"', '"NONE"'],
  })
  .rule({
    inputs: ["-", "-", '"PHARMACIST"', "-"],
    outputs: ['"AUTO_APPROVED"', '"NONE"'],
  })
  .rule({
    inputs: ["-", "-", '"INVENTORY_MANAGER"', "-"],
    outputs: ['"AUTO_APPROVED"', '"NONE"'],
  })
  .rule({
    inputs: ["-", "-", "-", "-"],
    outputs: ['"REQUIRES_APPROVAL"', '"PHARMACY_MANAGER"'],
  })
  .build();

export const xml = Dmn.export(defs);

export default defs;
