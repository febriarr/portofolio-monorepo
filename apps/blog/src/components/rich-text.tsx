import {
  RichText as BaseRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { CodeBlockComponent, type CodeBlockProps } from './code'

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    code: ({ node }: { node: any }) => {
      const { code, language, filename } = node.fields as CodeBlockProps
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
