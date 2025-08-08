'use client'

import React, { useState } from 'react'
import { AppIcon } from './AppIcon'
import { Taskbar } from './Taskbar'
import { CreateAppModal } from './CreateAppModal'
import { useWindowContext } from '@/contexts/WindowContext'
import { useCustomApps } from '@/hooks/useCustomApps'
import { AppConfig } from '@/types'

const defaultApps: AppConfig[] = []

export const Desktop: React.FC = () => {
  const { addWindow } = useWindowContext()
  const { customApps, addCustomApp, removeCustomApp } = useCustomApps()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allApps = [...defaultApps, ...customApps]

  const handleAppDoubleClick = (app: AppConfig) => {
    const centerX = (window.innerWidth - (app.defaultSize?.width || 600)) / 2
    const centerY = (window.innerHeight - (app.defaultSize?.height || 400)) / 2

    addWindow({
      appId: app.id,
      title: app.name,
      position: { x: centerX, y: centerY },
      size: app.defaultSize || { width: 600, height: 400 },
      isMinimized: false,
      isMaximized: false,
      customPrompt: app.prompt,
    })
  }

  const handleCreateApp = (appData: Omit<AppConfig, 'id'>) => {
    addCustomApp(appData)
  }

  const handleRightClick = (e: React.MouseEvent, app: AppConfig) => {
    if (app.isCustom) {
      e.preventDefault()
      if (confirm(`「${app.name}」を削除しますか？`)) {
        removeCustomApp(app.id)
      }
    }
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 gap-2 p-4">
        {allApps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            onDoubleClick={() => handleAppDoubleClick(app)}
            onContextMenu={(e) => handleRightClick(e, app)}
          />
        ))}
      </div>

      <Taskbar onCreateAppClick={() => setIsModalOpen(true)} />

      <CreateAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateApp}
      />
    </div>
  )
}
