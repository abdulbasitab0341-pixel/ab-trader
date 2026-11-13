import { $, esc, num, lang, addStrings, t, initLang, onLang, loadItems, loadShop, itemName, itemBoth, safeImg, waLink, CATEGORIES, catName, catDesc, DEFAULT_ITEMS } from "./common.js";

addStrings({
  pr_h: ["Products", "مصنوعات", "Hamara maal"],
  pr_p: ["Raw materials and feed for cattle and buffaloes.", "گائے اور بھینس کے لیے خام مال اور فیڈ۔", "Gaaye aur bhains ke liye kham maal aur feed."],
  search: ["Search product…", "مال تلاش کریں…", "Maal talash karein…"],
  ask: ["Ask rate on WhatsApp", "واٹس ایپ پر ریٹ پوچھیں", "WhatsApp par rate poochein"],
  protein: ["Protein", "پروٹین", "Protein"],
  none: ["Nothing found.", "کچھ نہیں ملا۔", "Kuch nahi mila."],
  typical: ["typical value", "عام قدر", "aam value"],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
});

let items = DEFAULT_ITEMS, shop = {}, cat = new URLSearchParams(location.search).get("cat") || "all", q = "";

const unit = (c) => (c.mode === "bag" ? `${t("c_perbag")} · ${num(c.bagKg) || 40} ${t("c_kg")}` : c.mode === "pc" ? t("c_perpc") : t("c_perkg"));

function card(c) {
  const img = safeImg(c.img);
  const wa = waLink(shop, `Assalam o Alaikum, ${c.ro || c.en} ka rate bata dein.`);
  return `<article class="prod">${img ? `<img class="pic" src="${esc(img)}" alt="${esc(c.en || c.ro)}" loading="lazy">` : `<div class="pic ph" aria-hidden="true">${esc((c.ro || c.en || "AB").slice(0, 2).toUpperCase())}</div>`}
    <h3>${esc(itemName(c))}</h3>
    <div class="names"><span>${esc([c.en, c.ro].filter((v, i, a) => v && a.indexOf(v) === i).join(" · "))}</span><span>${esc(c.ur)}</span></div>
    <div class="pills"><span class="pill ${c.mode === "bag" ? "" : "kg"}">${esc(unit(c))}</span>${num(c.cp) ? `<span class="pill soft" title="${esc(t("typical"))}">${esc(t("protein"))} ${num(c.cp)}%</span>` : ""}</div>
    ${shop.phone || shop.whatsapp ? `<a class="btn sm line" href="${esc(wa)}" target="_blank" rel="noopener">${esc(t("ask"))}</a>` : ""}</article>`;
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
}

$("#chips").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) { cat = b.dataset.cat; render(); } });
$("#q").addEventListener("input", (e) => { q = e.target.value; render(); });
onLang(render);
initLang();
render();
loadItems().then((j) => { items = j.items; render(); });
loadShop().then((s) => { shop = s; render(); });
