import { requireDashboardAccess } from '../../utils/dashboardAuth'
import { aggregateResults } from '../../utils/results'
import { noStore } from '../../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  requireDashboardAccess(event)
  return aggregateResults()
})
