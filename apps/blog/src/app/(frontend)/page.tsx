import React, { Suspense } from 'react'
import { getCategories, getPublishedPosts } from '@/queries'
import BlogTabs from '@/components/blog-tabs'
import { Metadata } from 'next'
import { cacheTag } from 'next/cache'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights on various topics.',
}

export default async function HomePage() {
  'use cache'
  cacheTag('posts', 'categories')
  const [categoriesResult, postsResult] = await Promise.all([
    getCategories(),
    getPublishedPosts({ limit: 10 }),
  ])

  if (!categoriesResult || !postsResult) {
    return <div className={'text-center'}>No Content found.</div>
  }

  const highlightedPost = postsResult.docs.find((p) => p.isHighlighted) ?? null

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-6 pb-20">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <BlogTabs
          categories={categoriesResult.docs}
          initialPosts={postsResult.docs}
          initialHasNextPage={postsResult.hasNextPage}
          highlightedPost={highlightedPost}
        />
      </Suspense>
    </div>
  )
}
