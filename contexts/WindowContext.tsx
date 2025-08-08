'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { WindowState } from '@/types'
import { useWindows } from '@/hooks/useWindows'

interface WindowContextType {
  windows: WindowState[]
  activeWindowId: string | null
  addWindow: (window: Omit<WindowState, 'id' | 'zIndex'>) => string
  removeWindow: (windowId: string) => void
  focusWindow: (windowId: string) => void
  updateWindow: (windowId: string, updates: Partial<WindowState>) => void
  minimizeWindow: (windowId: string) => void
  restoreWindow: (windowId: string) => void
  maximizeWindow: (windowId: string) => void
}

const WindowContext = createContext<WindowContextType | undefined>(undefined)

export const WindowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const windowManager = useWindows()

  return (
    <WindowContext.Provider value={windowManager}>
      {children}
    </WindowContext.Provider>
  )
}

export const useWindowContext = () => {
  const context = useContext(WindowContext)
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider')
  }
  return context
}
