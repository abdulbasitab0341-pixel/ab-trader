import { $, $$, esc, num, nf, rs, store, lang, addStrings, t, tri, initLang, onLang, api, loadItems, loadShop, loadList, itemName, waLink, CATEGORIES, catName } from "./common.js";
import { FORAGES, requirement, analyze, leastCost } from "./nutrition.js";

addStrings({
  bl_h: ["Feed Balancing", "فیڈ بیلنسنگ", "Feed Balancing"],
  bl_p: ["Check a daily ration for a milking cow or buffalo.", "دودھ دینے والی گائے یا بھینس کے روزانہ راشن کی جانچ۔", "Doodh dene wali gaaye ya bhains ke rozana ration ki jaanch."],
  bl_animal: ["Animal", "جانور", "Janwar"],
  bl_bw: ["Body weight (kg)", "جسمانی وزن (کلو)", "Janwar ka wazan (kg)"],
  bl_milk: ["Milk (litres/day)", "دودھ (لیٹر روزانہ)", "Doodh (litre rozana)"],
  bl_fat: ["Milk fat %", "دودھ میں چکنائی %", "Doodh mein chikna'i %"],
  bl_ration: ["Daily ration (kg as fed, per animal)", "روزانہ راشن (کلو، فی جانور)", "Rozana ration (kg, fi janwar)"],
  bl_add: ["Add ingredient", "مال شامل کریں", "Maal add karein"],
  bl_pick: ["Choose…", "چنیں…", "Chunein…"],
  bl_farm: ["Farm forage", "اپنا چارہ", "Apna chara"],
  bl_auto: ["Find cheapest ration", "سستا راشن تلاش کریں", "Sasta ration talash karein"],
  bl_clear: ["Clear", "صاف کریں", "Saaf karein"],
  bl_result: ["Result", "نتیجہ", "Nateeja"],
  bl_wa: ["Send on WhatsApp", "واٹس ایپ پر بھیجیں", "WhatsApp par bhejein"],
  bl_pub: ["Publish as formula", "فارمولا کے طور پر شائع کریں", "Formula ke tor par publish karein"],
  bl_disc: ["Typical values and rules of thumb only. Use your lab reports for exact numbers, and a nutritionist for final rations.", "صرف عام اقدار اور اندازے۔ درست اعداد کے لیے لیب رپورٹ اور حتمی راشن کے لیے ماہرِ غذائیت سے رجوع کریں۔", "Sirf aam values aur andaze. Durust adaad ke liye lab report aur final ration ke liye mahir-e-ghiza se rujoo karein."],
  bl_need: ["Needs", "ضرورت", "Zaroorat"],
  bl_have: ["Ration gives", "راشن میں", "Ration mein"],
  bl_dmi: ["Dry matter (kg)", "خشک مادہ (کلو)", "Dry matter (kg)"],
  bl_nel: ["Energy (Mcal)", "توانائی (Mcal)", "Taqat (Mcal)"],
  bl_cp: ["Protein (% of dry matter)", "پروٹین (% خشک مادہ)", "Protein (% dry matter)"],
  bl_ndf: ["Fibre NDF (%, at least)", "ریشہ NDF (% کم از کم)", "Resha NDF (% kam az kam)"],
  bl_for: ["Forage (% of dry matter, at least)", "چارہ (% خشک مادہ، کم از کم)", "Chara (% dry matter, kam az kam)"],
  bl_cost: ["Cost per day", "روزانہ خرچ", "Rozana kharcha"],
  bl_cpl: ["Cost per litre of milk", "فی لیٹر دودھ خرچ", "Fi litre doodh kharcha"],
  bl_asfed: ["Total as fed (kg)", "کل مقدار (کلو)", "Kul miqdaar (kg)"],
  ok: ["OK", "ٹھیک", "Theek"],
  low: ["Low", "کم", "Kam"],
  high: ["High", "زیادہ", "Zyada"],
  bl_vals: ["Values and price", "اقدار اور قیمت", "Values aur qeemat"],
  bl_price: ["Price (Rs/kg)", "قیمت (روپے/کلو)", "Qeemat (Rs/kg)"],
  bl_rm: ["Remove", "ہٹائیں", "Hatayein"],
  bl_empty: ["Add ingredients to see the result.", "نتیجہ دیکھنے کے لیے مال شامل کریں۔", "Nateeja dekhne ke liye maal add karein."],
  bl_noval: ["No nutrient values for this item. Enter them under Values, or add them in the admin panel.", "اس مال کی غذائی اقدار نہیں ہیں۔ اقدار میں درج کریں یا ایڈمن پینل میں شامل کریں۔", "Is maal ki ghizai values nahi hain. Values mein likhein ya admin panel mein add karein."],
  bl_a_ok: ["Cheapest ration found for the ingredients you added (prices from your list).", "آپ کے شامل کردہ مال سے سب سے سستا راشن مل گیا۔", "Aap ke add kiye maal se sab se sasta ration mil gaya."],
  bl_a_few: ["Add at least 3 ingredients with a price: one forage, one energy feed and one protein feed.", "کم از کم 3 مال قیمت کے ساتھ شامل کریں: ایک چارہ، ایک توانائی اور ایک پروٹین۔", "Kam az kam 3 maal qeemat ke sath add karein: ek chara, ek taqat aur ek protein."],
  bl_a_no: ["These ingredients cannot meet the needs. Add a protein feed (soybean meal, sarso khal) or more forage.", "ان مال سے ضرورت پوری نہیں ہوتی۔ پروٹین (سویابین میل، سرسوں کھل) یا مزید چارہ شامل کریں۔", "In maal se zaroorat poori nahi hoti. Protein (soybean meal, sarso khal) ya mazeed chara add karein."],
  bl_pubd: ["Name of the formula?", "فارمولے کا نام؟", "Formula ka naam?"],
  bl_pubok: ["Published on the Formulas page.", "فارمولے کے صفحے پر شائع ہو گیا۔", "Formulas page par publish ho gaya."],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
});

