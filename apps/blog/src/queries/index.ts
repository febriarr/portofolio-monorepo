import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
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

const cachedGetPostBySlug = unstable_cache(
  async (slug: string) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      depth: 2,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
    })
    const post = result.docs[0] ?? null
    return post ? sanitizePost(post) : null
  },
  ['post-by-slug'],
  { tags: ['posts'] },
)

export const getPostBySlug = (slug: string) => cachedGetPostBySlug(slug)

type PublishedPostsOptions = {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}

const cachedGetPublishedPosts = unstable_cache(
  async (options: PublishedPostsOptions) => {
    const { categorySlug, search, limit = 12, page = 1 } = options
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      depth: 2,
      limit,
      page,
      sort: '-publishedAt',
      overrideAccess: true,
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
  },
  ['published-posts'],
  { tags: ['posts'] },
)

export const getPublishedPosts = (options?: PublishedPostsOptions) =>
  cachedGetPublishedPosts(options ?? {})

export async function getAllPublishedSlugs(): Promise<string[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
    where: {
      _status: { equals: 'published' },
    },
    select: { slug: true },
  })
  return result.docs.map((p) => p.slug).filter((s): s is string => Boolean(s))
}

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
