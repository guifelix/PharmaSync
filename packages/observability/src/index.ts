export type TraceContext = {
  traceId: string
  actorId?: string
  orgId?: string
}

export function createLogFields(context: TraceContext): Record<string, string> {
  return Object.fromEntries(
    Object.entries(context).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}
