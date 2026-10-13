import type { CategoryKey, Presentation, ReasonKey } from '../../shared/types/experiment'

export interface ProductDefinition {
  key: CategoryKey
  categoryName: string
  image: string
  ordinary: Presentation
  premium: Presentation
}

export const products: readonly ProductDefinition[] = [
  {
    key: 'shirt',
    categoryName: 'Cotton T-shirt',
    image: '/products/shirt.jpg',
    ordinary: {
      image: '/products/shirt.jpg',
      name: 'Basic Cotton Tee',
      description: 'Standard white cotton T-shirt. An everyday wardrobe basic.',
      style: 'light',
      scene: 'iris',
      kicker: 'Everyday wardrobe / 01'
    },
    premium: {
      image: '/products/shirt.jpg',
      name: 'ATELIER Nº 01 — The Essential Form',
      description: 'An expression of timeless simplicity. Made for everyday refinement.',
      style: 'dark',
      scene: 'iris',
      kicker: 'Atelier / 01'
    }
  },
  {
    key: 'mug',
    categoryName: 'Ceramic mug',
    image: '/products/mug.jpg',
    ordinary: {
      image: '/products/mug.jpg',
      name: 'Everyday Ceramic Mug',
      description: 'A simple white ceramic mug for coffee or tea.',
      style: 'light',
      scene: 'ember',
      kicker: 'Home goods / 02'
    },
    premium: {
      image: '/products/mug.jpg',
      name: 'MAISON Nº 02 — The Quiet Ritual',
      description: 'A considered form for the moments that make a day feel yours.',
      style: 'dark',
      scene: 'ember',
      kicker: 'Maison / 02'
    }
  },
  {
    key: 'tote',
    categoryName: 'Canvas tote',
    image: '/products/tote.jpg',
    ordinary: {
      image: '/products/tote.jpg',
      name: 'Plain Canvas Tote',
      description: 'A reusable canvas bag with two shoulder straps.',
      style: 'light',
      scene: 'mint',
      kicker: 'Daily carry / 03'
    },
    premium: {
      image: '/products/tote.jpg',
      name: 'STUDIO Nº 03 — Carry the Everyday',
      description: 'Quiet utility, thoughtfully carried. A companion for wherever the day leads.',
      style: 'dark',
      scene: 'mint',
      kicker: 'Studio / 03'
    }
  }
]

export const reasons: { key: ReasonKey; label: string }[] = [
  { key: 'branding', label: 'Branding and exclusivity' },
  { key: 'photography', label: 'Photography and visual presentation' },
  { key: 'description', label: 'Product name and description' },
  { key: 'quality', label: 'Assumed quality or materials' },
  { key: 'other', label: 'Other' }
]
