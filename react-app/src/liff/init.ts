import liff from "@line/liff";
import { LIFF_ID } from "./config";

export class LiffLoginRedirectError extends Error {
  constructor() {
    super("LIFF login redirect");
    this.name = "LiffLoginRedirectError";
  }
}

/** OAuth コールバック後に URL から code/state を除去（BMS liff-init 準拠） */
export function stripLiffOAuthParams(): void {
  const url = new URL(window.location.href);
  const keys = [
    "code",
    "state",
    "liffClientId",
    "liffRedirectUri",
    "friendship_status_changed",
  ];
  let dirty = false;
  for (const k of keys) {
    if (url.searchParams.has(k)) {
      url.searchParams.delete(k);
      dirty = true;
    }
  }
  if (dirty) {
    const next =
      url.pathname +
      (url.searchParams.toString() ? `?${url.searchParams}` : "");
    window.history.replaceState({}, "", next);
  }
}

let initPromise: Promise<typeof liff> | null = null;

/** LIFF を1回だけ初期化。未ログイン時は login へリダイレクト。 */
export async function ensureLiffSession(): Promise<typeof liff> {
  if (!LIFF_ID) throw new Error("LIFF ID が未設定です。");

  if (!initPromise) {
    initPromise = (async () => {
      await liff.init({ liffId: LIFF_ID, withLoginOnExternalBrowser: true });
      if (!liff.isLoggedIn()) {
        const redirectUri = `${window.location.origin}${window.location.pathname}`;
        liff.login({ redirectUri });
        throw new LiffLoginRedirectError();
      }
      stripLiffOAuthParams();
      return liff;
    })().catch((e) => {
      if (e instanceof LiffLoginRedirectError) throw e;
      initPromise = null;
      throw e;
    });
  }

  try {
    return await initPromise;
  } catch (e) {
    if (e instanceof LiffLoginRedirectError) throw e;
    initPromise = null;
    throw e;
  }
}

export function getLiffIdToken(): string {
  const token = liff.getIDToken();
  if (!token) {
    throw new Error(
      "IDトークンを取得できませんでした。LINEアプリから開き直してください。",
    );
  }
  return token;
}

export { liff };
