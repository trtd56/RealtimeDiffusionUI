'use client'

import React from 'react'
import { AppConfig } from '@/types'

interface AppIconProps {
  app: AppConfig
  onDoubleClick: () => void
}

export const AppIcon: React.FC<AppIconProps> = ({ app, onDoubleClick }) => {
  return (
    <div
      className="desktop-icon w-20 h-20 text-white"
      onDoubleClick={onDoubleClick}
    >
      <div className="text-3xl mb-1">{app.icon}</div>
      <span className="text-xs text-center">{app.name}</span>
    </div>
  )
}
