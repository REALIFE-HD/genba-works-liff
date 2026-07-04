# 現場WORKS React + LIFF（Option A / REA-189）

職人向け LIFF ミニアプリ — React + Tailwind + `@line/liff`

## 本番 URL

| 用途 | URL |
|------|-----|
| **本番（React）** | https://toyama2026.github.io/genba-works-liff/ |
| LIFF リンク | https://liff.line.me/2010459645-nZrNO9J0 |
| Legacy（ロールバック用） | [legacy/index.html](legacy/index.html) |
| 旧 `/app/` パス | `/app/` → 本番へリダイレクト |

## LINE Developers 設定

LIFF エンドポイント URL は以下に設定してください（**変更不要**のはず — legacy と同じルート）:

```
https://toyama2026.github.io/genba-works-liff/
```

または

```
https://toyama2026.github.io/genba-works-liff/index.html
```

Scan QR は **ON** のままにしてください。

## 開発

```bash
cd react-app
npm install
npm run dev
```

## ビルド（GitHub Pages ルートへ出力）

```bash
cd react-app
npm run build
```

`index.html` と `assets/` がリポジトリ直下に出力されます。push 後 GitHub Actions でも同様にビルドされます。

## 構成

```text
react-app/src/
├── liff/       LIFF init・login
├── context/    GenbaContext（API・状態）
├── lib/        api, types, format, site-helpers
├── pages/      ホーム / 現場 / 打刻 / 日報 / チャット / マイ
└── components/
legacy/index.html   旧 vanilla JS（REA-189 以前）
```
