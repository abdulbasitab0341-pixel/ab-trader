import { $, $$, esc, num, nf, store, CATEGORIES, catName, addStrings, t, tri, initLang, onLang, api, itemName, safeImg } from "./common.js";

addStrings({
  admin: ["Admin", "ایڈمن", "Admin"],
  logout: ["Logout", "لاگ آؤٹ", "Logout"],
  login: ["Login", "لاگ ان", "Login"],
  password: ["Password", "پاس ورڈ", "Password"],
  tab_rates: ["Rates", "ریٹ", "Rate"],
  tab_items: ["Items", "مال", "Maal"],
  tab_shop: ["Shop", "دکان", "Dukan"],
  rates_help: ["Change today's rates here. Tap Save rates when done.", "آج کے ریٹ یہاں بدلیں۔ مکمل ہونے پر ریٹ محفوظ کریں دبائیں۔", "Aaj ke rate yahan badlein. Mukammal hone par Rate save karein dabayein."],
  save_rates: ["Save rates", "ریٹ محفوظ کریں", "Rate save karein"],
  changed: ["changed", "تبدیل", "tabdeel"],
  new_item: ["+ New item", "+ نیا مال", "+ Naya maal"],
  edit: ["Edit", "تبدیل", "Edit"],
  save: ["Save", "محفوظ کریں", "Save karein"],
  cancel: ["Cancel", "منسوخ", "Cancel"],
  rm_pic: ["Remove picture", "تصویر ہٹائیں", "Tasveer hatayein"],
  del: ["Delete item", "مال حذف کریں", "Maal delete karein"],
  del2: ["Tap again to delete", "حذف کرنے کے لیے دوبارہ دبائیں", "Delete ke liye dobara dabayein"],
  dlg_new: ["New item", "نیا مال", "Naya maal"],
  dlg_edit: ["Edit item", "مال تبدیل کریں", "Maal edit karein"],
  n_ro: ["Name (Roman)", "نام (رومن)", "Naam (Roman)"],
  n_ur: ["Name (Urdu)", "نام (اردو)", "Naam (Urdu)"],
  n_en: ["Name (English)", "نام (انگریزی)", "Naam (English)"],
  sold: ["Sold", "فروخت", "Farokht"],
  bagkg: ["Bori weight (kg)", "بوری کا وزن (کلو)", "Bori ka wazan (kg)"],
  r_cash: ["Cash rate", "نقد ریٹ", "Naqad rate"],
  r_udhaar: ["Credit rate", "ادھار ریٹ", "Udhaar rate"],
  picture: ["Picture", "تصویر", "Tasveer"],
  phone: ["Shop phone", "دکان کا فون", "Dukan ka phone"],
  whatsapp: ["WhatsApp number", "واٹس ایپ نمبر", "WhatsApp number"],
  address: ["Shop address", "دکان کا پتہ", "Dukan ka pata"],
  saved: ["Saved.", "محفوظ ہو گیا۔", "Save ho gaya."],
  need_name: ["Enter the item name first.", "پہلے مال کا نام لکھیں۔", "Pehle maal ka naam likhein."],
  e_wrong: ["Wrong password.", "پاس ورڈ غلط ہے۔", "Password ghalat hai."],
  e_nopw: ["ADMIN_PASSWORD is not set in Vercel yet.", "Vercel میں ADMIN_PASSWORD ابھی سیٹ نہیں ہے۔", "Vercel mein ADMIN_PASSWORD abhi set nahi hai."],
  e_nodb: ["Database is not connected. Connect Upstash Redis in Vercel, then try again.", "ڈیٹا بیس جڑا ہوا نہیں۔ Vercel میں Upstash Redis جوڑیں، پھر دوبارہ کوشش کریں۔", "Database connect nahi hai. Vercel mein Upstash Redis connect karein, phir dobara koshish karein."],
  e_net: ["Could not save. Check the internet and try again.", "محفوظ نہیں ہو سکا۔ انٹرنیٹ دیکھیں اور دوبارہ کوشش کریں۔", "Save nahi ho saka. Internet dekhein aur dobara koshish karein."],
  e_session: ["Login expired. Please login again.", "لاگ ان ختم ہو گیا۔ دوبارہ لاگ ان کریں۔", "Login khatam ho gaya. Dobara login karein."],
  warn_db: ["Changes cannot be saved yet because the database is not connected. The built-in starter items are showing.", "ڈیٹا بیس جڑا نہ ہونے کی وجہ سے تبدیلیاں ابھی محفوظ نہیں ہو سکتیں۔ شروع کا بنیادی مال دکھایا جا رہا ہے۔", "Database connect na hone ki wajah se tabdeeli abhi save nahi ho sakti. Shuru ka buniyadi maal dikhaya ja raha hai."],
  tab_reports: ["Lab reports", "لیب رپورٹس", "Lab reports"],
  tab_formulas: ["Formulas", "فارمولے", "Formulas"],
  new_report: ["+ New lab report", "+ نئی لیب رپورٹ", "+ Nayi lab report"],
  r_title: ["Report title", "رپورٹ کا عنوان", "Report ka unwaan"],
  r_lab: ["Lab name", "لیب کا نام", "Lab ka naam"],
  r_note: ["Note", "نوٹ", "Note"],
  r_apply: ["Also copy DM, CP, NDF and TDN into the item", "DM, CP, NDF اور TDN مال میں بھی کاپی کریں", "DM, CP, NDF aur TDN maal mein bhi copy karein"],
  fm_help: ["Make a formula in Feed Balancing (you are logged in, so a Publish button shows there).", "فارمولا فیڈ بیلنسنگ میں بنائیں (آپ لاگ ان ہیں، وہاں شائع کا بٹن نظر آئے گا)۔", "Formula Feed Balancing mein banayein (aap login hain, wahan Publish ka button nazar aayega)."],
  fm_go: ["Open Feed Balancing", "فیڈ بیلنسنگ کھولیں", "Feed Balancing kholein"],
  email: ["Email", "ای میل", "Email"],
  cat: ["Group", "گروپ", "Group"],
  nut_help: ["Nutrient values (for Feed Balancing) are typical estimates. Replace with lab values. CP and TDN are on dry matter.", "غذائی اقدار (فیڈ بیلنسنگ کے لیے) عام اندازے ہیں۔ لیب کی قدر لگائیں۔ CP اور TDN خشک مادے پر ہیں۔", "Ghizai values (Feed Balancing ke liye) aam andaze hain. Lab ki value lagayein. CP aur TDN dry matter par hain."],
  c_none: ["Nothing yet.", "ابھی کچھ نہیں۔", "Abhi kuch nahi."],
  search: ["Search item…", "مال تلاش کریں…", "Maal talash karein…"],
  per_bag_n: ["per bori of", "فی بوری وزن", "fi bori wazan"],
});

