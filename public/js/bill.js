import { $, $$, esc, num, nf, rs, today, dmy, sd, store, lang, addStrings, t, tri, initLang, onLang, loadItems, loadShop, itemName, itemBoth, DEFAULT_ITEMS, DEFAULT_SHOP } from "./common.js";

addStrings({
  tab_entry: ["Enter items", "مال لکھیں", "Maal likhein"],
  tab_bill: ["View bill", "بل دیکھیں", "Bill dekhein"],
  edit: ["Edit", "تبدیل کریں", "Edit karein"],
  cust: ["Customer name", "گاہک کا نام", "Gahak ka naam"],
  optional: ["Optional", "اختیاری", "Ikhtiyari"],
  bdate: ["Bill date", "بل کی تاریخ", "Bill ki tareekh"],
  btype: ["Bill type", "بل کی قسم", "Bill ki qisam"],
  item: ["Item", "مال", "Maal"],
  choose: ["Choose item", "مال چنیں", "Maal chunein"],
  other: ["Other item…", "دوسرا مال…", "Koi aur maal…"],
  iname: ["Item name", "مال کا نام", "Maal ka naam"],
  bags: ["Bags (bori)", "بوری", "Bori"],
  weight: ["Weight (kg)", "وزن (کلو)", "Wazan (kg)"],
  rate: ["Rate (Rs)", "ریٹ (روپے)", "Rate (Rs)"],
  per: ["Rate per", "ریٹ کا حساب", "Rate ka hisaab"],
  idate: ["Date", "تاریخ", "Tareekh"],
  amount: ["Amount", "رقم", "Raqam"],
  add: ["+ Add another item", "+ ایک اور مال شامل کریں", "+ Aur maal add karein"],
  remove: ["Remove", "ہٹائیں", "Hatayein"],
  freight: ["Freight", "کرایہ", "Kiraya"],
  prev: ["Previous balance", "سابقہ بقایا", "Sabiqa baqaya"],
  paid: ["Received", "وصول", "Wasool"],
  sub: ["Goods total", "مال کی رقم", "Maal ki raqam"],
  total: ["Total", "کل رقم", "Kul raqam"],
  bal: ["Balance due", "بقایا", "Baqaya"],
  share: ["Share bill", "بل شیئر کریں", "Bill share karein"],
  save_img: ["Save picture", "تصویر محفوظ کریں", "Tasveer save karein"],
  print: ["Print / PDF", "پرنٹ / پی ڈی ایف", "Print / PDF"],
  wa: ["WhatsApp text", "واٹس ایپ پیغام", "WhatsApp message"],
  copy: ["Copy text", "متن کاپی کریں", "Text copy karein"],
  new_bill: ["New bill", "نیا بل", "Naya bill"],
  hist: ["Previous bills", "پچھلے بل", "Pichle bill"],
  open: ["Open", "کھولیں", "Kholein"],
  del: ["Delete", "حذف", "Delete"],
  empty: ["Add an item to see the bill.", "بل دیکھنے کے لیے مال شامل کریں۔", "Bill dekhne ke liye maal add karein."],
  thanks: ["Thank you for your business.", "آپ کا شکریہ۔", "Aap ka shukriya."],
  customer: ["Customer", "گاہک", "Gahak"],
  m_copied: ["Bill text copied.", "بل کاپی ہو گیا۔", "Bill copy ho gaya."],
  m_saved: ["Picture saved.", "تصویر محفوظ ہو گئی۔", "Tasveer save ho gayi."],
  m_shared: ["Bill shared.", "بل شیئر ہو گیا۔", "Bill share ho gaya."],
  m_fail: ["Could not do that here. Try Save picture or WhatsApp text.", "یہاں ممکن نہیں ہوا۔ تصویر محفوظ کریں یا واٹس ایپ پیغام آزمائیں۔", "Yahan nahi ho saka. Tasveer save ya WhatsApp message try karein."],
  m_nodata: ["Add at least one item first.", "پہلے کم از کم ایک مال شامل کریں۔", "Pehle kam az kam ek maal add karein."],
});

