import { $, $$, esc, num, nf, store, addStrings, t, tri, initLang, onLang, api, itemName, safeImg } from "./common.js";

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
  per_bag_n: ["per bori of", "فی بوری وزن", "fi bori wazan"],
});

let token = store.get("abt-admin") || "";
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
const unit = (c) => (c.mode === "bag" ? `/${t("c_bori")} · ${num(c.bagKg) || 40} ${t("c_kg")}` : `/${t("c_kg")}`);

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
  const [it, sh] = await Promise.all([api("/api/items", { token }), api("/api/shop")]);
  items = it.items; dbOk = Boolean(it.db);
  orig = new Map(items.map((c) => [c.id, JSON.stringify(c)]));
  dirty.clear();
  $("#s-phone").value = sh.shop.phone || ""; $("#s-wa").value = sh.shop.whatsapp || ""; $("#s-addr").value = sh.shop.address || "";
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
  ["rates", "items", "shop"].forEach((n) => ($("#t-" + n).hidden = n !== k));
  $("#ratebar").hidden = k !== "rates";
}
$("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });

/* ---------- rates ---------- */
function renderRates() {
  $("#rates").innerHTML = items.map((c) => `<div class="rrow${dirty.has(c.id) ? " dirty" : ""}" data-id="${esc(c.id)}">
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
  const c = items.find((x) => x.id === id) || { ro: "", ur: "", en: "", mode: "bag", bagKg: 40, cash: "", udhaar: "", img: "" };
  $("#dlg-title").textContent = t(id === "new" ? "dlg_new" : "dlg_edit");
  $("#i-ro").value = c.ro || ""; $("#i-ur").value = c.ur || ""; $("#i-en").value = c.en || "";
  $("#i-mode").value = c.mode === "bag" ? "bag" : "kg"; $("#i-bagkg").value = c.bagKg || 40;
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
  const c = { ...(prev || {}), id, ro, ur, en, mode: $("#i-mode").value, bagKg: num($("#i-bagkg").value) || 40, cash: num($("#i-cash").value), udhaar: num($("#i-udhaar").value), img: editImg, order: prev ? prev.order : (Math.max(0, ...items.map((x) => num(x.order))) + 10) };
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

/* ---------- shop ---------- */
$("#shopform").addEventListener("submit", async (e) => {
  e.preventDefault();
  try { await api("/api/shop", { method: "PUT", token, body: { phone: $("#s-phone").value, whatsapp: $("#s-wa").value, address: $("#s-addr").value } }); toast("saved"); }
  catch (err) { fail(err); }
});

/* ---------- render + start ---------- */
function renderAll() {
  $("#warn").hidden = dbOk; $("#warn").textContent = t("warn_db");
  renderRates(); renderItems();
  $("#dlg-title").textContent = t(editing === "new" ? "dlg_new" : "dlg_edit");
}
onLang(() => { if (!$("#app").hidden) renderAll(); });
initLang();
boot();
