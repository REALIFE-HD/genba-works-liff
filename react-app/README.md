# 現場WORKS React + LIFF（Option A / REA-189）

職人向け LIFF ミニアプリの UI 層を React + Tailwind へ移行するソースです。

- **legacy**: リポジトリ直下の `index.html`（vanilla JS）— 本番並行運用
- **React 版**: ビルド出力 `../app/` → GitHub Pages `/genba-works-liff/app/`

## 開発

```bash
cd react-app
npm install
npm run dev
```

LIFF 実機確認は `npm run build` 後に GitHub Pages へデプロイするか、LIFF Endpoint を一時的にローカル tunnel へ向けてください。

## ビルド（GitHub Pages）

```bash
npm run build
```

`../app/` に成果物が出力されます。

## 構成

```text
src/liff/     LIFF init・login（LINE 固有）
src/pages/    画面（5タブ）
src/components/
```

## 移行順

1. ✅ スキャフォールド + LIFF + ホーム骨格
2. 現場一覧・詳細
3. 打刻フロー
4. 日報
5. チャット
