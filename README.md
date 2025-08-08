# ジェネレーティブUI仮想デスクトップ

Gemini APIを使用してAIが動的にUIを生成する仮想デスクトップアプリケーションです。

## 機能

- 🖥️ 仮想デスクトップ環境
- 🪟 ドラッグ＆リサイズ可能なウィンドウシステム
- 🤖 Gemini APIによるリアルタイムUI生成
- ⚡ **生成されたUIが実際に操作可能** - ボタン、入力フィールド、選択メニューなどが動作
- 🔒 セキュアなコンポーネントレンダリング
- 🎨 6種類のアプリケーション（メモ帳、電卓、ペイント、コードエディタ、表計算、メール）

## 必要要件

- Node.js 18以上
- Gemini API キー（必須）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Gemini APIキーの設定（必須）

`.env.local`ファイルを作成し、Gemini APIキーを設定します：

```bash
# .env.localファイルを作成
touch .env.local
```

`.env.local`ファイルに以下を記述：

```
GEMINI_API_KEY=your-actual-api-key-here
```

> ⚠️ **重要**: Gemini APIキーは必須です。キーがない場合はアプリケーションが動作しません。

APIキーは[Google AI Studio](https://makersuite.google.com/app/apikey)から無料で取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 使い方

1. デスクトップ上のアプリアイコンをダブルクリック
2. ウィンドウが開き、Gemini APIがUIを自動生成
3. 生成されたUIで実際に操作が可能：
   - テキストフィールドへの入力
   - ボタンのクリック（保存、クリア、計算など）
   - ドロップダウンメニューの選択
   - 各アプリケーション固有の機能
4. 毎回異なるUIが生成され、AIの創造性を体験できます

## アーキテクチャ

### AI UI生成フロー

1. ユーザーがアプリアイコンをダブルクリック
2. フロントエンドが `/api/generate-ui` にPOSTリクエスト
3. サーバーサイドでGemini APIを呼び出し
4. GeminiがJSON形式でUI構造を生成
5. UIRendererコンポーネントがJSONをReactコンポーネントに変換
6. イベントハンドラーを動的に割り当て、インタラクティブなUIを実現
7. 段階的なアニメーションでUIを表示

### 技術スタック

- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全な開発
- **Tailwind CSS** - スタイリング
- **Framer Motion** - アニメーション
- **react-rnd** - ドラッグ＆リサイズ
- **Google Gemini AI** - UI構造の生成（JSON形式）
- **カスタムUIRenderer** - 動的コンポーネントレンダリング

## ビルド

```bash
npm run build
npm start
```

## トラブルシューティング

### エラー: "Gemini API key is not configured"

`.env.local`ファイルにGEMINI_API_KEYが正しく設定されているか確認してください。
設定後はサーバーの再起動が必要です。

### APIリクエストが失敗する

- APIキーが有効であることを確認
- インターネット接続を確認
- [Google AI Studio](https://makersuite.google.com/app/apikey)でAPIキーのステータスを確認

## ライセンス

MIT