const KEY = "abt-bal";
let items = [], shop = {};
let S = store.get(KEY) || { bw: 550, milk: 20, fat: 4, rows: [] };
if (!Array.isArray(S.rows)) S.rows = [];
const save = () => store.set(KEY, S);

const pool = () => [...FORAGES, ...items.filter((i) => i.mode !== "pc")];
const find = (id) => pool().find((x) => x.id === id);
const nm = (x) => (x ? itemName(x) : "");
const defPrice = (x) => (x.forage ? x.price : x.mode === "bag" ? Math.round((num(x.cash) / (num(x.bagKg) || 40)) * 100) / 100 : num(x.cash));
// Values for a row: own edits win over the catalogue.
const val = (r, k) => (r[k] !== undefined && r[k] !== "" ? num(r[k]) : k === "price" ? defPrice(find(r.id) || {}) : num((find(r.id) || {})[k]));
const full = (r) => ({ id: r.id, kg: num(r.kg), dm: val(r, "dm"), cp: val(r, "cp"), tdn: val(r, "tdn"), ndf: val(r, "ndf"), price: val(r, "price"), forage: Boolean((find(r.id) || {}).forage) });
const req = () => requirement({ bw: num(S.bw), milk: num(S.milk), fat: num(S.fat) });

/* ---------- animal ---------- */
function renderReq() {
  const r = req();
  $("#req").innerHTML = `<div><small>${esc(t("bl_dmi"))}</small><b>${nf(r.dmi)}</b></div><div><small>${esc(t("bl_nel"))}</small><b>${nf(r.nelReq)}</b></div><div><small>${esc(t("bl_cp"))}</small><b>${nf(r.cpPct)}%</b></div>`;
}

