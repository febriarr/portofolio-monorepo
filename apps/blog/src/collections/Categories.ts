import { formatSlug } from '@/utils/format-slug'
import { CollectionConfig } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateTag('categories', 'max')
        revalidatePath('/')
        return doc
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data?.slug) {
          data.slug = formatSlug(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Auto generated Slug',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
