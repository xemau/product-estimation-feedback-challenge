import { createError, readBody } from 'h3'
import { openDashboardSession, validDashboardPassword } from '../../utils/dashboardAuth'
import { noStore } from '../../utils/session'

export default defineEventHandler(async (event) => {
  noStore(event)
  const body = await readBody(event).catch(() => ({})) as { password?: unknown }
  if (!validDashboardPassword(body?.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Incorrect password.' })
  }
  openDashboardSession(event)
  return { authenticated: true }
})
