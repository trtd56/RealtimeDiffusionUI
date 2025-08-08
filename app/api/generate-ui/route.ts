import { NextRequest, NextResponse } from 'next/server'
import { generateUIWithGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { appId, customPrompt } = body

    if (!appId) {
      return NextResponse.json({ error: 'appId is required' }, { status: 400 })
    }

    // Gemini APIを使用してUIのHTMLを生成
    const uiHtml = await generateUIWithGemini(appId, customPrompt)

    return NextResponse.json({ uiHtml })
  } catch (error) {
    console.error('Error generating UI:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate UI with Gemini API',
      },
      { status: 500 }
    )
  }
}
