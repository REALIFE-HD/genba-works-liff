# 現場WORKS LIFF

職人向け LINE LIFF ミニアプリ — React + Tailwind CSS + `@line/liff`

## 概要

現場WORKS は建設・工事現場の職人が LINE 上で使える業務支援アプリです。  
現場一覧・打刻・日報・チャット・マイページなど日常業務をワンストップで提供します。

## 本番 URL

| 用途 | URL |
|------|-----|
| **本番（React）** | https://toyama2026.github.io/genba-works-liff/ |
| LIFF リンク | https://liff.line.me/2010459645-nZrNO9J0 |
| Legacy（ロールバック用） | [legacy/index.html](legacy/index.html) |

## 技術スタック

| カテゴリ | ライブラリ / ツール |
|----------|-------------------|
| UI フレームワーク | React 19 |
| スタイリング | Tailwind CSS v4 |
| LIFF SDK | `@line/liff` v2 |
| ビルド | Vite 8 / TypeScript 6 |
| リンター | oxlint |
| デプロイ | GitHub Pages（GitHub Actions 自動ビルド） |

## 画面構成

| ページ | 説明 |
|--------|------|
| ホーム | 今日の現場・お知らせ |
| 現場 | 参加現場一覧・詳細 |
| 打刻 | 出退勤・現場入退場 |
| 日報 | 作業日報の入力・確認 |
| チャット | 現場内チャット |
| マイページ | プロフィール・設定 |

## ディレクトリ構成

```text
.
├── react-app/          React ソースコード（開発はここで行う）
│   └── src/
│       ├── liff/       LIFF init・login
│       ├── context/    GenbaContext（API・状態管理）
│       ├── lib/        api, types, format, site-helpers
│       ├── pages/      各画面コンポーネント
│       └── components/ 共通コンポーネント
├── index.html          ビルド成果物（GitHub Pages エントリ）
├── assets/             ビルド成果物（JS・CSS）
├── app/                /app/ パス → 本番へリダイレクト
└── legacy/             旧 vanilla JS 版（ロールバック用）
```

## 開発手順

```bash
cd react-app
npm install
npm run dev
```

## ビルド

```bash
cd react-app
npm run build
```

`index.html` と `assets/` がリポジトリ直下に出力されます。  
`main` ブランチへ push すると GitHub Actions が自動ビルド・コミットします。

## LINE Developers 設定

LIFF エンドポイント URL:

```
https://toyama2026.github.io/genba-works-liff/
```

Scan QR は **ON** のままにしてください。
