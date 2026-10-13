import { createError } from 'h3'
import { noStore, requireSubmission } from '../utils/session'
import { aggregateResults } from '../utils/results'
import type { CommunityResults } from '../../shared/types/experiment'

export default defineEventHandler((event): CommunityResults => {
  noStore(event)
  const me = requireSubmission(event)
  if (me.phase !== 'completed') {
    throw createError({ statusCode: 403, statusMessage: 'Submit feedback to unlock results.' })
  }

  const results = aggregateResults(me.id)
  return {
    ...results,
    categories: results.categories.map((category) => ({
      ...category,
      myOrdinary: me[`${category.category}_ordinary`]!,
      myPremium: me[`${category.category}_premium`]!
    }))
  }
})
