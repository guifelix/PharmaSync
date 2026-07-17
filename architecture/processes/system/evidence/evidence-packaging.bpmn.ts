import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Evidence Packaging Process
 *
 * Packages collected evidence into review-ready packages
 */

const defs = Bpmn.createProcess("evidence-packaging")
  .name("Evidence Packaging")
  .executable(true)

  .startEvent("packaging-started", { name: "Packaging Started" })

  // Group evidence by audit scope
  .serviceTask("group-by-scope", {
    name: "Group Evidence by Audit Scope",
    taskType: "evidence-grouper",
    retries: "3",
  })

  // Generate evidence package
  .serviceTask("generate-package", {
    name: "Generate Evidence Package",
    taskType: "package-generator",
    retries: "3",
  })

  // Sign package
  .serviceTask("sign-package", {
    name: "Sign Evidence Package",
    taskType: "package-signer",
    retries: "3",
  })

  // Store package
  .serviceTask("store-package", {
    name: "Store Evidence Package",
    taskType: "package-store",
    retries: "3",
  })

  .endEvent("packaging-complete", { name: "Packaging Complete" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
