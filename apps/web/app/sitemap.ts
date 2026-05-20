import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.febriardiansyah.my.id",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://www.febriardiansyah.my.id/about",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.febriardiansyah.my.id/projects",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://www.febriardiansyah.my.id/contact",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ]
}
