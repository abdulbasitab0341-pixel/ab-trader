import { $, esc, addStrings, t, initLang, onLang, loadShop, waLink, CATEGORIES, catName, catDesc } from "./common.js";

addStrings({
  h_admin: ["Admin", "ایڈمن", "Admin"],
  tagline: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  eyebrow: ["Livestock & Dairy Feed Raw Material Supplier", "مویشی اور ڈیری فیڈ خام مال سپلائر", "Livestock & Dairy Feed Raw Material Supplier"],
  h1a: ["Good feed.", "اچھا چارہ۔", "Acha chara."],
  h1b: ["Full weight.", "پورا تول۔", "Poora tol."],
  h1c: ["More milk.", "زیادہ دودھ۔", "Zyada doodh."],
  lede: [
    "Trusted supplier of Karachi cattle and dairy farmers. Serving all over Pakistan. Export supply available.",
    "کراچی کے مویشی اور ڈیری فارمرز کا قابلِ اعتماد سپلائر۔ پورے پاکستان میں سپلائی۔ ایکسپورٹ سپلائی دستیاب۔",
    "Karachi ke cattle aur dairy farmers ka qabil-e-aitmaad supplier. Poore Pakistan mein supply. Export supply dastiyab.",
  ],
  cta_rates: ["Ask today's rate", "آج کا ریٹ پوچھیں", "Aaj ka rate poochein"],
  cta_products: ["See the products", "مال دیکھیں", "Maal dekhein"],
  fa1: ["Karachi", "کراچی", "Karachi"],
  fa1p: ["Trusted by cattle and dairy farmers", "مویشی اور ڈیری فارمرز کا اعتماد", "Cattle aur dairy farmers ka aitmaad"],
  fa2: ["All Pakistan", "پورا پاکستان", "Poora Pakistan"],
  fa2p: ["Supply across the country", "ملک بھر میں سپلائی", "Mulk bhar mein supply"],
  fa3: ["Export", "ایکسپورٹ", "Export"],
  fa3p: ["Export supply available", "ایکسپورٹ سپلائی دستیاب", "Export supply dastiyab"],
  prod_h: ["What we supply", "ہم کیا سپلائی کرتے ہیں", "Hum kya supply karte hain"],
  prod_p: ["35 products in 6 groups. Tap a group to see the items.", "6 گروپس میں 35 مصنوعات۔ دیکھنے کے لیے گروپ پر ٹیپ کریں۔", "6 groups mein 35 products. Dekhne ke liye group par tap karein."],
  sv_h: ["Our services", "ہماری خدمات", "Hamari khidmaat"],
  sv1: ["Animal feed raw materials supply", "جانوروں کی خوراک کا خام مال", "Janwaron ki khurak ka kham maal"],
  sv2: ["Customized cattle and buffalo feed formulation", "گائے بھینس کے لیے حسبِ ضرورت فیڈ فارمولا", "Gaaye bhains ke liye hasb-e-zaroorat feed formula"],
  sv3: ["Feed balancing and nutritional solutions", "فیڈ بیلنسنگ اور غذائی حل", "Feed balancing aur ghizai hal"],
  sv4: ["Dairy feed ingredients and supplements", "ڈیری فیڈ اجزاء اور سپلیمنٹس", "Dairy feed ajza aur supplements"],
  sv5: ["Bulk wholesale supply", "تھوک سپلائی", "Thok supply"],
  sv6: ["Agricultural commodities trading", "زرعی اجناس کی تجارت", "Zaraai ajnaas ki tijarat"],
  sv7: ["Cow mats and dairy farm products", "کاؤ میٹ اور ڈیری فارم مصنوعات", "Cow mat aur dairy farm products"],
  sv8: ["Export supply services", "ایکسپورٹ سپلائی", "Export supply"],
  sv9: ["Lab reports of our feed", "ہمارے فیڈ کی لیب رپورٹس", "Hamare feed ki lab reports"],
  cm_h: ["Our commitment", "ہمارا عزم", "Hamara azm"],
  cm_p: [
    "We focus on reliable sourcing, consistent product quality, competitive pricing and customized feed solutions to support better livestock nutrition and dairy farm productivity.",
    "ہم قابلِ بھروسہ خریداری، یکساں معیار، مناسب قیمت اور حسبِ ضرورت فیڈ حل پر توجہ دیتے ہیں تاکہ مویشیوں کی بہتر خوراک اور ڈیری فارم کی پیداوار بڑھے۔",
    "Hum qabil-e-bharosa kharidari, yaksan miyaar, munasib qeemat aur hasb-e-zaroorat feed hal par tawajjo dete hain taake mawashi ki behtar khurak aur dairy farm ki paidawar barhe.",
  ],
  cm_p2: [
    "We aim to build long-term business relationships by providing dependable supply and feed balancing solutions.",
    "ہمارا مقصد قابلِ اعتماد سپلائی اور فیڈ بیلنسنگ کے ذریعے طویل مدتی کاروباری تعلقات بنانا ہے۔",
    "Hamara maqsad qabil-e-aitmaad supply aur feed balancing ke zariye taweel muddati karobari talluqaat banana hai.",
  ],
  faq_h: ["Common questions", "عام سوالات", "Aam sawalat"],
  q1: ["What does AB Trader supply?", "اے بی ٹریڈر کیا سپلائی کرتا ہے؟", "AB Trader kya supply karta hai?"],
  a1: [
    "Wheat, maize, cracked grain, chokar, macroni, pulses and broken pulses, NDF, HDF and SA Pala, soybean meal, canola meal, sarso khal, pea products, maize gluten, toxin binder, yeast, DCP and cow mats.",
    "گندم، مکئی، دلیہ، چوکر، مکرونی، دالیں اور کٹا، این ڈی ایف، ایچ ڈی ایف اور ایس اے پالا، سویابین میل، کینولا میل، سرسوں کھل، مٹر مصنوعات، مکئی گلوٹن، ٹاکسن بائنڈر، ییسٹ، ڈی سی پی اور کاؤ میٹ۔",
    "Gandum, makai, dalya, chokar, macroni, daalein aur kutta, NDF, HDF aur SA Pala, soybean meal, canola meal, sarso khal, mattar products, maize gluten, toxin binder, yeast, DCP aur cow mat.",
  ],
  q2: ["Do you help with feed balancing?", "کیا آپ فیڈ بیلنسنگ میں مدد کرتے ہیں؟", "Kya aap feed balancing mein madad karte hain?"],
  a2: [
    "Yes. Use the Feed Balancing page to check a ration for a cow or buffalo, or ask us for a customized formula.",
    "جی ہاں۔ فیڈ بیلنسنگ کے صفحے پر گائے یا بھینس کا راشن چیک کریں، یا ہم سے حسبِ ضرورت فارمولا پوچھیں۔",
    "Ji haan. Feed Balancing page par gaaye ya bhains ka ration check karein, ya hum se hasb-e-zaroorat formula poochein.",
  ],
  q3: ["How is the feed sold?", "مال کس حساب سے ملتا ہے؟", "Maal kis hisaab se milta hai?"],
  a3: [
    "Most items by the kilo. Chokar, Pala and Fazlani Atti by the bori (34, 40 or 48 kg). Cow mats per piece.",
    "زیادہ تر مال کلو کے حساب سے۔ چوکر، پالا اور فضلانی آٹی بوری (34، 40 یا 48 کلو) کے حساب سے۔ کاؤ میٹ فی عدد۔",
    "Zyada tar maal kilo ke hisaab se. Chokar, Pala aur Fazlani Atti bori (34, 40 ya 48 kg) ke hisaab se. Cow mat fi adad.",
  ],
  q4: ["Do you supply outside Karachi or export?", "کیا کراچی سے باہر یا ایکسپورٹ سپلائی ہوتی ہے؟", "Kya Karachi se bahir ya export supply hoti hai?"],
  a4: ["Yes. We serve all over Pakistan and export supply is available.", "جی ہاں۔ پورے پاکستان میں سپلائی اور ایکسپورٹ سپلائی دستیاب ہے۔", "Ji haan. Poore Pakistan mein supply aur export supply dastiyab hai."],
  contact_h: ["Contact AB Trader", "اے بی ٹریڈر سے رابطہ", "AB Trader se rabta"],
  contact_p: ["Ask for today's rates and stock.", "آج کا ریٹ اور اسٹاک معلوم کریں۔", "Aaj ka rate aur stock poochein."],
  c_mail: ["Email", "ای میل", "Email"],
  c_addr: ["Address", "پتہ", "Pata"],
  c_web: ["Website", "ویب سائٹ", "Website"],
  call: ["Call", "کال کریں", "Call karein"],
});

