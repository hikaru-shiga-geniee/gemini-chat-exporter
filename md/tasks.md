はい、承知いたしました。「gemini-chat-exporter」のMVP（Minimum Viable Product）を構築するための、詳細なステップバイステップ計画を以下に示します。

この計画は、各タスクが「小さく、テスト可能で、明確な開始と終了があり、単一の関心事に集中する」ように設計されています。MVPの目標は、「**現在開いているGeminiのチャット履歴をプレーンテキスト形式 (.txt) でダウンロードできる**」ことです。

---

## ♊️ Gemini Chat Exporter: MVP開発ステップバイステップ計画 📋

### フェーズ 1: プロジェクトセットアップ (Project Setup) 🏗️

- **[ ] S-1: Viteプロジェクトの初期化**
  - **説明:** Vite を使用して、React + TypeScript テンプレートで新しいプロジェクトを作成します。
  - **完了条件:** `npm create vite@latest gemini-chat-exporter -- --template react-ts` (または `yarn create vite ...`) が正常に実行され、プロジェクトフォルダが生成されていること。
- **[ ] S-2: 依存関係のインストール**
  - **説明:** プロジェクトに必要な基本的な依存関係 (MUI) をインストールします。
  - **完了条件:** `npm install @mui/material @emotion/react @emotion/styled` (または `yarn add ...`) が正常に完了し、`package.json` に追加されていること。
- **[ ] S-3: `manifest.json` (v3) の基本作成**
  - **説明:** `public` フォルダに基本的な `manifest.json` (バージョン3) を作成します。MVPに必要な最小限の項目 (name, version, manifest_version, description, action) を含めます。
  - **完了条件:** `public/manifest.json` が存在し、基本的な拡張機能情報と Popup の参照 (`popup.html`) が設定されていること。
- **[ ] S-4: `popup.html` の作成**
  - **説明:** `public` フォルダに `popup.html` を作成します。React アプリケーションをマウントするための `div` 要素と、`main.tsx` を読み込む `script` タグを含めます。
  - **完了条件:** `public/popup.html` が存在し、React アプリのマウントポイントが設定されていること。
- **[ ] S-5: アイコンファイルの配置**
  - **説明:** `public/icons` フォルダを作成し、プレースホルダーの拡張機能アイコン (16x16, 48x48, 128x128) を配置します。`manifest.json` でこれらのアイコンを参照するように更新します。
  - **完了条件:** アイコンファイルが配置され、`manifest.json` で参照されていること。
- **[ ] S-6: Viteビルド設定の基本構成**
  - **説明:** `vite.config.ts` を編集し、Chrome 拡張機能としてビルドできるように基本的な設定（出力ディレクトリを `dist` にするなど）を行います。現時点では Popup のみを考慮します。
  - **完了条件:** `npm run build` が実行でき、`dist` フォルダに `popup.html` とバンドルされた JS/CSS が出力されること。
- **[ ] S-7: Chromeでの拡張機能ロードテスト**
  - **説明:** `npm run build` で生成された `dist` フォルダを、Chrome のデベロッパーモードで拡張機能として読み込みます。
  - **完了条件:** 拡張機能がエラーなく読み込まれ、ツールバーにアイコンが表示されること（Popup はまだ空）。

---

### フェーズ 2: Popup UI の構築 (Popup UI) 🎨

- **[ ] P-1: Popup Reactアプリの基本設定**
  - **説明:** `src/popup/main.tsx` を作成し、`popup.html` の `div` に React アプリをマウントするコードを記述します。`src/popup/App.tsx` を作成し、基本的なコンポーネントを表示します。
  - **完了条件:** 拡張機能アイコンをクリックすると、`App.tsx` で定義された基本的なテキスト (例: "Hello Popup") が表示される Popup が開くこと。
- **[ ] P-2: MUIテーマの適用**
  - **説明:** `src/popup/theme.ts` を作成し、基本的な MUI テーマを定義します。`App.tsx` で `ThemeProvider` を使用してテーマを適用します。
  - **完了条件:** Popup UI に基本的な MUI スタイルが適用されること。
- **[ ] P-3: エクスポートボタンの追加**
  - **説明:** `App.tsx` に MUI の `Button` コンポーネントを追加します。ボタンには「Export Chat」などのテキストを表示します。
  - **完了条件:** Popup にクリック可能な「Export Chat」ボタンが表示されること。

---

### フェーズ 3: Content Script (データ抽出) 🔍

- **[ ] CS-1: Content Script エントリーポイントの作成**
  - **説明:** `src/content/index.ts` を作成します。コンソールにログを出力するなど、基本的な動作確認コードを記述します。
  - **完了条件:** `src/content/index.ts` が存在すること。
- **[ ] CS-2: Viteビルド設定の更新 (Content Script)**
  - **説明:** `vite.config.ts` を更新し、`src/content/index.ts` をビルドのエントリーポイントに追加します。
  - **完了条件:** `npm run build` で `dist` フォルダに `content/index.js` が出力されること。
- **[ ] CS-3: `manifest.json` の更新 (Content Script)**
  - **説明:** `manifest.json` を更新し、`content_scripts` を追加して、`gemini.google.com` で `content/index.js` が実行されるように設定します。`permissions` に `activeTab` と `scripting`、`host_permissions` に `https://gemini.google.com/*` を追加します。
  - **完了条件:** Gemini のページを開いたときに、`content/index.ts` に書いたコンソールログがデベロッパーツールのコンソールに出力されること。
