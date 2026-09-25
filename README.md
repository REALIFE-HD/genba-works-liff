# 現場WORKS（genba-works-liff）

職人向けの LINE LIFF ミニアプリです。画面上の名称は「現場WORKS」（英表記 GENBA WORKS）。現行の本番 UI は `react-app/` の React アプリで、ビルド結果をリポジトリ直下に置き、GitHub Pages で配信します。

公開 URL（`react-app/vite.config.ts` のコメント）:

https://realife-hd.github.io/genba-works-liff/

## 目的・背景

職人が LINE 上で、現場への入退場、日報、現場ごとの連絡、自分の出面を扱うためのミニアプリです。データ本体の API 実装はこのリポジトリには無く、クライアントは Supabase Edge Functions を呼び出します。

`react-app/README.md` は、この React 版を「Option A / REA-189」と呼び、React + Tailwind + `@line/liff` への移行だと書いています。`legacy/README.md` は、`legacy/index.html` を REA-189 本番切替（2026-07）以前の vanilla JS UI だと書いています。切替の判断や課題本文は、このリポジトリ内にはありません。

## 主な機能

### 職人向け LIFF（`react-app/`、本番の `index.html`）

起動時に LIFF を初期化し、未ログインなら LINE ログインへリダイレクトします。プロフィールの表示名をヘッダーに出します。API の `env` が `dev` のときだけ「テスト中 (dev)」を表示します。幅は最大 460px のモバイル向けレイアウトです。

下部タブは **ホーム / 現場 / 日報 / チャット / マイ** です。未提出日報とチャット未読には印が付きます。

| 画面 | 実装されていること |
|------|-------------------|
| ホーム | 在場中・退場済・本日予定・予定なしの状態、今日やること、次の予定、Google カレンダー追加、住所がある現場の地図リンク |
| 打刻 | LIFF の `scanCodeV2` で現場 QR を読み、入場 / 退場を送る。同じ操作の再送は同じ idempotency key。17時以降の在場中は退場忘れの注意 |
| 現場一覧 | 現場名・住所の検索。フィルタは全部 / 今日 / 在場中 / 予定 / 完了。住所がある現場は Google マップの経路リンク |
| 現場詳細 | 概要、報告写真（直近）、図面、現場チャット、日報と出面履歴。工程日の「入らない」切替と、期間・担当工事・人数での予定登録 |
| 日報 | 写真は最大 6 枚（施工前 / 施工中 / 完了）。カメラ撮影とアルバム選択。対応ブラウザでは日本語の音声入力。下書き API と、失敗時の定型文。提出前の確認 |
| チャット | 現場スレッドと個人メッセージ。現場チャットの定型文は「到着しました」「完了しました」「材料が不足しています」「確認お願いします」。現場スレッドは約 5 秒間隔で再取得 |
| マイ | 今月の人工・稼働時間・出勤日と、日別の入場 / 退場・日報の有無 |
| 初回登録 | 職人が未登録（`worker_not_found`）のとき、所属会社・担当工事・任意の名前を送る。会社一覧が空なら画面上の選択肢は「合同会社REALIFE」 |

担当工事の選択肢は、コーティング、塗装、内装、足場、電気、設備、防水、左官、解体、清掃、その他です。

図面タブは「図面はまだ登録されていません」という固定文言です。図面を取得して表示する処理は、このリポジトリの React コードにはありません。

写真は長辺 1280px 以下に縮小し、JPEG（品質 0.7）の data URL にして送ります。

職人 API は次のパスへ POST します（ホストは設定値のベース URL）。ボディに LINE の ID トークンを載せます。

- `genba-me` — 本人・本日の打刻・現場・履歴・日報・未読
- `punch` — QR による入場 / 退場（`method: "qr"`）
- `genba-register` — 初回登録
- `genba-schedule` — `list_mine` / `toggle` / `create`
- `genba-chat` — `list` / `send`
- `genba-dm` — `workers` / `list` / `history` / `send`
- `genba-report-draft` — 日報下書き
- `report-submit` — 日報提出

### 監督向けの静的 HTML（React ビルドとは別）

いずれも単一 HTML で、ブラウザの `localStorage` キー `genba_dash_key` に監督パスコードを保存し、リクエストヘッダー `x-dash-key` で送ります。パスコードの値はこのリポジトリに書かれていません。

