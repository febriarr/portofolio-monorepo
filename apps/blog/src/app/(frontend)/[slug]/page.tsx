import { getAllPublishedSlugs, getPostBySlug } from '@/queries'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { TypographySmall } from '@workspace/ui/components/typography'
import Image from 'next/image'
import { RichText } from '@/components/rich-text'

type Args = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
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

  if (!post) return notFound()

  return (
    <article className="mx-auto w-full max-w-5xl px-4 md:px-6 lg:px-16 pt-6 pb-20 border border-border relative">
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
          <div className="w-full flex justify-center"></div>

          {typeof post.author === 'object' && post.author.instagram ? (
            <div className="w-full flex justify-center">
              <Link
                href={post.author.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex space-x-4 items-center"
              >
                <Avatar>
                  <AvatarImage
                    src={
                      typeof post.author.avatar === 'object'
                        ? (post.author.avatar?.url ?? '')
                        : ''
                    }
                    alt={post.author.name ?? ''}
                  />
                  <AvatarFallback>
                    {post.author.name?.charAt(0).toUpperCase() ?? 'A'}
                  </AvatarFallback>
                </Avatar>
                <TypographySmall>{post.author.name}</TypographySmall>
              </Link>
            </div>
          ) : null}
        </header>

        {typeof post.heroImage === 'object' && post.heroImage?.url ? (
          <div className="w-full flex justify-center mb-8 md:mb-12">
            <Image
              src={post.heroImage.url}
              alt={post.heroImage.alt ?? post.title}
              width={post.heroImage.width ?? 1200}
              height={post.heroImage.height ?? 630}
              className="w-full object-contain h-auto border rounded-xl"
              priority
            />
          </div>
        ) : null}

        <div className="prose prose-invert max-w-none prose-headings:tracking-normal prose-a:text-primary prose-blockquote:border-primary">
          <RichText data={post.content} />
        </div>
      </div>
    </article>
  )
}
