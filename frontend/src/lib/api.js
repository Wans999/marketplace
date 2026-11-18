// Carries the PRD section 8 error body ({ error: { code, message, details } }) so pages can branch on status.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error?.message ?? `HTTP ${status}`)
    this.status = status
    this.code = body?.error?.code
    this.details = body?.error?.details ?? []
  }
}

export async function apiGet(path, { signal } = {}) {
  const res = await fetch(`/api${path}`, { signal })
  const body = await res.json().catch(() => null) // e.g. the dev proxy's HTML page when the backend is down
  if (!res.ok) throw new ApiError(res.status, body)
  return body
}
