// Starter catalogue. Used when no database is connected, and copied into the
// database the first time the admin saves something.
// mode: "kg" per kilo | "bag" per bori of bagKg | "pc" per piece. cash / udhaar = rate in Rs.
// cat: category id. dm, cp, tdn, ndf = typical % (dry matter as fed; CP/TDN/NDF on dry-matter basis).
// 0 = unknown: enter the real value from your lab report in the admin panel.

export const CATEGORIES = [
  { id: "grains", en: "Grains & Raw Materials", ur: "دانے اور خام مال", ro: "Dane aur kham maal",
    d: { en: "Wheat, maize, pulses and their cracked or ground forms.", ur: "گندم، مکئی، دالیں اور ان کا دلیہ یا پاؤڈر۔", ro: "Gandum, makai, daalein aur un ka dalya ya powder." } },
  { id: "byproducts", en: "By-Products & Choras", ur: "چوکر اور چورے", ro: "Chokar aur chore",
    d: { en: "Bran, husk and broken pulses for the daily ration.", ur: "چوکر، چھلکے اور ٹوٹی ہوئی دالیں۔", ro: "Chokar, chilke aur tooti hui daalein." } },
  { id: "pala", en: "Pala & Feed Products", ur: "پالا اور فیڈ", ro: "Pala aur feed",
    d: { en: "Ready bagged feed for cows and buffaloes.", ur: "گائے اور بھینس کے لیے تیار بوری بند فیڈ۔", ro: "Gaaye aur bhains ke liye tayyar bori band feed." } },
  { id: "protein", en: "Protein Meals & Oil Cakes", ur: "پروٹین میل اور کھل", ro: "Protein meal aur khal",
    d: { en: "Protein for milk: soybean, canola, mustard and pea.", ur: "دودھ کے لیے پروٹین: سویابین، کینولا، سرسوں اور مٹر۔", ro: "Doodh ke liye protein: soybean, canola, sarson aur mattar." } },
  { id: "additives", en: "Feed Supplements & Additives", ur: "سپلیمنٹ اور ایڈیٹوز", ro: "Supplement aur additives",
    d: { en: "Gluten, toxin binder, yeast and minerals.", ur: "گلوٹن، ٹاکسن بائنڈر، خمیر اور معدنیات۔", ro: "Gluten, toxin binder, yeast aur minerals." } },
  { id: "mats", en: "Cow Mats", ur: "کاؤ میٹ", ro: "Cow mat",
    d: { en: "Rubber dairy cow mats, sold per piece.", ur: "ربڑ کی کاؤ میٹ، فی عدد۔", ro: "Rubber cow mat, fi adad." } },
];

