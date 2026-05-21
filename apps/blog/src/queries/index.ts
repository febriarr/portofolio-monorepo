import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getPayloadClient = () => getPayload({ config })

export const getPublishedPosts = unstable_cache(
  async (options?: { categorySlug?: string; search?: string; limit?: number; page?: number }) => {
    const { categorySlug, search, limit = 12, page = 1 } = options ?? {}
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      depth: 2,
      limit,
      page,
      sort: '-publishedAt',
      where: {
        _status: { equals: 'published' },
        ...(categorySlug &&
          categorySlug !== 'all' && {
            'category.slug': { equals: categorySlug },
          }),
        ...(search && {
          title: { like: search },
        }),
      },
    })

    return result
  },
  ['published-posts'],
  { tags: ['posts'] },
)

export const getCategories = unstable_cache(
  async () => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'name',
    })

    return result
  },
  ['categories'],
  { tags: ['categories'] },
)

export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'posts',
      depth: 2,
      limit: 1,
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
    })

    return result.docs[0] ?? null
  },
  ['post-by-slug'],
  { tags: ['posts'] },
)
