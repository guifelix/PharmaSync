workspace "PharmaSync Protocol Phase 1 POC" "C4 model for a buildable proof of concept that integrates pharmaceutical inventory, operational signals, and compliance evidence across a pilot supply chain network." {

    model {
        distributorOps = person "Distribution Operations Manager" "Monitors regional medication stock, movements, shortages, and expiration risk."
        pharmacyOps = person "Hospital or Pharmacy Operations User" "Uses inventory and alert views to coordinate replenishment and medication availability."
        complianceOfficer = person "Compliance Officer" "Reviews audit evidence, policy exceptions, and regulatory reports."
        integrationEngineer = person "Partner Integration Engineer" "Configures adapters and resolves partner feed issues."
        manufacturer = softwareSystem "Manufacturer ERP/WMS" "External manufacturer or distributor systems that provide shipment and lot information."
        hospitalEhr = softwareSystem "Hospital EHR or Pharmacy System" "External facility systems that provide dispense, inventory, and utilization data."
        governmentProgram = softwareSystem "Government Medication Program" "VA, SNS, DoD, or state medication program systems participating in the pilot."
        auditStakeholders = softwareSystem "Audit and Governance Stakeholders" "Internal governance teams, auditors, and regulatory reviewers who receive evidence packages from authorized users."
        identityProvider = softwareSystem "Identity Provider" "OIDC/SAML identity provider for workforce and partner authentication."

        pharmaSync = softwareSystem "PharmaSync Protocol Phase 1 POC" "Integration-first pilot system for near-real-time pharmaceutical inventory visibility, shortage/expiry signals, and compliance evidence." {
            webApp = container "Operations Web App" "Browser dashboard for inventory, alerts, recommendations, integration health, and compliance evidence views." "Vue 3 / Vite / Nuxt UI / Reka UI"
            apiGateway = container "API Gateway" "Authenticated entry point for users, partner APIs, and internal service APIs." "AdonisJS / REST / OpenAPI"
            inventoryApi = container "Inventory API" "Manages medications, lots, locations, stock levels, expirations, inventory movements, and corrections." "AdonisJS / Lucid ORM / PostgreSQL" {
                inventoryApiComponent = component "Inventory Domain Component" "Medication, lot, expiration, stock, and inventory movement business rules. Processes: movement-recording.bpmn.ts, correction-workflow.bpmn.ts." "Domain module"
                replenishmentComponent = component "Replenishment Component" "Threshold checks, reorder recommendations, and inventory allocation support. Processes: stock-adjustment.bpmn.ts, dmn/inventory/allocation-rules.dmn.ts." "Domain module"
                auditPublisherComponent = component "Audit Publisher Component" "Publishes auditable inventory actions and corrections. Process: evidence-collection.bpmn.ts." "Messaging module"
                inventoryRestComponent = component "Inventory REST Controller" "REST endpoints for inventory queries, corrections, and movement ingestion." "API module"
            }
            integrationGateway = container "Integration Gateway" "Ingests partner feeds, validates payloads, maps to the canonical model, handles idempotency, quarantines failures, and publishes accepted events. Processes: system/ingestion/*." "Workers / ETL adapters" {
                feedAdapterComponent = component "Partner Feed Adapter Component" "Receives CSV, JSON API, and mock healthcare-format inventory feeds. Process: feed-ingestion.bpmn.ts." "Adapter module"
                validationComponent = component "Payload Validation Component" "Validates schema, required fields, data types, and business constraints before ingestion. Process: feed-validation.bpmn.ts." "Validation module"
                canonicalMapperComponent = component "Canonical Mapping Component" "Maps partner-specific payloads into canonical medication, lot, location, and movement events. Process: canonical-mapping.bpmn.ts." "Mapping module"
                idempotencyComponent = component "Idempotency Component" "Deduplicates repeated partner submissions using source, payload hash, and partner event identifiers. Process: idempotency-check.bpmn.ts." "Reliability module"
                quarantineComponent = component "Quarantine Component" "Stores rejected payloads with error reasons, source metadata, and trace IDs for remediation. Processes: quarantine-review.bpmn.ts, payload-remediation.bpmn.ts." "Exception handling module"
                integrationEventPublisherComponent = component "Integration Event Publisher Component" "Publishes accepted integration and inventory events through the workflow queue/outbox. Process: outbox-publisher.bpmn.ts." "Messaging module"
            }
            signalService = container "Signal Service" "Calculates shortage, overstock, expiration-risk, and replenishment signals using transparent rules for the POC. Processes: system/signals/*, dmn/signals/*." "TypeScript worker / rules engine"
            complianceService = container "Compliance Evidence Service" "Captures audit evidence, policy findings, trace IDs, and evidence packages for authorized review. Processes: system/evidence/*, dmn/compliance/*." "AdonisJS service module"
            workflowQueue = container "Workflow Queue and Outbox" "Reliably processes inventory, integration, signal, and audit events without requiring national-scale streaming infrastructure. Processes: system/outbox/*." "PostgreSQL outbox + worker queue"
            database = container "Operational Database" "Stores canonical inventory, locations, users, permissions, policies, and reporting state." "PostgreSQL"
            objectStorage = container "Evidence and Payload Storage" "Stores import archives, generated reports, and audit evidence packages." "S3-compatible object storage"
        }

        futureExpansion = softwareSystem "Future PharmaSync Platform Expansion" "Roadmap capabilities after the Phase 1 POC: sales-representative training, approval workflow support, advanced forecasting, and national-scale event streaming."

        distributorOps -> webApp "Views stock, shipment, shortages, and expiration risks" "HTTPS"
        pharmacyOps -> webApp "Reviews available medication and replenishment needs" "HTTPS"
        complianceOfficer -> webApp "Reviews evidence and exports reports" "HTTPS"
        integrationEngineer -> webApp "Monitors integrations and mapping failures" "HTTPS"

        webApp -> apiGateway "Calls platform APIs" "JSON/HTTPS"
        apiGateway -> inventoryApi "Routes inventory commands and queries" "JSON/HTTPS"
        apiGateway -> complianceService "Routes compliance and report requests" "JSON/HTTPS"
        apiGateway -> identityProvider "Authenticates users and partner clients" "OIDC/SAML"

        manufacturer -> integrationGateway "Sends shipment, ASN, lot, and inventory feeds" "API/File"
        hospitalEhr -> integrationGateway "Sends facility stock, dispense, and utilization feeds" "API/File/HL7/FHIR-style"
        governmentProgram -> integrationGateway "Sends program inventory and allocation feeds" "API/File"

        integrationGateway -> inventoryApi "Submits normalized inventory events" "JSON/HTTPS"
        integrationGateway -> objectStorage "Archives raw and normalized payloads" "Object API"
        integrationGateway -> workflowQueue "Publishes integration events and remediation tasks" "Outbox/events"

        inventoryApi -> database "Reads and writes canonical inventory state" "SQL/TLS"
        inventoryApi -> workflowQueue "Publishes inventory movement and correction events" "Outbox/events"
        inventoryApi -> objectStorage "Stores bulk import/export artifacts" "Object API"

        signalService -> workflowQueue "Consumes inventory and dispense events" "Events"
        signalService -> database "Reads history and writes risk signals" "SQL/TLS"
        signalService -> inventoryApi "Publishes replenishment recommendations" "JSON/HTTPS"

        complianceService -> workflowQueue "Consumes auditable platform events" "Events"
        complianceService -> database "Stores policies, findings, and report metadata" "SQL/TLS"
        complianceService -> objectStorage "Stores evidence packages and generated reports" "Object API"
        complianceService -> auditStakeholders "Produces evidence packages for authorized review" "Secure file/API"
        pharmaSync -> futureExpansion "Expands after pilot evidence is established" "Roadmap"

        inventoryRestComponent -> inventoryApiComponent "Executes inventory commands"
        inventoryRestComponent -> replenishmentComponent "Requests thresholds and recommendations"
        inventoryApiComponent -> database "Persists medication, lot, location, and movement state"
        replenishmentComponent -> database "Reads stock, history, and thresholds"
        inventoryApiComponent -> auditPublisherComponent "Emits auditable actions"
        replenishmentComponent -> auditPublisherComponent "Emits recommendation events"
        auditPublisherComponent -> workflowQueue "Publishes inventory and audit events"

        feedAdapterComponent -> validationComponent "Submits raw partner payloads"
        validationComponent -> canonicalMapperComponent "Sends valid payloads"
        validationComponent -> quarantineComponent "Sends invalid payloads"
        canonicalMapperComponent -> idempotencyComponent "Sends canonical events"
        idempotencyComponent -> integrationEventPublisherComponent "Publishes new canonical events"
        idempotencyComponent -> quarantineComponent "Sends duplicates or conflicts"
        quarantineComponent -> objectStorage "Stores rejected payloads and trace metadata"
        integrationEventPublisherComponent -> workflowQueue "Publishes integration events"
        integrationEventPublisherComponent -> inventoryApi "Submits accepted inventory events"

        pilot = deploymentEnvironment "Pilot" {
            cloud = deploymentNode "Pilot Cloud Environment" "Private cloud or HIPAA-capable cloud account" "Cloud" {
                appNode = deploymentNode "Application Runtime" "Container runtime for app and APIs" "Containers" {
                    webAppInstance = containerInstance webApp
                    apiGatewayInstance = containerInstance apiGateway
                    inventoryApiInstance = containerInstance inventoryApi
                    integrationGatewayInstance = containerInstance integrationGateway
                    signalServiceInstance = containerInstance signalService
                    complianceServiceInstance = containerInstance complianceService
                }
                dataNode = deploymentNode "Data Runtime" "Managed data services" "Managed services" {
                    databaseInstance = containerInstance database
                    workflowQueueInstance = containerInstance workflowQueue
                    objectStorageInstance = containerInstance objectStorage
                }
            }
        }
    }

    views {
        systemContext pharmaSync "pharmasync-context" "System context for the PharmaSync Protocol Phase 1 POC." {
            include *
            autoLayout lr
        }

        container pharmaSync "pharmasync-containers" "Container view for the PharmaSync Protocol Phase 1 POC." {
            include *
            autoLayout lr
        }

        component inventoryApi "inventory-api-components" "Component view for the Inventory API container." {
            include *
            autoLayout lr
        }

        component integrationGateway "integration-gateway-components" "Component view for the Integration Gateway, the core proof point for the POC." {
            include *
            autoLayout lr
        }

        dynamic pharmaSync "inventory-ingestion-flow" "Inventory ingestion and risk signal flow." {
            manufacturer -> integrationGateway "1. Sends shipment and lot feed"
            integrationGateway -> objectStorage "2. Archives raw payload"
            integrationGateway -> inventoryApi "3. Submits normalized inventory event"
            inventoryApi -> database "4. Updates canonical inventory"
            inventoryApi -> workflowQueue "5. Publishes inventory event"
            signalService -> workflowQueue "6. Consumes inventory event"
            signalService -> database "7. Writes risk signal"
            webApp -> apiGateway "8. Requests updated inventory and alerts"
            apiGateway -> inventoryApi "9. Reads current inventory"
            autoLayout lr
        }

        deployment pharmaSync "Pilot" "pharmasync-pilot-deployment" "Pilot deployment view." {
            include *
            autoLayout lr
        }

        styles {
            element "Person" {
                shape person
                background #084c61
                color #ffffff
            }
            element "Software System" {
                background #177e89
                color #ffffff
            }
            element "Container" {
                background #2d6a4f
                color #ffffff
            }
            element "Component" {
                background #6c757d
                color #ffffff
            }
            element "Database" {
                shape cylinder
            }
        }
    }
}
