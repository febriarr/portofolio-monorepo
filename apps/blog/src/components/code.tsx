import { CopyButton } from './copy-button'
import { getHighlighter } from '@/utils/highlighter'

export type CodeBlockProps = {
  code: string
  language?: string
  filename?: string
  blockType: 'code'
}

type Props = CodeBlockProps & { className?: string }

export async function CodeBlockComponent({ code, language = 'typescript', filename }: Props) {
  if (!code) return null

  const highlighter = await getHighlighter()

  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: 'css-variables',
  })

  return (
    <div className="my-6 overflow-hidden rounded-none border border-border font-mono text-sm relative">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
        <span className="text-xs text-muted-foreground">{filename ?? language}</span>
        <CopyButton code={code} />
      </div>
      <div
        className={`
          [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm [&>pre]:leading-6
          [&_.diff.add]:bg-green-500/15 [&_.diff.add]:relative
          [&_.diff.remove]:bg-red-500/15 [&_.diff.remove]:relative
          [&_.diff.add]:before:content-['+'] [&_.diff.add]:before:absolute [&_.diff.add]:before:left-1 [&_.diff.add]:before:text-green-400
          [&_.diff.remove]:before:content-['-'] [&_.diff.remove]:before:absolute [&_.diff.remove]:before:left-1 [&_.diff.remove]:before:text-red-400 
        `}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
