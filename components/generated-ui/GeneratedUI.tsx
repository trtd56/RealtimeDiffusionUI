'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DOMPurify from 'dompurify'

interface GeneratedUIProps {
  appId: string
}

export const GeneratedUI: React.FC<GeneratedUIProps> = ({ appId }) => {
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [displayedHtml, setDisplayedHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // UIを生成する関数
    const generateUI = async () => {
      setIsGenerating(true)
      setDisplayedHtml('')
      setError(null)
      
      try {
        // APIエンドポイントにリクエスト
        const response = await fetch('/api/generate-ui', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ appId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `API request failed: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        // DOMPurifyでサニタイズ（XSS攻撃を防ぐ）
        const sanitizedHtml = DOMPurify.sanitize(data.html, {
          ALLOWED_TAGS: [
            'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'button', 'input', 'textarea', 'select', 'option', 'label',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'ul', 'ol', 'li', 'nav', 'canvas', 'form', 'fieldset', 'legend',
            'svg', 'path', 'strong', 'em', 'br', 'hr', 'small', 'code', 'pre'
          ],
          ALLOWED_ATTR: [
            'class', 'id', 'type', 'placeholder', 'value', 'readonly',
            'style', 'min', 'max', 'for', 'width', 'height', 'name',
            'viewBox', 'fill', 'stroke', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'd',
            'colspan', 'rowspan', 'disabled', 'checked', 'selected', 'required',
            'autocomplete', 'autofocus', 'multiple', 'pattern', 'step'
          ],
          KEEP_CONTENT: true,
          ALLOW_DATA_ATTR: false,
        })
        
        setHtmlContent(sanitizedHtml)
        
        // タイピングアニメーションのシミュレーション
        // HTMLを段階的に表示
        const chunks = sanitizedHtml.match(/<[^>]+>|[^<]+/g) || []
        let currentHtml = ''
        
        for (let i = 0; i < chunks.length; i++) {
          currentHtml += chunks[i]
          setDisplayedHtml(currentHtml)
          await new Promise(resolve => setTimeout(resolve, 3)) // 各要素を3msごとに追加
        }
        
      } catch (err) {
        console.error('Error generating UI:', err)
        setError(err instanceof Error ? err.message : 'UI生成に失敗しました')
      } finally {
        setIsGenerating(false)
      }
    }

    generateUI()
  }, [appId])

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-8"
      >
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">エラーが発生しました</h3>
          <p className="text-sm">{error}</p>
          {error.includes('GEMINI_API_KEY') && (
            <div className="mt-4 text-xs">
              <p className="font-semibold">設定方法:</p>
              <ol className="list-decimal list-inside mt-1">
                <li>.env.localファイルを作成</li>
                <li>GEMINI_API_KEY=your-api-key を追加</li>
                <li>サーバーを再起動</li>
              </ol>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (isGenerating && !displayedHtml) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-8"
      >
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 text-center">
          AIがUIを生成しています...
          <br />
          <span className="text-sm text-gray-500">
            Gemini APIでHTMLを生成中
          </span>
        </p>
        <div className="mt-4 w-full max-w-md">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-blue-500 h-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-auto relative"
    >
      {isGenerating && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm animate-pulse z-50">
          生成中...
        </div>
      )}
      
      <div 
        dangerouslySetInnerHTML={{ __html: displayedHtml }}
        className="generated-content"
      />
    </motion.div>
  )
}