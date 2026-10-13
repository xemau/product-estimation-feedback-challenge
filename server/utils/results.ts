import type { DashboardResults, ReasonKey } from '../../shared/types/experiment'
import { products, reasons } from './catalog'
import { EXPERIMENT_VERSION, getDatabase, type SubmissionRow } from './database'

const round = (value: number) => Math.round(value * 100) / 100

export function aggregateResults(excludeExplanationId?: string): DashboardResults {
  const db = getDatabase()
  const participantCount = (db.prepare('SELECT COUNT(*) AS count FROM submissions WHERE experiment_version = ?').get(EXPERIMENT_VERSION) as { count: number }).count
  const completed = db.prepare("SELECT * FROM submissions WHERE experiment_version = ? AND phase = 'completed'").all(EXPERIMENT_VERSION) as unknown as SubmissionRow[]
  const completedCount = completed.length
  const categories = products.map((product) => {
    const ordinaryAverage = completedCount === 0 ? 0 : round(completed.reduce((sum, row) => sum + row[`${product.key}_ordinary`]!, 0) / completedCount)
    const premiumAverage = completedCount === 0 ? 0 : round(completed.reduce((sum, row) => sum + row[`${product.key}_premium`]!, 0) / completedCount)
    const difference = round(premiumAverage - ordinaryAverage)
    return {
      category: product.key,
      categoryName: product.categoryName,
      ordinaryAverage,
      premiumAverage,
      difference,
      percentageDifference: ordinaryAverage === 0 ? null : round(difference / ordinaryAverage * 100)
    }
  })
  const counts = new Map<ReasonKey, number>()
  for (const row of completed) {
    if (row.reason) counts.set(row.reason, (counts.get(row.reason) || 0) + 1)
  }
  const explanations = excludeExplanationId
    ? db.prepare(`
      SELECT id, explanation AS text, completed_at AS createdAt FROM submissions
      WHERE experiment_version = ? AND phase = 'completed' AND explanation IS NOT NULL AND id != ?
      ORDER BY completed_at DESC, id DESC LIMIT 50
    `).all(EXPERIMENT_VERSION, excludeExplanationId)
    : db.prepare(`
      SELECT id, explanation AS text, completed_at AS createdAt FROM submissions
      WHERE experiment_version = ? AND phase = 'completed' AND explanation IS NOT NULL
      ORDER BY completed_at DESC, id DESC LIMIT 50
    `).all(EXPERIMENT_VERSION)

  return {
    participantCount,
    completedCount,
    categories,
    reasons: reasons.map((reason) => ({ ...reason, count: counts.get(reason.key) || 0 })),
    explanations: explanations as DashboardResults['explanations']
  }
}
