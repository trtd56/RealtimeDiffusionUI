'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes,
  FaRocket,
  FaQuestionCircle,
  FaLightbulb,
  FaGlobe,
  FaGamepad,
  FaMusic,
  FaBriefcase,
  FaHeart,
} from 'react-icons/fa'
import { AppConfig } from '@/types'

interface CreateAppModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (app: Omit<AppConfig, 'id'>) => void
}

// アイコン候補のマッピング
const iconSuggestions = [
  { keyword: 'game', icon: <FaGamepad /> },
  { keyword: 'music', icon: <FaMusic /> },
  { keyword: 'work', icon: <FaBriefcase /> },
  { keyword: 'health', icon: <FaHeart /> },
  { keyword: 'web', icon: <FaGlobe /> },
  { keyword: 'idea', icon: <FaLightbulb /> },
]

const getIconForApp = (description: string): React.ReactNode => {
  const lowerDesc = description.toLowerCase()
  for (const suggestion of iconSuggestions) {
    if (lowerDesc.includes(suggestion.keyword)) {
      return suggestion.icon
    }
  }
  return <FaRocket /> // デフォルトアイコン
}

export const CreateAppModal: React.FC<CreateAppModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [appName, setAppName] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appName || !description) return

    setIsCreating(true)

    // アイコンを自動選択
    const icon = getIconForApp(description)

    // アプリ作成
    onCreate({
      name: appName,
      description,
      prompt: description,
      icon,
      defaultSize: { width: 700, height: 500 },
      isCustom: true,
    })

    // リセット
    setAppName('')
    setDescription('')
    setIsCreating(false)
    onClose()
  }

  const examples = [
    'TODOリストアプリを作って',
    '天気予報アプリを作成',
    'ポモドーロタイマーアプリ',
    '簡単な音楽プレーヤー',
    'マークダウンエディタ',
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ヘッダー */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    新しいアプリを作成
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>

              {/* コンテンツ */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* アプリ名入力 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    アプリ名
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="例: タスク管理"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {/* 説明入力 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    どんなアプリを作りたいですか？
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="アプリの機能や目的を説明してください..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none"
                    required
                  />
                </div>

                {/* 例示 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FaQuestionCircle className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      例えばこんなアプリが作れます
                    </span>
                  </div>
                  <div className="space-y-1">
                    {examples.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setDescription(example)}
                        className="block w-full text-left text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                      >
                        • {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !appName || !description}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? '作成中...' : 'アプリを作成'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
