'use server'

import { getPublishedPosts } from '@/queries/index'
import type { Post } from '@/payload-types'

export async function fetchPostsAction(options: {
  categorySlug?: string
  search?: string
}): Promise<Post[]> {
  const result = await getPublishedPosts({ ...options, limit: 10 })
  return result.docs
}
