import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// lucide-reactで利用可能な一般的なアイコンのリスト
const availableIcons = [
  'Activity',
  'Airplay',
  'AlertCircle',
  'Archive',
  'BarChart',
  'Battery',
  'Bell',
  'Book',
  'Bookmark',
  'Box',
  'Briefcase',
  'Calendar',
  'Camera',
  'Cast',
  'Check',
  'ChevronDown',
  'ChevronUp',
  'Circle',
  'Clipboard',
  'Clock',
  'Cloud',
  'Code',
  'Coffee',
  'Command',
  'Compass',
  'Copy',
  'CreditCard',
  'Database',
  'Download',
  'Edit',
  'ExternalLink',
  'Eye',
  'Facebook',
  'File',
  'FileText',
  'Film',
  'Filter',
  'Flag',
  'Folder',
  'Gift',
  'GitBranch',
  'Globe',
  'Grid',
  'HardDrive',
  'Hash',
  'Headphones',
  'Heart',
  'HelpCircle',
  'Home',
  'Image',
  'Inbox',
  'Info',
  'Key',
  'Layers',
  'Layout',
  'Link',
  'List',
  'Lock',
  'LogIn',
  'LogOut',
  'Mail',
  'Map',
  'MapPin',
  'Menu',
  'MessageCircle',
  'MessageSquare',
  'Mic',
  'Monitor',
  'Moon',
  'Music',
  'Navigation',
  'Package',
  'Paperclip',
  'Pause',
  'PenTool',
  'Phone',
  'PieChart',
  'Play',
  'Plus',
  'Pocket',
  'Power',
  'Printer',
  'Radio',
  'RefreshCw',
  'Repeat',
  'RotateCw',
  'Rss',
  'Save',
  'Search',
  'Send',
  'Server',
  'Settings',
  'Share',
  'Shield',
  'ShoppingBag',
  'ShoppingCart',
  'Shuffle',
  'Sidebar',
  'SkipBack',
  'SkipForward',
  'Slack',
  'Smartphone',
  'Smile',
  'Speaker',
  'Square',
  'Star',
  'Sun',
  'Sunrise',
  'Sunset',
  'Tablet',
  'Tag',
  'Target',
  'Terminal',
  'Thermometer',
  'ThumbsUp',
  'ToggleLeft',
  'Tool',
  'Trash',
  'TrendingUp',
  'Truck',
  'Tv',
  'Twitter',
  'Type',
  'Umbrella',
  'Unlock',
  'Upload',
  'User',
  'UserCheck',
  'UserPlus',
  'Users',
  'Video',
  'Volume',
  'Watch',
  'Wifi',
  'Wind',
  'X',
  'Zap',
  'ZoomIn',
  'ZoomOut',
  'Gamepad2',
  'Calculator',
  'Palette',
  'Scissors',
  'Wrench',
  'Hammer',
  'Lightbulb',
  'Rocket',
  'Brain',
  'Cpu',
  'Sparkles',
  'Wand2',
  'Binary',
  'Bot',
  'Blocks',
  'Beaker',
  'Atom',
  'Bug',
  'Cog',
  'Gauge',
  'Layers2',
  'Network',
  'Workflow',
]

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'name and description are required' },
        { status: 400 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const prompt = `アプリの名前: "${name}"
アプリの説明: "${description}"

上記のアプリケーションに最も適したアイコンを、以下のリストから1つ選んでください。
アプリの機能や目的を考慮して、最も直感的で分かりやすいアイコンを選択してください。

利用可能なアイコン:
${availableIcons.join(', ')}

回答は選択したアイコン名のみを返してください（例: "Calendar"）。
説明や理由は不要です。アイコン名のみを返してください。`

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    })

    const selectedIcon = response.text?.trim() || 'Rocket'

    // 選択されたアイコンが利用可能なリストに含まれているか確認
    const validIcon = availableIcons.includes(selectedIcon)
      ? selectedIcon
      : 'Rocket'

    return NextResponse.json({ icon: validIcon })
  } catch (error) {
    console.error('Error generating icon:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to generate icon',
      },
      { status: 500 }
    )
  }
}
