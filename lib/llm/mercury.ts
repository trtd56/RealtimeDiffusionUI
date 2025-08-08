import OpenAI from 'openai'
import { UIGeneratorProvider } from './types'

const appTypePrompts: Record<string, string> = {
  notepad: 'テキストエディタ・メモ帳アプリ',
  calculator: '電卓アプリ',
  paint: 'ペイントツール・お絵かきアプリ',
  code: 'コードエディタ・IDE',
  table: 'スプレッドシート・表計算アプリ',
  mail: 'メールクライアント',
}

export class MercuryProvider implements UIGeneratorProvider {
  private client: OpenAI

  constructor() {
    const apiKey = process.env.MERCURY_API_KEY

    if (!apiKey) {
      throw new Error(
        'MERCURY_API_KEY is not configured. Please set it in .env.local file.'
      )
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.inceptionlabs.ai/v1',
    })
  }

  async generateUI(appId: string, customPrompt?: string): Promise<string> {
    const appType =
      customPrompt || appTypePrompts[appId] || `${appId}アプリケーション`

    const systemInstruction = `あなたは優秀なUIデザイナーです。要求されたアプリケーションのUIを、単一のHTMLファイルとして生成してください。
以下の条件を厳守してください：
- 全体を\`<html>\`から\`</html>\`まで含む、完全なHTML文字列を生成する
- \`<head>\`内でTailwind CSSをCDNから読み込む（<script src="https://cdn.tailwindcss.com"></script>）
- UIは日本語を基本とし、モダンでレスポンシブなデザインにする
- インタラクティブな要素（ボタンなど）がクリックされた場合、JavaScriptの \`window.parent.postMessage\` を使用して、親ウィンドウにアクションを通知する
- postMessageで送信するデータは \`{ type: 'action', payload: { action: 'アクション名', ... } }\` の形式のJSONオブジェクトとする
- 生成するコードは、\`\`\`html ... \`\`\` のようなマークダウンのコードブロックで囲むこと
- HTML以外のテキスト（説明など）は一切含めないこと`

    try {
      const response = await this.client.chat.completions.create({
        model: 'mercury',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: 'メモ帳アプリ' },
          {
            role: 'assistant',
            content: `\`\`\`html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>メモ帳</title>
</head>
<body class="bg-gray-100">
  <div class="p-6 max-w-3xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 class="text-2xl font-bold text-white">メモ帳</h2>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
          <input type="text" id="title" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="メモのタイトルを入力">
        </div>
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">カテゴリー</label>
          <select id="category" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>仕事</option>
            <option>プライベート</option>
            <option>アイデア</option>
            <option>その他</option>
          </select>
        </div>
        <div>
          <label for="content" class="block text-sm font-medium text-gray-700 mb-2">内容</label>
          <textarea id="content" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 resize-none" placeholder="メモの内容を入力..."></textarea>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            <span id="charCount">文字数: 0</span>
          </div>
          <div class="flex gap-3">
            <button id="clear-btn" class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">クリア</button>
            <button id="save-btn" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <script>
    const content = document.getElementById('content');
    const charCount = document.getElementById('charCount');
    content.addEventListener('input', () => {
      charCount.textContent = '文字数: ' + content.value.length;
    });

    document.getElementById('save-btn').addEventListener('click', () => {
      const title = document.getElementById('title').value;
      const category = document.getElementById('category').value;
      const text = document.getElementById('content').value;
      window.parent.postMessage({
        type: 'action',
        payload: {
          action: 'save',
          title,
          category,
          text,
          charCount: text.length
        }
      }, '*');
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
      document.getElementById('title').value = '';
      document.getElementById('content').value = '';
      charCount.textContent = '文字数: 0';
      window.parent.postMessage({
        type: 'action',
        payload: { action: 'clear' }
      }, '*');
    });
  </script>
</body>
</html>
\`\`\``,
          },
          { role: 'user', content: appType },
        ],
        max_tokens: 4000,
        temperature: 0.7,
      })

      const text = response.choices[0]?.message?.content || ''

      const htmlMatch = text.match(/```html\n?([\s\S]*?)\n?```/)
      if (htmlMatch) {
        return htmlMatch[1].trim()
      }

      if (
        text.trim().startsWith('<!DOCTYPE html>') ||
        text.trim().startsWith('<html>')
      ) {
        return text.trim()
      }

      throw new Error('Mercury did not return valid HTML format.')
    } catch (error) {
      console.error('Mercury API Error:', error)
      if (error instanceof Error) {
        throw new Error(`Mercury API failed: ${error.message}`)
      }
      throw new Error('Mercury API failed with unknown error')
    }
  }
}
