'use client'

'use client'

import { useState } from 'react'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { Button } from '@workspace/ui/components/button'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="flex items-center gap-1.5 cursor-pointer"
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  )
}
