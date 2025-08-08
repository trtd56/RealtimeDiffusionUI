'use client'

import React, { useState, useCallback } from 'react'

interface UINode {
  type: string
  props?: Record<string, any>
  children?: UINode[] | string
}

interface UIRendererProps {
  uiStructure: UINode
  onAction?: (action: string, data?: any) => void
}

export const UIRenderer: React.FC<UIRendererProps> = ({ uiStructure, onAction }) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({})

  const handleInputChange = useCallback((id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }))
    
    // 文字数カウント更新
    if (id === 'content') {
      const charCountElement = document.getElementById('charCount')
      if (charCountElement) {
        charCountElement.textContent = `文字数: ${value.length}`
      }
    }
  }, [])

  const handleSelectChange = useCallback((id: string, value: string) => {
    setSelectedValues(prev => ({ ...prev, [id]: value }))
  }, [])

  const handleClick = useCallback((action: string) => {
    if (action === 'clear') {
      // すべての入力をクリア
      setInputValues({})
      setSelectedValues({})
      // textareaとinputをクリア
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input: any) => {
        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
          input.value = ''
        } else if (input.tagName === 'SELECT') {
          input.selectedIndex = 0
        }
      })
      // 文字数カウントもリセット
      const charCountElement = document.getElementById('charCount')
      if (charCountElement) {
        charCountElement.textContent = '文字数: 0'
      }
    } else if (action === 'save') {
      // 保存処理
      const data = {
        ...inputValues,
        ...selectedValues,
        timestamp: new Date().toISOString()
      }
      console.log('保存データ:', data)
      alert('メモを保存しました！')
      onAction?.(action, data)
    } else if (action === 'calculate') {
      // 計算処理
      const display = document.getElementById('display') as HTMLInputElement
      if (display && display.value) {
        try {
          // 安全な計算のために Function constructor を使用
          const result = Function('"use strict"; return (' + display.value + ')')()
          display.value = String(result)
        } catch (e) {
          display.value = 'Error'
        }
      }
    } else if (action.startsWith('append:')) {
      // 電卓の数字入力
      const value = action.replace('append:', '')
      const display = document.getElementById('display') as HTMLInputElement
      if (display) {
        if (value === 'C') {
          display.value = ''
        } else if (value === '=') {
          try {
            const result = Function('"use strict"; return (' + display.value + ')')()
            display.value = String(result)
          } catch (e) {
            display.value = 'Error'
          }
        } else {
          display.value += value
        }
      }
    } else {
      // その他のアクション
      onAction?.(action, { inputValues, selectedValues })
    }
  }, [inputValues, selectedValues, onAction])

  const renderNode = (node: UINode | string, key?: number): React.ReactNode => {
    // テキストノード
    if (typeof node === 'string') {
      return node
    }

    const { type, props = {}, children } = node
    const { onClick, ...restProps } = props

    // イベントハンドラーの設定
    const eventHandlers: any = {}
    if (onClick && typeof onClick === 'string') {
      eventHandlers.onClick = () => handleClick(onClick)
    }

    // 入力要素の特別処理
    if (type === 'input') {
      const { id, ...inputProps } = restProps
      return (
        <input
          key={key}
          {...inputProps}
          {...eventHandlers}
          value={inputValues[id] || ''}
          onChange={(e) => handleInputChange(id, e.target.value)}
        />
      )
    }

    if (type === 'textarea') {
      const { id, ...textareaProps } = restProps
      return (
        <textarea
          key={key}
          {...textareaProps}
          {...eventHandlers}
          value={inputValues[id] || ''}
          onChange={(e) => handleInputChange(id, e.target.value)}
        />
      )
    }

    if (type === 'select') {
      const { id, ...selectProps } = restProps
      return (
        <select
          key={key}
          {...selectProps}
          {...eventHandlers}
          value={selectedValues[id] || ''}
          onChange={(e) => handleSelectChange(id, e.target.value)}
        >
          {Array.isArray(children) && children.map((child, idx) => renderNode(child, idx))}
        </select>
      )
    }

    // 標準HTML要素
    const Element = type as keyof React.JSX.IntrinsicElements

    // 子要素のレンダリング
    let renderedChildren: React.ReactNode = null
    if (children) {
      if (typeof children === 'string') {
        renderedChildren = children
      } else if (Array.isArray(children)) {
        renderedChildren = children.map((child, idx) => renderNode(child, idx))
      } else {
        renderedChildren = renderNode(children)
      }
    }

    return (
      <Element key={key} {...restProps} {...eventHandlers}>
        {renderedChildren}
      </Element>
    )
  }

  return <>{renderNode(uiStructure)}</>
}