import { Bpmn, exportSvg } from "@bpmnkit/core";

/**
 * Recall Initiation Process
 *
 * Handles product recall initiation, FDA notification based on recall class,
 * partner notification, and return tracking
 */

const defs = Bpmn.createProcess("recall-initiation")
  .name("Recall Initiation")
  .executable(true)

  .startEvent("issue-detected", { name: "Issue Detected" })

  // Assess severity of the issue
  .serviceTask("assess-severity", {
    name: "Assess Severity",
    taskType: "severity-assessor",
    retries: "3",
  })

  // Gateway: Recall Class?
  .exclusiveGateway("classification", { name: "Recall Class?" })
  .branch("class1", (b) =>
    b
      .condition('= recallClass = "I"')
      .serviceTask("notify-fda-urgent", {
        name: "Notify FDA - Urgent",
        taskType: "fda-urgent-notifier",
        retries: "3",
      })
      .endEvent("fda-notified-class1", { name: "FDA Notified - Class I" }),
  )
  .branch("class2", (b) =>
    b
      .condition('= recallClass = "II"')
      .serviceTask("notify-fda-standard", {
        name: "Notify FDA - Standard",
        taskType: "fda-standard-notifier",
        retries: "3",
      })
      .endEvent("fda-notified-class2", { name: "FDA Notified - Class II" }),
  )
  .branch("class3", (b) =>
    b
      .condition('= recallClass = "III"')
      .serviceTask("notify-fda-minimal", {
        name: "Notify FDA - Minimal",
        taskType: "fda-minimal-notifier",
        retries: "3",
      })
      .endEvent("fda-notified-class3", { name: "FDA Notified - Class III" }),
  )

  // Outside branches - notify partners and track returns
  .serviceTask("notify-partners", {
    name: "Notify Partners",
    taskType: "partner-notifier",
    retries: "3",
  })
  .serviceTask("track-returns", {
    name: "Track Returns",
    taskType: "returns-tracker",
    retries: "3",
  })
  .endEvent("recall-active", { name: "Recall Active" })

  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);

export default defs;
