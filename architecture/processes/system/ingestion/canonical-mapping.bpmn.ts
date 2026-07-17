import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Canonical Mapping Process
 *
 * Maps partner-specific payloads into canonical medication, lot,
 * location, and movement events
 */

const defs = Bpmn.createProcess("canonical-mapping")
  .name("Canonical Mapping")
  .executable(true)

  .startEvent("mapping-started", { name: "Mapping Started" })

  // Extract partner-specific fields
  .serviceTask("extract-fields", {
    name: "Extract Partner Fields",
    taskType: "field-extractor",
    retries: "3",
  })

  // Map medication identifiers
  .serviceTask("map-medication", {
    name: "Map Medication Identifiers",
    taskType: "medication-mapper",
    retries: "3",
  })

  // Map lot information
  .serviceTask("map-lot", {
    name: "Map Lot Information",
    taskType: "lot-mapper",
    retries: "3",
  })

  // Map location
  .serviceTask("map-location", {
    name: "Map Location",
    taskType: "location-mapper",
    retries: "3",
  })

  // Map movement events
  .serviceTask("map-movement", {
    name: "Map Movement Events",
    taskType: "movement-mapper",
    retries: "3",
  })

  // Validate canonical model
  .serviceTask("validate-canonical", {
    name: "Validate Canonical Model",
    taskType: "canonical-validator",
    retries: "3",
  })

  .endEvent("mapping-complete", { name: "Mapping Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
