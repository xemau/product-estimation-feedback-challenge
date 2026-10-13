import type { CategoryKey, Presentation, ReasonKey } from '../../shared/types/experiment'

export interface ProductDefinition {
  key: CategoryKey
  categoryName: string
  ordinary: Presentation
  premium: Presentation
}

const shirtImages = ['/products/shirt-1.jpg', '/products/shirt-2.jpg', '/products/shirt-3.jpg', '/products/shirt-4.jpg']
const mugImages = ['/products/mug-1.jpg', '/products/mug-2.jpg', '/products/mug-3.jpg', '/products/mug-4.jpg']
const toteImages = ['/products/tote-1.jpg', '/products/tote-2.jpg', '/products/tote-3.jpg']

export const products: readonly ProductDefinition[] = [
  {
    key: 'shirt',
    categoryName: 'Cotton T-shirt',
    ordinary: {
      images: shirtImages,
      name: 'Regular Fit Cotton T-shirt',
      description: 'A plain white T-shirt in lightweight cotton jersey. Regular fit with a ribbed crew neck, short sleeves and a straight hem.',
      specifications: ['100% cotton', 'Regular fit', 'Crew neck'],
      style: 'catalog',
      kicker: 'Clothing / T-shirts'
    },
    premium: {
      images: [shirtImages[3]!, shirtImages[0]!, shirtImages[1]!, shirtImages[2]!],
      name: 'The Everyday Cotton Tee',
      description: 'The easy foundation for what comes next. Soft, lightweight cotton jersey falls into a clean regular shape, with a crew neck that works on its own or under a layer.',
      specifications: ['100% cotton', 'Regular fit', 'Crew neck'],
      style: 'editorial',
      kicker: 'Everyday essentials'
    }
  },
  {
    key: 'mug',
    categoryName: 'Porcelain mug',
    ordinary: {
      images: mugImages,
      name: 'White Porcelain Mug',
      description: 'A white glazed porcelain mug with a rounded handle. Holds 36 cl and can go in the microwave or dishwasher.',
      specifications: ['Feldspar porcelain', '36 cl', 'Dishwasher safe'],
      style: 'catalog',
      kicker: 'Home / Mugs'
    },
    premium: {
      images: [mugImages[3]!, mugImages[0]!, mugImages[2]!, mugImages[1]!],
      name: 'The Morning Cup',
      description: 'A quiet moment, held in white porcelain. Its generous 36 cl shape is made for slow coffee mornings and everyday use, with the ease of microwave and dishwasher care.',
      specifications: ['Feldspar porcelain', '36 cl', 'Dishwasher safe'],
      style: 'editorial',
      kicker: 'At the table'
    }
  },
  {
    key: 'tote',
    categoryName: 'Canvas tote',
    ordinary: {
      images: toteImages,
      name: 'Cotton Canvas Tote',
      description: 'A plain beige tote in cotton canvas with long shoulder handles and a zipped inner pocket. Measures 44 × 42.5 × 24.5 cm.',
      specifications: ['100% cotton canvas', 'Zipped inner pocket', '44 × 42.5 × 24.5 cm'],
      style: 'catalog',
      kicker: 'Accessories / Bags'
    },
    premium: {
      images: [toteImages[1]!, toteImages[0]!, toteImages[2]!],
      name: 'The Canvas Carryall',
      description: 'Room for the day ahead. This generous cotton-canvas carryall sits easily on the shoulder and keeps smaller essentials close in a zipped inner pocket.',
      specifications: ['100% cotton canvas', 'Zipped inner pocket', '44 × 42.5 × 24.5 cm'],
      style: 'editorial',
      kicker: 'Objects for everyday'
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
