import { Dmn } from "@bpmnkit/core";

/**
 * Audit Trigger Decision Table
 *
 * Determines when an audit should be triggered based on:
 * - Event type
 * - Severity
 * - Frequency
 */

const defs = Dmn.createDecisionTable("audit-trigger")
  .name("Audit Trigger Decision")
  .hitPolicy("FIRST")
  .input({ label: "Event Type", expression: "eventType", typeRef: "string" })
  .input({ label: "Severity", expression: "severity", typeRef: "string" })
  .input({
    label: "Frequency (24h)",
    expression: "frequency24h",
    typeRef: "number",
  })
  .output({ label: "Trigger Audit", name: "triggerAudit", typeRef: "boolean" })
  .output({ label: "Audit Type", name: "auditType", typeRef: "string" })
  .rule({
    inputs: ['"CORRECTION"', '"HIGH"', ">= 3"],
    outputs: ["true", '"FULL_AUDIT"'],
  })
  .rule({
    inputs: ['"QUARANTINE"', '"CRITICAL"', ">= 1"],
    outputs: ["true", '"FULL_AUDIT"'],
  })
  .rule({
    inputs: ['"CORRECTION"', '"MEDIUM"', ">= 5"],
    outputs: ["true", '"TARGETED_AUDIT"'],
  })
  .rule({
    inputs: ['"DISPENSE"', '"HIGH"', ">= 10"],
    outputs: ["true", '"TARGETED_AUDIT"'],
  })
  .rule({
    inputs: ['"RECEIPT"', '"HIGH"', ">= 5"],
    outputs: ["true", '"TARGETED_AUDIT"'],
  })
  .rule({ inputs: ["-", "-", "-"], outputs: ["false", '"NONE"'] })
  .build();

export const xml = Dmn.export(defs);

export default defs;
