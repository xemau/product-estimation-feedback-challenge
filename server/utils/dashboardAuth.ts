import { randomBytes } from 'node:crypto'
import { createError, getCookie, setCookie, type H3Event } from 'h3'

const cookieName = 'price_of_nothing_dashboard'
const sessionToken = randomBytes(32).toString('base64url')

export function validDashboardPassword(password: unknown): boolean {
  return password === 'cool'
}

export function hasDashboardAccess(event: H3Event): boolean {
  return getCookie(event, cookieName) === sessionToken
}

export function requireDashboardAccess(event: H3Event): void {
  if (!hasDashboardAccess(event)) throw createError({ statusCode: 401, statusMessage: 'Dashboard password required.' })
}

export function openDashboardSession(event: H3Event): void {
  setCookie(event, cookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8
  })
}

export function closeDashboardSession(event: H3Event): void {
  setCookie(event, cookieName, '', { path: '/', maxAge: 0 })
}
