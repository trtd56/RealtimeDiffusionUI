export interface WindowState {
  id: string
  appId: string
  title: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  content?: React.ReactNode
}

export interface AppConfig {
  id: string
  name: string
  icon: React.ReactNode
  defaultSize?: { width: number; height: number }
  defaultPosition?: { x: number; y: number }
}

export interface UIElement {
  type: 'label' | 'input' | 'button' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'container'
  id?: string
  text?: string
  placeholder?: string
  options?: string[]
  value?: string | boolean
  children?: UIElement[]
  className?: string
}

export interface GeneratedUIData {
  type: string
  title: string
  elements: UIElement[]
}