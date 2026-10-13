import { hasDashboardAccess } from '../../utils/dashboardAuth'
import { noStore } from '../../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  return { authenticated: hasDashboardAccess(event) }
})
