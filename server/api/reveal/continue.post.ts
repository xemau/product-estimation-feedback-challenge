import { createError } from 'h3'
import { getDatabase } from '../../utils/database'
import { noStore, requireSubmission, sessionState } from '../../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  const row = requireSubmission(event)
  if (row.phase === 'reveal') {
    getDatabase().prepare("UPDATE submissions SET phase = 'feedback' WHERE id = ? AND phase = 'reveal'").run(row.id)
    return sessionState({ ...row, phase: 'feedback' })
  }
  if (row.phase === 'feedback' || row.phase === 'completed') return sessionState(row)
  throw createError({ statusCode: 403, statusMessage: 'Complete all estimates first.' })
})
