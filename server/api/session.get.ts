import { currentSubmission, noStore, sessionState } from '../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  return sessionState(currentSubmission(event))
})
