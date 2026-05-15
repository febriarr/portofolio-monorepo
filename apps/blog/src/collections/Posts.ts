import { formatSlug } from '@/utils/format-slug'
import { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (data?.title && !data?.slug) {
          data.slug = formatSlug(data.title)
        }

        if (req.user && !data?.author) {
          data!.author = req.user.id
        }

        if (data?._status === 'published' && !data?.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      type: 'collapsible',
      label: 'SEO',
      fields: [
        {
          name: 'meta',
          type: 'group',
          fields: [
            {
              name: 'title',
              type: 'text',
              minLength: 10,
              maxLength: 60,
            },
            {
              name: 'description',
              type: 'textarea',
              minLength: 50,
              maxLength: 160,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },

    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
