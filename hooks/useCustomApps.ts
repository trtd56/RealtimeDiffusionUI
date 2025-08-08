'use client'

import { useState, useCallback } from 'react'
import { AppConfig } from '@/types'

export const useCustomApps = () => {
  const [customApps, setCustomApps] = useState<AppConfig[]>([])

  // カスタムアプリを追加
  const addCustomApp = useCallback(
    (app: Omit<AppConfig, 'id'>) => {
      const newApp: AppConfig = {
        ...app,
        id: `custom_${Date.now()}`,
        isCustom: true,
      }
      const updatedApps = [...customApps, newApp]
      setCustomApps(updatedApps)
      return newApp
    },
    [customApps]
  )

  // カスタムアプリを削除
  const removeCustomApp = useCallback(
    (appId: string) => {
      const updatedApps = customApps.filter((app) => app.id !== appId)
      setCustomApps(updatedApps)
    },
    [customApps]
  )

  return {
    customApps,
    addCustomApp,
    removeCustomApp,
  }
}
