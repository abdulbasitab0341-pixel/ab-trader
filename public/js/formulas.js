import { $, esc, nf, addStrings, t, initLang, onLang, loadItems, loadList, itemName, lang } from "./common.js";
import { FORAGES, requirement, analyze } from "./nutrition.js";

addStrings({
  fm_h: ["Nutrition Formulas", "نیوٹریشن فارمولے", "Nutrition Formulas"],
  fm_p: ["Ready ration plans. Open one in Feed Balancing to adjust it.", "تیار راشن پلان۔ فیڈ بیلنسنگ میں کھول کر تبدیل کریں۔", "Tayyar ration plan. Feed Balancing mein khol kar tabdeel karein."],
  f_for: ["For", "کے لیے", "Ke liye"],
  f_milk: ["L milk/day", "لیٹر دودھ روزانہ", "L doodh rozana"],
  f_kg: ["kg per day", "کلو روزانہ", "kg rozana"],
  f_open: ["Open in Feed Balancing", "فیڈ بیلنسنگ میں کھولیں", "Feed Balancing mein kholein"],
  f_prot: ["Protein", "پروٹین", "Protein"],
  f_none: ["No formulas yet. They will appear here.", "ابھی کوئی فارمولا نہیں۔ یہاں نظر آئیں گے۔", "Abhi koi formula nahi. Yahan nazar aayenge."],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
});

let list = [], items = [];
const pool = () => [...FORAGES, ...items];
const nm = (f) => (lang === "ur" ? f.ur || f.ro || f.en : f.ro || f.en || f.ur);

function render() {
  $("#list").innerHTML = list.length ? `<div class="grid reports">${list.map((f) => {
    const rows = f.rows.map((r) => { const it = pool().find((x) => x.id === r.id); return { ...(it || {}), kg: r.kg, label: it ? itemName(it) : r.id }; });
    const a = analyze(rows, requirement(f));
    return `<article class="prod"><h3>${esc(nm(f))}</h3>
      <div class="names"><span>${esc(t("f_for"))} ${nf(f.milk)} ${esc(t("f_milk"))}</span></div>
      <ul class="fl">${rows.map((r) => `<li><span>${esc(r.label)}</span><b class="ltr">${nf(r.kg)} kg</b></li>`).join("")}</ul>
      ${a.dmKg ? `<p class="sub">${esc(t("f_prot"))} ${nf(a.cpPct)}% · NEL ${nf(a.nelS)} Mcal</p>` : ""}
      ${f.note ? `<p>${esc(f.note)}</p>` : ""}
      <a class="btn sm" href="/balancing#f=${esc(f.id)}">${esc(t("f_open"))}</a></article>`;
  }).join("")}</div>` : `<p class="sub">${esc(t("f_none"))}</p>`;
}
onLang(render);
initLang();
render();
loadList("formulas").then((l) => { list = l; render(); });
loadItems({ noimg: true }).then((j) => { items = j.items; render(); });
