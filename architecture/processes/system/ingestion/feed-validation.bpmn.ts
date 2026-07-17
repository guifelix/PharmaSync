import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Feed Validation Process
 *
 * Validates partner feed payload against schema, required fields,
 * data types, and business constraints
 */

const defs = Bpmn.createProcess("feed-validation")
  .name("Feed Payload Validation")
  .executable(true)

  .startEvent("validation-started", { name: "Validation Started" })

  // Schema validation
  .serviceTask("validate-schema", {
    name: "Validate Schema",
    taskType: "schema-validator",
    retries: "3",
  })

  // Required fields validation
  .serviceTask("validate-required-fields", {
    name: "Validate Required Fields",
    taskType: "required-fields-validator",
    retries: "3",
  })

  // Data types validation
  .serviceTask("validate-data-types", {
    name: "Validate Data Types",
    taskType: "data-types-validator",
    retries: "3",
  })

  // Business constraints validation
  .serviceTask("validate-business-constraints", {
    name: "Validate Business Constraints",
    taskType: "business-constraints-validator",
    retries: "3",
  })

  // Gateway: Validation result
  .exclusiveGateway("validation-result", { name: "All Valid?" })
  .branch("valid", (b) =>
    b
      .condition("= valid")
      .endEvent("validation-passed", { name: "Validation Passed" }),
  )
  .branch("invalid", (b) =>
    b
      .condition("= invalid")
      .serviceTask("collect-errors", {
        name: "Collect Validation Errors",
        taskType: "error-collector",
        retries: "3",
      })
      .endEvent("validation-failed", { name: "Validation Failed" }),
  )

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