const KEY = "abt3-bill", HKEY = "abt3-hist";
let items = DEFAULT_ITEMS;
let shop = { ...DEFAULT_SHOP };

/* ---------- bill state ---------- */
const newRow = (date) => ({ id: "", name: "", date, bags: "", weight: "", wAuto: true, rate: "", mode: "kg" });
const blankBill = () => { const d = today(); return { date: d, cust: "", type: "cash", rows: [newRow(d)], freight: "", prev: "", paid: "" }; };
let bill = store.get(KEY);
if (!bill || !Array.isArray(bill.rows) || !bill.rows.length) bill = blankBill();

const cat = (id) => items.find((c) => c.id === id);
const rateFor = (c) => (bill.type === "udhaar" ? num(c.udhaar) || num(c.cash) : num(c.cash));
const bagKg = (r) => num((cat(r.id) || {}).bagKg) || 40;
const amount = (r) => (r.mode === "bag" ? num(r.bags) : num(r.weight)) * num(r.rate);
const live = () => bill.rows.filter((r) => r.id || r.name || num(r.bags) || num(r.weight) || num(r.rate));
const rowName = (r) => { const c = cat(r.id); return c ? itemName(c) : r.name || "-"; };
const typeKey = () => (bill.type === "udhaar" ? "c_udhaar" : "c_cash");
function totals() {
  const sub = bill.rows.reduce((a, r) => a + amount(r), 0);
  const total = sub + num(bill.freight) + num(bill.prev);
  return { sub, total, bal: total - num(bill.paid) };
}
const save = () => store.set(KEY, bill);

/* ---------- entry form ---------- */
function rowsHTML() {
  return bill.rows.map((r, i) => {
    const known = Boolean(cat(r.id));
    const other = r.id === "__o" || (!known && r.id !== "" && Boolean(r.name));
    const opts = items.map((c) => `<option value="${esc(c.id)}"${r.id === c.id ? " selected" : ""}>${esc(itemBoth(c))}</option>`).join("");
    return `<div class="item">
      <div class="head"><span class="no">#${i + 1}</span><button type="button" class="x" data-rm="${i}">${esc(t("remove"))}</button></div>
      <div class="field full"><label for="r-${i}-sel">${tri("item")}</label>
        <select id="r-${i}-sel" data-i="${i}" data-k="sel"><option value="">${esc(t("choose"))}</option>${opts}<option value="__o"${other ? " selected" : ""}>${esc(t("other"))}</option></select></div>
      ${other ? `<div class="field full"><label for="r-${i}-name">${tri("iname")}</label><input id="r-${i}-name" type="text" data-i="${i}" data-k="name" value="${esc(r.name)}"></div>` : ""}
      <div class="field"><label for="r-${i}-bags">${tri("bags")}</label><input id="r-${i}-bags" type="number" min="0" step="any" inputmode="decimal" data-i="${i}" data-k="bags" value="${esc(r.bags)}"></div>
      <div class="field"><label for="r-${i}-weight">${tri("weight")}</label><input id="r-${i}-weight" type="number" min="0" step="any" inputmode="decimal" data-i="${i}" data-k="weight" value="${esc(r.weight)}"></div>
      <div class="field"><label for="r-${i}-rate">${tri("rate")}</label><input id="r-${i}-rate" type="number" min="0" step="any" inputmode="decimal" data-i="${i}" data-k="rate" value="${esc(r.rate)}"></div>
      <div class="field"><label for="r-${i}-mode">${tri("per")}</label>
        <select id="r-${i}-mode" data-i="${i}" data-k="mode"><option value="kg"${r.mode !== "bag" ? " selected" : ""}>${esc(t("c_perkg"))}</option><option value="bag"${r.mode === "bag" ? " selected" : ""}>${esc(t("c_perbag"))}</option></select></div>
      <div class="foot2">
        <div class="field"><label for="r-${i}-date">${tri("idate")}</label><input id="r-${i}-date" type="date" data-i="${i}" data-k="date" value="${esc(r.date)}"></div>
        <span class="amt" id="r-${i}-amt">${rs(amount(r))}</span>
      </div>
    </div>`;
  }).join("");
}
function renderRows() { $("#rows").innerHTML = rowsHTML(); }

