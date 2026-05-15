import { createHighlighter, type Highlighter } from 'shiki'

const cssVariablesTheme = {
  name: 'css-variables',
  type: 'dark' as const,
  colors: {
    'editor.background': 'transparent',
    'editor.foreground': 'var(--shiki-color-text)',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: 'var(--shiki-token-comment)' },
    },
    {
      scope: ['constant', 'entity.name.constant', 'variable.other.constant', 'variable.language'],
      settings: { foreground: 'var(--shiki-token-constant)' },
    },
    {
      scope: ['entity', 'entity.name'],
      settings: { foreground: 'var(--shiki-token-function)' },
    },
    {
      scope: ['entity.name.tag'],
      settings: { foreground: 'var(--shiki-token-keyword)' },
    },
    {
      scope: ['keyword', 'storage', 'storage.type'],
      settings: { foreground: 'var(--shiki-token-keyword)' },
    },
    {
      scope: ['storage.modifier.package', 'storage.modifier.import', 'storage.type.java'],
      settings: { foreground: 'var(--shiki-color-text)' },
    },
    {
      scope: ['string', 'string punctuation.section.embedded source'],
      settings: { foreground: 'var(--shiki-token-string)' },
    },
    {
      scope: ['support'],
      settings: { foreground: 'var(--shiki-token-constant)' },
    },
    {
      scope: ['meta.property-name'],
      settings: { foreground: 'var(--shiki-token-constant)' },
    },
    {
      scope: ['variable'],
      settings: { foreground: 'var(--shiki-token-parameter)' },
    },
    {
      scope: ['variable.other.property'],
      settings: { foreground: 'var(--shiki-token-constant)' },
    },
    {
      scope: ['punctuation'],
      settings: { foreground: 'var(--shiki-token-punctuation)' },
    },
  ],
}

let highlighter: Highlighter | null = null

export async function getHighlighter() {
  if (highlighter) return highlighter

  highlighter = await createHighlighter({
    themes: [cssVariablesTheme],
    langs: [
      'typescript',
      'tsx',
      'javascript',
      'jsx',
      'css',
      'html',
      'bash',
      'json',
      'sql',
      'python',
      'java',
    ],
  })

  return highlighter
}
