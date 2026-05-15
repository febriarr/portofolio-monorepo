import { nextJsConfig } from '@workspace/eslint-config/next-js'

export default [
  ...nextJsConfig,
  {
    ignores: ['src/payload-types.ts', 'src/payload-generated-schema.ts'],
  },
]