let shop = {};

function renderCats() {
  $("#cats").innerHTML = CATEGORIES.map((g) => `<a class="cat-card" href="/products?cat=${g.id}"><b>${esc(catName(g.id))}</b><span>${esc(catDesc(g.id))}</span></a>`).join("");
}
function renderShop() {
  const ph = shop.phone || shop.whatsapp;
  $("#c-phone").textContent = ph || t("c_pending");
  $("#c-phone").href = ph ? waLink(shop, "Assalam o Alaikum, aaj ka rate bata dein.") : "#contact";
  $("#c-mail").textContent = shop.email || "";
  $("#c-mail").href = shop.email ? "mailto:" + shop.email : "#contact";
  $("#c-mail").parentElement.hidden = !shop.email;
  $("#c-addr").textContent = shop.address || t("c_pending");
  const wa = ph ? waLink(shop, "Assalam o Alaikum, aaj ka rate bata dein.") : "#contact";
  $("#hero-wa").href = wa;
  if (ph) $("#hero-wa").target = "_blank";
  $("#callbar").classList.toggle("on", Boolean(ph));
  $("#cb-wa").href = wa;
  $("#cb-call").href = ph ? "tel:" + ph.replace(/[^\d+]/g, "") : "#contact";
}

onLang(() => { renderCats(); renderShop(); });
initLang();
renderCats();
loadShop().then((s) => { shop = s; renderShop(); });
renderShop();
