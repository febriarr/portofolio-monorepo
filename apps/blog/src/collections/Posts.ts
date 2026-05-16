import { formatSlug } from '@/utils/format-slug'
import { CollectionConfig } from 'payload'
import { handleIsHighlighted } from '@/hooks/isHighlight'

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
        // Skip kalau ini update dari hook isHighlight
        if (req.context?.isHighlightUpdate) return data

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
      name: 'isHighlighted',
      label: 'Highlight Post',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [handleIsHighlighted],
      },
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
              admin: {
                description: 'Optional, Jika kosong akan menggunakan title post.',
              },
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
