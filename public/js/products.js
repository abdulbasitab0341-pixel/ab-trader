import { $, $$, esc, num, nf, store, lang, addStrings, t, tri, initLang, onLang, loadItems, loadShop, itemName, safeImg, waLink, CATEGORIES, catName, catDesc, DEFAULT_ITEMS, DEFAULT_SHOP } from "./common.js";

addStrings({
  pr_h: ["Products", "مصنوعات", "Hamara maal"],
  pr_p: ["Pick your items, set the quantity and send the order on WhatsApp.", "اپنا مال چنیں، مقدار لکھیں اور آرڈر واٹس ایپ پر بھیجیں۔", "Apna maal chunein, miqdaar likhein aur order WhatsApp par bhejein."],
  search: ["Search product…", "مال تلاش کریں…", "Maal talash karein…"],
  protein: ["Protein", "پروٹین", "Protein"],
  none: ["Nothing found.", "کچھ نہیں ملا۔", "Kuch nahi mila."],
  typical: ["typical value", "عام قدر", "aam value"],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
  add: ["Add to order", "آرڈر میں شامل کریں", "Order mein add karein"],
  o_review: ["Review order", "آرڈر دیکھیں", "Order dekhein"],
  o_h: ["Your order", "آپ کا آرڈر", "Aap ka order"],
  o_name: ["Your name", "آپ کا نام", "Aap ka naam"],
  o_area: ["Delivery address / area", "ڈیلیوری کا پتہ / علاقہ", "Delivery ka pata / ilaqa"],
  o_send: ["Send order on WhatsApp", "آرڈر واٹس ایپ پر بھیجیں", "Order WhatsApp par bhejein"],
  o_clear: ["Clear order", "آرڈر صاف کریں", "Order saaf karein"],
  o_note: ["We reply with today's rate and delivery time. No payment is taken on the website.", "ہم آج کا ریٹ اور ڈیلیوری کا وقت بتائیں گے۔ ویب سائٹ پر کوئی ادائیگی نہیں ہوتی۔", "Hum aaj ka rate aur delivery ka waqt batayenge. Website par koi adaigi nahi hoti."],
  o_items: ["items", "اشیاء", "items"],
  o_item: ["item", "شے", "item"],
  o_empty: ["Your order is empty.", "آپ کا آرڈر خالی ہے۔", "Aap ka order khali hai."],
  o_rm: ["Remove", "ہٹائیں", "Hatayein"],
  o_s1: ["Choose", "منتخب", "Chunein"],
  o_s2: ["Send", "بھیجیں", "Bhejein"],
  o_s3: ["We confirm", "تصدیق", "Tasdeeq"],
  o_sent: ["Order sent. We will confirm today's rate on WhatsApp.", "آرڈر بھیج دیا گیا۔ ہم واٹس ایپ پر آج کا ریٹ بتائیں گے۔", "Order bhej diya gaya. Hum WhatsApp par aaj ka rate batayenge."],
  o_hello: ["Assalam o Alaikum, I want to order:", "السلام علیکم، میں آرڈر دینا چاہتا ہوں:", "Assalam o Alaikum, main order dena chahta hoon:"],
  o_confirm: ["Please confirm today's rate and delivery.", "براہِ کرم آج کا ریٹ اور ڈیلیوری بتائیں۔", "Meherbani kar ke aaj ka rate aur delivery batayein."],
  o_nm: ["Name", "نام", "Naam"],
  o_ad: ["Address", "پتہ", "Pata"],
});

const CART = "abt-cart", CUST = "abt-cust";
let items = DEFAULT_ITEMS, shop = { ...DEFAULT_SHOP }, cat = new URLSearchParams(location.search).get("cat") || "all", q = "";
let cart = store.get(CART) || {};
let cust = store.get(CUST) || { name: "", area: "" };
let sent = false;

const unitKey = (c) => (c.mode === "bag" ? "c_bori" : c.mode === "pc" ? "c_pc" : "c_kg");
const stepOf = (c) => (c.mode === "kg" ? 10 : 1);
const unitLabel = (c) => (c.mode === "bag" ? `${t("c_perbag")} · ${num(c.bagKg) || 40} ${t("c_kg")}` : c.mode === "pc" ? t("c_perpc") : t("c_perkg"));
const saveCart = () => store.set(CART, cart);
const lines = () => items.filter((c) => num(cart[c.id]) > 0);

