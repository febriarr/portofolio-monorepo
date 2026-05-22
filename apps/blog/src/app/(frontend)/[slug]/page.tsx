import { getPostBySlug, getPublishedPosts } from '@/queries'
import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogDetailContent from './_components/blog-detail-content'
import { BlogDetailSkeleton } from '@/components/blog-detail-skeleton'


export async function generateStaticParams() {
  const result = await getPublishedPosts({ limit: 1000 })
  return result.docs.map((post) => ({ slug: post.slug }))
}


type Args = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return {
      title: 'No post found',
    }
  }
  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.excerpt
  const image = typeof post.meta?.image === 'object' ? post.meta.image : post.heroImage

  const imageUrl = typeof image === 'object' && image?.url ? image.url : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: imageUrl
        ? [
            {
              url: imageUrl,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function BlogDetailPage({ params }: Args) {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetailContent params={params} />
    </Suspense>
  )
}
