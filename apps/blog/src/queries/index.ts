import { Category, Post } from '@/payload-types'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001'

function buildPostsUrl(options?: {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}) {
  const { categorySlug, search, limit = 12, page = 1 } = options ?? {}
  const params = new URLSearchParams()

  params.set('depth', '2')
  params.set('limit', String(limit))
  params.set('page', String(page))
  params.set('sort', '-publishedAt')
  params.set('where[_status][equals]', 'published')

  if (categorySlug && categorySlug !== 'all') {
    params.set('where[category.slug][equals]', categorySlug)
  }

  if (search) {
    params.set('where[title][like]', search)
  }

  return `${BASE_URL}/api/posts?${params.toString()}`
}

export async function getPublishedPosts(options?: {
  categorySlug?: string
  search?: string
  limit?: number
  page?: number
}) {
  const url = buildPostsUrl(options)

  const res = await fetch(url, {
    next: {
      tags: ['posts'],
    },
  })

  if (!res.ok) throw new Error('Failed to fetch posts')

  return res.json() as Promise<{
    docs: Post[]
    totalDocs: number
    totalPages: number
    hasNextPage: boolean
    nextPage: number | null
    page: number
  }>
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/api/categories?limit=100&sort=name`, {
    next: {
      tags: ['categories'],
    },
  })

  if (!res.ok) throw new Error('Failed to fetch categories')

  const data = await res.json()
  return data as { docs: Category[] }
}

export async function getPostBySlug(slug: string) {
  const params = new URLSearchParams()
  params.set('depth', '2')
  params.set('limit', '1')
  params.set('where[slug][equals]', slug)
  params.set('where[_status][equals]', 'published')

  const res = await fetch(`${BASE_URL}/api/posts?${params.toString()}`, {
    next: {
      tags: [`post-${slug}`],
    },
  })

  if (!res.ok) throw new Error('Failed to fetch post')

  const data = await res.json()
  return data.docs[0] as Post | undefined
}
