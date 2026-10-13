import { createHash, randomBytes, randomInt, randomUUID } from 'node:crypto'
import { createError, getCookie, setCookie, setHeader, type H3Event } from 'h3'
import type { SessionState } from '../../shared/types/experiment'
import { products } from './catalog'
import { getDatabase, getSubmissionByHash, type SubmissionRow } from './database'

const cookieName = 'price_of_nothing_participant'

export function noStore(event: H3Event): void {
  setHeader(event, 'Cache-Control', 'no-store')
}

export function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function currentSubmission(event: H3Event): SubmissionRow | undefined {
  const token = getCookie(event, cookieName)
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return undefined
  return getSubmissionByHash(tokenHash(token))
}

export function requireSubmission(event: H3Event): SubmissionRow {
  const row = currentSubmission(event)
  if (!row) throw createError({ statusCode: 401, statusMessage: 'Start the experiment first.' })
  return row
}

export function createSubmission(event: H3Event): SubmissionRow {
  const token = randomBytes(32).toString('base64url')
  const id = randomUUID()
  getDatabase().prepare(`
    INSERT INTO submissions (
      id, token_hash, created_at, phase, step_index,
      shirt_premium_first, mug_premium_first, tote_premium_first
    ) VALUES (?, ?, ?, 'pricing', 0, ?, ?, ?)
  `).run(id, tokenHash(token), new Date().toISOString(), randomInt(2), randomInt(2), randomInt(2))
  setCookie(event, cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  })
  return getSubmissionByHash(tokenHash(token))!
}

export function sessionState(row?: SubmissionRow): SessionState {
  if (!row) return { phase: 'welcome' }
  if (row.phase !== 'pricing') return { phase: row.phase }

  const categoryIndex = Math.floor(row.step_index / 2)
  const presentationNumber = row.step_index % 2 + 1
  const product = products[categoryIndex]!
  const premiumFirst = row[`${product.key}_premium_first`]
  const premium = premiumFirst === (presentationNumber === 1 ? 1 : 0)

  return {
    phase: 'pricing',
    stepIndex: row.step_index,
    categoryIndex,
    presentationNumber,
    presentation: premium ? product.premium : product.ordinary
  }
}
