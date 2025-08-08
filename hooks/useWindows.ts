import { useState, useCallback, useRef } from 'react'
import { WindowState } from '@/types'

export const useWindows = () => {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const nextZIndex = useRef(1000)

  const addWindow = useCallback((window: Omit<WindowState, 'id' | 'zIndex'>) => {
    const newWindow: WindowState = {
      ...window,
      id: `window-${Date.now()}`,
      zIndex: nextZIndex.current++,
    }
    setWindows((prev) => [...prev, newWindow])
    setActiveWindowId(newWindow.id)
    return newWindow.id
  }, [])

  const removeWindow = useCallback((windowId: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== windowId))
    setActiveWindowId((prev) => (prev === windowId ? null : prev))
  }, [])

  const focusWindow = useCallback((windowId: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === windowId ? { ...w, zIndex: nextZIndex.current++ } : w
      )
    )
    setActiveWindowId(windowId)
  }, [])

  const updateWindow = useCallback(
    (windowId: string, updates: Partial<WindowState>) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, ...updates } : w))
      )
    },
    []
  )

  const minimizeWindow = useCallback((windowId: string) => {
    updateWindow(windowId, { isMinimized: true })
  }, [updateWindow])

  const restoreWindow = useCallback((windowId: string) => {
    updateWindow(windowId, { isMinimized: false, isMaximized: false })
    focusWindow(windowId)
  }, [updateWindow, focusWindow])

  const maximizeWindow = useCallback((windowId: string) => {
    updateWindow(windowId, { isMaximized: true, isMinimized: false })
  }, [updateWindow])

  return {
    windows,
    activeWindowId,
    addWindow,
    removeWindow,
    focusWindow,
    updateWindow,
    minimizeWindow,
    restoreWindow,
    maximizeWindow,
  }
}