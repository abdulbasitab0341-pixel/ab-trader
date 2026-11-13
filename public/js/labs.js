import { $, esc, num, addStrings, t, initLang, onLang, api, loadItems, loadList, itemName, safeImg } from "./common.js";

addStrings({
  lr_h: ["Lab Reports", "لیب رپورٹس", "Lab Reports"],
  lr_p: ["Tested values for our feed ingredients.", "ہمارے فیڈ مال کی لیبارٹری جانچ۔", "Hamare feed maal ki laboratory jaanch."],
  search: ["Search report…", "رپورٹ تلاش کریں…", "Report talash karein…"],
  l_dm: ["Dry matter", "خشک مادہ", "Dry matter"],
  l_cp: ["Protein", "پروٹین", "Protein"],
  l_fat: ["Fat", "چکنائی", "Chikna'i"],
  l_fibre: ["Fibre", "ریشہ", "Resha"],
  l_ash: ["Ash", "راکھ", "Rakh"],
  l_ndf: ["NDF", "این ڈی ایف", "NDF"],
  l_tdn: ["TDN", "ٹی ڈی این", "TDN"],
  l_pic: ["View report picture", "رپورٹ کی تصویر دیکھیں", "Report ki tasveer dekhein"],
  l_none: ["No lab reports yet. They will appear here.", "ابھی کوئی رپورٹ نہیں۔ یہاں نظر آئیں گی۔", "Abhi koi report nahi. Yahan nazar aayengi."],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
});

let list = [], items = [], q = "";
const KEYS = ["dm", "cp", "fat", "fibre", "ash", "ndf", "tdn"];

function render() {
  const s = q.trim().toLowerCase();
  const l = list.filter((r) => !s || [r.title, r.lab, r.note, (items.find((i) => i.id === r.item) || {}).en, (items.find((i) => i.id === r.item) || {}).ro].some((v) => (v || "").toLowerCase().includes(s)));
  $("#list").innerHTML = l.length ? `<div class="grid reports">${l.map((r) => {
    const it = items.find((i) => i.id === r.item);
    const vals = KEYS.filter((k) => r[k] !== "" && r[k] != null).map((k) => `<div><small>${esc(t("l_" + k))}</small><b>${esc(r[k])}%</b></div>`).join("");
    return `<article class="prod rep"><h2 class="t">${esc(r.title)}</h2>
      <div class="names"><span>${esc([it ? itemName(it) : "", r.lab, r.date].filter(Boolean).join(" · "))}</span></div>
      ${vals ? `<div class="vals">${vals}</div>` : ""}${r.note ? `<p>${esc(r.note)}</p>` : ""}
      ${r.hasImg ? `<button type="button" class="btn sm line" data-pic="${esc(r.id)}">${esc(t("l_pic"))}</button><div class="repimg" id="img-${esc(r.id)}"></div>` : ""}</article>`;
  }).join("")}</div>` : `<p class="sub">${esc(t("l_none"))}</p>`;
}

$("#list").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-pic]"); if (!b) return;
  const box = document.getElementById("img-" + b.dataset.pic);
  if (box.firstChild) { box.innerHTML = ""; return; }
  try { const j = await api("/api/reports?id=" + encodeURIComponent(b.dataset.pic)); const src = safeImg(j.list[0]?.img); if (src) box.innerHTML = `<img src="${esc(src)}" alt="" loading="lazy">`; } catch { /* offline */ }
});
$("#q").addEventListener("input", (e) => { q = e.target.value; render(); });
onLang(render);
initLang();
render();
loadList("reports").then((l) => { list = l; render(); });
loadItems({ noimg: true }).then((j) => { items = j.items; render(); });
