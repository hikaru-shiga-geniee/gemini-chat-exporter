## ♊️ Gemini Chat Exporter: アーキテクチャとファイル構成 🚀

Vite + React + TypeScript + MUI を使用した Chrome 拡張機能「gemini-chat-exporter」のアーキテクチャとファイル構成をご提案します。

---

### 🏛️ システムアーキテクチャ

この拡張機能は、主に以下の3つのコンポーネントで構成されます。

1.  **Popup (ポップアップ)**:
    * **役割**: ユーザーインターフェース (UI) を提供します。ユーザーはここからエクスポート操作を開始し、形式（Markdown, JSON, Textなど）を選択します。
    * **技術**: React + TypeScript + MUI で構築します。Vite によって `popup.html` と関連する React コードがバンドルされます。
    * **動作**:
        * 拡張機能アイコンをクリックすると表示されます。
        * エクスポートボタンがクリックされると、Content Script にメッセージを送信してチャットデータの取得を要求します。
        * Content Script からデータを受け取り、プレビュー表示（任意）やファイル保存処理をトリガーします。

2.  **Content Script (コンテントスクリプト)**:
    * **役割**: 実際に Gemini の Web ページ (gemini.google.com) に挿入され、チャットの DOM (Document Object Model) にアクセスして会話データを抽出します。
    * **技術**: TypeScript で記述します。Vite によってバンドルされます。
    * **動作**:
        * `manifest.json` の設定に基づき、Gemini のページが開かれたときに自動的に実行されます。
        * Popup または Background Script からのメッセージを受け取り、現在のチャット履歴を DOM から解析・抽出します。
        * 抽出したデータを整形し、メッセージの送信元（Popup など）に返信します。
        * Gemini の UI は動的に変化するため、`MutationObserver` などを使用してチャットの更新を監視する必要があるかもしれません。

3.  **Background Script (バックグラウンドスクリプト) - (任意だが推奨)**:
    * **役割**: 拡張機能のバックグラウンドで動作し、永続的なタスクやコンポーネント間の通信を管理します。特に、`chrome.downloads` API を使用した確実なファイル保存や、複雑なロジックを担います。
    * **技術**: TypeScript で記述します。Vite によってバンドルされます。
    * **動作**:
        * Popup からのファイル保存リクエストを受け取ります。
        * Content Script にデータ取得を指示し、データを受け取ります。
        * 受け取ったデータを指定された形式に変換します。
        * `chrome.downloads.download()` API を使用して、ユーザーにファイルをダウンロードさせます。
        * （オプション）将来的に設定保存 (`chrome.storage`) などを実装する場合にも利用します。

**通信フロー:**

```mermaid
graph TD
    A[Popup (UI)] -- 1. エクスポート要求 --> B{Background Script};
    B -- 2. データ取得要求 --> C[Content Script (Gemini上)];
    C -- 3. DOM解析 & データ抽出 --> C;
    C -- 4. チャットデータ送信 --> B;
    B -- 5. データ整形 & ファイル生成 --> B;
    B -- 6. chrome.downloads.download() --> D[ファイル保存];
```

* *シンプルな実装では Popup と Content Script が直接通信することも可能ですが、Background Script を経由する方が `chrome` API の利用や処理の分離の観点から推奨されます。*

---

### 📁 ファイル＆フォルダ構成

Vite を使った一般的な React + TS プロジェクト構成をベースに、Chrome 拡張機能の要件を追加します。