- `dashboard.html`（現場WORKS 監督ダッシュボード）: 在場人数、稼働現場、未退場、要対応の日報、明日の予定確認、本日の未打刻、手動打刻の承認、日報の AI 要約タグと承認、依頼主への報告、通知と再送待ち、7 日間の予定、現場チャット、出面 CSV。チャットの再取得は 6 秒間隔。呼ぶパスは `genba-dash`、`genba-action`、`genba-export`、`genba-schedule`、`genba-chat`。
- `admin.html`（現場WORKS 管理）: dev / prod の切替（画面文言では dev は通知を実送信せず dryrun ログのみ、prod は実送信）、dry テスト、職人の承認と有効化、現場の追加（名前、住所、QR トークン、任意の緯度経度と半径）。呼ぶパスは `genba-admin`。dry テストの関数名は `genba-detect-no-clockin`、`genba-detect-unconfirmed`、`genba-detect-eod`、`genba-remind-preday`、`genba-notify-retry`。
- `site.html`（現場WORKS 掲示用QR）: クエリ `name` と `token` で現場名と QR 文字列を出し、印刷できる。クエリが無いときの既定値はソースにハードコードされている（値は本書に書かない）。QR 描画は jsDelivr 上の `qrcodejs`。

`pilot-shimizu.html`、`pilot-run-today.html`、`pilot-tanaka.html`、`pilot-run-tanaka.html` はパイロット手順用の静的 HTML です。チェックリストと、別画面へのリンクを含みます。個人名、トークン、案件 URL は本書に転記しません。

## 技術スタック

バージョンは `react-app/package.json` の範囲です。

| 種類 | 内容 |
|------|------|
| UI | React `^19.2.7`、react-dom、lucide-react |
| LINE | `@line/liff` `^2.29.1` |
| ビルド | Vite `^8.1.1`、`@vitejs/plugin-react` |
| 言語 | TypeScript `~6.0.2` |
| スタイル | Tailwind CSS `^4.3.2`（`@tailwindcss/vite`）。本文フォントは Hiragino Kaku Gothic ProN / Yu Gothic UI / Meiryo |
| Lint | oxlint `^1.71.0`（`npm run lint`） |
| 旧 UI | `legacy/index.html` は LINE LIFF SDK を CDN から読む vanilla JS |
| CI | GitHub Actions、Node.js 22（`package.json` に `engines` は無い） |

パッケージ名は `react-app`、`version` は `0.0.0`、`private: true` です。

## ディレクトリ構成

```text
.
├── index.html              # Vite のビルド成果物（Pages の入口）
├── assets/                 # ビルド済み JS / CSS
├── app/index.html          # /genba-works-liff/ へ即時リダイレクト
├── admin.html              # 監督向け管理
├── dashboard.html          # 監督ダッシュボード
├── site.html               # 掲示用 QR
├── pilot-*.html            # パイロット手順
├── favicon.svg
├── icons.svg
├── legacy/
│   ├── README.md           # 旧 UI の説明（旧ホスト URL のまま）
│   └── index.html          # REA-189 以前の本番 UI
├── react-app/              # 現行ソース
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── .env.example
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── liff/           # LIFF ID と初期化
│       ├── context/        # GenbaContext（API と画面状態）
│       ├── lib/            # api, types, constants, format, photos, site-helpers
│       ├── pages/          # ホーム / 打刻 / 現場 / 現場詳細 / 日報 / チャット / マイ
│       └── components/     # Header, BottomNav, チャット, DM, 登録, UI
└── .github/workflows/build-react-app.yml
```

`react-app/src/App.css` と `react-app/src/assets/` の Vite / React ロゴ SVG は、ソースから import されていません。

## セットアップ・ローカル表示

作業ディレクトリは `react-app/` です。CI は Node.js 22 と `npm ci` です。ローカルの Node 版はリポジトリでは固定されていません。

```bash
cd react-app
npm ci
npm run dev
```

`npm ci` の代わりに、既存の `react-app/README.md` は次を案内しています。

```bash
cd react-app
npm install
npm run dev
```

`vite.config.ts` は `server` を上書きしていません。待受は Vite の既定（ポート 5173）です。`base` が `/genba-works-liff/` なので、起動ログに出る URL のパスはそのプレフィックス付きです。