function qtyHTML(c) {
  const v = num(cart[c.id]);
  return `<div class="qty" data-id="${esc(c.id)}"><div class="stp"><button type="button" data-d="-1" aria-label="-">−</button><input type="number" min="0" step="any" inputmode="decimal" value="${v || ""}" placeholder="0" aria-label="${esc(itemName(c))} ${esc(t(unitKey(c)))}"><button type="button" data-d="1" aria-label="+">+</button></div><span class="u">${esc(t(unitKey(c)))}</span></div>`;
}
function card(c) {
  const img = safeImg(c.img);
  return `<article class="prod${num(cart[c.id]) > 0 ? " inorder" : ""}" data-card="${esc(c.id)}">${img ? `<img class="pic" src="${esc(img)}" width="640" height="400" alt="${esc((c.en || c.ro) + " (" + (c.ro || "") + ") supplied by AB Trader")}" loading="lazy" decoding="async">` : `<div class="pic ph" aria-hidden="true">${esc((c.ro || c.en || "AB").slice(0, 2).toUpperCase())}</div>`}
    <h3>${esc(itemName(c))}</h3>
    <div class="names"><span>${esc([c.en, c.ro].filter((v, i, a) => v && a.indexOf(v) === i).join(" · "))}</span><span>${esc(c.ur)}</span></div>
    <div class="pills"><span class="pill ${c.mode === "bag" ? "" : "kg"}">${esc(unitLabel(c))}</span>${num(c.cp) ? `<span class="pill soft" title="${esc(t("typical"))}">${esc(t("protein"))} ${num(c.cp)}%</span>` : ""}</div>
    ${qtyHTML(c)}</article>`;
}

function render() {
  $("#chips").innerHTML = [["all", t("c_all")], ...CATEGORIES.map((g) => [g.id, catName(g.id)])]
    .map(([id, n]) => `<button type="button" data-cat="${id}" aria-pressed="${cat === id}">${esc(n)}</button>`).join("");
  const s = q.trim().toLowerCase();
  const hit = (c) => !s || [c.en, c.ro, c.ur].some((v) => (v || "").toLowerCase().includes(s));
  const out = CATEGORIES.filter((g) => cat === "all" || cat === g.id).map((g) => {
    const l = items.filter((c) => c.cat === g.id && hit(c));
    return l.length ? `<section class="cat" id="${g.id}"><h2>${esc(catName(g.id))}</h2><p class="sub">${esc(catDesc(g.id))}</p><div class="grid">${l.map(card).join("")}</div></section>` : "";
  }).join("");
  $("#list").innerHTML = out || `<p class="sub">${esc(t("none"))}</p>`;
  renderBar();
}

/* ---------- cart bar ---------- */
function renderBar() {
  const n = lines().length;
  $("#cartbar").classList.toggle("on", n > 0);
  $("#cb-n").textContent = `${n} ${t(n === 1 ? "o_item" : "o_items")}`;
  $("#cb-s").textContent = lines().slice(0, 2).map((c) => itemName(c)).join(", ") + (n > 2 ? "…" : "");
}

function setQty(id, v) {
  v = Math.max(0, Math.round(num(v) * 100) / 100);
  if (v) cart[id] = v; else delete cart[id];
  saveCart(); sent = false;
  const cardEl = document.querySelector(`[data-card="${id}"]`);
  if (cardEl) { cardEl.classList.toggle("inorder", v > 0); const inp = cardEl.querySelector("input"); if (inp && document.activeElement !== inp) inp.value = v || ""; }
  renderBar();
  if ($("#sheet").open) renderSheet();
}

$("#list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-d]"); if (!b) return;
  const id = b.closest("[data-id]").dataset.id, c = items.find((x) => x.id === id);
  const next = num(cart[id]) + num(b.dataset.d) * stepOf(c);
  setQty(id, next);
  const inp = b.parentElement.querySelector("input"); inp.value = num(cart[id]) || "";
});
$("#list").addEventListener("input", (e) => {
  const inp = e.target.closest(".qty input"); if (!inp) return;
  setQty(inp.closest("[data-id]").dataset.id, inp.value);
});
$("#chips").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; render(); } });
$("#q").addEventListener("input", (e) => { q = e.target.value; render(); });

