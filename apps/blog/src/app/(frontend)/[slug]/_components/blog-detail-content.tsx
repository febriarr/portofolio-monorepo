import { RichText } from '@/components/rich-text'
import { getPostBySlug } from '@/queries'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function BlogDetailContent({ params }: Args) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return <div className="text-center">Post Not Found.</div>
  }

  return (
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
  )
}
