'use client'

import React from 'react'
import { useWindowContext } from '@/contexts/WindowContext'
import { Window } from './Window'
import { GeneratedUI } from '../generated-ui/GeneratedUI'

export const WindowManager: React.FC = () => {
  const { windows } = useWindowContext()

  return (
    <>
      {windows.map((window) => (
        <Window key={window.id} window={window}>
          <GeneratedUI appId={window.appId} />
        </Window>
      ))}
    </>
  )
}
