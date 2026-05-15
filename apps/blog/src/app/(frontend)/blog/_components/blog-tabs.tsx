'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Input } from '@workspace/ui/components/input'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { searchSchema } from '@workspace/validator'
import type { Category, Post } from '@/payload-types'
import { fetchPostsAction } from '@/app/(frontend)/blog/_components/actions'

type BlogTabsProps = {
  categories: Category[]
  initialPosts: Post[]
  highlightedPost: Post | null
}

// Helpers
function getCategoryName(category: Post['category']): string {
  if (typeof category === 'object' && category !== null) return category.name
  return ''
}

function getAuthorName(author: Post['author']): string {
  if (typeof author === 'object' && author !== null) return author.name ?? ''
  return ''
}

//  Post Card
function PostCard({ post, highlighted = false }: { post: Post; highlighted?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={highlighted ? 'col-span-1 block md:col-span-3' : 'block'}
    >
      <article
        className={`flex h-full flex-col p-6 text-card-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground ${
          highlighted ? 'md:min-h-[420px]' : ''
        }`}
      >
        {/* Top */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-primary">{getCategoryName(post.category)}</p>

          <p className="shrink-0 text-sm font-medium text-muted-foreground">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </p>
        </div>

        {/* Highlight */}
        {highlighted && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            ★ Highlight
          </p>
        )}

        {/* Title */}
        <h2
          className={`mb-4 font-semibold leading-tight tracking-normal ${
            highlighted ? 'line-clamp-3 text-3xl md:text-4xl' : 'line-clamp-2 text-2xl'
          }`}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>

        {/* Push author to bottom */}
        <div className="mt-auto">
          <p className="text-sm text-muted-foreground">{getAuthorName(post.author)}</p>
        </div>
      </article>
    </Link>
  )
}

function BlogGrid({
  posts,
  highlightedPost,
  showHighlighted,
}: {
  posts: Post[]
  highlightedPost: Post | null
  showHighlighted: boolean
}) {
  const regularPosts = showHighlighted ? posts.filter((p) => p.id !== highlightedPost?.id) : posts

  return (
    <section className="grid  divide-x divide-y border border-border md:grid-cols-2 lg:grid-cols-3">
      {showHighlighted && highlightedPost && <PostCard post={highlightedPost} highlighted />}

      {regularPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className="col-span-1 flex min-h-[300px] items-center justify-center p-6 text-muted-foreground md:col-span-2 lg:col-span-3">
          No posts found.
        </div>
      )}
    </section>
  )
}

// Main
export default function BlogTabs({ categories, initialPosts, highlightedPost }: BlogTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') ?? 'all'
  const currentSearch = searchParams.get('search') ?? ''

  const [searchValue, setSearchValue] = useState(currentSearch)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [loading, setLoading] = useState(false)

  const updateParams = useCallback(
    (params: { category?: string; search?: string }) => {
      const next = new URLSearchParams(searchParams.toString())

      if (params.category !== undefined) {
        if (params.category === 'all') next.delete('category')
        else next.set('category', params.category)
      }

      if (params.search !== undefined) {
        if (params.search === '') next.delete('search')
        else next.set('search', params.search)
      }

      router.push(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  // Debounce search  update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = searchSchema.safeParse(searchValue)
      if (parsed.success) {
        updateParams({ search: parsed.data })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchValue, updateParams])

  // Fetch saat URL params berubah
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchPostsAction({
      categorySlug: currentCategory !== 'all' ? currentCategory : undefined,
      search: currentSearch || undefined,
    })
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [currentCategory, currentSearch])

  return (
    <Tabs value={currentCategory} onValueChange={(value) => updateParams({ category: value })}>
      <div className="w-full flex flex-col md:flex-row gap-4">
        {/*  search*/}
        <div className="relative max-w-sm">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search articles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search posts by title"
          />
        </div>
      </div>
      <TabsList className="mb-6 h-auto flex-wrap gap-1" variant="line">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat.id} value={cat.slug}>
            {cat.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value={currentCategory}
        className={loading ? 'opacity-60 transition-opacity' : ''}
      >
        <BlogGrid
          posts={posts}
          highlightedPost={highlightedPost}
          showHighlighted={currentCategory === 'all' && !currentSearch}
        />
      </TabsContent>
    </Tabs>
  )
}
