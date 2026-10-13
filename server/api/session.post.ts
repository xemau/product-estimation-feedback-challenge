import { createError, readBody } from 'h3'
import { createSubmission, currentSubmission, noStore, sessionState } from '../utils/session'

export default defineEventHandler(async (event) => {
  noStore(event)
  const body = await readBody(event).catch(() => ({})) as { restart?: unknown }
  if (body && (typeof body !== 'object' || (body.restart !== undefined && typeof body.restart !== 'boolean'))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request.' })
  }
  const existing = currentSubmission(event)
  if (body?.restart && existing?.phase !== 'completed') {
    throw createError({ statusCode: 403, statusMessage: 'Finish your current experiment first.' })
  }
  return sessionState(body?.restart ? createSubmission(event) : existing || createSubmission(event))
})
