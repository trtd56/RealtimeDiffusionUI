'use client'

import React from 'react'
import { AppIcon } from './AppIcon'
import { Taskbar } from './Taskbar'
import { useWindowContext } from '@/contexts/WindowContext'
import { AppConfig } from '@/types'
import {
  FaCalculator,
  FaFileAlt,
  FaPaintBrush,
  FaCode,
  FaTable,
  FaEnvelope,
} from 'react-icons/fa'

const apps: AppConfig[] = [
  {
    id: 'notepad',
    name: 'メモ帳',
    icon: <FaFileAlt />,
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: 'calculator',
    name: '電卓',
    icon: <FaCalculator />,
    defaultSize: { width: 320, height: 480 },
  },
  {
    id: 'paint',
    name: 'ペイント',
    icon: <FaPaintBrush />,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'code',
    name: 'コードエディタ',
    icon: <FaCode />,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'table',
    name: 'テーブル',
    icon: <FaTable />,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: 'mail',
    name: 'メール',
    icon: <FaEnvelope />,
    defaultSize: { width: 800, height: 600 },
  },
]

export const Desktop: React.FC = () => {
  const { addWindow } = useWindowContext()

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
    })
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-8 gap-2 p-4">
        {apps.map((app) => (
          <AppIcon
            key={app.id}
            app={app}
            onDoubleClick={() => handleAppDoubleClick(app)}
          />
        ))}
      </div>
      <Taskbar />
    </div>
  )
}
