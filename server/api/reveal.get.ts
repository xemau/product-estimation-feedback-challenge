import { createError } from 'h3'
import { products } from '../utils/catalog'
import { noStore, requireSubmission } from '../utils/session'

export default defineEventHandler((event) => {
  noStore(event)
  const row = requireSubmission(event)
  if (row.phase === 'pricing' || row.step_index !== 6) {
    throw createError({ statusCode: 403, statusMessage: 'Complete all estimates first.' })
  }
  return products.map((product) => {
    const ordinary = row[`${product.key}_ordinary`]!
    const premium = row[`${product.key}_premium`]!
    return {
      category: product.key,
      categoryName: product.categoryName,
      ordinary: { name: product.ordinary.name, price: ordinary, image: product.ordinary.images[0]! },
      premium: { name: product.premium.name, price: premium, image: product.premium.images[0]! },
      difference: premium - ordinary
    }
  })
})
