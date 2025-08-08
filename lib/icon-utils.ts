import * as icons from 'lucide-react'

// アイコン名からコンポーネントを取得するヘルパー関数
export function getIconComponent(iconName: string) {
  // アイコン名をPascalCaseに変換（例: "rocket" -> "Rocket"）
  const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1)

  // lucide-reactからアイコンコンポーネントを取得
  const IconComponent = (icons as any)[pascalCase]

  // アイコンが見つからない場合はRocketアイコンをデフォルトとして使用
  return IconComponent || icons.Rocket
}
