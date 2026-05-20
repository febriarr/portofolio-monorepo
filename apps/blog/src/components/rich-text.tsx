import {
  RichText as BaseRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { CodeBlockComponent, type CodeBlockProps } from './code'
import { SerializedBlockNode } from 'node_modules/@payloadcms/richtext-lexical/dist/features/blocks/server/nodes/BlocksNode'

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    code: ({ node }: { node: SerializedBlockNode<CodeBlockProps> }) => {
      const { code, language, filename } = node.fields
      return (
        <CodeBlockComponent
          key={node.fields.id}
          code={code}
          language={language}
          filename={filename}
          blockType="code"
        />
      )
    },
  },
})

export function RichText({ data }: { data: Parameters<typeof BaseRichText>[0]['data'] }) {
  return <BaseRichText data={data} converters={jsxConverters} />
}
