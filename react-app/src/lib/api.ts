import { SUPABASE_ANON_KEY, SUPABASE_FUNCTIONS_BASE } from "./constants";

const H = () => ({
  "content-type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
});

export async function apiPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${SUPABASE_FUNCTIONS_BASE}${path}`, {
    method: "POST",
    headers: H(),
    body: JSON.stringify(body),
  });
  return res.json() as Promise<T>;
}
