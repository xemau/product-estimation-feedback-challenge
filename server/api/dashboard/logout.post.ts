import { closeDashboardSession } from '../../utils/dashboardAuth'
import { noStore } from '../../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  closeDashboardSession(event)
  return { authenticated: false }
})
