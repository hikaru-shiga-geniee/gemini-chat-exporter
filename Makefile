.PHONY: help build format format-check lint lint-fix clean dev install test

# デフォルトターゲット
help:
	@echo "使用可能なコマンド:"
	@echo "  make build        - プロジェクトをビルド"
	@echo "  make format       - コードをフォーマット"
	@echo "  make format-check - フォーマットをチェック"
	@echo "  make lint         - ESLintでコードをチェック"
	@echo "  make lint-fix     - ESLintでコードを修正"
	@echo "  make dev          - 開発サーバーを起動"
	@echo "  make clean        - ビルドファイルをクリーンアップ"
	@echo "  make install      - 依存関係をインストール"
	@echo "  make test         - 拡張機能の最終テストを実行"

# ビルド
build:
	npm run build

# フォーマット
format:
	npm run format

# フォーマットチェック
format-check:
	npm run format:check

# リント
lint:
	npm run lint

# リント修正
lint-fix:
	npm run lint:fix

# 開発サーバー
dev:
	npm run dev

# クリーンアップ
clean:
	rm -rf dist/

# 依存関係インストール
install:
	npm install

# 最終テスト
test:
	@echo "Chrome拡張機能の最終テストを実行中..."
	node final-test.cjs

# ビルド前チェック（フォーマット・リント）
check: format-check lint
	@echo "すべてのチェックが完了しました"

# 一括修正（フォーマット・リント修正）
fix: format lint-fix
	@echo "フォーマットとリントの修正が完了しました" 
