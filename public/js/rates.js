import { $, esc, num, nf, addStrings, t, initLang, onLang, loadItems, loadShop, itemName, catName, waLink, CATEGORIES, lang } from "./common.js";

addStrings({
  rt_h: ["Today's Rates", "آج کے ریٹ", "Aaj ke Rate"],
  rt_p: ["Daily cash and credit rates of feed raw material.", "فیڈ خام مال کے روزانہ نقد اور ادھار ریٹ۔", "Feed kham maal ke rozana naqad aur udhaar rate."],
  rt_search: ["Search item…", "چیز تلاش کریں…", "Cheez talash karein…"],
  rt_wa: ["Share on WhatsApp", "واٹس ایپ پر بھیجیں", "WhatsApp par bhejein"],
  rt_img: ["Save as picture", "تصویر محفوظ کریں", "Tasveer save karein"],
  rt_print: ["Print", "پرنٹ", "Print"],
  rt_note: ["Rates change daily. Call or WhatsApp to confirm before ordering.", "ریٹ روزانہ بدلتے ہیں۔ آرڈر سے پہلے کال یا واٹس ایپ پر تصدیق کریں۔", "Rate rozana badalte hain. Order se pehle call ya WhatsApp par tasdeeq karein."],
  rt_upd: ["Updated", "آخری تبدیلی", "Aakhri tabdeeli"],
  rt_item: ["Item", "چیز", "Cheez"],
  rt_call: ["Ask", "پوچھیں", "Poochhein"],
  rt_none: ["No items found.", "کوئی چیز نہیں ملی۔", "Koi cheez nahi mili."],
  c_pc: ["Per piece", "فی عدد", "Fi adad"],
});

let items = [], shop = null, updated = 0, q = "";
const unit = (c) => (c.mode === "bag" ? `${t("c_perbag")} (${num(c.bagKg) || 40} ${t("c_kg")})` : c.mode === "pc" ? t("c_pc") : t("c_perkg"));
const when = () => {
  const d = updated ? new Date(updated) : new Date();
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) + (updated ? " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "");
};
const visible = () => {
  const s = q.trim().toLowerCase();
  return items.filter((c) => !s || [c.en, c.ro, c.ur].some((v) => (v || "").toLowerCase().includes(s)));
};
const price = (v) => (num(v) > 0 ? nf(num(v)) : "—");
const groups = (l) => CATEGORIES.map((g) => ({ g, rows: l.filter((c) => c.cat === g.id) })).filter((x) => x.rows.length);

function render() {
  $("#stamp").textContent = `${t("rt_upd")}: ${when()}`;
  const l = groups(visible());
  $("#list").innerHTML = l.length ? l.map(({ g, rows }) => `<section class="rategrp"><h2>${esc(catName(g.id))}</h2>
    <div class="rtbl"><div class="rr hd"><span>${esc(t("rt_item"))}</span><span>${esc(t("c_cash"))}</span><span>${esc(t("c_udhaar"))}</span></div>
    ${rows.map((c) => `<div class="rr"><span><b>${esc(itemName(c))}</b><small>${esc(unit(c))}</small></span><span class="n">${esc(price(c.cash))}</span><span class="n">${esc(price(c.udhaar))}</span></div>`).join("")}</div></section>`).join("") : `<p class="sub">${esc(t("rt_none"))}</p>`;
}

const textList = () => {
  const L = [`*AB TRADER* – ${t("n_rates")}`, when(), ""];
  groups(items.filter((c) => num(c.cash) > 0 || num(c.udhaar) > 0)).forEach(({ g, rows }) => {
    L.push(`*${catName(g.id)}*`);
    rows.filter((c) => num(c.cash) > 0 || num(c.udhaar) > 0).forEach((c) => L.push(`${c.ro || c.en} (${unit(c)}): ${t("c_cash")} ${price(c.cash)} | ${t("c_udhaar")} ${price(c.udhaar)}`));
    L.push("");
  });
  L.push(shop ? `${shop.phone} · abtrader.pk` : "abtrader.pk");
  return L.join("\n");
};

$("#share-wa").addEventListener("click", () => window.open("https://wa.me/?text=" + encodeURIComponent(textList()), "_blank", "noopener"));
$("#print").addEventListener("click", () => window.print());

function canvasPicture() {
  const rows = groups(items.filter((c) => num(c.cash) > 0 || num(c.udhaar) > 0));
  const W = 900, pad = 36, rh = 46, gh = 54;
  const H = 190 + rows.reduce((a, x) => a + gh + x.rows.filter((c) => num(c.cash) > 0 || num(c.udhaar) > 0).length * rh, 0) + 90;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  x.fillStyle = "#fbf9f1"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#0b3a29"; x.fillRect(0, 0, W, 130);
  x.fillStyle = "#d19a1e"; x.fillRect(0, 130, W, 5);
  x.fillStyle = "#fff"; x.font = "800 40px Georgia, serif"; x.fillText("AB TRADER", pad, 62);
  x.font = "600 22px sans-serif"; x.fillStyle = "#e9c36a"; x.fillText("Livestock & Dairy Feed Raw Material Supplier", pad, 96);
  x.fillStyle = "#fff"; x.font = "700 20px sans-serif"; x.textAlign = "right"; x.fillText(when(), W - pad, 62); x.fillText("Today's Rates", W - pad, 96); x.textAlign = "left";
  let y = 170;
  rows.forEach(({ g, rows: r }) => {
    x.fillStyle = "#0b3a29"; x.font = "800 24px sans-serif"; x.fillText(g.en, pad, y + 6);
    x.font = "700 18px sans-serif"; x.fillStyle = "#7a6a3a"; x.textAlign = "right"; x.fillText("Cash", W - 200, y + 6); x.fillText("Udhaar", W - pad, y + 6); x.textAlign = "left";
    y += gh - 14;
    r.filter((c) => num(c.cash) > 0 || num(c.udhaar) > 0).forEach((c, i) => {
      x.fillStyle = i % 2 ? "#f3efe0" : "#fbf9f1"; x.fillRect(pad - 10, y - 24, W - 2 * pad + 20, rh);
      x.fillStyle = "#16241d"; x.font = "700 22px sans-serif"; x.fillText(c.ro || c.en, pad, y);
      x.font = "500 15px sans-serif"; x.fillStyle = "#6b7a72"; x.fillText(c.mode === "bag" ? `per bori (${num(c.bagKg) || 40} kg)` : c.mode === "pc" ? "per piece" : "per kg", pad + 330, y);
      x.fillStyle = "#16241d"; x.font = "800 22px sans-serif"; x.textAlign = "right"; x.fillText(price(c.cash), W - 200, y); x.fillText(price(c.udhaar), W - pad, y); x.textAlign = "left";
      y += rh;
    });
    y += 14;
  });
  x.fillStyle = "#0b3a29"; x.fillRect(0, H - 70, W, 70);
  x.fillStyle = "#fff"; x.font = "700 22px sans-serif"; x.fillText(`${shop ? shop.phone : ""}   ·   abtrader.pk`, pad, H - 28);
  return cv;
}

$("#share-img").addEventListener("click", () => {
  canvasPicture().toBlob(async (b) => {
    const f = new File([b], "ab-trader-rates.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: "AB Trader rates" }); return; } catch { /* cancelled */ } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "ab-trader-rates.png"; a.click();
  }, "image/png");
});

$("#q").addEventListener("input", (e) => { q = e.target.value; render(); });
onLang(render);
initLang();
(async () => {
  const [j, s] = await Promise.all([loadItems({ noimg: true }), loadShop()]);
  items = j.items; updated = j.updated || 0; shop = s; render();
})();
