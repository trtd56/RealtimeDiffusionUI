import { NextRequest, NextResponse } from 'next/server'
import { generateUI } from '@/lib/llm'

export async function POST(request: NextRequest) {
  try {
    const llmProvider = process.env.LLM_PROVIDER || 'gemini'

    // APIキーの確認
    if (llmProvider === 'gemini' && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local',
        },
        { status: 500 }
      )
    }

    if (llmProvider === 'mercury' && !process.env.MERCURY_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Mercury API key is not configured. Please set MERCURY_API_KEY in .env.local',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { appId, customPrompt } = body

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 })
    }

    // 抽象化レイヤーを使用してUIのHTMLを生成
    const uiHtml = await generateUI(appId, customPrompt)

    return NextResponse.json({ uiHtml })
  } catch (error) {
    console.error('Error generating UI:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate UI with LLM API',
      },
      { status: 500 }
    )
  }
}
