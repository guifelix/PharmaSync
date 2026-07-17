import env from '#start/env'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

export type WorkforceAuthContext = {
  userId: string
  organizationId: string
  permittedSiteIds: string[]
  roles: string[]
  traceId: string
  subject: string
  issuer: string
  audience: string[]
}

type JwtHeader = {
  alg?: string
  typ?: string
}

type WorkforceClaims = {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  org_id?: string
  organization_id?: string
  site_ids?: string[]
  permitted_site_ids?: string[]
  roles?: string[]
}

export function traceIdFromHeader(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : randomUUID()
}

export function bearerTokenFromHeader(value: string | undefined) {
  const [scheme, token] = value?.split(' ') ?? []
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null
  }

  return token
}

export function signLocalWorkforceToken(
  claims: WorkforceClaims,
  secret = env.get('AUTH_LOCAL_JWT_SECRET')
) {
  const header = encodeJson({ alg: 'HS256', typ: 'JWT' })
  const payload = encodeJson(claims)
  const signature = hmac(`${header}.${payload}`, secret)

  return `${header}.${payload}.${signature}`
}

export function verifyWorkforceToken(token: string, traceId: string) {
  const [encodedHeader, encodedPayload, signature] = token.split('.')
  if (!encodedHeader || !encodedPayload || !signature) {
    return null
  }

  const header = decodeJson<JwtHeader>(encodedHeader)
  const claims = decodeJson<WorkforceClaims>(encodedPayload)
  if (!header || !claims || header.alg !== 'HS256') {
    return null
  }

  const expectedSignature = hmac(
    `${encodedHeader}.${encodedPayload}`,
    env.get('AUTH_LOCAL_JWT_SECRET')
  )
  if (!constantTimeEqual(signature, expectedSignature)) {
    return null
  }

  return contextFromClaims(claims, traceId)
}

export function contextFromClaims(
  claims: WorkforceClaims,
  traceId: string
): WorkforceAuthContext | null {
  const audience = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : []
  const organizationId = claims.org_id ?? claims.organization_id
  const permittedSiteIds = claims.permitted_site_ids ?? claims.site_ids
  const now = Math.floor(Date.now() / 1000)

  if (
    claims.iss !== env.get('OIDC_ISSUER_URL') ||
    !claims.sub ||
    !audience.includes(env.get('OIDC_AUDIENCE')) ||
    !organizationId ||
    !Array.isArray(permittedSiteIds) ||
    !Array.isArray(claims.roles) ||
    (claims.exp !== undefined && claims.exp <= now) ||
    (claims.nbf !== undefined && claims.nbf > now)
  ) {
    return null
  }

  return {
    userId: claims.sub,
    organizationId,
    permittedSiteIds,
    roles: claims.roles,
    traceId,
    subject: claims.sub,
    issuer: claims.iss,
    audience,
  }
}

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function decodeJson<T>(value: string) {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

function hmac(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}