/* ---------- ration rows ---------- */
function renderAddList() {
  const used = new Set(S.rows.map((r) => r.id));
  const opt = (x) => `<option value="${esc(x.id)}">${esc(nm(x))}</option>`;
  const groups = CATEGORIES.map((g) => { const l = items.filter((i) => i.cat === g.id && i.mode !== "pc" && !used.has(i.id)); return l.length ? `<optgroup label="${esc(catName(g.id))}">${l.map(opt).join("")}</optgroup>` : ""; }).join("");
  const fg = FORAGES.filter((f) => !used.has(f.id));
  $("#add").innerHTML = `<option value="">${esc(t("bl_pick"))}</option>${fg.length ? `<optgroup label="${esc(t("bl_farm"))}">${fg.map(opt).join("")}</optgroup>` : ""}${groups}`;
}
function renderRows() {
  $("#rrows").innerHTML = S.rows.map((r, i) => {
    const x = find(r.id) || {};
    const f = (k, lab, step = "any") => `<div class="field"><label for="v-${i}-${k}">${esc(lab)}</label><input id="v-${i}-${k}" type="number" min="0" step="${step}" inputmode="decimal" data-i="${i}" data-k="${k}" value="${esc(r[k] !== undefined ? r[k] : k === "price" ? defPrice(x) || "" : num(x[k]) || "")}"></div>`;
    const missing = !(val(r, "dm") && val(r, "tdn"));
    return `<div class="rrow"><div class="top2"><b>${esc(nm(x) || r.id)}</b><button type="button" class="btn danger sm" data-rm="${i}">${esc(t("bl_rm"))}</button></div>
      <div class="field"><label for="k-${i}">${esc(lang === "ur" ? "کلو" : "kg")}</label><input id="k-${i}" type="number" min="0" step="any" inputmode="decimal" data-i="${i}" data-k="kg" value="${esc(r.kg ?? "")}"></div>
      ${missing ? `<p class="note warn">${esc(t("bl_noval"))}</p>` : ""}
      <details${missing ? " open" : ""}><summary>${esc(t("bl_vals"))}</summary><div class="grid3">${f("price", t("bl_price"))}${f("dm", "DM %")}${f("cp", "CP %")}${f("tdn", "TDN %")}${f("ndf", "NDF %")}</div></details></div>`;
  }).join("");
}

/* ---------- result ---------- */
const badge = (have, need, kind) => {
  // kind: "min" (should reach need) or "near" (should be close to need)
  const r = need ? have / need : 1;
  const st = kind === "near" ? (r < 0.95 ? "low" : r > 1.08 ? "high" : "ok") : r < 0.97 ? "low" : "ok";
  return `<span class="bd ${st}">${esc(t(st))}</span>`;
};
function renderRes() {
  const r = req(), rows = S.rows.map(full), a = analyze(rows, r);
  if (!a.dmKg) { $("#res").innerHTML = `<p class="sub">${esc(t("bl_empty"))}</p>`; return; }
  const line = (k, have, need, kind, fmt = nf) => `<tr><td>${esc(t(k))}</td><td class="ltr">${fmt(have)}</td><td class="ltr">${fmt(need)}</td><td>${badge(have, need, kind)}</td></tr>`;
  $("#res").innerHTML = `<table class="rt"><thead><tr><th></th><th>${esc(t("bl_have"))}</th><th>${esc(t("bl_need"))}</th><th></th></tr></thead><tbody>
    ${line("bl_dmi", a.dmKg, r.dmi, "near")}${line("bl_nel", a.nelS, r.nelReq, "near")}${line("bl_cp", a.cpPct, r.cpPct, "min")}${line("bl_ndf", a.ndfPct, 28, "min")}${line("bl_for", a.forPct, 40, "min")}</tbody></table>
    <div class="sums2"><div><small>${esc(t("bl_asfed"))}</small><b class="ltr">${nf(a.asFed)}</b></div><div><small>${esc(t("bl_cost"))}</small><b class="ltr">${rs(a.cost)}</b></div>${num(S.milk) ? `<div><small>${esc(t("bl_cpl"))}</small><b class="ltr">${rs(a.cost / num(S.milk))}</b></div>` : ""}</div>`;
}
function renderAll() { renderReq(); renderAddList(); renderRows(); renderRes(); }

