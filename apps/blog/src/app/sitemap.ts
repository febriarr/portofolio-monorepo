import type { MetadataRoute } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({
    config: configPromise,
  })

  const baseUrl = 'https://blog.febriardiansyah.my.id'

  // Fetch published posts
  const posts = await payload.find({
    collection: 'posts',
    depth: 0,
    limit: 20,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),

    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    // Home
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },

    // Posts
    ...postEntries,
  ]
}
