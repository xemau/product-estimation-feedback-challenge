import { createError } from 'h3'
import { products, reasons } from '../utils/catalog'
import { getDatabase, type SubmissionRow } from '../utils/database'
import { noStore, requireSubmission } from '../utils/session'
import type { CategoryResult, CommunityResults, ReasonKey } from '../../shared/types/experiment'

const round = (value: number) => Math.round(value * 100) / 100

export default defineEventHandler((event): CommunityResults => {
  noStore(event)
  const me = requireSubmission(event)
  if (me.phase !== 'completed') {
    throw createError({ statusCode: 403, statusMessage: 'Submit feedback to unlock results.' })
  }

  const db = getDatabase()
  const participantCount = (db.prepare('SELECT COUNT(*) AS count FROM submissions').get() as { count: number }).count
  const completed = db.prepare("SELECT * FROM submissions WHERE phase = 'completed'").all() as unknown as SubmissionRow[]
  const completedCount = completed.length
  const categories: CategoryResult[] = products.map((product) => {
    const ordinaryAverage = completedCount === 0 ? 0 : round(completed.reduce((sum, row) => sum + row[`${product.key}_ordinary`]!, 0) / completedCount)
    const premiumAverage = completedCount === 0 ? 0 : round(completed.reduce((sum, row) => sum + row[`${product.key}_premium`]!, 0) / completedCount)
    const difference = round(premiumAverage - ordinaryAverage)
    return {
      category: product.key,
      categoryName: product.categoryName,
      ordinaryAverage,
      premiumAverage,
      difference,
      percentageDifference: ordinaryAverage === 0 ? null : round(difference / ordinaryAverage * 100),
      myOrdinary: me[`${product.key}_ordinary`]!,
      myPremium: me[`${product.key}_premium`]!
    }
  })
  const counts = new Map<ReasonKey, number>()
  for (const row of completed) {
    if (row.reason) counts.set(row.reason, (counts.get(row.reason) || 0) + 1)
  }
  const explanations = db.prepare(`
    SELECT id, explanation AS text, completed_at AS createdAt FROM submissions
    WHERE phase = 'completed' AND explanation IS NOT NULL AND id != ?
    ORDER BY completed_at DESC, id DESC LIMIT 50
  `).all(me.id) as unknown as CommunityResults['explanations']

  return {
    participantCount,
    completedCount,
    categories,
    reasons: reasons.map((reason) => ({ ...reason, count: counts.get(reason.key) || 0 })),
    explanations
  }
})
