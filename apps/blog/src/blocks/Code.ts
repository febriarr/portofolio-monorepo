import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'filename',
      type: 'text',
      label: 'Filename (optional)',
    },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'TSX', value: 'tsx' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'JSX', value: 'jsx' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'Bash', value: 'bash' },
        { label: 'JSON', value: 'json' },
        { label: 'SQL', value: 'sql' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
