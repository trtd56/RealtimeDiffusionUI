'use client'

import { Desktop } from '@/components/desktop/Desktop'
import { WindowManager } from '@/components/window/WindowManager'
import { WindowProvider } from '@/contexts/WindowContext'

export default function Home() {
  return (
    <WindowProvider>
      <main className="h-screen w-screen overflow-hidden">
        <Desktop />
        <WindowManager />
      </main>
    </WindowProvider>
  )
}
