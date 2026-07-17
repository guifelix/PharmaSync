---
id: TASK-020
title: Define BPMN process directory structure under architecture/processes
status: Done
assignee: []
created_date: '2026-07-17 18:43'
updated_date: '2026-07-17 20:42'
labels:
  - architecture
  - bpmn
  - structure
dependencies: []
priority: high
ordinal: 67000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Define the folder organization for BPMN process models under architecture/processes/ to support all process categories (system, human, dmn, cross-org, regulatory, operational) with clear separation by category and subdomain. This is a prerequisite for TASK-019 model creation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Directory structure defined with categories: system/, human/, dmn/, cross-org/, regulatory/, operational/
- [x] #2 Each category has logical subdomains (e.g., system/ingestion/, system/signals/, human/quarantine/)
- [x] #3 Structure documented in architecture/processes/README.md
- [x] #4 Aligns with Structurizr/D2 conventions in architecture/
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Directory structure created under architecture/processes/ with 6 categories (system, human, dmn, cross-org, regulatory, operational) and documented in architecture/processes/README.md. Phase 1 scope defined with 11 process areas. Ready for TASK-019 model creation.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Defined BPMN process directory structure under architecture/processes/ with 6 categories (system, human, dmn, cross-org, regulatory, operational), each with logical subdomains. Documented in architecture/processes/README.md with naming conventions, Phase 1 scope, and cross-references to Structurizr/D2.
<!-- SECTION:FINAL_SUMMARY:END -->
