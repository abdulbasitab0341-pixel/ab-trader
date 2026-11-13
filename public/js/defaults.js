// Starter items. Used when no database is connected, and copied into the
// database the first time the admin saves something.
// mode: "kg" = sold by weight, "bag" = sold by the bori. cash / udhaar are rates in Rs.

const feed = {
  en: "Ready-mixed compound feed, sold by the 40 kg bori.",
  ur: "تیار مکس فیڈ، 40 کلو کی بوری میں۔",
  ro: "Tayyar mix feed, 40 kg ki bori mein.",
};

export const DEFAULT_ITEMS = [
  { id: "makai", en: "Maize", ro: "Makai", ur: "مکئی", mode: "kg", bagKg: 40, cash: 70, udhaar: 0,
    desc: { en: "Whole or crushed grain. The main energy source in the ration.", ur: "ثابت یا پسا ہوا دانہ۔ خوراک میں توانائی کا بڑا ذریعہ۔", ro: "Sabut ya pisa hua dana. Khurak mein taqat ka bara zariya." } },
  { id: "macroni", en: "Macroni", ro: "Macroni", ur: "مکرونی", mode: "kg", bagKg: 40, cash: 80, udhaar: 0,
    desc: { en: "Energy feed for the daily ration.", ur: "روزانہ کی خوراک کے لیے توانائی والی فیڈ۔", ro: "Rozana ki khurak ke liye taqat wali feed." } },
  { id: "chokar", en: "Wheat bran", ro: "Chokar", ur: "چوکر", mode: "kg", bagKg: 40, cash: 68, udhaar: 0,
    desc: { en: "Light, fluffy bran that adds fibre and bulk to the mix.", ur: "ہلکا چوکر جو خوراک میں ریشہ اور حجم بڑھاتا ہے۔", ro: "Halka chokar jo khurak mein resha aur hajam barhata hai." } },
  { id: "master-feed", en: "Master Feed", ro: "Master Feed", ur: "ماسٹر فیڈ", mode: "bag", bagKg: 40, cash: 3900, udhaar: 0, desc: feed },
  { id: "sa-feed", en: "S.A Feed", ro: "S.A Feed", ur: "ایس اے فیڈ", mode: "bag", bagKg: 40, cash: 3700, udhaar: 0, desc: feed },
  { id: "nagori-feed", en: "Nagori Feed", ro: "Nagori Feed", ur: "ناگوری فیڈ", mode: "bag", bagKg: 40, cash: 0, udhaar: 0, desc: feed },
  { id: "gandum", en: "Wheat", ro: "Gandum", ur: "گندم", mode: "kg", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Clean feed-grade wheat for mixing into the daily ration.", ur: "صاف گندم، روزانہ کی خوراک میں ملانے کے لیے۔", ro: "Saaf gandum, rozana ki khurak mein milane ke liye." } },
  { id: "dalia", en: "Cracked grain", ro: "Dalia", ur: "دلیہ", mode: "kg", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Cracked wheat and maize. Soft on the stomach and easy to feed.", ur: "موٹا پسا ہوا گندم اور مکئی۔ ہضم میں ہلکا اور کھلانے میں آسان۔", ro: "Mota pisa hua gandum aur makai. Hazam mein halka aur khilane mein asaan." } },
  { id: "khal-binola", en: "Cottonseed cake", ro: "Khal Binola", ur: "کھل بنولہ", mode: "bag", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "The classic protein feed for milking buffaloes and cows.", ur: "دودھ دینے والی بھینس اور گائے کے لیے پروٹین کی روایتی خوراک۔", ro: "Doodh dene wali bhains aur gaaye ke liye protein ki riwayati khurak." } },
  { id: "sarson-khal", en: "Mustard cake", ro: "Sarson ki Khal", ur: "سرسوں کی کھل", mode: "bag", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Oil cake from mustard seed, fed alongside khal binola.", ur: "سرسوں کے بیج کی کھل، کھل بنولہ کے ساتھ کھلائی جاتی ہے۔", ro: "Sarson ke beej ki khal, khal binola ke sath khilai jati hai." } },
  { id: "wanda", en: "Compound feed", ro: "Wanda", ur: "ونڈا", mode: "bag", bagKg: 40, cash: 0, udhaar: 0, desc: feed },
  { id: "chana-chilka", en: "Gram husk", ro: "Chanay ka Chilka", ur: "چنے کا چھلکا", mode: "kg", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Chickpea husk, a tasty roughage animals take to quickly.", ur: "چنے کا چھلکا، ذائقے دار ریشہ جو جانور شوق سے کھاتے ہیں۔", ro: "Chane ka chilka, zaiqedar resha jo janwar shauq se khate hain." } },
  { id: "rice-polish", en: "Rice polish", ro: "Rice Polish", ur: "رائس پالش", mode: "kg", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Fine rice bran with natural oil for extra energy.", ur: "چاول کا باریک چھلکا، قدرتی تیل کے ساتھ اضافی توانائی۔", ro: "Chawal ka bareek chilka, qudrati tel ke sath izafi taqat." } },
  { id: "mineral-mixture", en: "Mineral mixture", ro: "Mineral Mixture", ur: "منرل مکسچر", mode: "kg", bagKg: 40, cash: 0, udhaar: 0,
    desc: { en: "Salt and minerals to add to the daily ration.", ur: "نمک اور معدنیات، روزانہ کی خوراک میں ملانے کے لیے۔", ro: "Namak aur minerals, rozana ki khurak mein milane ke liye." } },
].map((x, i) => ({ img: "", ...x, order: (i + 1) * 10 }));

export const DEFAULT_SHOP = { phone: "", whatsapp: "", address: "" };
