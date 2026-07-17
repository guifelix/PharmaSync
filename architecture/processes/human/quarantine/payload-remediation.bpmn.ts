import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Payload Remediation Process
 *
 * Human remediation of quarantined payloads
 */

const defs = Bpmn.createProcess("payload-remediation")
  .name("Payload Remediation")
  .executable(true)

  .startEvent("remediation-started", { name: "Remediation Started" })

  // Load original payload
  .serviceTask("load-payload", {
    name: "Load Original Payload",
    taskType: "payload-loader",
    retries: "3",
  })

  // Present remediation options
  .userTask("select-remediation", {
    name: "Select Remediation Action",
    formId: "remediation-options-form",
    zeebeUserTask: true,
  })

  // Apply remediation
  .serviceTask("apply-remediation", {
    name: "Apply Remediation",
    taskType: "remediation-applier",
    retries: "3",
  })

  // Validate remediated payload
  .serviceTask("validate-remediated", {
    name: "Validate Remediated Payload",
    taskType: "remediated-validator",
    retries: "3",
  })

  // Gateway: Validation result
  .exclusiveGateway("validation-result", { name: "Valid?" })
  .branch("valid", (b) =>
    b
      .condition("= valid")
      .serviceTask("reprocess", {
        name: "Reprocess Payload",
        taskType: "payload-reprocessor",
        retries: "3",
      })
      .endEvent("reprocessed", { name: "Reprocessed" }),
  )
  .branch("invalid", (b) =>
    b.condition("= !valid").userTask("retry-remediation", {
      name: "Retry Remediation",
      formId: "remediation-retry-form",
      zeebeUserTask: true,
    }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
