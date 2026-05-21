'use client'

import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import { searchSchema } from '@workspace/validator'
import type { Category, Media, Post } from '@/payload-types'
import { fetchPostsAction } from '@/queries/actions'
import Image from 'next/image'

type BlogTabsProps = {
  categories: Category[]
  initialPosts: Post[]
  initialHasNextPage: boolean
  highlightedPost: Post | null
}

function getCategoryName(category: Post['category']): string {
  if (typeof category === 'object' && category !== null) return category.name
  return ''
}

function getAuthorName(author: Post['author']): string {
  if (typeof author === 'object' && author !== null) return author.name ?? ''
  return ''
}

function PostCard({ post, highlighted = false }: { post: Post; highlighted?: boolean }) {
  const heroImage = highlighted
    ? ((post.heroImage as Media | null) ?? (post.meta?.image as Media | null))
    : null

  const imageUrl = typeof heroImage === 'object' && heroImage?.url ? heroImage.url : null

  return (
    <Link
      href={`/${post.slug}`}
      className={highlighted ? 'col-span-1 block md:col-span-2 lg:col-span-3' : 'block'}
    >
      <article
        className={`flex h-full text-card-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground group ${
          highlighted ? 'flex-col md:flex-row md:min-h-105' : 'flex-col p-6'
        }`}
      >
        {highlighted && imageUrl && (
          <div className="relative w-full shrink-0 overflow-hidden aspect-video md:aspect-auto md:w-1/2 md:self-stretch">
            <Image
              src={imageUrl}
              alt={heroImage?.alt ?? post.title}
              fill
              className="object-cover object-bottom absolute w-full h-full inset-0"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        )}

        <div className={`flex flex-col ${highlighted ? 'flex-1 p-8 border-l' : 'h-full'}`}>
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

          {highlighted && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              ★ Highlight
            </p>
          )}

          <h2
            className={`mb-4 font-semibold leading-tight tracking-normal group-hover:underline ${
              highlighted ? 'line-clamp-3 text-3xl md:text-4xl' : 'line-clamp-2 text-2xl'
            }`}
          >
            {post.title}
          </h2>

          <p className="mb-6 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-auto">
            <p className="text-sm text-muted-foreground">{getAuthorName(post.author)}</p>
          </div>
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
    <section className="grid divide-x divide-y border border-border md:grid-cols-2 lg:grid-cols-3">
      {showHighlighted && highlightedPost && <PostCard post={highlightedPost} highlighted />}

      {regularPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {posts.length === 0 && (
        <div className="col-span-1 flex min-h-75 items-center justify-center p-6 text-muted-foreground md:col-span-2 lg:col-span-3">
          No posts found.
        </div>
      )}
    </section>
  )
}

export default function BlogTabs({
  categories,
  initialPosts,
  initialHasNextPage,
  highlightedPost,
}: BlogTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams])

  const currentCategory = searchParams.get('category') ?? 'all'
  const currentSearch = searchParams.get('search') ?? ''

  const [searchValue, setSearchValue] = useState(currentSearch)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [nextPage, setNextPage] = useState<number | null>(initialHasNextPage ? 2 : null)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const updateParams = useCallback(
    (params: { category?: string; search?: string }) => {
      const next = new URLSearchParams(searchParamsString)

      if (params.category !== undefined) {
        if (params.category === 'all') next.delete('category')
        else next.set('category', params.category)
      }

      if (params.search !== undefined) {
        if (params.search === '') next.delete('search')
        else next.set('search', params.search)
      }

      const nextQuery = next.toString()
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
      const currentUrl = searchParamsString ? `${pathname}?${searchParamsString}` : pathname

      if (nextUrl === currentUrl) return

      router.replace(nextUrl, { scroll: false })
    },
    [pathname, router, searchParamsString],
  )

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = searchSchema.safeParse(searchValue)
      if (parsed.success) {
        updateParams({ search: parsed.data })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchValue, updateParams])

  // Fetch fresh when filters change — reset pagination
  useEffect(() => {
    let cancelled = false

    setLoading(true)

    fetchPostsAction({
      categorySlug: currentCategory !== 'all' ? currentCategory : undefined,
      search: currentSearch || undefined,
      page: 1,
    })
      .then(({ posts: data, hasNextPage: hnp, nextPage: np }) => {
        if (!cancelled) {
          setPosts(data)
          setHasNextPage(hnp)
          setNextPage(np ?? null)
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [currentCategory, currentSearch])

  const handleLoadMore = useCallback(async () => {
    if (!nextPage || loadingMore) return

    setLoadingMore(true)

    try {
      const {
        posts: morePosts,
        hasNextPage: hnp,
        nextPage: np,
      } = await fetchPostsAction({
        categorySlug: currentCategory !== 'all' ? currentCategory : undefined,
        search: currentSearch || undefined,
        page: nextPage,
      })

      setPosts((prev) => [...prev, ...morePosts])
      setHasNextPage(hnp)
      setNextPage(np ?? null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMore(false)
    }
  }, [nextPage, loadingMore, currentCategory, currentSearch])

  return (
    <Tabs value={currentCategory} onValueChange={(value) => updateParams({ category: value })}>
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="relative max-w-sm h-fit">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search articles..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            aria-label="Search posts by title"
          />
        </div>

        <TabsList className="mb-6 h-auto flex-wrap gap-1" variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.slug}>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent
        value={currentCategory}
        className={loading ? 'opacity-60 transition-opacity' : ''}
      >
        <BlogGrid
          posts={posts}
          highlightedPost={highlightedPost}
          showHighlighted={currentCategory === 'all' && !currentSearch}
        />

        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="min-w-32"
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
