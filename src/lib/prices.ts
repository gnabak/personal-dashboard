/**
 * Best-effort last-price fetcher for stock / ETF tickers.
 *
 * Tries Yahoo Finance's public chart endpoint first. If the browser blocks
 * it for CORS, falls back to a public CORS proxy. Both can fail at any
 * time — every caller must handle a `null` result and prompt the user to
 * enter the price manually.
 */

export interface PriceResult {
  ticker: string;
  price: number;
  currency?: string;
  fetchedAt: string;
}

const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
const PROXY = "https://corsproxy.io/?";

export async function fetchLastPrice(
  ticker: string
): Promise<PriceResult | null> {
  const symbol = encodeURIComponent(ticker.trim());
  if (!symbol) return null;
  const url = `${YAHOO_BASE}/${symbol}?interval=1d&range=5d`;

  // Direct attempt
  const direct = await tryFetchYahoo(url);
  if (direct) return { ...direct, ticker };

  // Proxy fallback
  const proxied = await tryFetchYahoo(`${PROXY}${encodeURIComponent(url)}`);
  if (proxied) return { ...proxied, ticker };

  return null;
}

async function tryFetchYahoo(
  url: string
): Promise<Omit<PriceResult, "ticker"> | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta ?? {};
    const price: number | undefined =
      meta.regularMarketPrice ?? meta.previousClose;
    if (typeof price !== "number" || !Number.isFinite(price)) return null;
    return {
      price,
      currency: typeof meta.currency === "string" ? meta.currency : undefined,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Fetch many tickers in parallel; returns a record keyed by ticker. */
export async function fetchLastPrices(
  tickers: string[]
): Promise<Record<string, PriceResult | null>> {
  const unique = Array.from(new Set(tickers.map((t) => t.trim()).filter(Boolean)));
  const results = await Promise.all(unique.map((t) => fetchLastPrice(t)));
  const out: Record<string, PriceResult | null> = {};
  unique.forEach((t, i) => {
    out[t] = results[i];
  });
  return out;
}
