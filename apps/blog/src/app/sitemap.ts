import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const baseUrl = 'https://blog.febriardiansyah.my.id'

const getSitemapPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      depth: 0,
      pagination: false,
      overrideAccess: true,
      where: {
        _status: { equals: 'published' },
      },
      select: { slug: true, updatedAt: true },
    })
    return result.docs
  },
  ['sitemap-posts'],
  { tags: ['posts'] },
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts()

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post): post is typeof post & { slug: string } => Boolean(post.slug))
    .map((post) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ]
}
