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

export async function generateUIWithGemini(appId: string): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please set it in .env.local file.'
    )
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
        text: `あなたは優秀なUIデザイナーです。要求されたアプリケーションのUIをJSON形式で設計してください。
以下の条件を満たしてください：
- JSON形式でUIの構造を返す
- 各要素は type, props, children を持つ
- propsにはTailwind CSSクラス名を含める（className）
- 日本語のラベルやプレースホルダーを使用
- モダンで使いやすいUIデザイン
- レスポンシブデザインを考慮
- 適切なインタラクティブ要素（ボタン、入力フィールドなど）を含める
- onClickなどのイベントハンドラーには文字列でアクション名を指定（例: "save", "clear", "calculate"）`,
      },
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
          text: JSON.stringify({
            type: 'div',
            props: { className: 'p-6 max-w-3xl mx-auto' },
            children: [
              {
                type: 'div',
                props: {
                  className: 'bg-white rounded-lg shadow-lg overflow-hidden',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      className:
                        'bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4',
                    },
                    children: [
                      {
                        type: 'h2',
                        props: { className: 'text-2xl font-bold text-white' },
                        children: 'メモ帳',
                      },
                    ],
                  },
                  {
                    type: 'div',
                    props: { className: 'p-6 space-y-4' },
                    children: [
                      {
                        type: 'div',
                        props: {},
                        children: [
                          {
                            type: 'label',
                            props: {
                              className:
                                'block text-sm font-medium text-gray-700 mb-2',
                            },
                            children: 'タイトル',
                          },
                          {
                            type: 'input',
                            props: {
                              type: 'text',
                              className:
                                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                              placeholder: 'メモのタイトルを入力',
                              id: 'title',
                            },
                          },
                        ],
                      },
                      {
                        type: 'div',
                        props: {},
                        children: [
                          {
                            type: 'label',
                            props: {
                              className:
                                'block text-sm font-medium text-gray-700 mb-2',
                            },
                            children: 'カテゴリー',
                          },
                          {
                            type: 'select',
                            props: {
                              className:
                                'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                              id: 'category',
                            },
                            children: [
                              { type: 'option', props: {}, children: '仕事' },
                              {
                                type: 'option',
                                props: {},
                                children: 'プライベート',
                              },
                              {
                                type: 'option',
                                props: {},
                                children: 'アイデア',
                              },
                              { type: 'option', props: {}, children: 'その他' },
                            ],
                          },
                        ],
                      },
                      {
                        type: 'div',
                        props: {},
                        children: [
                          {
                            type: 'label',
                            props: {
                              className:
                                'block text-sm font-medium text-gray-700 mb-2',
                            },
                            children: '内容',
                          },
                          {
                            type: 'textarea',
                            props: {
                              className:
                                'w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none',
                              placeholder: 'メモの内容を入力...',
                              id: 'content',
                            },
                          },
                        ],
                      },
                      {
                        type: 'div',
                        props: {
                          className: 'flex justify-between items-center',
                        },
                        children: [
                          {
                            type: 'div',
                            props: { className: 'text-sm text-gray-500' },
                            children: [
                              {
                                type: 'span',
                                props: { id: 'charCount' },
                                children: '文字数: 0',
                              },
                            ],
                          },
                          {
                            type: 'div',
                            props: { className: 'flex gap-3' },
                            children: [
                              {
                                type: 'button',
                                props: {
                                  className:
                                    'px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors',
                                  onClick: 'clear',
                                },
                                children: 'クリア',
                              },
                              {
                                type: 'button',
                                props: {
                                  className:
                                    'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors',
                                  onClick: 'save',
                                },
                                children: '保存',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          }),
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

    // コードブロックから JSONを抽出
    const jsonMatch =
      text.match(/```json\n?([\s\S]*?)\n?```/) ||
      text.match(/```\n?([\s\S]*?)\n?```/)

    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim())
      } catch (e) {
        console.error('Failed to parse JSON from Gemini:', e)
        // JSONパースに失敗した場合は文字列をそのまま試みる
      }
    }

    // コードブロックがない場合はそのままJSONとしてパースを試みる
    try {
      return JSON.parse(text.trim())
    } catch (e) {
      console.error('Failed to parse response as JSON:', e)
      throw new Error('Gemini returned invalid JSON format')
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    if (error instanceof Error) {
      throw new Error(`Gemini API failed: ${error.message}`)
    }
    throw new Error('Gemini API failed with unknown error')
  }
}
