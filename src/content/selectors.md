# Gemini Chat Selectors

GeminiのWebページからチャットメッセージを抽出するためのCSSセレクタのドキュメント

## 分析対象URL
- https://gemini.google.com/app/b1f7ad7de6947268?hl=ja
- https://gemini.google.com/app/5aa9ab3594c9d29e?hl=ja

## メインコンテナ

### チャット履歴コンテナ
```css
/* メインのチャット履歴コンテナ */
#chat-history
.chat-history-scroll-container
.chat-history

/* テスト用属性 */
[data-test-id="chat-history-container"]
```

### 会話コンテナ
```css
/* 個別の会話コンテナ */
.conversation-container
[_ngcontent-ng-c4126108266].conversation-container
```

## ユーザーメッセージ

### ユーザークエリコンポーネント
```css
/* ユーザーの質問/発言 */
user-query
user-query[_ngcontent-ng-c4126108266]

/* ユーザークエリコンテナ */
.user-query-container
.user-query-bubble-container

/* ユーザークエリ内容 */
user-query-content
.query-text
```

### ユーザープロフィール要素
```css
/* ユーザーアイコン関連 */
.user-icon
.user-profile-picture-container
user-profile-picture
.async-user-icon
```

## AIレスポンス

### モデルレスポンスコンポーネント
```css
/* AIモデルの応答 */
model-response
model-response[_ngcontent-ng-c4126108266]

/* デュアルモデルレスポンス */
dual-model-response
dual-model-response[_ngcontent-ng-c4126108266]

/* レスポンスコンテナ */
response-container
.response-container
```

## Angularコンポーネント属性

### 主要なngcontent属性
```css
/* メインチャットコンポーネント */
[_ngcontent-ng-c4126108266]

/* ユーザークエリコンポーネント */
[_nghost-ng-c766806165]

/* モデルレスポンスコンポーネント */
[_nghost-ng-c166373346]
```

## 使用推奨セレクタ

### 基本的なアプローチ
```css
/* すべてのuser-queryエレメント */
user-query

/* すべてのmodel-responseエレメント */
model-response

/* 代替アプローチ（より具体的） */
.conversation-container user-query
.conversation-container model-response

/* フォールバック（クラスベース） */
.user-query-container
.response-container
```

### 推奨実装順序
1. `user-query`と`model-response`タグを直接使用
2. 該当する要素が見つからない場合は`.conversation-container`内を検索
3. 最終手段として`_ngcontent`属性を使用

## 注意事項

- GeminiはAngularアプリケーションのため、DOM構造が動的に変化する可能性があります
- `_ngcontent-ng-*`属性は動的に生成されるため、バージョンによって変わる可能性があります
- 最も安定したセレクタは`user-query`と`model-response`のカスタムタグ名です
- テキスト抽出時は、各要素内の`.textContent`または`.innerText`を使用します 
