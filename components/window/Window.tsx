'use client'

import React, { useEffect, useState } from 'react'
import { Rnd } from 'react-rnd'
import { WindowState } from '@/types'
import { useWindowContext } from '@/contexts/WindowContext'
import {
  FaTimes,
  FaWindowMinimize,
  FaWindowMaximize,
  FaWindowRestore,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

interface WindowProps {
  window: WindowState
  children?: React.ReactNode
}

export const Window: React.FC<WindowProps> = ({ window, children }) => {
  const {
    focusWindow,
    updateWindow,
    removeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
  } = useWindowContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleDragStop = (_: any, d: { x: number; y: number }) => {
    updateWindow(window.id, { position: { x: d.x, y: d.y } })
  }

  const handleResizeStop = (_: any, __: any, ref: HTMLElement) => {
    updateWindow(window.id, {
      size: {
        width: parseInt(ref.style.width),
        height: parseInt(ref.style.height),
      },
    })
  }

  const handleMaximizeToggle = () => {
    if (window.isMaximized) {
      restoreWindow(window.id)
    } else {
      maximizeWindow(window.id)
    }
  }

  if (window.isMinimized) {
    return null
  }

  const position = window.isMaximized ? { x: 0, y: 0 } : window.position
  const size = window.isMaximized
    ? {
        width: typeof globalThis !== 'undefined' ? globalThis.innerWidth : 1920,
        height:
          (typeof globalThis !== 'undefined' ? globalThis.innerHeight : 1080) -
          48,
      }
    : window.size

  return (
    <AnimatePresence>
      <Rnd
        position={position}
        size={size}
        onDragStart={() => focusWindow(window.id)}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={() => focusWindow(window.id)}
        dragHandleClassName="window-drag-handle"
        enableResizing={!window.isMaximized}
        disableDragging={window.isMaximized}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        style={{
          zIndex: window.zIndex,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden window-shadow"
        >
          <div className="window-header window-drag-handle">
            <span className="font-semibold">{window.title}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => minimizeWindow(window.id)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                <FaWindowMinimize className="text-xs" />
              </button>
              <button
                onClick={handleMaximizeToggle}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                {window.isMaximized ? (
                  <FaWindowRestore className="text-xs" />
                ) : (
                  <FaWindowMaximize className="text-xs" />
                )}
              </button>
              <button
                onClick={() => removeWindow(window.id)}
                className="p-2 hover:bg-red-500 rounded transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              children || window.content
            )}
          </div>
        </motion.div>
      </Rnd>
    </AnimatePresence>
  )
}
