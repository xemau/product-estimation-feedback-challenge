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
      name: 'Cotton Crew T-shirt',
      description: 'A white cotton jersey T-shirt with a crew neckline, short sleeves, and a relaxed shape.',
      specifications: ['Cotton jersey', 'Crew neck', 'Short sleeves'],
      style: 'light',
      scene: 'iris',
      kicker: 'Wardrobe / 01'
    },
    premium: {
      image: '/products/shirt.jpg',
      name: 'Form 01: Cotton Tee',
      description: 'A relaxed white T-shirt in cotton jersey, cut with short sleeves and a clean crew neckline.',
      specifications: ['Cotton jersey', 'Crew neck', 'Short sleeves'],
      style: 'dark',
      scene: 'iris',
      kicker: 'Form / 01'
    }
  },
  {
    key: 'mug',
    categoryName: 'Ceramic mug',
    image: '/products/mug.jpg',
    ordinary: {
      image: '/products/mug.jpg',
      name: 'White Ceramic Mug',
      description: 'A white glazed ceramic mug with a straight-sided body and a single rounded handle.',
      specifications: ['Glazed ceramic', 'Single handle', 'Straight-sided'],
      style: 'light',
      scene: 'ember',
      kicker: 'Tableware / 02'
    },
    premium: {
      image: '/products/mug.jpg',
      name: 'Ritual 02: Ceramic Mug',
      description: 'A straight-sided mug in white glazed ceramic, finished with one rounded handle.',
      specifications: ['Glazed ceramic', 'Single handle', 'Straight-sided'],
      style: 'dark',
      scene: 'ember',
      kicker: 'Ritual / 02'
    }
  },
  {
    key: 'tote',
    categoryName: 'Canvas tote',
    image: '/products/tote.jpg',
    ordinary: {
      image: '/products/tote.jpg',
      name: 'Canvas Tote Bag',
      description: 'A plain canvas bag with an open top and two long straps for carrying over the shoulder.',
      specifications: ['Canvas', 'Open top', 'Shoulder straps'],
      style: 'light',
      scene: 'mint',
      kicker: 'Carry goods / 03'
    },
    premium: {
      image: '/products/tote.jpg',
      name: 'Carry 03: Canvas Tote',
      description: 'An open-top canvas tote with two long shoulder straps and a simple, unprinted finish.',
      specifications: ['Canvas', 'Open top', 'Shoulder straps'],
      style: 'dark',
      scene: 'mint',
      kicker: 'Everyday / 03'
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
