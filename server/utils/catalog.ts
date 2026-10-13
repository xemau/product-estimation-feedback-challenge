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
      style: 'light'
    },
    premium: {
      image: '/products/shirt.jpg',
      name: 'ATELIER Nº 01 — The Essential Form',
      description: 'An expression of timeless simplicity. Made for everyday refinement.',
      style: 'dark'
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
      style: 'light'
    },
    premium: {
      image: '/products/mug.jpg',
      name: 'MAISON Nº 02 — The Quiet Ritual',
      description: 'A considered form for the moments that make a day feel yours.',
      style: 'dark'
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
      style: 'light'
    },
    premium: {
      image: '/products/tote.jpg',
      name: 'STUDIO Nº 03 — Carry the Everyday',
      description: 'Quiet utility, thoughtfully carried. A companion for wherever the day leads.',
      style: 'dark'
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