その他のスクリプト（いずれも `react-app/` で実行）:

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` は `tsc -b` のあと Vite でビルドし、出力先は親ディレクトリ（リポジトリ直下の `index.html` と `assets/`）です。`emptyOutDir` は `false` です。ローカルで build すると、コミット済みの Pages 用ファイルを上書きします。`npm run preview` はその `outDir`（リポジトリ直下）を配信します。ポートは Vite の既定（4173）です。

LIFF は `withLoginOnExternalBrowser: true` です。未ログイン時のリダイレクト先は、開いているページの origin と pathname です。LINE Developers のエンドポイントと一致しないオリジンでは、ログインが完了しないことがあります。ローカル用エンドポイントの設定はこのリポジトリにありません。QR 読取は `scanCodeV2` が使えないと失敗し、画面はミニアプリ設定の「Scan QR」を ON にするよう案内します。

## 設定値

値・トークン・URL の実体は書きません。未設定のときはソース内のフォールバックが使われ、ビルド結果に入ります。フォールバック文字列は本書に載せません。

| 名前 | どこで読むか | 用途 |
|------|----------------|------|
| `VITE_LIFF_ID` | `react-app/.env.example`、`react-app/src/liff/config.ts` | LIFF の ID。example にだけ例が書いてある |
| `VITE_SUPABASE_FUNCTIONS_BASE` | `react-app/src/lib/constants.ts` | Edge Functions のベース URL。`.env.example` には無い |
| `VITE_SUPABASE_ANON_KEY` | `react-app/src/lib/constants.ts` | Functions 呼び出しの `apikey` と `Authorization: Bearer`。`.env.example` には無い |

任意で `react-app/.env.example` を `react-app/.env` にコピーできます。コピーされるのは `VITE_LIFF_ID` だけです。Vite は `react-app/` の `.env` を読み、`VITE_` 付きの値をクライアントへ埋めます。

```bash
cd react-app
cp .env.example .env
```

監督画面が使う名前（値はソースに無い）:

| 名前 | 用途 |
|------|------|
| `genba_dash_key` | 監督パスコードを入れる `localStorage` のキー |
| `x-dash-key` | そのパスコードを送るリクエストヘッダー |

`admin.html`、`dashboard.html`、`legacy/index.html` は、React の環境変数を読まず、接続先を HTML 内に直接書いています。

`site.html` のクエリ名は `name`（表示名）と `token`（QR に載せる文字列）です。

## デプロイ

GitHub Pages の公開 URL として、Vite 設定のコメントは次を書いています。

https://realife-hd.github.io/genba-works-liff/

`base` は `/genba-works-liff/` です。Pages のソースブランチを指定する設定ファイル（workflow の `pages` デプロイや `CNAME`）は、このリポジトリにありません。配信物は main 上のリポジトリ直下です。

ワークフローは `.github/workflows/build-react-app.yml`（表示名 Build React app (GitHub Pages)）です。

- 起動: `main` への push のうち `react-app/**` またはこの workflow 自身が変わったとき。加えて `workflow_dispatch`
- 権限: `contents: write`
- 処理: checkout、Node.js 22、`react-app` で `npm ci`、`npm run build`
- 自動コミット: `index.html`、`assets/**`、`app/index.html`。メッセージは `chore: build React app to GitHub Pages root`

`app/index.html` は `/genba-works-liff/` へ `meta refresh` と `location.replace` で移します。タイトルは「現場WORKS — 移転中」です。

既存の `react-app/README.md` は、LINE Developers の LIFF エンドポイントを旧ホストのルート、またはその `index.html` に置く想定で、Scan QR は ON のまま、と書いています。現行コメント上のホストは上記の `realife-hd.github.io` です。LINE 側の実際の設定は、このリポジトリからは確認できません。

## 関連リポジトリ・外部サービス

- このリポジトリの公開先: https://github.com/REALIFE-HD/genba-works-liff
- LINE LIFF（`@line/liff`、および legacy の LIFF SDK）。ログイン、プロフィール、QR スキャン
- Supabase Edge Functions。上記のパスを POST / GET する。関数の実装は別リポジトリにあり、ここには呼び出し側だけがある
- Google マップ（地図検索と経路）と Google カレンダー（予定テンプレートの作成 URL）
- GitHub Actions と GitHub Pages
- `site.html` の QR は jsDelivr の `qrcodejs`

パイロット用 HTML は、画面上 BMS・SK と書かれた別アプリ、Linear の課題、別の LIFF へのリンクを含みます。それらの URL と識別子は本書に書きません。このリポジトリの git 設定以外に、関連リポジトリのクローン手順はありません。

## 現状・注意点

- 説明用の README はこれまで `react-app/README.md` と `legacy/README.md` だけで、リポジトリ直下にはありませんでした。
- 本番ホストの表記が分かれています。Vite のコメントと `base` は `realife-hd.github.io` / `/genba-works-liff/` です。`react-app/README.md`、`legacy/README.md`、`admin.html` の Pages 用定数、`pilot-tanaka.html` は、旧ホスト `toyama2026.github.io` をまだ指しています。どちらが LINE のエンドポイントとして有効かは、リポジトリだけでは断定できません。
- `npm run build` と、main 上の GitHub Actions は、手書きソースではない `index.html` と `assets/` を上書きしてコミットします。
- LIFF ID、Functions のベース URL、クライアント用キーのフォールバックがソースにあり、未設定のビルドに入ります。監督用 HTML と `legacy/index.html` も接続先を直書きしています。`site.html` とパイロット HTML には現場固有の既定値があります。実値は本書に載せていません。
- 図面タブはプレースホルダです。
- `react-app/src/App.css` と `react-app/src/assets/` のロゴ SVG は未使用です。
- バックエンド、データベース、LINE Developers コンソールの現状は、このリポジトリの範囲では確認できません。
