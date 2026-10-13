import type { SessionState } from '../../shared/types/experiment'

const pathByPhase: Record<SessionState['phase'], string> = {
  welcome: '/',
  pricing: '/experiment',
  reveal: '/reveal',
  feedback: '/feedback',
  completed: '/results'
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!['/', '/experiment', '/reveal', '/feedback', '/results'].includes(to.path)) return
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
  const session = await $fetch<SessionState>('/api/session', { headers })
  const destination = pathByPhase[session.phase]
  if (to.path !== destination) return navigateTo(destination, { replace: true })
})
