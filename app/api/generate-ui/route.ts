import { NextRequest, NextResponse } from 'next/server'
import { generateUIWithGemini } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { appId } = body

    if (!appId) {
      return NextResponse.json(
        { error: 'appId is required' },
        { status: 400 }
      )
    }

    // Gemini APIを使用してHTMLを生成
    const htmlContent = await generateUIWithGemini(appId)

    return NextResponse.json({ html: htmlContent })
  } catch (error) {
    console.error('Error generating UI:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate UI with Gemini API' 
      },
      { status: 500 }
    )
  }
}