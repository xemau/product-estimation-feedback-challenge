import { createError, readBody } from 'h3'
import { products } from '../utils/catalog'
import { getDatabase } from '../utils/database'
import { noStore, requireSubmission, sessionState } from '../utils/session'

export default defineEventHandler(async (event) => {
  noStore(event)
  const body = await readBody(event) as { stepIndex?: unknown; euros?: unknown }
  if (!body || !Number.isInteger(body.stepIndex) || !Number.isInteger(body.euros) ||
    (body.stepIndex as number) < 0 || (body.stepIndex as number) > 5 ||
    (body.euros as number) < 0 || (body.euros as number) > 2000) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a whole-euro amount from 0 to 2000.' })
  }

  const db = getDatabase()
  db.exec('BEGIN IMMEDIATE')
  try {
    const row = requireSubmission(event)
    if (row.phase !== 'pricing' || body.stepIndex !== row.step_index) {
      if ((body.stepIndex as number) < row.step_index) {
        db.exec('COMMIT')
        return sessionState(row)
      }
      throw createError({ statusCode: 409, statusMessage: 'This is not the current product.' })
    }
    const product = products[Math.floor(row.step_index / 2)]!
    const premiumFirst = row[`${product.key}_premium_first`]
    const premium = premiumFirst === (row.step_index % 2 === 0 ? 1 : 0)
    const column = `${product.key}_${premium ? 'premium' : 'ordinary'}`
    const nextStep = row.step_index + 1
    const nextPhase = nextStep === 6 ? 'reveal' : 'pricing'
    db.prepare(`UPDATE submissions SET ${column} = ?, step_index = ?, phase = ? WHERE id = ?`)
      .run(body.euros as number, nextStep, nextPhase, row.id)
    db.exec('COMMIT')
    return sessionState({ ...row, [column]: body.euros, step_index: nextStep, phase: nextPhase })
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
})