let token = store.get("abt-admin") || "";
let aq = "";
let reports = [], formulas = [], repEdit = null, repImg = "";
let items = [], orig = new Map(), dirty = new Set(), dbOk = true, tab = "rates";
let editing = null, editImg = "", delArmed = false;

/* ---------- helpers ---------- */
let toastTimer;
function toast(k, err) {
  const el = $("#toast");
  el.textContent = t(k); el.classList.toggle("err", Boolean(err)); el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), 3500);
}
function fail(e) {
  if (e && e.status === 401) { logout(); $("#login-msg").textContent = t("e_session"); return; }
  toast(e && e.code === "nodb" ? "e_nodb" : "e_net", true);
}
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const unit = (c) => (c.mode === "bag" ? `/${t("c_bori")} · ${num(c.bagKg) || 40} ${t("c_kg")}` : c.mode === "pc" ? `/${t("c_pc")}` : `/${t("c_kg")}`);

/* ---------- login ---------- */
function showLogin() { $("#login").hidden = false; $("#app").hidden = true; $("#logout").hidden = true; }
function logout() { token = ""; store.del("abt-admin"); showLogin(); }
$("#logout").addEventListener("click", () => { logout(); $("#login-msg").textContent = ""; });
$("#login").addEventListener("submit", async (e) => {
  e.preventDefault();
  $("#login-msg").textContent = "";
  try {
    const j = await api("/api/login", { method: "POST", body: { password: $("#pw").value } });
    token = j.token; store.set("abt-admin", token); $("#pw").value = "";
    await showApp();
  } catch (err) {
    $("#login-msg").textContent = t(err.status === 503 ? "e_nopw" : err.status === 401 ? "e_wrong" : "e_net");
  }
});

