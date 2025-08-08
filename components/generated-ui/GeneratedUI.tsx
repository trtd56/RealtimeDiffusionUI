'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { UIRenderer } from './UIRenderer'

interface GeneratedUIProps {
  appId: string
  customPrompt?: string
}

export const GeneratedUI: React.FC<GeneratedUIProps> = ({
  appId,
  customPrompt,
}) => {
  const [uiHtml, setUiHtml] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateUI = async () => {
      setIsGenerating(true)
      setUiHtml('')
      setError(null)

      try {
        // APIエンドポイントにリクエスト
        const response = await fetch('/api/generate-ui', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ appId, customPrompt }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || `API request failed: ${response.status}`
          )
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        // HTML文字列を設定
        setUiHtml(data.uiHtml)
      } catch (err) {
        console.error('Error generating UI:', err)
        setError(err instanceof Error ? err.message : 'UI生成に失敗しました')
      } finally {
        setIsGenerating(false)
      }
    }

    generateUI()
  }, [appId, customPrompt])

  // iframeからのアクションハンドラー
  const handleAction = useCallback((action: string, payload?: any) => {
    console.log(`アクション実行: ${action}`, payload)

    // アクションに応じた処理を実装
    switch (action) {
      case 'save':
        console.log('保存データ:', payload)
        // ここで実際の保存処理を実装（APIコール、ローカルストレージなど）
        alert(
          `メモを保存しました！\nタイトル: ${payload.title}\nカテゴリー: ${payload.category}\n文字数: ${payload.charCount}`
        )
        break
      case 'clear':
        console.log('クリア実行')
        break
      default:
        console.log('未定義のアクション:', action)
    }
  }, [])

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

  if (isGenerating && !uiHtml) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-hidden relative"
    >
      {uiHtml && <UIRenderer uiHtml={uiHtml} onAction={handleAction} />}
    </motion.div>
  )
}
