import { dbReady, readShop, writeShop, cleanShop, isAdmin, readBody } from "./_lib.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") return res.status(200).json({ shop: await readShop() });

    if (req.method === "PUT") {
      if (!isAdmin(req)) return res.status(401).json({ error: "login" });
      if (!dbReady()) return res.status(503).json({ error: "nodb" });
      await writeShop(cleanShop(readBody(req)));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
}
