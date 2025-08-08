'use client'

import React from 'react'
import { useWindowContext } from '@/contexts/WindowContext'
import { Plus } from 'lucide-react'

interface TaskbarProps {
  onCreateAppClick: () => void
}

export const Taskbar: React.FC<TaskbarProps> = ({ onCreateAppClick }) => {
  const { windows, activeWindowId, focusWindow, restoreWindow } =
    useWindowContext()

  const handleTaskClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) {
      restoreWindow(windowId)
    } else if (activeWindowId === windowId) {
      // If clicking on active window, minimize it
      const window = windows.find((w) => w.id === windowId)
      if (window) {
        restoreWindow(windowId)
      }
    } else {
      focusWindow(windowId)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 bg-opacity-90 backdrop-blur-md taskbar-shadow flex items-center px-2 z-[99999]">
      <button
        onClick={onCreateAppClick}
        className="h-10 px-4 flex items-center justify-center gap-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
      >
        <Plus className="text-white" size={20} />
        <span className="text-white text-sm font-medium">新しいアプリ</span>
      </button>

      <div className="flex-1 flex items-center px-2 gap-1">
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => handleTaskClick(window.id, window.isMinimized)}
            className={`
              h-9 px-3 rounded flex items-center gap-2 transition-all
              ${
                activeWindowId === window.id && !window.isMinimized
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <span className="text-sm truncate max-w-[150px]">
              {window.title}
            </span>
          </button>
        ))}
      </div>

      <div className="text-white text-xs px-3">
        {new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}
