import { DEFAULT_ITEMS, DEFAULT_SHOP, CATEGORIES } from "./defaults.js";
export { DEFAULT_ITEMS, DEFAULT_SHOP, CATEGORIES };

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
export const nf = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US");
export const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-US");
export const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export const dmy = (s) => (s ? s.split("-").reverse().join("-") : "");
export const sd = (s) => { if (!s) return ""; const p = s.split("-"); return `${+p[2]}-${+p[1]}-${p[0].slice(2)}`; };
export const safeImg = (s) => (typeof s === "string" && (/^data:image\//.test(s) || /^\/img\/p\/[a-z0-9-]+\.(svg|webp)$/.test(s)) ? s : "");

export const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

/* ---------- language: en, ur, ro ---------- */
const LANGS = ["en", "ur", "ro"];
export let lang = store.get("abt-lang");
if (!LANGS.includes(lang)) lang = "ro";
const listeners = [];
export const onLang = (fn) => listeners.push(fn);
export function setLang(l) {
  lang = l; store.set("abt-lang", l);
  applyLang();
  listeners.forEach((fn) => fn(l));
}

// Each string is [English, Urdu, Roman Urdu].
const S = {};
export const addStrings = (o) => Object.assign(S, o);
export function t(k) {
  const v = S[k];
  if (!v) return k;
  return v[LANGS.indexOf(lang)] ?? v[0];
}
// Label with all three languages: the chosen one large, the others small.
export function tri(k) {
  const v = S[k];
  if (!v) return esc(k);
  const i = LANGS.indexOf(lang);
  const main = v[i];
  const seen = new Set([main.toLowerCase()]);
  const rest = [];
  [0, 1, 2].filter((j) => j !== i).forEach((j) => { const x = v[j]; if (!seen.has(x.toLowerCase())) { seen.add(x.toLowerCase()); rest.push(x); } });
  return `<span class="lab"><span class="l1">${esc(main)}</span>${rest.length ? `<span class="l2">${esc(rest.join(" · "))}</span>` : ""}</span>`;
}

addStrings({
  home: ["Home", "ہوم", "Home"],
  c_bill: ["Bill Maker", "بل میکر", "Bill Maker"],
  c_cash: ["Cash", "نقد", "Naqad"],
  c_udhaar: ["Credit", "ادھار", "Udhaar"],
  c_perkg: ["Per kg", "فی کلو", "Fi kg"],
  c_perbag: ["Per bori", "فی بوری", "Fi bori"],
  c_kg: ["kg", "کلو", "kg"],
  c_bori: ["bori", "بوری", "bori"],
  c_perpc: ["Per piece", "فی عدد", "Fi adad"],
  c_pc: ["pc", "عدد", "adad"],
  n_products: ["Products", "مصنوعات", "Maal"],
  n_lab: ["Lab Reports", "لیب رپورٹس", "Lab Reports"],
  n_formula: ["Formulas", "فارمولے", "Formulas"],
  n_balance: ["Feed Balancing", "فیڈ بیلنسنگ", "Feed Balancing"],
  n_bill: ["Bill Maker", "بل میکر", "Bill Maker"],
  n_contact: ["Contact", "رابطہ", "Rabta"],
  n_order: ["Order now", "آرڈر کریں", "Order karein"],
  c_all: ["All", "سب", "Sab"],
  c_pending: ["To be added", "جلد شامل ہوگا", "Jald add hoga"],
});

export function applyLang() {
  const root = document.documentElement;
  root.lang = lang === "ro" ? "ur-Latn" : lang;
  root.dir = lang === "ur" ? "rtl" : "ltr";
  $$("[data-t]").forEach((el) => (el.textContent = t(el.dataset.t)));
  $$("[data-tri]").forEach((el) => (el.innerHTML = tri(el.dataset.tri)));
  $$("[data-ph]").forEach((el) => (el.placeholder = t(el.dataset.ph)));
  $$(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.l === lang)));
}

export function initLang() {
  mountHeader();
  $$(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.l)));
  applyLang();
}

