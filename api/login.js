import { adminConfigured, checkPassword, makeToken, isAdmin, readBody } from "./_lib.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // Lets the admin page check that a saved login is still valid.
  if (req.method === "GET") return isAdmin(req) ? res.status(200).json({ ok: true }) : res.status(401).json({ error: "login" });

  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!adminConfigured()) return res.status(503).json({ error: "nopassword" });

  const { password } = readBody(req);
  if (checkPassword(password)) return res.status(200).json({ token: makeToken() });

  await new Promise((r) => setTimeout(r, 600)); // slows down password guessing
  return res.status(401).json({ error: "wrong" });
}
