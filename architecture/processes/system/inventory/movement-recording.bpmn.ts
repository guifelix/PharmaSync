import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Movement Recording Process
 *
 * Records inventory movements (receipts, dispenses, corrections, transfers)
 */

const defs = Bpmn.createProcess("movement-recording")
  .name("Movement Recording")
  .executable(true)

  .startEvent("recording-started", { name: "Recording Started" })

  // Validate movement data
  .serviceTask("validate-movement", {
    name: "Validate Movement Data",
    taskType: "movement-validator",
    retries: "3",
  })

  // Record receipt movement
  .serviceTask("record-receipt", {
    name: "Record Receipt Movement",
    taskType: "receipt-recorder",
    retries: "3",
  })

  // Record dispense movement
  .serviceTask("record-dispense", {
    name: "Record Dispense Movement",
    taskType: "dispense-recorder",
    retries: "3",
  })

  // Record correction movement
  .serviceTask("record-correction", {
    name: "Record Correction Movement",
    taskType: "correction-recorder",
    retries: "3",
  })

  // Record transfer movement
  .serviceTask("record-transfer", {
    name: "Record Transfer Movement",
    taskType: "transfer-recorder",
    retries: "3",
  })

  // Emit outbox event
  .serviceTask("emit-outbox", {
    name: "Emit Outbox Event",
    taskType: "outbox-emitter",
    retries: "3",
  })

  .endEvent("recording-complete", { name: "Recording Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
