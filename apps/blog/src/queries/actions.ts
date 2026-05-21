'use server'

import { getPublishedPosts } from '@/queries/index'
import type { Post } from '@/payload-types'

export async function fetchPostsAction(options: {
  categorySlug?: string
  search?: string
  page?: number
}): Promise<{
  posts: Post[]
  hasNextPage: boolean
  nextPage?: number | null
}> {
  const result = await getPublishedPosts({ ...options, limit: 10 })
  return {
    posts: result.docs,
    hasNextPage: result.hasNextPage,
    nextPage: result.nextPage,
  }
}