```
gemini-chat-exporter/
├── public/                 # ビルド時に dist/ にコピーされる静的ファイル
│   ├── manifest.json       # 拡張機能の定義ファイル ✨
│   ├── icons/              # 拡張機能のアイコン
│   │   ├── icon16.png
│   │   ├── icon48.png
│   │   └── icon128.png
│   └── popup.html          # Popup の HTML (Reactアプリのマウントポイント)
│
├── src/                    # ソースコード
│   ├── popup/              # Popup 関連
│   │   ├── main.tsx        # React のエントリーポイント (popup.htmlから読み込む)
│   │   ├── App.tsx         # Popup のメインReactコンポーネント
│   │   ├── components/     # Popup 用の React コンポーネント
│   │   │   └── ExportButton.tsx
│   │   └── theme.ts        # MUI のテーマ設定
│   │
│   ├── content/            # Content Script 関連
│   │   └── index.ts        # Content Script のエントリーポイント 🔍
│   │
│   ├── background/         # Background Script 関連
│   │   └── index.ts        # Background Script のエントリーポイント ⚙️
│   │
│   ├── types/              # 共通の型定義
│   │   └── chat.ts         # チャットデータの型など
│   │
│   └── utils/              # 共通のユーティリティ関数
│       └── fileSaver.ts    # ファイル保存ロジックなど
│
├── dist/                   # ビルド後の出力先 (このフォルダを拡張機能として読み込む)
├── package.json            # プロジェクト定義、依存関係
├── vite.config.ts          # Vite の設定ファイル 🛠️
├── tsconfig.json           # TypeScript の設定ファイル
└── README.md               # プロジェクトの説明
```

---

### ✨ `manifest.json` (v3) の主要な設定

```json
{
  "manifest_version": 3,
  "name": "Gemini Chat Exporter",
  "version": "0.1.0",
  "description": "Export your Gemini chat conversations.",
  "permissions": [
    "activeTab",    // 現在アクティブなタブへのアクセス (Content Script 実行に必要)
    "scripting",    // スクリプト注入 (Content Script 実行に必要)
    "downloads"     // chrome.downloads API を使う場合に必要
    // "storage"      // 設定保存を行う場合に必要
  ],
  "host_permissions": [
    "https://gemini.google.com/*" // Content Script を実行する対象サイト
  ],
  "action": {
    "default_popup": "popup.html", // Popup の HTML を指定
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background/index.js" // Background Script を指定 (ビルド後のパス)
  },
  "content_scripts": [
    {
      "matches": ["https://gemini.google.com/*"],
      // JS は Vite がビルド時に挿入するように設定するか、ここで指定
      // "js": ["content/index.js"],
      "run_at": "document_idle" // ページの読み込みが完了してから実行
    }
  ]
}
```

* **注意:** Vite でビルドする場合、`manifest.json` の `background` や `content_scripts` の `js` パスは、Vite のビルド設定 (`vite.config.ts`) で適切に出力されるように調整する必要があります。多くの場合、`vite.config.ts` で複数のエントリーポイントを指定し、`manifest.json` は `public` に置いてビルド時にコピーします。Content Script は `chrome.scripting.executeScript` を使って Background Script から動的に注入する方法も一般的です。

---

### 🛠️ `vite.config.ts` のポイント

Vite で Chrome 拡張機能をビルドするには、複数のエントリーポイント（Popup, Content Script, Background Script）を扱えるように設定する必要があります。`vite-plugin-crx` などのプラグインを利用すると便利ですが、手動で設定する場合は以下のような点を考慮します。

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'), // Popupのエントリー
        content: resolve(__dirname, 'src/content/index.ts'), // Content Script
        background: resolve(__dirname, 'src/background/index.ts'), // Background Script
      },
      output: {
        entryFileNames: `[name]/index.js`, // 各スクリプトをフォルダ分けして出力
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
    outDir: 'dist', // 出力ディレクトリ
    emptyOutDir: true, // ビルド時に dist をクリーンアップ
  },
  // ... その他設定
});
```

* *これは基本的な例です。実際のプロジェクトでは、`manifest.json` のコピーや CSS の扱いなど、さらに詳細な設定が必要になります。*

---

このアーキテクチャとファイル構成をベースに、Gemini の DOM 構造を解析する部分 (Content Script) と、MUI を使った Popup の UI 構築を進めていくことになります。頑張ってください！💪