const FIELDS = { cust: "b-cust", date: "b-date", freight: "b-freight", prev: "b-prev", paid: "b-paid" };
function fillForm() { for (const k in FIELDS) $("#" + FIELDS[k]).value = bill[k] ?? ""; }

function renderSummary() {
  const s = totals();
  const line = (k, v, c = "") => `<div class="${c}"><span>${esc(t(k))}</span><span class="ltr">${rs(v)}</span></div>`;
  $("#sumcard").innerHTML = line("sub", s.sub) + (num(bill.freight) ? line("freight", num(bill.freight)) : "") + (num(bill.prev) ? line("prev", num(bill.prev)) : "") +
    line("total", s.total, "big") + line("paid", num(bill.paid)) + line("bal", s.bal, "due");
  $("#dock-amt").textContent = rs(s.bal);
}

/* ---------- the bill (preview) ---------- */
function slipHTML() {
  const s = totals(), rows = live();
  const tag = `<span class="tag ${bill.type === "udhaar" ? "cr" : ""}">${esc(t(typeKey()))}</span>`;
  const line = (k, v, c = "") => `<div class="${c}"><span>${esc(t(k))}</span><span class="ltr">${rs(v)}</span></div>`;
  return `<header><div><strong>AB TRADERS</strong><small>${esc(t("tagline"))}</small></div><div class="r"><span class="ltr">${esc(shop.phone)}</span><br>${esc(shop.address)}</div></header>
  <div class="meta"><div><b>${esc(bill.cust || t("customer"))}</b></div><div style="text-align:end"><b class="ltr">${esc(dmy(bill.date))}</b>${tag}</div></div>
  ${rows.length ? `<table><thead><tr><th>${esc(t("item"))}</th><th>${esc(t("bags_s"))}</th><th>${esc(t("weight_s"))}</th><th>${esc(t("rate_s"))}</th><th>${esc(t("amount"))}</th></tr></thead><tbody>${
    rows.map((r) => `<tr><td class="n">${esc(rowName(r))}<small class="ltr">${esc(sd(r.date))}</small></td><td class="ltr">${num(r.bags) ? nf(num(r.bags)) : ""}</td><td class="ltr">${num(r.weight) ? nf(num(r.weight)) : ""}</td><td class="ltr">${nf(num(r.rate))}<small>/${esc(t(r.mode === "bag" ? "c_bori" : "c_kg"))}</small></td><td class="ltr"><b>${rs(amount(r))}</b></td></tr>`).join("")}</tbody></table>
  <div class="sums">${line("sub", s.sub)}${num(bill.freight) ? line("freight", num(bill.freight)) : ""}${num(bill.prev) ? line("prev", num(bill.prev)) : ""}${line("total", s.total, "big")}${line("paid", num(bill.paid))}${line("bal", s.bal, "due")}</div>` : `<div class="empty">${esc(t("empty"))}</div>`}
  <footer>${esc(t("thanks"))}</footer>`;
}
addStrings({
  bags_s: ["Bags", "بوری", "Bori"],
  weight_s: ["Kg", "کلو", "Kg"],
  rate_s: ["Rate", "ریٹ", "Rate"],
  tagline: ["Dairy Feed Supplier", "ڈیری فیڈ سپلائر", "Dairy Feed Supplier"],
});

function billText() {
  const s = totals(), L = [];
  L.push("*AB TRADERS* | " + t("tagline"));
  if (shop.phone) L.push(shop.phone);
  if (shop.address) L.push(shop.address);
  L.push(dmy(bill.date) + " | " + t(typeKey()));
  if (bill.cust) L.push(t("customer") + ": " + bill.cust);
  L.push("");
  live().forEach((r) => L.push(sd(r.date) + " " + rowName(r) + ": " + (num(r.bags) ? nf(num(r.bags)) + " " + t("c_bori") + ", " : "") + (num(r.weight) ? nf(num(r.weight)) + " " + t("c_kg") + " " : "") + "x " + nf(num(r.rate)) + "/" + t(r.mode === "bag" ? "c_bori" : "c_kg") + " = " + rs(amount(r))));
  L.push("");
  L.push(t("sub") + ": " + rs(s.sub));
  if (num(bill.freight)) L.push(t("freight") + ": " + rs(num(bill.freight)));
  if (num(bill.prev)) L.push(t("prev") + ": " + rs(num(bill.prev)));
  L.push("*" + t("total") + ": " + rs(s.total) + "*");
  L.push(t("paid") + ": " + rs(num(bill.paid)));
  L.push("*" + t("bal") + ": " + rs(s.bal) + "*");
  L.push("");
  L.push(t("thanks"));
  return L.join("\n");
}