// [id, cat, en, ro, ur, mode, bagKg, cash, dm, cp, tdn, ndf]
const T = [
  ["gandum", "grains", "Wheat", "Gandum", "گندم", "kg", 40, 0, 89, 13, 82, 14],
  ["gandum-dalya", "grains", "Cracked Wheat", "Gandum Dalya", "گندم دلیہ", "kg", 40, 0, 89, 13, 82, 14],
  ["makai", "grains", "Maize (Corn)", "Makai", "مکئی", "kg", 40, 70, 88, 9, 88, 10],
  ["makai-dalya", "grains", "Cracked Maize", "Makai Dalya", "مکئی دلیہ", "kg", 40, 0, 88, 9, 88, 10],
  ["makai-powder", "grains", "Ground Maize", "Makai Powder", "مکئی پاؤڈر", "kg", 40, 0, 88, 9, 88, 10],
  ["mongi", "grains", "Mung Beans (Green Gram)", "Mongi", "مونگی", "kg", 40, 0, 90, 25, 80, 15],
  ["masoor", "grains", "Red Lentils", "Masoor", "مسور", "kg", 40, 0, 90, 26, 80, 16],

  ["chokar", "byproducts", "Wheat Bran", "Chokar", "چوکر", "bag", 34, 2312, 89, 16, 70, 42],
  ["kala-chora", "byproducts", "Black Gram Husk / Churi", "Kala Chora", "کالا چورا", "kg", 40, 0, 90, 12, 55, 55],
  ["rang-last-chora", "byproducts", "Rang Last Churi", "Rang Last Chora", "رنگ لاسٹ چورا", "kg", 40, 0, 0, 0, 0, 0],
  ["bahir-ghutli-chora", "byproducts", "External Seed Husk / Churi", "Bahir Ghutli Ka Chora", "باہر گھٹلی کا چورا", "kg", 40, 0, 0, 0, 0, 0],
  ["macroni", "byproducts", "Macaroni & Vermicelli", "Macroni Sawiyan", "مکرونی سویاں", "kg", 40, 80, 90, 12, 85, 8],
  ["chana-atti", "byproducts", "Chickpea Flour", "Chana Atti", "چنا آٹی", "kg", 40, 0, 90, 22, 82, 18],
  ["mash-kutta", "byproducts", "Black Gram Broken", "Mash Kutta", "ماش کٹا", "kg", 40, 0, 90, 24, 78, 15],
  ["moth-kutta", "byproducts", "Moth Bean Broken", "Moth Kutta", "موٹھ کٹا", "kg", 40, 0, 90, 23, 78, 15],
  ["masoor-kutta", "byproducts", "Red Lentil Broken", "Masoor Kutta", "مسور کٹا", "kg", 40, 0, 90, 26, 80, 15],
  ["mong-kutta", "byproducts", "Mung Bean Broken", "Mong Kutta", "مونگ کٹا", "kg", 40, 0, 90, 25, 80, 15],

  ["ndf-pala", "pala", "NDF Feed", "NDF Pala", "این ڈی ایف پالا", "bag", 48, 0, 0, 0, 0, 0],
  ["hdf-pala", "pala", "HDF Feed", "HDF Pala", "ایچ ڈی ایف پالا", "bag", 48, 0, 0, 0, 0, 0],
  ["sa-feed", "pala", "SA Feed", "SA Pala", "ایس اے پالا", "bag", 40, 3700, 0, 0, 0, 0],
  ["fazlani-atti", "pala", "Fazlani Feed Meal", "Fazlani Atti", "فضلانی آٹی", "bag", 40, 0, 0, 0, 0, 0],
  ["master-feed", "pala", "Master Feed", "Master Feed", "ماسٹر فیڈ", "bag", 40, 3900, 0, 0, 0, 0],
  ["nagori-feed", "pala", "Nagori Feed", "Nagori Feed", "ناگوری فیڈ", "bag", 40, 0, 0, 0, 0, 0],

  ["soybean-meal", "protein", "Soybean Meal", "Soybean Meal", "سویابین میل", "kg", 40, 0, 90, 46, 82, 14],
  ["soybean-chilka", "protein", "Soybean Hulls", "Soybean Chilka", "سویابین چھلکا", "kg", 40, 0, 90, 12, 77, 62],
  ["canola-meal", "protein", "Canola Meal", "Canola Meal", "کینولا میل", "kg", 40, 0, 90, 36, 72, 28],
  ["sarso-meal", "protein", "Mustard Meal", "Sarso Meal", "سرسوں میل", "kg", 40, 0, 90, 34, 70, 30],
  ["sarso-khal", "protein", "Mustard Oil Cake", "Sarso Khal", "سرسوں کھل", "kg", 40, 0, 91, 33, 72, 30],
  ["mattar-atti", "protein", "Pea Flour", "Mattar Atti", "مٹر آٹی", "kg", 40, 0, 90, 23, 80, 14],
  ["mattar-chilka", "protein", "Pea Hulls", "Mattar Chilka", "مٹر چھلکا", "kg", 40, 0, 90, 8, 65, 60],

  ["maize-gluten-30", "additives", "Maize Gluten Feed 30%", "Maize Gluten 30%", "مکئی گلوٹن 30%", "kg", 40, 0, 90, 30, 78, 38],
  ["toxin-binder", "additives", "Mycotoxin Binder", "Toxin Binder", "ٹاکسن بائنڈر", "kg", 40, 0, 0, 0, 0, 0],
  ["yeast", "additives", "Feed Grade Yeast", "Yeast", "خمیر (ییسٹ)", "kg", 40, 0, 93, 45, 75, 5],
  ["dcp", "additives", "Di-Calcium Phosphate", "DCP", "ڈی سی پی", "kg", 40, 0, 0, 0, 0, 0],

  ["cow-mat", "mats", "Rubber Cow Mat / Dairy Cow Mat", "Cow Mat", "کاؤ میٹ", "pc", 1, 0, 0, 0, 0, 0],
];

export const DEFAULT_ITEMS = T.map(([id, cat, en, ro, ur, mode, bagKg, cash, dm, cp, tdn, ndf], i) => ({
  id, cat, en, ro, ur, mode, bagKg, cash, udhaar: 0, dm, cp, tdn, ndf, img: "", order: (i + 1) * 10,
}));

export const DEFAULT_SHOP = { phone: "+92 314 3942492", whatsapp: "+92 314 3942492", email: "info@abtrader.pk", address: "" };
