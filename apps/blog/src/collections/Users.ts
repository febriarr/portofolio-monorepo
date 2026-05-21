import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'email',
      type: 'email',
      access: {
        read: ({ req: { user } }) => !!user,
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'sessions',
      type: 'array',
      access: {
        read: ({ req: { user } }) => !!user,
      },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'createdAt', type: 'date' },
        { name: 'expiresAt', type: 'date' },
      ],
    },
  ],
}
