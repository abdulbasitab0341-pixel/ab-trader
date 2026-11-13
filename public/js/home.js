import { $, esc, num, lang, addStrings, t, initLang, onLang, loadItems, loadShop, itemName, safeImg, waLink, DEFAULT_ITEMS } from "./common.js";

addStrings({
  h_products: ["Products", "مصنوعات", "Maal"],
  h_contact: ["Contact", "رابطہ", "Rabta"],
  h_admin: ["Admin", "ایڈمن", "Admin"],
  tagline: ["Dairy Feed Supplier", "ڈیری فیڈ سپلائر", "Dairy Feed Supplier"],
  eyebrow: ["Dairy feed supplier · Pakistan", "ڈیری فیڈ سپلائر · پاکستان", "Dairy feed supplier · Pakistan"],
  h1a: ["Good feed.", "اچھا چارہ۔", "Acha chara."],
  h1b: ["Full weight.", "پورا تول۔", "Poora tol."],
  h1c: ["More milk.", "زیادہ دودھ۔", "Zyada doodh."],
  lede: [
    "AB Traders supplies makai, chokar, macroni, khal, wanda and bagged feeds for cows and buffaloes, one bori or a full truck.",
    "اے بی ٹریڈرز گائے اور بھینس کے لیے مکئی، چوکر، مکرونی، کھل، ونڈا اور بوری بند فیڈ فراہم کرتا ہے، ایک بوری ہو یا پورا ٹرک۔",
    "AB Traders gaaye aur bhains ke liye makai, chokar, macroni, khal, wanda aur bori band feed supply karta hai, ek bori ho ya poora truck.",
  ],
  cta_rates: ["Ask today's rate", "آج کا ریٹ پوچھیں", "Aaj ka rate poochein"],
  cta_products: ["See the feed", "مال دیکھیں", "Maal dekhein"],
  prod_h: ["What we stock", "ہمارا مال", "Hamara maal"],
  prod_p: ["Sold by the kilo or by the bori (40 kg).", "کلو یا بوری (40 کلو) کے حساب سے دستیاب۔", "Kilo ya bori (40 kg) ke hisaab se dastiyab."],
  why_h: ["How we do business", "ہمارا طریقہ کار", "Hamara tareeqa"],
  why1: ["Full weight", "پورا تول", "Poora tol"],
  why1p: ["Every bori is weighed in front of you.", "ہر بوری آپ کے سامنے تولی جاتی ہے۔", "Har bori aap ke samne toli jati hai."],
  why2: ["Clean, fresh stock", "صاف اور تازہ مال", "Saaf, taza maal"],
  why2p: ["Dry, clean grain and khal. No dust, no damp.", "خشک، صاف دانہ اور کھل۔ نہ مٹی، نہ نمی۔", "Khushk, saaf dana aur khal. Na mitti, na nami."],
  why3: ["Any quantity", "ہر مقدار", "Har miqdaar"],
  why3p: ["One bori for a single animal or a truck for the whole farm.", "ایک جانور کے لیے ایک بوری یا پورے فارم کے لیے ٹرک۔", "Ek janwar ke liye ek bori ya poore farm ke liye truck."],
  why4: ["A written bill", "پکا بل", "Pakka bill"],
  why4p: ["Every order gets a clear bill with rate, weight and balance.", "ہر آرڈر کا صاف بل، ریٹ، وزن اور بقایا کے ساتھ۔", "Har order ka saaf bill, rate, wazan aur baqaya ke sath."],
  faq_h: ["Common questions", "عام سوالات", "Aam sawalat"],
  q1: ["Which dairy feed does AB Traders supply?", "اے بی ٹریڈرز کون سی ڈیری فیڈ فراہم کرتا ہے؟", "AB Traders kaun si dairy feed supply karta hai?"],
  a1: [
    "Makai, gandum, dalia, chokar, macroni, khal binola, sarson ki khal, wanda, Master Feed, Nagori Feed, S.A Feed and mineral mixture for cows and buffaloes.",
    "گائے اور بھینس کے لیے مکئی، گندم، دلیہ، چوکر، مکرونی، کھل بنولہ، سرسوں کی کھل، ونڈا، ماسٹر فیڈ، ناگوری فیڈ، ایس اے فیڈ اور منرل مکسچر۔",
    "Gaaye aur bhains ke liye makai, gandum, dalia, chokar, macroni, khal binola, sarson ki khal, wanda, Master Feed, Nagori Feed, S.A Feed aur mineral mixture.",
  ],
  q2: ["How is the feed sold?", "فیڈ کس حساب سے ملتی ہے؟", "Feed kis hisaab se milti hai?"],
  a2: ["Loose items by the kilo. Bagged feed by the bori of 40 kg.", "کھلا مال کلو کے حساب سے۔ بوری بند فیڈ 40 کلو کی بوری کے حساب سے۔", "Khula maal kilo ke hisaab se. Bori band feed 40 kg ki bori ke hisaab se."],
  q3: ["Do I get a bill with my order?", "کیا آرڈر کے ساتھ بل ملتا ہے؟", "Kya order ke sath bill milta hai?"],
  a3: [
    "Yes. Every order comes with a written bill showing bags, weight, rate, freight and any balance.",
    "جی ہاں۔ ہر آرڈر کے ساتھ لکھا ہوا بل ملتا ہے جس میں بوری، وزن، ریٹ، کرایہ اور بقایا درج ہوتا ہے۔",
    "Ji haan. Har order ke sath likha hua bill milta hai jis mein bori, wazan, rate, kiraya aur baqaya darj hota hai.",
  ],
  contact_h: ["Contact AB Traders", "اے بی ٹریڈرز سے رابطہ", "AB Traders se rabta"],
  contact_p: ["Ask for today's rates and stock.", "آج کا ریٹ اور اسٹاک معلوم کریں۔", "Aaj ka rate aur stock poochein."],
  c_phone: ["Phone", "فون", "Phone"],
  c_addr: ["Address", "پتہ", "Pata"],
  c_web: ["Website", "ویب سائٹ", "Website"],
  call: ["Call", "کال کریں", "Call karein"],
});

