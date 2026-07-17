import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Retry Handling Process
 *
 * Handles retry logic with exponential backoff
 */

const defs = Bpmn.createProcess("retry-handling")
  .name("Retry Handling")
  .executable(true)

  .startEvent("retry-started", { name: "Retry Started" })

  // Calculate retry delay
  .serviceTask("calculate-delay", {
    name: "Calculate Retry Delay",
    taskType: "delay-calculator",
    retries: "3",
  })

  // Wait for delay
  .intermediateCatchEvent("wait-delay", {
    name: "Wait for Retry Delay",
    timerDuration: "PT1M",
  })

  // Retry the operation
  .serviceTask("retry-operation", {
    name: "Retry Operation",
    taskType: "operation-retrier",
    retries: "3",
  })

  .endEvent("retry-complete", { name: "Retry Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