/* ---------- data ---------- */
async function showApp() {
  const [it, sh, rp, fm] = await Promise.all([api("/api/items", { token }), api("/api/shop"), api("/api/reports").catch(() => ({ list: [] })), api("/api/formulas").catch(() => ({ list: [] }))]);
  reports = rp.list; formulas = fm.list;
  items = it.items; dbOk = Boolean(it.db);
  orig = new Map(items.map((c) => [c.id, JSON.stringify(c)]));
  dirty.clear();
  $("#s-phone").value = sh.shop.phone || ""; $("#s-wa").value = sh.shop.whatsapp || ""; $("#s-addr").value = sh.shop.address || ""; $("#s-mail").value = sh.shop.email || "";
  $("#login").hidden = true; $("#app").hidden = false; $("#logout").hidden = false;
  setTab(tab); renderAll();
}
async function boot() {
  if (!token) return showLogin();
  try { await api("/api/login", { token }); await showApp(); }
  catch (e) { if (e.status === 401) { token = ""; store.del("abt-admin"); } showLogin(); }
}

/* ---------- tabs ---------- */
function setTab(k) {
  tab = k;
  $$("#tabs button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tab === k)));
  ["rates", "items", "reports", "formulas", "shop"].forEach((n) => ($("#t-" + n).hidden = n !== k));
  $("#ratebar").hidden = k !== "rates";
}
$("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });

/* ---------- rates ---------- */
const vis = (c) => !aq || [c.en, c.ro, c.ur].some((v) => (v || "").toLowerCase().includes(aq));
function renderRates() {
  $("#rates").innerHTML = items.filter(vis).map((c) => `<div class="rrow${dirty.has(c.id) ? " dirty" : ""}" data-id="${esc(c.id)}">
    <div class="nm"><b>${esc(itemName(c))}</b><small>${esc(c.ur && itemName(c) !== c.ur ? c.ur + " " : "")}${esc(unit(c))}</small></div>
    <div class="field"><label for="rc-${esc(c.id)}">${tri("r_cash")}</label><input id="rc-${esc(c.id)}" type="number" min="0" step="any" inputmode="decimal" data-id="${esc(c.id)}" data-f="cash" value="${c.cash || ""}"></div>
    <div class="field"><label for="ru-${esc(c.id)}">${tri("r_udhaar")}</label><input id="ru-${esc(c.id)}" type="number" min="0" step="any" inputmode="decimal" data-id="${esc(c.id)}" data-f="udhaar" value="${c.udhaar || ""}"></div>
  </div>`).join("");
  updateRateBar();
}
function updateRateBar() {
  $("#ratecount").textContent = dirty.size ? `${dirty.size} ${t("changed")}` : "";
  $("#save-rates").disabled = !dirty.size;
}
$("#rates").addEventListener("input", (e) => {
  const el = e.target, c = items.find((x) => x.id === el.dataset.id); if (!c) return;
  c[el.dataset.f] = num(el.value);
  const changed = JSON.stringify(c) !== orig.get(c.id);
  changed ? dirty.add(c.id) : dirty.delete(c.id);
  el.closest(".rrow").classList.toggle("dirty", changed);
  updateRateBar();
});
async function postItems(list) {
  for (let i = 0; i < list.length; i += 4) await api("/api/items", { method: "POST", token, body: { items: list.slice(i, i + 4) } });
  list.forEach((c) => orig.set(c.id, JSON.stringify(c)));
}
$("#save-rates").addEventListener("click", async () => {
  const list = items.filter((c) => dirty.has(c.id));
  try { await postItems(list); dirty.clear(); renderRates(); toast("saved"); } catch (e) { fail(e); }
});

/* ---------- items list ---------- */
function renderItems() {
  $("#items").innerHTML = items.map((c, i) => {
    if (!vis(c)) return "";
    const img = safeImg(c.img);
    return `<div class="arow">${img ? `<img class="th" src="${esc(img)}" alt="">` : `<div class="th">${esc((c.ro || c.en || "AB").slice(0, 2).toUpperCase())}</div>`}
      <div><b>${esc(c.ro || c.en)}${c.ur ? " · " + esc(c.ur) : ""}</b><small>${esc(t("c_cash"))} ${nf(num(c.cash))} · ${esc(t("c_udhaar"))} ${nf(num(c.udhaar))} ${esc(unit(c))}</small></div>
      <div class="btns"><button type="button" class="btn line sm" data-up="${i}" aria-label="Up"${i === 0 ? " disabled" : ""}>↑</button><button type="button" class="btn line sm" data-down="${i}" aria-label="Down"${i === items.length - 1 ? " disabled" : ""}>↓</button><button type="button" class="btn sm" data-edit="${esc(c.id)}">${esc(t("edit"))}</button></div></div>`;
  }).join("");
}
$("#items").addEventListener("click", async (e) => {
  const ed = e.target.closest("[data-edit]"), up = e.target.closest("[data-up]"), dn = e.target.closest("[data-down]");
  if (ed) return openDlg(ed.dataset.edit);
  const i = up ? +up.dataset.up : dn ? +dn.dataset.down : -1;
  if (i < 0) return;
  const j = up ? i - 1 : i + 1;
  [items[i], items[j]] = [items[j], items[i]];
  items.forEach((c, k) => (c.order = (k + 1) * 10));
  const moved = [items[i], items[j]];
  renderAll();
  try { await postItems(moved); } catch (err) { fail(err); }
});

/* ---------- item editor ---------- */
function showPrev() { const p = $("#prev"); p.hidden = !editImg; if (editImg) p.src = editImg; $("#i-rmimg").hidden = !editImg; }
function openDlg(id) {
  editing = id; delArmed = false;
  const c = items.find((x) => x.id === id) || { ro: "", ur: "", en: "", mode: "bag", bagKg: 40, cash: "", udhaar: "", img: "", cat: CATEGORIES[0].id };
  $("#i-cat").innerHTML = CATEGORIES.map((g) => `<option value="${g.id}">${esc(catName(g.id))}</option>`).join("");
  $("#i-cat").value = c.cat || CATEGORIES[0].id;
  ["dm", "cp", "tdn", "ndf"].forEach((k) => ($("#i-" + k).value = c[k] || ""));
  $("#dlg-title").textContent = t(id === "new" ? "dlg_new" : "dlg_edit");
  $("#i-ro").value = c.ro || ""; $("#i-ur").value = c.ur || ""; $("#i-en").value = c.en || "";
  $("#i-mode").value = c.mode === "bag" || c.mode === "pc" ? c.mode : "kg"; $("#i-bagkg").value = c.bagKg || 40;
  $("#i-cash").value = c.cash || ""; $("#i-udhaar").value = c.udhaar || ""; $("#i-file").value = "";
  editImg = safeImg(c.img); showPrev();
  $("#i-del").hidden = id === "new"; $("#i-del").textContent = t("del");
  $("#dlg").showModal();
}
$("#new-item").addEventListener("click", () => openDlg("new"));
$("#i-cancel").addEventListener("click", () => $("#dlg").close());
$("#i-rmimg").addEventListener("click", () => { editImg = ""; $("#i-file").value = ""; showPrev(); });
$("#i-file").addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => {
    const k = Math.min(1, 480 / Math.max(im.width, im.height)), cv = document.createElement("canvas");
    cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
    cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
    editImg = cv.toDataURL("image/jpeg", 0.72); URL.revokeObjectURL(url); showPrev();
  };
  im.onerror = () => URL.revokeObjectURL(url);
  im.src = url;
});
$("#iform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const ro = $("#i-ro").value.trim(), ur = $("#i-ur").value.trim(), en = $("#i-en").value.trim();
  if (!ro && !ur && !en) return toast("need_name", true);
  let id = editing, prev = items.find((x) => x.id === id);
  if (id === "new") { id = slug(ro || en) || "item"; if (items.some((x) => x.id === id)) id += "-" + Date.now().toString(36); }
  const c = { ...(prev || {}), id, ro, ur, en, mode: $("#i-mode").value, cat: $("#i-cat").value, dm: num($("#i-dm").value), cp: num($("#i-cp").value), tdn: num($("#i-tdn").value), ndf: num($("#i-ndf").value), bagKg: num($("#i-bagkg").value) || 40, cash: num($("#i-cash").value), udhaar: num($("#i-udhaar").value), img: editImg, order: prev ? prev.order : (Math.max(0, ...items.map((x) => num(x.order))) + 10) };
  try {
    await postItems([c]);
    if (prev) items[items.indexOf(prev)] = c; else items.push(c);
    dirty.delete(id);
    $("#dlg").close(); renderAll(); toast("saved");
  } catch (err) { $("#dlg").close(); fail(err); }
});
$("#i-del").addEventListener("click", async () => {
  if (!delArmed) { delArmed = true; $("#i-del").textContent = t("del2"); return; }
  try {
    await api("/api/items?id=" + encodeURIComponent(editing), { method: "DELETE", token });
    items = items.filter((x) => x.id !== editing); dirty.delete(editing); orig.delete(editing);
    $("#dlg").close(); renderAll(); toast("saved");
  } catch (err) { $("#dlg").close(); fail(err); }
});

