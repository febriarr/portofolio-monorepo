import { getPostBySlug } from '@/queries'
import { Metadata } from 'next'
import { RichText } from '@/components/rich-text'
import { Suspense } from 'react'

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
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return <div className="text-center">Post Not Found.</div>
  }

  return (
    <Suspense fallback={<p className="text-muted-foreground text-center">Loading...</p>}>
      <article className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-16 pt-6 pb-20 border border-border relative">
        <div className="absolute inset-0 -z-10 w-full h-full grid grid-cols-3 divide-x divide-dashed pointer-events-none">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="z-30">
          <header className="mb-12">
            <p className="mb-4 text-sm font-medium text-center text-muted-foreground">
              {typeof post.category === 'object' ? post.category?.name : ''}
            </p>

            <h1 className="mb-6 text-center text-4xl font-bold leading-tight tracking-normal  md:text-6xl">
              {post.title}
            </h1>

            <p className="text-sm leading-8 text-muted-foreground text-center">
              {typeof post.author === 'object' ? post.author?.name : ''}
            </p>
          </header>

          <div className="prose prose-invert max-w-none prose-headings:tracking-normal prose-a:text-primary prose-blockquote:border-primary">
            <RichText data={post.content} />
          </div>
        </div>
      </article>
    </Suspense>
  )
}
