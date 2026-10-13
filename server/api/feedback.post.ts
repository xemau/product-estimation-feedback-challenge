import { createError, readBody } from 'h3'
import { reasons } from '../utils/catalog'
import { getDatabase } from '../utils/database'
import { noStore, requireSubmission, sessionState } from '../utils/session'
import type { ReasonKey } from '../../shared/types/experiment'

export default defineEventHandler(async (event) => {
  noStore(event)
  const body = await readBody(event) as { reason?: unknown; explanation?: unknown }
  const explanation = typeof body?.explanation === 'string' ? body.explanation.trim() : ''
  if (!body || typeof body.reason !== 'string' ||
    !reasons.some((reason) => reason.key === body.reason) ||
    (body.explanation !== undefined && typeof body.explanation !== 'string') ||
    Array.from(explanation).length > 200) {
    throw createError({ statusCode: 400, statusMessage: 'Select a reason and keep your note under 200 characters.' })
  }

  const row = requireSubmission(event)
  if (row.phase === 'completed') return sessionState(row)
  if (row.phase !== 'feedback' || row.step_index !== 6) {
    throw createError({ statusCode: 403, statusMessage: 'View the reveal before submitting feedback.' })
  }

  getDatabase().prepare(`
    UPDATE submissions SET reason = ?, explanation = ?, completed_at = ?, phase = 'completed'
    WHERE id = ? AND phase = 'feedback'
  `).run(body.reason as ReasonKey, explanation || null, new Date().toISOString(), row.id)
  return sessionState({ ...row, phase: 'completed' })
})
