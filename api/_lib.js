import crypto from "node:crypto";
import { DEFAULT_ITEMS, DEFAULT_SHOP } from "../public/js/defaults.js";

// Upstash Redis (added from the Vercel Marketplace) provides these variables.
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
// Local preview only: keeps data in memory when no Redis is set.
const MEMORY = process.env.ABT_MEMORY_DB === "1";
const mem = (globalThis.__abtMem ??= { items: {}, seeded: false, shop: null, cols: {} });

export const dbReady = () => Boolean((REDIS_URL && REDIS_TOKEN) || MEMORY);
const useRedis = () => Boolean(REDIS_URL && REDIS_TOKEN);

async function cmd(args) {
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error(j.error || `redis ${r.status}`);
  return j.result;
}

const ITEMS = "abt:items";
const SEEDED = "abt:seeded";
const SHOP = "abt:shop";
const RATES_AT = "abt:ratesAt";

function pairsFrom(result) {
  if (Array.isArray(result)) {
    const out = [];
    for (let i = 0; i + 1 < result.length; i += 2) out.push([result[i], result[i + 1]]);
    return out;
  }
  return result && typeof result === "object" ? Object.entries(result) : [];
}

function parse(pairs) {
  return pairs
    .map(([id, v]) => { try { return { id, ...JSON.parse(v) }; } catch { return null; } })
    .filter(Boolean)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function readItems() {
  if (!dbReady()) return { items: DEFAULT_ITEMS, source: "defaults" };
  let pairs, seeded = true;
  if (useRedis()) {
    pairs = pairsFrom(await cmd(["HGETALL", ITEMS]));
    if (!pairs.length) seeded = Boolean(await cmd(["GET", SEEDED]));
  } else {
    pairs = Object.entries(mem.items);
    seeded = mem.seeded;
  }
  if (!pairs.length && !seeded) return { items: DEFAULT_ITEMS, source: "defaults" };
  return { items: parse(pairs), source: "db" };
}

const body = ({ id, ...rest }) => JSON.stringify(rest);

// First admin save copies the starter items into the database so nothing is lost.
export async function seedIfNeeded() {
  if (useRedis()) {
    if (await cmd(["GET", SEEDED])) return;
    const args = ["HSET", ITEMS];
    DEFAULT_ITEMS.forEach((i) => args.push(i.id, body(i)));
    await cmd(args);
    await cmd(["SET", SEEDED, "1"]);
  } else {
    if (mem.seeded) return;
    DEFAULT_ITEMS.forEach((i) => (mem.items[i.id] = body(i)));
    mem.seeded = true;
  }
}

export async function writeItems(list) {
  if (!list.length) return;
  if (useRedis()) {
    const args = ["HSET", ITEMS];
    list.forEach((i) => args.push(i.id, body(i)));
    await cmd(args);
  } else {
    list.forEach((i) => (mem.items[i.id] = body(i)));
  }
}

export async function deleteItem(id) {
  if (useRedis()) await cmd(["HDEL", ITEMS, id]);
  else delete mem.items[id];
}

export async function touchRates() {
  const v = String(Date.now());
  if (useRedis()) await cmd(["SET", RATES_AT, v]);
  else mem.ratesAt = v;
}

export async function readRatesAt() {
  try {
    const v = dbReady() ? (useRedis() ? await cmd(["GET", RATES_AT]) : mem.ratesAt) : null;
    return v ? Number(v) : 0;
  } catch { return 0; }
}

export async function readShop() {
  let raw = null;
  if (dbReady()) raw = useRedis() ? await cmd(["GET", SHOP]) : mem.shop;
  try { return { ...DEFAULT_SHOP, ...(raw ? JSON.parse(raw) : {}) }; } catch { return { ...DEFAULT_SHOP }; }
}

export async function writeShop(shop) {
  const v = JSON.stringify(shop);
  if (useRedis()) await cmd(["SET", SHOP, v]);
  else mem.shop = v;
}

/* ---------- input cleaning ---------- */
const s = (v, n) => String(v ?? "").trim().slice(0, n);
const n = (v) => { const x = Number(v); return Number.isFinite(x) && x >= 0 ? Math.round(x * 100) / 100 : 0; };

export function cleanItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = s(raw.id, 60).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  const ro = s(raw.ro, 60), ur = s(raw.ur, 60), en = s(raw.en, 60);
  if (!id || !(ro || ur || en)) return null;
  const img = typeof raw.img === "string" && /^\/img\/p\/[a-z0-9-]+\.(svg|webp)$/.test(raw.img) ? raw.img : typeof raw.img === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(raw.img) && raw.img.length <= 400000 ? raw.img : "";
  const mode = raw.mode === "bag" || raw.mode === "pc" ? raw.mode : "kg";
  const pct = (v) => Math.min(100, n(v));
  const cat = s(raw.cat, 30).toLowerCase().replace(/[^a-z0-9-]+/g, "");
  const out = { id, cat, en, ro, ur, mode, bagKg: n(raw.bagKg) || (mode === "pc" ? 1 : 40), cash: n(raw.cash), udhaar: n(raw.udhaar), dm: pct(raw.dm), cp: pct(raw.cp), tdn: pct(raw.tdn), ndf: pct(raw.ndf), img, order: n(raw.order) };
  if (raw.desc && typeof raw.desc === "object") out.desc = { en: s(raw.desc.en, 300), ur: s(raw.desc.ur, 300), ro: s(raw.desc.ro, 300) };
  return out;
}

