import { postgresAdapter } from '@payloadcms/db-postgres'
import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Config } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from '@/collections/Posts'
import { Categories } from '@/collections/Categories'
import { Tags } from '@/collections/Tags'
import { CodeBlock } from '@/blocks/Code'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Posts, Categories, Tags],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      BlocksFeature({
        blocks: [CodeBlock],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp: sharp as unknown as NonNullable<Config['sharp']>,
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.R2_BUCKET),
      collections: {
        media: {
          prefix: 'blog',
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => {
            const key = prefix ? `${prefix}/${filename}` : filename
            return `${process.env.R2_PUBLIC_URL}/${key}`
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        // R2 S3 API endpoint — for uploads only, not for serving files
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
})