/* ---------- events ---------- */
["bw", "milk", "fat"].forEach((k) => {
  const el = $("#a-" + k); el.value = S[k];
  el.addEventListener("input", () => { S[k] = el.value; save(); renderReq(); renderRes(); });
});
$("#add").addEventListener("change", (e) => {
  if (!e.target.value) return;
  S.rows.push({ id: e.target.value, kg: "" }); save(); renderAll();
  const i = S.rows.length - 1; $("#k-" + i)?.focus();
});
$("#rrows").addEventListener("input", (e) => {
  const el = e.target, i = el.dataset.i; if (i === undefined) return;
  S.rows[+i][el.dataset.k] = el.value; save(); renderRes();
});
$("#rrows").addEventListener("click", (e) => { const b = e.target.closest("[data-rm]"); if (b) { S.rows.splice(+b.dataset.rm, 1); save(); renderAll(); } });
$("#clear").addEventListener("click", () => { S.rows = []; save(); $("#autonote").textContent = ""; renderAll(); });
$("#auto").addEventListener("click", () => {
  const note = $("#autonote"); note.classList.remove("warn");
  const c = S.rows.map(full).filter((x) => x.dm > 0 && x.tdn > 0 && x.price > 0);
  if (c.length < 3) { note.textContent = t("bl_a_few"); note.classList.add("warn"); return; }
  const sol = leastCost(c, req());
  if (!sol) { note.textContent = t("bl_a_no"); note.classList.add("warn"); return; }
  S.rows.forEach((r) => { if (c.some((x) => x.id === r.id)) r.kg = sol[r.id] || 0; });
  save(); note.textContent = t("bl_a_ok"); renderRows(); renderRes();
});

function text() {
  const r = req(), rows = S.rows.map(full), a = analyze(rows, r), L = [];
  L.push("*AB Trader | " + t("bl_h") + "*");
  L.push(`${t("bl_bw")}: ${nf(num(S.bw))} | ${t("bl_milk")}: ${nf(num(S.milk))} | ${t("bl_fat")}: ${nf(num(S.fat))}`);
  S.rows.filter((x) => num(x.kg)).forEach((x) => L.push(`${nm(find(x.id))}: ${nf(num(x.kg))} kg`));
  L.push(`${t("bl_cp")}: ${nf(a.cpPct)} | ${t("bl_nel")}: ${nf(a.nelS)} / ${nf(r.nelReq)}`);
  L.push(`${t("bl_cost")}: ${rs(a.cost)}`);
  return L.join("\n");
}
$("#wa").addEventListener("click", () => {
  const d = String(shop.whatsapp || shop.phone || "");
  window.open(d ? waLink(shop, text()) : "https://wa.me/?text=" + encodeURIComponent(text()), "_blank", "noopener");
});
const token = store.get("abt-admin");
if (token) $("#pub").hidden = false;
$("#pub").addEventListener("click", async () => {
  const name = prompt(t("bl_pubd")); if (!name) return;
  try {
    await api("/api/formulas", { method: "POST", token, body: { item: { en: name, ro: name, ur: name, bw: num(S.bw), milk: num(S.milk), fat: num(S.fat), rows: S.rows.filter((x) => num(x.kg)).map((x) => ({ id: x.id, kg: num(x.kg) })) } } });
    $("#autonote").textContent = t("bl_pubok");
  } catch { $("#autonote").textContent = "Login in /admin first."; }
});

/* ---------- start ---------- */
async function openFormula() {
  const m = /^#f=(.+)$/.exec(location.hash); if (!m) return;
  const list = await loadList("formulas"); const f = list.find((x) => x.id === decodeURIComponent(m[1]));
  if (!f) return;
  S = { bw: f.bw, milk: f.milk, fat: f.fat, rows: f.rows.map((r) => ({ id: r.id, kg: r.kg })) };
  save(); ["bw", "milk", "fat"].forEach((k) => ($("#a-" + k).value = S[k])); renderAll();
}
onLang(renderAll);
initLang();
renderAll();
loadItems({ noimg: true }).then((j) => { items = j.items; renderAll(); openFormula(); });
loadShop().then((s) => { shop = s; });
