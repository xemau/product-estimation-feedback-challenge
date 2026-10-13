import { createError, readBody } from 'h3'
import { requireDashboardAccess, validDashboardPassword } from '../../utils/dashboardAuth'
import { getDatabase } from '../../utils/database'
import { noStore } from '../../utils/session'

export default defineEventHandler(async (event) => {
  noStore(event)
  requireDashboardAccess(event)
  const body = await readBody(event).catch(() => ({})) as { password?: unknown }
  if (!validDashboardPassword(body?.password)) {
    throw createError({ statusCode: 403, statusMessage: 'Password confirmation failed.' })
  }
  getDatabase().prepare('DELETE FROM submissions').run()
  return { reset: true }
})