- **[ ] CS-4: Gemini チャット要素のセレクタ特定**
  - **説明:** Gemini の Web ページの DOM を調査し、個々のチャットメッセージ（ユーザーの発言と AI の応答）を一意に特定できる CSS セレクタを見つけます。
  - **完了条件:** ユーザーの発言と AI の応答をそれぞれ取得できる CSS セレクタのリストがドキュメント化されていること。
- **[ ] CS-5: チャット要素からテキストを抽出する関数作成**
  - **説明:** `src/content/` 内に、指定された CSS セレクタを使用して DOM からチャットメッセージのテキストを抽出し、配列として返す関数 (`extractChatData`) を作成します。
  - **完了条件:** `extractChatData` 関数が、Gemini ページのコンソールで実行すると、現在のチャット内容のテキスト配列を返すこと。

---

### フェーズ 4: 通信 (Communication) ↔️

- **[ ] C-1: Content Script にメッセージリスナーを追加**
  - **説明:** `src/content/index.ts` に `chrome.runtime.onMessage` リスナーを追加します。特定のメッセージ (`getChatData`) を受信したら、`extractChatData` を実行し、結果を送信元に返信 (`sendResponse`) するようにします。
  - **完了条件:** Content Script が Popup からのメッセージを待機し、応答できる状態になっていること。
- **[ ] C-2: Popup ボタンクリック時のメッセージ送信**
  - **説明:** `src/popup/App.tsx` のエクスポートボタンのクリックハンドラに、`chrome.tabs.query` と `chrome.tabs.sendMessage` を使用して、現在アクティブな Gemini タブの Content Script に `getChatData` メッセージを送信する処理を追加します。
  - **完了条件:** Popup のボタンをクリックすると、Content Script の `onMessage` リスナーがトリガーされること。
- **[ ] C-3: Popup でのデータ受信**
  - **説明:** `chrome.tabs.sendMessage` のコールバック (または `chrome.runtime.onMessage` を使って) Content Script から返されたチャットデータ (テキスト配列) を Popup で受信し、コンソールに出力します。
  - **完了条件:** Popup のボタンをクリックすると、抽出されたチャットデータが Popup のコンソールに表示されること。

---

### フェーズ 5: ファイル保存 (File Saving) 💾

- **[ ] FS-1: テキスト整形関数の作成**
  - **説明:** `src/popup/` (または `src/utils/`) に、Content Script から受け取ったチャットデータ (テキスト配列) を、1つのプレーンテキスト文字列に整形する関数 (`formatAsText`) を作成します。メッセージ間に区切り線などを入れると良いでしょう。
  - **完了条件:** `formatAsText` 関数が、チャットデータ配列を期待されるテキスト形式に変換できること。
- **[ ] FS-2: ダウンロード関数の作成**
  - **説明:** `src/popup/` (または `src/utils/`) に、テキスト文字列を受け取り、`Blob` を作成し、`URL.createObjectURL` を使ってダウンロードリンク (`<a>` タグ) を生成し、プログラム的にクリックしてファイルをダウンロードさせる関数 (`downloadTextFile`) を作成します。ファイル名は `gemini-chat.txt` とします。
  - **完了条件:** `downloadTextFile` 関数が、指定されたテキスト内容で `.txt` ファイルをダウンロードさせられること。
- **[ ] FS-3: Popup でのダウンロード実行**
  - **説明:** Popup でチャットデータを受信した後、`formatAsText` で整形し、`downloadTextFile` を呼び出してファイル保存を実行するようにします。
  - **完了条件:** Popup のボタンをクリックすると、Gemini のチャット内容が `gemini-chat.txt` という名前でダウンロードされること。

---

### フェーズ 6: ビルドとテスト (Build & Test) ✅

- **[ ] BT-1: Background Script の基本設定 (任意だが推奨)**
  - **説明:** MVP では必須ではないかもしれませんが、将来性を考え `src/background/index.ts` と `vite.config.ts` のエントリーポイント、`manifest.json` の `background` 設定を追加します。現時点では空でも構いません。
  - **完了条件:** Background Script を含めてもビルドが通り、拡張機能が正常に動作すること。
- **[ ] BT-2: Viteビルド設定の最終調整**
  - **説明:** `vite.config.ts` を見直し、すべてのエントリーポイント (Popup, Content, Background) が正しくバンドルされ、`dist` フォルダに必要なファイル (manifest, icons, html, js) がすべて出力されるように調整します。
  - **完了条件:** `npm run build` で、Chrome に読み込ませるための完全な `dist` フォルダが生成されること。
- **[ ] BT-3: 最終動作確認**
  - **説明:** 最新の `dist` フォルダを Chrome に読み込み直し、Gemini のページを開いて、Popup のボタンをクリックし、チャットが正しく `.txt` ファイルとしてダウンロードされるかを確認します。
  - **完了条件:** MVP の目標である「Gemini チャットのテキストエクスポート」が正常に機能すること。

---

この計画により、機能を一つずつ追加・テストしながら、着実に MVP を構築していくことができます。