/* ---------- order sheet ---------- */
function steps() {
  const s = [["o_s1", "done"], ["o_s2", sent ? "done" : "on"], ["o_s3", sent ? "on" : ""]];
  $("#sh-steps").innerHTML = s.map(([k, st], i) => `${i ? "<hr>" : ""}<span class="${st}"><i>${i + 1}</i> ${esc(t(k))}</span>`).join("");
}
function renderSheet() {
  steps();
  const l = lines();
  $("#olist").innerHTML = l.length ? l.map((c) => `<div class="orow" data-id="${esc(c.id)}"><div><b>${esc(itemName(c))}</b><br><small>${esc(unitLabel(c))}</small></div>
    <div class="stp"><button type="button" data-d="-1" aria-label="-">−</button><input type="number" min="0" step="any" inputmode="decimal" value="${num(cart[c.id])}" aria-label="${esc(itemName(c))}"><button type="button" data-d="1" aria-label="+">+</button></div>
    <button type="button" class="rm" data-rm="${esc(c.id)}">${esc(t("o_rm"))}</button></div>`).join("") : `<p class="sub">${esc(t("o_empty"))}</p>`;
  $("#o-name").value = cust.name; $("#o-area").value = cust.area;
  $("#o-send").disabled = !l.length;
  $("#sh-sent").hidden = !sent;
}
$("#cb-open").addEventListener("click", () => { sent = false; renderSheet(); $("#sheet").showModal(); });
$("#sh-x").addEventListener("click", () => $("#sheet").close());
$("#sheet").addEventListener("click", (e) => { if (e.target === $("#sheet")) $("#sheet").close(); });
$("#olist").addEventListener("click", (e) => {
  const rm = e.target.closest("[data-rm]"), b = e.target.closest("[data-d]");
  if (rm) return setQty(rm.dataset.rm, 0);
  if (b) { const id = b.closest("[data-id]").dataset.id, c = items.find((x) => x.id === id); setQty(id, num(cart[id]) + num(b.dataset.d) * stepOf(c)); }
});
$("#olist").addEventListener("change", (e) => { const inp = e.target.closest("input"); if (inp) setQty(inp.closest("[data-id]").dataset.id, inp.value); });
["name", "area"].forEach((k) => $("#o-" + k).addEventListener("input", (e) => { cust[k] = e.target.value; store.set(CUST, cust); }));

function orderText() {
  const L = [t("o_hello"), ""];
  lines().forEach((c, i) => {
    const bag = c.mode === "bag" ? ` (${nf(num(cart[c.id]) * (num(c.bagKg) || 40))} ${t("c_kg")})` : "";
    L.push(`${i + 1}. ${c.ro || c.en}${c.en && c.en !== c.ro ? " / " + c.en : ""}: ${nf(num(cart[c.id]))} ${t(unitKey(c))}${bag}`);
  });
  L.push("");
  if (cust.name) L.push(`${t("o_nm")}: ${cust.name}`);
  if (cust.area) L.push(`${t("o_ad")}: ${cust.area}`);
  L.push(t("o_confirm"));
  return L.join("\n");
}
$("#o-send").addEventListener("click", () => {
  if (!lines().length) return;
  window.open(waLink(shop, orderText()), "_blank", "noopener");
  sent = true; steps(); $("#sh-sent").hidden = false;
});
$("#o-clear").addEventListener("click", () => { cart = {}; saveCart(); sent = false; $("#sheet").close(); render(); });

/* ---------- start ---------- */
function goHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  const el = id && document.getElementById(id);
  if (el && CATEGORIES.some((g) => g.id === id)) el.scrollIntoView();
}
onLang(() => { render(); if ($("#sheet").open) renderSheet(); });
initLang();
render();
goHash();
loadItems().then((j) => { items = j.items; render(); goHash(); });
loadShop().then((s) => { shop = s; });