/* ---------- history (saved on this phone only) ---------- */
function pushHistory() {
  if (!live().length) return;
  const h = store.get(HKEY) || [];
  h.unshift({ at: Date.now(), bill });
  store.set(HKEY, h.slice(0, 30));
}
function renderHistory() {
  const h = store.get(HKEY) || [];
  $("#hist").innerHTML = h.length ? `<h3>${esc(t("hist"))}</h3>` + h.map((e, i) => {
    const total = e.bill.rows.reduce((a, r) => a + amount(r), 0) + num(e.bill.freight) + num(e.bill.prev);
    return `<div class="hrow"><div class="i"><b>${esc(e.bill.cust || t("customer"))}</b><small>${esc(dmy(e.bill.date))} · ${rs(total)}</small></div><button type="button" class="btn line sm" data-open="${i}">${esc(t("open"))}</button><button type="button" class="btn danger sm" data-hdel="${i}">${esc(t("del"))}</button></div>`;
  }).join("") : "";
}

/* ---------- render everything ---------- */
function renderOut() {
  bill.rows.forEach((r, i) => { const el = $("#r-" + i + "-amt"); if (el) el.textContent = rs(amount(r)); });
  renderSummary();
  $("#slip").innerHTML = slipHTML();
  $$("#btype button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.type === bill.type)));
  save();
}
function renderAll() { renderRows(); renderOut(); renderHistory(); setView(view); }

let view = "entry";
function setView(v) {
  view = v;
  $("#app").dataset.view = v;
  $$("#views button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
  $("#dock-btn").textContent = v === "entry" ? t("tab_bill") : t("edit");
}

/* ---------- events ---------- */
$("#entry").addEventListener("input", (e) => {
  const el = e.target, k = el.dataset.k;
  if (el.dataset.i !== undefined) {
    const i = +el.dataset.i, r = bill.rows[i];
    if (k === "sel") {
      r.id = el.value;
      const c = cat(r.id);
      if (c) {
        r.name = c.ro || c.en || ""; r.mode = c.mode === "bag" ? "bag" : "kg";
        r.rate = rateFor(c) || "";
        if (r.wAuto && num(r.bags)) r.weight = num(r.bags) * bagKg(r);
      } else r.name = "";
      renderRows();
      const f = $(`#r-${i}-${r.id === "__o" ? "name" : "bags"}`); if (f) f.focus();
    } else if (k === "bags") {
      r.bags = el.value;
      if (r.wAuto) { r.weight = num(r.bags) ? num(r.bags) * bagKg(r) : ""; $(`#r-${i}-weight`).value = r.weight; }
    } else if (k === "weight") {
      r.weight = el.value; r.wAuto = el.value === "";
    } else r[k] = el.value;
  } else if (el.id === "b-date") {
    const old = bill.date; bill.date = el.value;
    bill.rows.forEach((r, i) => { if (r.date === old) { r.date = bill.date; const d = $(`#r-${i}-date`); if (d) d.value = bill.date; } });
  } else {
    const f = Object.keys(FIELDS).find((f) => FIELDS[f] === el.id);
    if (!f) return;
    bill[f] = el.value;
  }
  $("#status").textContent = "";
  renderOut();
});
$("#rows").addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]"); if (!b) return;
  bill.rows.splice(+b.dataset.rm, 1);
  if (!bill.rows.length) bill.rows.push(newRow(bill.date));
  renderRows(); renderOut();
});
$("#add").addEventListener("click", () => {
  bill.rows.push(newRow(bill.date)); renderRows(); renderOut();
  $(`#r-${bill.rows.length - 1}-sel`).focus();
});
$("#btype").addEventListener("click", (e) => {
  const b = e.target.closest("[data-type]"); if (!b) return;
  bill.type = b.dataset.type;
  bill.rows.forEach((r) => { const c = cat(r.id); if (c && rateFor(c)) r.rate = rateFor(c); });
  renderRows(); renderOut();
});
$$(".js-new").forEach((b) => b.addEventListener("click", () => {
  pushHistory();
  const keep = bill.type;
  bill = blankBill(); bill.type = keep;
  fillForm(); renderAll(); setView("entry"); $("#status").textContent = "";
  window.scrollTo(0, 0);
}));
$("#views").addEventListener("click", (e) => { const b = e.target.closest("[data-view]"); if (b) { setView(b.dataset.view); window.scrollTo(0, 0); } });
$("#dock-btn").addEventListener("click", () => { setView(view === "entry" ? "preview" : "entry"); window.scrollTo(0, 0); });
$("#hist").addEventListener("click", (e) => {
  const h = store.get(HKEY) || [];
  const o = e.target.closest("[data-open]"), d = e.target.closest("[data-hdel]");
  if (o) { const e2 = h.splice(+o.dataset.open, 1)[0]; if (live().length) h.unshift({ at: Date.now(), bill }); store.set(HKEY, h); bill = e2.bill; fillForm(); renderAll(); setView("preview"); window.scrollTo(0, 0); }
  if (d) { h.splice(+d.dataset.hdel, 1); store.set(HKEY, h); renderHistory(); }
});

