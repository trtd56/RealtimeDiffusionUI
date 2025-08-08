'use client'

import React, { useEffect, useRef } from 'react'

interface UIRendererProps {
  uiHtml: string
  onAction?: (action: string, payload?: any) => void
}

export const UIRenderer: React.FC<UIRendererProps> = ({ uiHtml, onAction }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // セキュリティ: 必要に応じてoriginのチェックを追加
      // if (event.origin !== 'expected-origin') return;

      const { type, payload } = event.data
      if (type === 'action' && payload && onAction) {
        onAction(payload.action, payload)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [onAction])

  return (
    <iframe
      ref={iframeRef}
      srcDoc={uiHtml}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title="Generated UI"
    />
  )
}
