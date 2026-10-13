export type Phase = 'welcome' | 'pricing' | 'reveal' | 'feedback' | 'completed'
export type CategoryKey = 'shirt' | 'mug' | 'tote'
export type ReasonKey = 'branding' | 'photography' | 'description' | 'quality' | 'other'

export interface Presentation {
  image: string
  name: string
  description: string
  style: 'light' | 'dark'
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
  image: string
  ordinary: { name: string; price: number }
  premium: { name: string; price: number }
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

export interface CommunityResults {
  participantCount: number
  completedCount: number
  categories: CategoryResult[]
  reasons: { key: ReasonKey; label: string; count: number }[]
  explanations: { id: string; text: string; createdAt: string }[]
}
