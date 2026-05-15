import { Metadata } from 'next'
import { Suspense } from 'react'
import { getCategories, getPublishedPosts } from '@/queries'
import BlogTabs from './_components/blog-tabs'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights on various topics.',
}

export default async function BlogPage() {
  const [categoriesResult, postsResult] = await Promise.all([
    getCategories(),
    getPublishedPosts({ limit: 50 }),
  ])

  const highlightedPost = postsResult.docs.find((p) => p.isHighlighted) ?? null

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pt-6 pb-20">
      <header className="mb-12">
        <p className="mb-2 text-sm font-medium uppercase tracking-normal text-muted-foreground">
          Blog
        </p>
        <h1 className="text-4xl font-bold tracking-normal md:text-6xl">Latest Articles</h1>
      </header>

      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <BlogTabs
          categories={categoriesResult.docs}
          initialPosts={postsResult.docs}
          highlightedPost={highlightedPost}
        />
      </Suspense>
    </div>
  )
}
