# ♊️ Gemini Chat Exporter

Geminiのチャット履歴をエクスポートするChrome拡張機能です。

## 📋 概要

この拡張機能を使用すると、Gemini（gemini.google.com）でのチャット会話をMarkdown形式でエクスポートできます。

### 🎯 主な機能

- ✅ Geminiのチャット履歴を自動抽出
- ✅ Markdown形式（.txt）でのエクスポート
- ✅ ユーザーとAIの会話を適切に区別して保存
- ✅ 直感的なPopup UIでワンクリックエクスポート
- ✅ Chrome Extension Manifest V3対応

### 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **UIライブラリ**: Material-UI (MUI)
- **拡張機能**: Chrome Extension Manifest V3
- **Content Script**: DOM解析によるチャットデータ抽出

## 🚀 インストール方法

### 前提条件

- Node.js (v18以上推奨)
- npm または yarn
- Google Chrome

### 1. リポジトリのクローンとビルド

```bash
git clone <repository-url>
cd gemini-chat-exporter

# 依存関係をインストール
npm install

# プロジェクトをビルド
npm run build
```

### 2. Chrome拡張機能として読み込み

1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトの `dist` フォルダを選択

## 📖 使用方法

1. **Gemini（gemini.google.com）にアクセス**
2. **チャット会話を開始または既存の会話を表示**
3. **ツールバーの拡張機能アイコンをクリック**
4. **「Export Chat」ボタンをクリック**
5. **チャット履歴がMarkdown形式の.txtファイルでダウンロード**

## 🔧 開発

### 利用可能なコマンド

```bash
# ヘルプを表示
make help

# 開発サーバーを起動
make dev

# プロジェクトをビルド
make build

# コードをフォーマット
make format

# フォーマットをチェック（変更なし）
make format-check

# ESLintでコードをチェック
make lint

# ESLintでコードを自動修正
make lint-fix

# フォーマット・リントの一括チェック
make check

# フォーマット・リントの一括修正
make fix

# ビルドファイルをクリーンアップ
make clean

# 最終テストを実行
make test
```

## 📁 プロジェクト構成

```
gemini-chat-exporter/
├── public/                 # 静的ファイル
│   ├── manifest.json       # Chrome拡張機能の設定
│   └── icons/              # 拡張機能アイコン
├── src/                    # ソースコード
│   ├── popup/              # Popup UI
│   │   ├── main.tsx        # Reactエントリーポイント
│   │   ├── App.tsx         # メインコンポーネント
│   │   ├── theme.ts        # MUIテーマ設定
│   │   └── components/     # UIコンポーネント
│   ├── content/            # Content Script
│   │   ├── index.ts        # メインエントリーポイント
│   │   └── chatExtractor.ts # チャット抽出ロジック
│   ├── background/         # Background Script
│   │   └── index.ts        # サービスワーカー
│   ├── types/              # 型定義
│   └── utils/              # ユーティリティ関数
├── dist/                   # ビルド出力
├── final-test.cjs          # 最終テストスクリプト
├── Makefile                # 開発用コマンド
└── vite.config.ts          # Vite設定
```

## 🎯 機能詳細

### Content Script
- Geminiページの DOM 構造を解析
- ユーザーの入力とAIの応答を自動抽出
- リアルタイムでのチャット監視機能

### Popup UI
- Material-UI による美しいユーザーインターフェース
- エクスポート進行状況の表示
- エラーハンドリングとユーザーフィードバック

### Background Script
- 拡張機能の永続的な動作を管理
- 将来の機能拡張に対応

## 🧪 テスト

拡張機能が正しくビルドされているかテストするには：

```bash
make test
# または
node final-test.cjs
```

このスクリプトは以下を確認します：
- 必要なファイルがすべて生成されているか
- manifest.jsonの設定が正しいか
- Chrome拡張機能として読み込み可能な状態か

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## ⚠️ 注意事項

- この拡張機能は非公式のツールです
- Geminiの利用規約に従ってご使用ください
- 個人的な用途での使用を推奨します
- Geminiのページ構造変更により動作しなくなる可能性があります

## 🐛 トラブルシューティング

### 拡張機能が動作しない場合

1. **Geminiページでの動作確認**
   - gemini.google.com にアクセスしているか確認
   - ページが完全に読み込まれているか確認

2. **Content Scriptの確認**
   - デベロッパーツール（F12）でコンソールエラーをチェック
   - Content Scriptが正しく読み込まれているか確認

3. **拡張機能の再読み込み**
   - chrome://extensions/ で拡張機能を無効化→有効化
   - または「更新」ボタンをクリック

### 支援が必要な場合

Issue を作成して以下の情報を含めてください：
- Chrome のバージョン
- エラーメッセージ（あれば）
- 実行した手順
- 期待していた動作と実際の動作