/* ---------- generic admin-edited lists (lab reports, formulas) ---------- */
const imgOk = (v) => (typeof v === "string" && /^data:image\/(jpeg|png|webp);base64,/.test(v) && v.length <= 400000 ? v : "");
const numOrBlank = (v) => (v === "" || v == null || !Number.isFinite(Number(v)) ? "" : Math.round(Number(v) * 100) / 100);
const slug = (v) => s(v, 60).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

export function cleanReport(raw) {
  if (!raw || typeof raw !== "object") return null;
  const title = s(raw.title, 120);
  const id = slug(raw.id) || slug(title) || "r" + Date.now().toString(36);
  if (!title) return null;
  const out = { id, title, item: slug(raw.item), date: s(raw.date, 10), lab: s(raw.lab, 80), note: s(raw.note, 400), img: imgOk(raw.img) };
  for (const k of ["dm", "cp", "fat", "fibre", "ash", "ndf", "tdn"]) out[k] = numOrBlank(raw[k]);
  return out;
}

export function cleanFormula(raw) {
  if (!raw || typeof raw !== "object") return null;
  const en = s(raw.en, 80), ro = s(raw.ro, 80), ur = s(raw.ur, 80);
  if (!(en || ro || ur)) return null;
  const id = slug(raw.id) || slug(ro || en) || "f" + Date.now().toString(36);
  const rows = (Array.isArray(raw.rows) ? raw.rows : []).slice(0, 30).map((r) => ({ id: slug(r?.id), kg: n(r?.kg) })).filter((r) => r.id && r.kg > 0);
  return { id, en, ro, ur, note: s(raw.note, 400), bw: n(raw.bw) || 550, milk: n(raw.milk), fat: n(raw.fat) || 4, rows, order: n(raw.order) };
}

export const COLLECTIONS = {
  reports: { key: "abt:reports", clean: cleanReport },
  formulas: { key: "abt:formulas", clean: cleanFormula },
};

export async function colRead(name) {
  const { key } = COLLECTIONS[name];
  if (!dbReady()) return [];
  const pairs = useRedis() ? pairsFrom(await cmd(["HGETALL", key])) : Object.entries(mem.cols[name] || {});
  return parse(pairs);
}
export async function colWrite(name, list) {
  const { key } = COLLECTIONS[name];
  if (useRedis()) { const a = ["HSET", key]; list.forEach((i) => a.push(i.id, body(i))); await cmd(a); }
  else { mem.cols[name] ||= {}; list.forEach((i) => (mem.cols[name][i.id] = body(i))); }
}
export async function colDelete(name, id) {
  if (useRedis()) await cmd(["HDEL", COLLECTIONS[name].key, id]);
  else delete (mem.cols[name] || {})[id];
}

export const cleanShop = (raw) => ({ phone: s(raw?.phone, 30), whatsapp: s(raw?.whatsapp, 30), email: s(raw?.email, 80), address: s(raw?.address, 200) });

/* ---------- admin login ---------- */
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function checkPassword(p) {
  if (!adminConfigured()) return false;
  const h = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
  return same(h(p), h(process.env.ADMIN_PASSWORD));
}

export function makeToken() {
  const exp = String(Date.now() + 30 * 24 * 3600 * 1000);
  return `${exp}.${sign(exp)}`;
}

export function isAdmin(req) {
  if (!secret()) return false;
  const h = req.headers?.authorization || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7) : "";
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return same(sig, sign(exp));
}

export function readBody(req) {
  const b = req.body;
  if (b && typeof b === "object") return b;
  try { return JSON.parse(b || "{}"); } catch { return {}; }
}
