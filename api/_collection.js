import { dbReady, COLLECTIONS, colRead, colWrite, colDelete, isAdmin, readBody } from "./_lib.js";

// Shared handler for /api/reports and /api/formulas.
export function collectionHandler(name) {
  const { clean } = COLLECTIONS[name];
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    try {
      if (req.method === "GET") {
        let list = await colRead(name);
        const id = req.query?.id;
        if (id) list = list.filter((x) => x.id === id);
        else list = list.map(({ img, ...r }) => ({ ...r, hasImg: Boolean(img) })); // pictures load one at a time
        return res.status(200).json({ list, db: dbReady() });
      }
      if (!isAdmin(req)) return res.status(401).json({ error: "login" });
      if (!dbReady()) return res.status(503).json({ error: "nodb" });
      if (req.method === "POST") {
        const b = readBody(req);
        const one = clean(b.item);
        if (!one) return res.status(400).json({ error: "bad" });
        if (!one.order) one.order = (await colRead(name)).length * 10 + 10;
        await colWrite(name, [one]);
        return res.status(200).json({ ok: true, id: one.id });
      }
      if (req.method === "DELETE") {
        const id = String(req.query?.id || "");
        if (!id) return res.status(400).json({ error: "id" });
        await colDelete(name, id);
        return res.status(200).json({ ok: true });
      }
      return res.status(405).json({ error: "method" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "server" });
    }
  };
}
