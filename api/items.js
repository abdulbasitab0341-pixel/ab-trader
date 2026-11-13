import { dbReady, readItems, seedIfNeeded, writeItems, deleteItem, touchRates, readRatesAt, cleanItem, isAdmin, readBody } from "./_lib.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      const { items, source } = await readItems();
      const lite = req.query?.noimg === "1";
      return res.status(200).json({
        source,
        db: dbReady(),
        updated: await readRatesAt(),
        items: lite ? items.map(({ img, ...rest }) => ({ ...rest, img: "" })) : items,
      });
    }

    if (!isAdmin(req)) return res.status(401).json({ error: "login" });
    if (!dbReady()) return res.status(503).json({ error: "nodb" });

    if (req.method === "POST") {
      const b = readBody(req);
      const list = (Array.isArray(b.items) ? b.items : [b.item]).map(cleanItem).filter(Boolean);
      if (!list.length) return res.status(400).json({ error: "bad item" });
      await seedIfNeeded();
      await writeItems(list);
      await touchRates();
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id || "");
      if (!id) return res.status(400).json({ error: "id" });
      await seedIfNeeded();
      await deleteItem(id);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
}
