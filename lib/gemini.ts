import { GoogleGenAI } from '@google/genai'

// アプリケーションタイプに応じたプロンプトマッピング
const appTypePrompts: Record<string, string> = {
  notepad: 'テキストエディタ・メモ帳アプリ',
  calculator: '電卓アプリ',
  paint: 'ペイントツール・お絵かきアプリ',
  code: 'コードエディタ・IDE',
  table: 'スプレッドシート・表計算アプリ',
  mail: 'メールクライアント',
}

export async function generateUIWithGemini(appId: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in .env.local file.')
  }

  const ai = new GoogleGenAI({
    apiKey,
  })

  const appType = appTypePrompts[appId] || `${appId}アプリケーション`

  const config = {
    thinkingConfig: {
      thinkingBudget: 0,
    },
    systemInstruction: [
      {
        text: `あなたは優秀なUIデザイナーです。要求されたアプリケーションのUIをHTMLで実装してください。
以下の条件を満たしてください：
- HTMLコードのみを返す（DOCTYPE宣言や<html>タグは不要）
- Tailwind CSSクラスを使用してスタイリング
- 日本語のラベルやプレースホルダーを使用
- モダンで使いやすいUIデザイン
- レスポンシブデザインを考慮
- 適切なインタラクティブ要素（ボタン、入力フィールドなど）を含める
- 実際に機能しそうな本格的なUIを作成`,
      }
    ],
  }

  const model = 'gemini-2.5-flash-lite'
  
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: 'メモ帳アプリ',
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `<div class="p-6 max-w-3xl mx-auto">
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
      <h2 class="text-2xl font-bold text-white">メモ帳</h2>
    </div>
    <div class="p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
        <input type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="メモのタイトルを入力">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
        <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>仕事</option>
          <option>プライベート</option>
          <option>アイデア</option>
          <option>その他</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">内容</label>
        <textarea class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none" placeholder="メモの内容を入力..."></textarea>
      </div>
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          <span>文字数: 0</span>
        </div>
        <div class="flex gap-3">
          <button class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">クリア</button>
          <button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">保存</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: appType,
        },
      ],
    },
  ]

  try {
    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    })

    const text = response.text || ''
    
    // コードブロックから HTMLを抽出
    const htmlMatch = text.match(/```html\n?([\s\S]*?)\n?```/) || 
                      text.match(/```\n?([\s\S]*?)\n?```/)
    
    if (htmlMatch) {
      return htmlMatch[1].trim()
    }
    
    // コードブロックがない場合はそのまま返す
    return text.trim()
  } catch (error) {
    console.error('Gemini API Error:', error)
    if (error instanceof Error) {
      throw new Error(`Gemini API failed: ${error.message}`)
    }
    throw new Error('Gemini API failed with unknown error')
  }
}