# ♊️ Gemini Chat Exporter

Geminiのチャット履歴をエクスポートするChrome拡張機能です。

## 📋 概要

この拡張機能を使用すると、Gemini（gemini.google.com）でのチャット会話を様々な形式でエクスポートできます。

### 🎯 主な機能

- Geminiのチャット履歴を抽出
- プレーンテキスト形式（.txt）でのエクスポート
- 将来的にMarkdown、JSON形式にも対応予定

### 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript
- **ビルドツール**: Vite
- **UIライブラリ**: Material-UI (MUI)
- **拡張機能**: Chrome Extension Manifest V3

## 🚀 セットアップ

### 前提条件

- Node.js (v18以上推奨)
- npm または yarn
- Google Chrome

### インストール

1. リポジトリをクローン

```bash
git clone <repository-url>
cd gemini-chat-exporter
```

2. 依存関係をインストール

```bash
make install
# または
npm install
```

3. プロジェクトをビルド

```bash
make build
# または
npm run build
```

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
```

### Chrome拡張機能として読み込む

1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. プロジェクトの `dist` フォルダを選択

## 📁 プロジェクト構成

```
gemini-chat-exporter/
├── public/                 # 静的ファイル
│   └── manifest.json       # Chrome拡張機能の設定
├── src/                    # ソースコード
│   ├── popup/              # Popup UI
│   │   ├── main.tsx        # Reactエントリーポイント
│   │   └── App.tsx         # メインコンポーネント
│   ├── content/            # Content Script（予定）
│   ├── background/         # Background Script（予定）
│   ├── types/              # 型定義（予定）
│   └── utils/              # ユーティリティ（予定）
├── dist/                   # ビルド出力
├── Makefile                # 開発用コマンド
├── vite.config.ts          # Vite設定
├── .prettierrc             # Prettier設定
└── README.md               # このファイル
```

## 🎯 開発ロードマップ

### フェーズ 1: プロジェクトセットアップ ✅

- [x] Viteプロジェクトの初期化
- [x] 依存関係のインストール
- [x] manifest.jsonの作成
- [x] 基本的なPopup UIの構築

### フェーズ 2: Popup UI の構築 🚧

- [x] MUIテーマの適用
- [x] エクスポートボタンの追加
- [x] UI/UXの改善

### フェーズ 3: Content Script（データ抽出）

- [ ] Content Scriptの作成
- [ ] Gemini DOM要素の解析
- [ ] チャットデータの抽出機能

### フェーズ 4: 通信機能

- [ ] Popup ↔ Content Script間の通信
- [ ] データの送受信機能

### フェーズ 5: ファイル保存

- [ ] テキスト形式でのエクスポート
- [ ] ファイルダウンロード機能

### フェーズ 6: 最終調整

- [ ] エラーハンドリング
- [ ] パフォーマンス最適化
- [ ] テスト・デバッグ

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