export const catName = (id) => { const c = CATEGORIES.find((x) => x.id === id); return c ? (lang === "ur" ? c.ur : lang === "en" ? c.en : c.ro) : ""; };
export const catDesc = (id) => { const c = CATEGORIES.find((x) => x.id === id); return c ? c.d[lang] || c.d.en : ""; };

/* ---------- shared header: <header class="top" id="top"> ---------- */
const NAV = [["/products", "n_products"], ["/lab-reports", "n_lab"], ["/formulas", "n_formula"], ["/balancing", "n_balance"]];
export function mountHeader() {
  const h = document.getElementById("top");
  if (!h) return;
  const here = location.pathname.replace(/\/$/, "").replace(/\.html$/, "");
  h.innerHTML = `<div class="in"><a class="brand" href="/" aria-label="AB Trader"><img src="/img/mark.png" width="38" height="38" alt=""><span class="bw">AB <b>TRADER</b></span></a>
  <nav class="nav" id="nav" aria-label="Main">${NAV.map(([u, k]) => `<a href="${u}" data-t="${k}"${here === u ? ' aria-current="page"' : ""}></a>`).join("")}<a class="navbtn" href="/bill" data-t="n_bill"></a><a class="navcta" href="/products" data-t="n_order"></a></nav>
  <div class="hr"><div class="lang" role="group" aria-label="Language"><button type="button" data-l="en">English</button><button type="button" data-l="ur">اردو</button><button type="button" data-l="ro">Roman</button></div>
  <button type="button" class="menu" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span></button></div></div>`;
  const btn = h.querySelector(".menu"), nav = h.querySelector(".nav");
  const set = (open) => { h.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); set(!h.classList.contains("open")); });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", (e) => { if (!h.contains(e.target)) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  const onScroll = () => { h.classList.toggle("scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
}

/* ---------- scroll-reveal animations (skipped for reduced motion) ---------- */
export function reveal(root = document) {
  const els = [...root.querySelectorAll(".rv:not(.in)")];
  if (!els.length) return;
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach((e) => e.classList.add("in")); return; }
  const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  els.forEach((e) => io.observe(e));
}

/* ---------- item helpers ---------- */
export const itemName = (c) => (lang === "ur" ? c.ur || c.ro || c.en : c.ro || c.en || c.ur);
export const itemBoth = (c) => (lang === "ur" ? [c.ur, c.ro] : [c.ro, c.ur]).filter(Boolean).join(" · ");

/* ---------- data from the API (falls back to built-in items) ---------- */
export async function api(path, { method = "GET", body, token } = {}) {
  const r = await fetch(path, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  let j = {};
  try { j = await r.json(); } catch { /* not json */ }
  if (!r.ok) throw Object.assign(new Error(j.error || "http " + r.status), { status: r.status, code: j.error });
  return j;
}

export async function loadItems({ noimg = false } = {}) {
  try {
    const j = await api("/api/items" + (noimg ? "?noimg=1" : ""));
    if (Array.isArray(j.items)) {
      store.set("abt-items", j.items.map((i) => ({ ...i, img: "" })));
      return j;
    }
    throw new Error("bad");
  } catch {
    return { items: store.get("abt-items") || DEFAULT_ITEMS, source: "offline", db: false };
  }
}

// Public lists kept in the database: lab reports and saved formulas.
export async function loadList(name) {
  try {
    const j = await api("/api/" + name);
    store.set("abt-" + name, j.list);
    return j.list;
  } catch { return store.get("abt-" + name) || []; }
}

export async function loadShop() {
  try {
    const j = await api("/api/shop");
    store.set("abt-shop", j.shop);
    return { ...DEFAULT_SHOP, ...j.shop };
  } catch {
    return { ...DEFAULT_SHOP, ...(store.get("abt-shop") || {}) };
  }
}

export const waLink = (shop, text = "") => {
  const d = String(shop.whatsapp || shop.phone || "").replace(/\D/g, "");
  const n = d.startsWith("0") ? "92" + d.slice(1) : d;
  return `https://wa.me/${n}${text ? "?text=" + encodeURIComponent(text) : ""}`;
};