let items = DEFAULT_ITEMS, shop = { phone: "", whatsapp: "", address: "" };

function renderGrid() {
  const sub = (c) => (c.mode === "bag" ? `${t("c_perbag")} · ${num(c.bagKg) || 40} ${t("c_kg")}` : t("c_perkg"));
  $("#grid").innerHTML = items.map((c) => {
    const img = safeImg(c.img);
    const d = c.desc && (c.desc[lang] || c.desc.en);
    return `<article class="prod">${img ? `<img class="pic" src="${esc(img)}" alt="${esc(c.ro || c.en)}" loading="lazy">` : `<div class="pic ph" aria-hidden="true">${esc((c.ro || c.en || "AB").slice(0, 2).toUpperCase())}</div>`}
      <h3>${esc(itemName(c))}</h3>
      <div class="names"><span>${esc([c.en, c.ro].filter((v, i, a) => v && a.indexOf(v) === i).join(" · "))}</span><span>${esc(c.ur)}</span></div>
      <span class="pill ${c.mode === "bag" ? "" : "kg"}">${esc(sub(c))}</span>
      ${d ? `<p>${esc(d)}</p>` : ""}</article>`;
  }).join("");
}

function renderShop() {
  $("#c-phone").textContent = shop.phone || t("c_pending");
  $("#c-addr").textContent = shop.address || t("c_pending");
  const has = Boolean(shop.phone || shop.whatsapp);
  const wa = has ? waLink(shop, "Assalam o Alaikum, aaj ka rate bata dein.") : "#contact";
  $("#hero-wa").href = wa;
  if (has) $("#hero-wa").target = "_blank";
  $("#callbar").classList.toggle("on", has);
  $("#cb-wa").href = wa;
  $("#cb-call").href = shop.phone ? "tel:" + shop.phone.replace(/[^\d+]/g, "") : "#contact";
}

onLang(() => { renderGrid(); renderShop(); });
initLang();
renderGrid();
renderShop();

loadItems().then((j) => { items = j.items; renderGrid(); });
loadShop().then((s) => { shop = s; renderShop(); });
