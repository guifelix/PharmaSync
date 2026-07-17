---
id: TASK-019
title: Model PharmaSync processes with bpmnkit
status: Done
assignee:
  - '@felix'
created_date: '2026-07-17 18:23'
updated_date: '2026-07-17 20:54'
labels:
  - bpmn
  - architecture
  - integration
  - domain
dependencies: []
priority: high
ordinal: 66000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create BPMN 2.0 models for key PharmaSync processes using @bpmnkit/core: Integration Gateway ingestion flow, Signal Service rules, Compliance evidence workflow, and Inventory ingestion flow. Models should be executable, version-controlled, and renderable in the ops dashboard via @bpmnkit/canvas.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 bpmnkit/core and bpmnkit/canvas added to integration package
- [x] #2 Integration Gateway BPMN model created (feed→validate→map→idempotent→publish)
- [x] #3 Signal Service BPMN model created (shortage/expiry/replenishment rules)
- [x] #4 Compliance evidence workflow BPMN model created
- [x] #5 Inventory ingestion flow BPMN model created (matches dynamic view)
- [x] #6 Models export valid BPMN 2.0 XML with Zeebe extensions
- [x] #7 Models render in Vue dashboard via @bpmnkit/canvas
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Fix existing BPMN/DMN models with type errors (branch API issues, DMN API issues, exportSvg for DMN)
2. Complete remaining models: regulatory models, remaining DMN tables
3. Fix integration-gateway BPMN model that was started
4. Check all AC items: #2 (Integration Gateway), #3 (Signal Service), #4 (Compliance), #5 (Inventory), #6 (valid XML), #7 (Vue dashboard)
5. Create Vue dashboard component using @bpmnkit/canvas for AC #7
6. Verify with pnpm typecheck and generate XML output
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Feed ingestion BPMN model created at architecture/processes/system/ingestion/feed-ingestion.bpmn.ts - generates valid BPMN 2.0 XML with Zeebe extensions, renders SVG with auto-layout. Ready for next batch of Phase 1 models.

AC #7: Built BpmnViewer Vue dashboard at tools/bpmn-viewer/ using @bpmnkit/canvas. Vue components: App.vue (sidebar tree + search + theme toggle), ModelCanvas.vue (BpmnCanvas wrapper with xml fetch). Models manifest at tools/bpmn-viewer/public/models.json (56 entries) with per-model XML. Build verified: pnpm build passes (85 modules, 1.05s). Added tools/* to pnpm-workspace.yaml.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
All 56 BPMN/DMN models created under architecture/processes/, validated (56/56 pass XML export). Vue BpmnViewer dashboard at tools/bpmn-viewer/ renders all models via @bpmnkit/canvas. Build verified.
<!-- SECTION:FINAL_SUMMARY:END -->
