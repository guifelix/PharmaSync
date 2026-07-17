import type { InventoryMovement } from "@pharmasync/domain";
export * from "./outbox.js";

export type PartnerFeedFormat = "csv" | "json";

export type PartnerFeedReasonCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_DATE"
  | "INVALID_QUANTITY"
  | "UNKNOWN_SITE"
  | "UNKNOWN_PRODUCT"
  | "INVALID_EVENT_TYPE"
  | "DUPLICATE_EVENT"
  | "CONFLICTING_DUPLICATE";

export type PartnerFeedReasonCategory =
  "schema" | "reference-data" | "business-rule" | "duplicate";

export type PartnerFeedEnvelope = {
  partnerId: string;
  format: PartnerFeedFormat;
  receivedAt: string;
  payloadHash: string;
  rawPayloadUri?: string;
};

export type CanonicalInventoryEvent = {
  traceId: string;
  partnerId: string;
  idempotencyKey: string;
  movement: InventoryMovement;
};

export type QuarantineReason = {
  code: PartnerFeedReasonCode;
  category: PartnerFeedReasonCategory;
  fieldPath: string;
  message: string;
};

export type QuarantineRecord = {
  id: string;
  organizationId: string;
  siteId: string | null;
  partnerId: string;
  feedId: string;
  traceId: string;
  payloadHash: string;
  reasonCode: PartnerFeedReasonCode;
  reasonCategory: PartnerFeedReasonCategory;
  reasonMessage: string;
  fieldPath: string;
  sourceEventId: string | null;
  rawPayloadUri: string;
  status: "quarantined";
  createdAt: string;
};
