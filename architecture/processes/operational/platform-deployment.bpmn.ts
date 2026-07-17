import { Bpmn, exportSvg } from "@bpmnkit/core";

const defs = Bpmn.createProcess("platform-deployment")
  .name("Platform Deployment")
  .executable(true)
  .startEvent("deploy-req", { name: "Deployment Requested" })
  .serviceTask("build-artifact", {
    name: "Build Artifact",
    taskType: "artifact-builder",
    retries: "3",
  })
  .serviceTask("run-tests", {
    name: "Run Automated Tests",
    taskType: "test-runner",
    retries: "3",
  })
  .exclusiveGateway("tests-pass", { name: "Tests Pass?" })
  .branch("pass", (b) =>
    b
      .condition("= passed")
      .userTask("approve-deploy", {
        name: "Approve Deployment",
        formId: "deploy-approval-form",
        zeebeUserTask: true,
      })
      .serviceTask("deploy-staging", {
        name: "Deploy to Staging",
        taskType: "staging-deployer",
        retries: "3",
      })
      .serviceTask("verify-staging", {
        name: "Verify Staging",
        taskType: "staging-verifier",
        retries: "3",
      })
      .serviceTask("deploy-production", {
        name: "Deploy to Production",
        taskType: "production-deployer",
        retries: "3",
      })
      .endEvent("deployed", { name: "Deployed to Production" }),
  )
  .branch("fail", (b) =>
    b
      .condition("= !passed")
      .serviceTask("fix-issues", {
        name: "Fix Build Issues",
        taskType: "build-fixer",
        retries: "3",
      })
      .endEvent("fix-needed", { name: "Fixes Needed" }),
  )
  .build();

export const xml = Bpmn.export(defs);
export const svg = await exportSvg(defs);
export default defs;
