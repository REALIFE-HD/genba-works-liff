# Agent guide — genba-works-liff

職人向け LINE LIFF「現場WORKS」。本番 UI は `react-app/`（React / Vite / Tailwind / LIFF）。ビルド成果をリポジトリ直下へ置き **GitHub Pages** で配信。

公開: https://realife-hd.github.io/genba-works-liff/

## コマンド（`react-app/`）

```bash
cd react-app
npm install
npm run dev
npm run lint
npm run build
```

CI（`.github/workflows/build-react-app.yml`）が Pages 用成果物をコミットする流れ。API 本体はこのリポに無く、Supabase Edge Functions を呼ぶ。

## ディレクトリ

| パス | 内容 |
|---|---|
| `react-app/` | 現行 LIFF アプリ |
| `dashboard.html` / `admin.html` / `site.html` | 監督・管理・掲示 QR（静的） |
| `legacy/` | 旧 vanilla UI |
| 直下の `index.html` 等 | Pages 向けビルド出力 |

## 触らない

- LIFF / Supabase の本番キー・監督パスコードをコミットする
- `pilot-*.html` の個人名・トークンをドキュメントや PR に転記する
- Edge Functions 側スキーマを、このリポだけで勝手に前提変更する（`supabase-schema` / バックエンド側と整合）

## PR

職人 UX・打刻・日報の挙動を変えるときは再現手順を書く。Linear `REA-xxx` 推奨。