$("#adm-q").addEventListener("input", (e) => { aq = e.target.value.trim().toLowerCase(); renderRates(); renderItems(); });

/* ---------- lab reports ---------- */
const RK = ["dm", "cp", "fat", "fibre", "ash", "ndf", "tdn"];
function renderReports() {
  $("#reports").innerHTML = reports.length ? reports.map((r) => `<div class="arow"><div class="th">${r.hasImg ? "IMG" : "LAB"}</div>
    <div><b>${esc(r.title)}</b><small>${esc([r.date, r.lab].filter(Boolean).join(" · "))}</small></div>
    <div class="btns"><button type="button" class="btn sm" data-redit="${esc(r.id)}">${esc(t("edit"))}</button><button type="button" class="btn danger sm" data-rdel="${esc(r.id)}">${esc(t("del"))}</button></div></div>`).join("") : `<p class="sub">${esc(t("c_none"))}</p>`;
}
function renderFormulas() {
  $("#formulas").innerHTML = formulas.length ? formulas.map((f) => `<div class="arow"><div class="th">FM</div>
    <div><b>${esc(f.ro || f.en || f.ur)}</b><small>${nf(f.milk)} L · ${f.rows.length}</small></div>
    <div class="btns"><a class="btn line sm" href="/balancing#f=${esc(f.id)}">${esc(t("edit"))}</a><button type="button" class="btn danger sm" data-fdel="${esc(f.id)}">${esc(t("del"))}</button></div></div>`).join("") : `<p class="sub">${esc(t("c_none"))}</p>`;
}
const showRPrev = () => { const p = $("#r-prev"); p.hidden = !repImg; if (repImg) p.src = repImg; };
async function openReport(id) {
  let r = { title: "", item: "", date: "", lab: "", note: "" };
  if (id !== "new") { try { r = (await api("/api/reports?id=" + encodeURIComponent(id))).list[0] || r; } catch (e) { return fail(e); } }
  repEdit = id; repImg = safeImg(r.img);
  $("#r-item").innerHTML = `<option value="">-</option>` + items.map((c) => `<option value="${esc(c.id)}">${esc(c.ro || c.en)}</option>`).join("");
  $("#r-item").value = r.item || "";
  $("#r-title").value = r.title || ""; $("#r-date").value = r.date || ""; $("#r-lab").value = r.lab || ""; $("#r-note").value = r.note || "";
  RK.forEach((k) => ($("#r-" + k).value = r[k] ?? ""));
  $("#r-file").value = ""; $("#r-apply").checked = false; showRPrev();
  $("#rdlg").showModal();
}
$("#new-report").addEventListener("click", () => openReport("new"));
$("#r-cancel").addEventListener("click", () => $("#rdlg").close());
$("#r-file").addEventListener("change", (e) => {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f), im = new Image();
  im.onload = () => {
    const k = Math.min(1, 900 / Math.max(im.width, im.height)), cv = document.createElement("canvas");
    cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
    cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
    let q = 0.7; repImg = cv.toDataURL("image/jpeg", q);
    while (repImg.length > 390000 && q > 0.3) { q -= 0.1; repImg = cv.toDataURL("image/jpeg", q); }
    URL.revokeObjectURL(url); showRPrev();
  };
  im.src = url;
});
$("#rform").addEventListener("submit", async (e) => {
  e.preventDefault();
  const item = { id: repEdit === "new" ? "" : repEdit, title: $("#r-title").value, item: $("#r-item").value, date: $("#r-date").value, lab: $("#r-lab").value, note: $("#r-note").value, img: repImg };
  RK.forEach((k) => (item[k] = $("#r-" + k).value));
  try {
    const j = await api("/api/reports", { method: "POST", token, body: { item } });
    const c = $("#r-apply").checked && items.find((x) => x.id === item.item);
    if (c) { ["dm", "cp", "ndf", "tdn"].forEach((k) => { if (item[k] !== "") c[k] = num(item[k]); }); await postItems([c]); renderAll(); }
    reports = (await api("/api/reports")).list;
    $("#rdlg").close(); renderReports(); toast("saved");
  } catch (err) { $("#rdlg").close(); fail(err); }
});
$("#reports").addEventListener("click", async (e) => {
  const ed = e.target.closest("[data-redit]"), dl = e.target.closest("[data-rdel]");
  if (ed) return openReport(ed.dataset.redit);
  if (dl) { try { await api("/api/reports?id=" + encodeURIComponent(dl.dataset.rdel), { method: "DELETE", token }); reports = reports.filter((r) => r.id !== dl.dataset.rdel); renderReports(); } catch (err) { fail(err); } }
});
$("#formulas").addEventListener("click", async (e) => {
  const dl = e.target.closest("[data-fdel]"); if (!dl) return;
  try { await api("/api/formulas?id=" + encodeURIComponent(dl.dataset.fdel), { method: "DELETE", token }); formulas = formulas.filter((f) => f.id !== dl.dataset.fdel); renderFormulas(); } catch (err) { fail(err); }
});

/* ---------- shop ---------- */
$("#shopform").addEventListener("submit", async (e) => {
  e.preventDefault();
  try { await api("/api/shop", { method: "PUT", token, body: { phone: $("#s-phone").value, whatsapp: $("#s-wa").value, email: $("#s-mail").value, address: $("#s-addr").value } }); toast("saved"); }
  catch (err) { fail(err); }
});

/* ---------- render + start ---------- */
function renderAll() {
  $("#warn").hidden = dbOk; $("#warn").textContent = t("warn_db");
  renderRates(); renderItems(); renderReports(); renderFormulas();
  $("#dlg-title").textContent = t(editing === "new" ? "dlg_new" : "dlg_edit");
}
onLang(() => { if (!$("#app").hidden) renderAll(); });
initLang();
boot();