const msg = (k, err) => { const el = $("#status"); el.textContent = t(k); el.classList.toggle("err", Boolean(err)); };

$("#copy").addEventListener("click", async () => {
  if (!live().length) return msg("m_nodata", true);
  try { await navigator.clipboard.writeText(billText()); msg("m_copied"); } catch { msg("m_fail", true); }
});
$("#wa").addEventListener("click", () => {
  if (!live().length) return msg("m_nodata", true);
  window.open("https://wa.me/?text=" + encodeURIComponent(billText()), "_blank", "noopener");
});
$("#print").addEventListener("click", () => { if (!live().length) return msg("m_nodata", true); window.print(); });

/* ---------- bill picture ---------- */
async function drawBill() {
  const rtl = lang === "ur", F = rtl ? '"Noto Nastaliq Urdu"' : '"Hanken Grotesk"', LT = '"Hanken Grotesk"', D = '"Big Shoulders Display"';
  try { await Promise.all([document.fonts.load("700 20px " + F, "بل Bill"), document.fonts.load("900 50px " + D, "AB"), document.fonts.load("600 16px " + LT, "12")]); } catch { /* fonts optional */ }
  const rows = live(), s = totals(), rh = rtl ? 56 : 42, W = 800;
  const sums = [["sub", s.sub]];
  if (num(bill.freight)) sums.push(["freight", num(bill.freight)]);
  if (num(bill.prev)) sums.push(["prev", num(bill.prev)]);
  sums.push(["total", s.total, 1], ["paid", num(bill.paid)], ["bal", s.bal, 2]);
  const H = 135 + 100 + 44 + rows.length * rh + 24 + sums.length * rh + 90;
  const c = document.createElement("canvas"); c.width = W * 2; c.height = H * 2;
  const x = c.getContext("2d"); x.scale(2, 2); x.textBaseline = "middle";
  const T = (str, px, y, al = "left", font = "400 16px " + F, col = "#10302a", ltr = false, maxW) => {
    x.font = font; x.fillStyle = col; x.direction = rtl && !ltr ? "rtl" : "ltr";
    if (rtl) { px = W - px; al = al === "left" ? "right" : al === "right" ? "left" : al; }
    x.textAlign = al; if (maxW) x.fillText(String(str), px, y, maxW); else x.fillText(String(str), px, y);
  };
  x.fillStyle = "#fff"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#10302a"; x.fillRect(0, 0, W, 130);
  x.fillStyle = "#f0b310"; x.fillRect(0, 130, W, 5);
  T("AB TRADERS", 30, 58, "left", "900 52px " + D, "#edf0e6", true);
  T(t("tagline"), 30, 102, "left", "600 16px " + F, "#f0b310");
  if (shop.phone) T(shop.phone, 770, 52, "right", "600 17px " + LT, "#edf0e6", true);
  if (shop.address) T(shop.address, 770, 92, "right", "400 15px " + F, "#edf0e6", false, 380);
  let y = 175;
  T(bill.cust || t("customer"), 30, y, "left", "700 20px " + F, "#10302a", false, 480);
  T(dmy(bill.date), 770, y, "right", "700 18px " + LT, "#10302a", true);
  T(t(typeKey()), 770, y + 36, "right", "700 15px " + F, bill.type === "udhaar" ? "#b23a2a" : "#2f7d4f");
  y = 255;
  const hf = "700 14px " + F, g = "#52645c";
  T(t("idate"), 30, y, "left", hf, g); T(t("item"), 120, y, "left", hf, g); T(t("bags_s"), 400, y, "right", hf, g);
  T(t("weight_s"), 500, y, "right", hf, g); T(t("rate_s"), 640, y, "right", hf, g); T(t("amount"), 770, y, "right", hf, g);
  x.fillStyle = "#10302a"; x.fillRect(30, y + 20, W - 60, 2); y += 22;
  rows.forEach((r) => {
    y += rh / 2;
    T(sd(r.date), 30, y, "left", "400 15px " + LT, "#10302a", true); T(rowName(r), 120, y, "left", "600 16px " + F, "#10302a", false, 220);
    if (num(r.bags)) T(nf(num(r.bags)), 400, y, "right", "400 16px " + LT, "#10302a", true);
    if (num(r.weight)) T(nf(num(r.weight)), 500, y, "right", "400 16px " + LT, "#10302a", true);
    T(nf(num(r.rate)) + " /" + t(r.mode === "bag" ? "c_bori" : "c_kg"), 640, y, "right", "400 15px " + F, "#10302a", true);
    T(rs(amount(r)), 770, y, "right", "700 16px " + LT, "#10302a", true);
    y += rh / 2; x.fillStyle = "#cdd3c3"; x.fillRect(30, y, W - 60, 1);
  });
  y += 24;
  sums.forEach(([k, v, mode]) => {
    if (mode === 2) { x.fillStyle = "#f0b310"; x.fillRect(400, y + 3, 380, rh - 6); }
    if (mode === 1) { x.fillStyle = "#10302a"; x.fillRect(410, y, 360, 2); }
    const sz = mode === 2 ? "20px " : "17px ";
    T(t(k), 420, y + rh / 2, "left", (mode ? "700 " : "400 ") + sz + F);
    T(rs(v), 770, y + rh / 2, "right", (mode ? "700 " : "400 ") + sz + LT, "#10302a", true);
    y += rh;
  });
  T(t("thanks"), W / 2, H - 50, "center", "400 16px " + F, g);
  T("abtraders.pk", W / 2, H - 22, "center", "600 14px " + LT, g, true);
  return c;
}
const toBlob = (c) => new Promise((r) => c.toBlob(r, "image/png"));
function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const fileName = () => "AB-Traders-Bill-" + (bill.cust ? bill.cust.replace(/[^\w؀-ۿ]+/g, "-") + "-" : "") + bill.date + ".png";

$("#save").addEventListener("click", async () => {
  if (!live().length) return msg("m_nodata", true);
  try { download(await toBlob(await drawBill()), fileName()); msg("m_saved"); } catch { msg("m_fail", true); }
});
$("#share").addEventListener("click", async () => {
  if (!live().length) return msg("m_nodata", true);
  try {
    const blob = await toBlob(await drawBill());
    const file = new File([blob], fileName(), { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "AB Traders" }); return msg("m_shared"); }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    download(blob, fileName()); msg("m_saved");
  } catch { msg("m_fail", true); }
});

/* ---------- start ---------- */
onLang(renderAll);
initLang();
fillForm();
renderAll();

loadItems({ noimg: true }).then((j) => { items = j.items; renderRows(); renderOut(); });
loadShop().then((s) => { shop = s; renderOut(); });
