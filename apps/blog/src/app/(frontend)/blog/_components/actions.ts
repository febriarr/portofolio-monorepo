'use server'

import { getPublishedPosts } from '@/queries'
import type { Post } from '@/payload-types'

export async function fetchPostsAction(options: {
  categorySlug?: string
  search?: string
}): Promise<Post[]> {
  const result = await getPublishedPosts({ ...options, limit: 50 })
  return result.docs
}
