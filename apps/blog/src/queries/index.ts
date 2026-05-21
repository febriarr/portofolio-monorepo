import { getPayload } from 'payload'
import config from '@payload-config'
import { cacheTag } from 'next/cache'
import type { Post } from '@/payload-types'

const getPayloadClient = () => getPayload({ config })

function sanitizeAuthor(author: Post['author']): Post['author'] {
  if (typeof author !== 'object' || !author) return author
  return {
    ...author,
    email: '',
    sessions: undefined,
  } as Post['author']
}

function sanitizePost(post: Post): Post {
  return {
    ...post,
    author: sanitizeAuthor(post.author),
  }
}

export async function getPostBySlug(slug: string) {
  'use cache'
  cacheTag('posts', `post-${slug}`)

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
  })

  const post = result.docs[0] ?? null
  return post ? sanitizePost(post) : null
}

export async function getPublishedPosts(options?: {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}) {
  'use cache'
  cacheTag('posts')

  const { categorySlug, search, limit = 12, page = 1 } = options ?? {}
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit,
    page,
    sort: '-publishedAt',
    overrideAccess: false,
    where: {
      _status: { equals: 'published' },
      ...(categorySlug &&
        categorySlug !== 'all' && {
          'category.slug': { equals: categorySlug },
        }),
      ...(search && { title: { like: search } }),
    },
  })

  return {
    ...result,
    docs: result.docs.map(sanitizePost),
  }
}

export async function getCategories() {
  'use cache'
  cacheTag('categories')

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })

  return result
}
