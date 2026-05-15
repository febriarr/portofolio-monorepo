import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Where } from 'payload'

export async function getPublishedPosts(options?: {
  categorySlug?: string
  search?: string
  limit?: number
}) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { categorySlug, search, limit = 12 } = options ?? {}

  const where: Where = {
    _status: { equals: 'published' },
  }

  if (categorySlug && categorySlug !== 'all') {
    where['category.slug'] = { equals: categorySlug }
  }

  if (search) {
    where['title'] = { like: search }
  }

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    sort: '-publishedAt',
    where,
  })

  return posts
}

export async function getCategories() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  return categories
}

export async function getPostBySlug(slug: string) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  })

  return posts.docs[0]
}
