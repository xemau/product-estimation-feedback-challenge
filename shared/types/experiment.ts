export type Phase = 'welcome' | 'pricing' | 'reveal' | 'feedback' | 'completed'
export type CategoryKey = 'shirt' | 'mug' | 'tote'
export type ReasonKey = 'branding' | 'photography' | 'description' | 'quality' | 'other'

export interface Presentation {
  images: string[]
  name: string
  description: string
  specifications: string[]
  style: 'catalog' | 'editorial'
  kicker: string
}

export interface SessionState {
  phase: Phase
  stepIndex?: number
  categoryIndex?: number
  presentationNumber?: number
  presentation?: Presentation
}

export interface RevealItem {
  category: CategoryKey
  categoryName: string
  ordinary: { name: string; price: number; image: string }
  premium: { name: string; price: number; image: string }
  difference: number
}

export interface CategoryResult {
  category: CategoryKey
  categoryName: string
  ordinaryAverage: number
  premiumAverage: number
  difference: number
  percentageDifference: number | null
  myOrdinary: number
  myPremium: number
}

export interface DashboardResults {
  participantCount: number
  completedCount: number
  categories: Omit<CategoryResult, 'myOrdinary' | 'myPremium'>[]
  reasons: { key: ReasonKey; label: string; count: number }[]
  explanations: { id: string; text: string; createdAt: string }[]
}

export interface CommunityResults extends Omit<DashboardResults, 'categories'> {
  categories: CategoryResult[]
}
