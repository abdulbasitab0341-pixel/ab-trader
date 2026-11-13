// Dairy ration maths. These are typical textbook estimates (NRC-style rules of thumb),
// good for planning. For exact rations use real lab values and a nutritionist.

// Farm forages that are not in the shop. dm = % dry matter as fed; cp, tdn, ndf on dry matter. price = Rs per kg as fed (edit it).
export const FORAGES = [
  { id: "f-berseem", forage: true, en: "Berseem (green)", ro: "Berseem (hara)", ur: "برسیم (ہرا)", dm: 15, cp: 20, tdn: 62, ndf: 40, price: 6 },
  { id: "f-silage", forage: true, en: "Maize silage", ro: "Makai ka silage", ur: "مکئی کا سائیلج", dm: 30, cp: 8, tdn: 68, ndf: 48, price: 9 },
  { id: "f-jawar", forage: true, en: "Green maize / jawar", ro: "Hari makai / jawar", ur: "ہری مکئی / جوار", dm: 22, cp: 9, tdn: 60, ndf: 55, price: 6 },
  { id: "f-toori", forage: true, en: "Wheat straw", ro: "Toori (bhoosa)", ur: "توڑی (بھوسہ)", dm: 90, cp: 3.5, tdn: 42, ndf: 78, price: 30 },
];

export const nel = (tdn) => (tdn > 0 ? Math.max(0, 0.0245 * tdn - 0.12) : 0); // Mcal per kg dry matter

export function requirement({ bw, milk, fat }) {
  bw = bw || 550; milk = milk || 0; fat = fat || 4;
  const dmi = Math.min(0.04 * bw, 0.025 * bw + 0.1 * milk);
  const nelReq = 0.08 * Math.pow(bw, 0.75) + milk * (0.3512 + 0.0962 * fat);
  const cpPct = milk <= 10 ? 13 : milk <= 20 ? 15 : milk <= 30 ? 16.5 : 17.5;
  return { dmi, nelReq, cpPct, cpKg: (cpPct / 100) * dmi, ndfMin: 0.28 * dmi, forageMin: 0.4 * dmi };
}

// rows: [{ kg (as fed), dm, cp, tdn, ndf, price (Rs/kg as fed), forage }]
export function analyze(rows, req) {
  let dmKg = 0, cpKg = 0, nelS = 0, ndfKg = 0, forKg = 0, cost = 0, asFed = 0;
  for (const r of rows) {
    const kg = Number(r.kg) || 0; if (!kg) continue;
    const dm = kg * (Number(r.dm) || 0) / 100;
    dmKg += dm; asFed += kg;
    cpKg += dm * (Number(r.cp) || 0) / 100;
    ndfKg += dm * (Number(r.ndf) || 0) / 100;
    nelS += dm * nel(Number(r.tdn) || 0);
    if (r.forage) forKg += dm;
    cost += kg * (Number(r.price) || 0);
  }
  return {
    asFed, dmKg, cpKg, nelS, ndfKg, forKg, cost,
    cpPct: dmKg ? (cpKg / dmKg) * 100 : 0,
    ndfPct: dmKg ? (ndfKg / dmKg) * 100 : 0,
    forPct: dmKg ? (forKg / dmKg) * 100 : 0,
    nelDen: dmKg ? nelS / dmKg : 0,
    dmiPct: req.dmi ? (dmKg / req.dmi) * 100 : 0,
    nelPct: req.nelReq ? (nelS / req.nelReq) * 100 : 0,
  };
}

/* ---------- least-cost optimiser: two-phase simplex ---------- */
// minimise c.x  subject to rows [{a:[..], op:"=" | ">=" | "<=", b}] and x >= 0. Returns x or null.
export function simplex(c, rows) {
  const n = c.length, m = rows.length, EPS = 1e-9;
  let nSlack = 0, nArt = 0;
  const R = rows.map((r) => { let a = r.a.slice(), b = r.b, op = r.op; if (b < 0) { a = a.map((v) => -v); b = -b; op = op === "<=" ? ">=" : op === ">=" ? "<=" : "="; } return { a, b, op }; });
  R.forEach((r) => { if (r.op !== "=") nSlack++; if (r.op !== "<=") nArt++; });
  const W = n + nSlack + nArt + 1;
  const T = R.map(() => new Array(W).fill(0));
  const basis = new Array(m);
  let si = n, ai = n + nSlack;
  const artCols = [];
  R.forEach((r, i) => {
    r.a.forEach((v, j) => (T[i][j] = v)); T[i][W - 1] = r.b;
    if (r.op === "<=") { T[i][si] = 1; basis[i] = si++; }
    else if (r.op === ">=") { T[i][si++] = -1; T[i][ai] = 1; basis[i] = ai; artCols.push(ai++); }
    else { T[i][ai] = 1; basis[i] = ai; artCols.push(ai++); }
  });
  const run = (obj, allowed) => {
    for (let it = 0; it < 5000; it++) {
      // reduced costs
      let enter = -1;
      for (let j = 0; j < W - 1; j++) {
        if (!allowed(j) || basis.includes(j)) continue;
        let z = 0; for (let i = 0; i < m; i++) z += obj[basis[i]] * T[i][j];
        if (obj[j] - z < -EPS) { enter = j; break; } // Bland's rule
      }
      if (enter < 0) return true;
      let leave = -1, best = Infinity;
      for (let i = 0; i < m; i++) if (T[i][enter] > EPS) { const q = T[i][W - 1] / T[i][enter]; if (q < best - EPS || (Math.abs(q - best) <= EPS && basis[i] < basis[leave])) { best = q; leave = i; } }
      if (leave < 0) return false; // unbounded
      const p = T[leave][enter];
      for (let j = 0; j < W; j++) T[leave][j] /= p;
      for (let i = 0; i < m; i++) if (i !== leave) { const f = T[i][enter]; if (Math.abs(f) > EPS) for (let j = 0; j < W; j++) T[i][j] -= f * T[leave][j]; }
      basis[leave] = enter;
    }
    return false;
  };
  const isArt = (j) => j >= n + nSlack;
  if (nArt) {
    const o1 = new Array(W - 1).fill(0); artCols.forEach((j) => (o1[j] = 1));
    run(o1, () => true);
    let infeas = 0; for (let i = 0; i < m; i++) if (isArt(basis[i])) infeas += T[i][W - 1];
    if (infeas > 1e-6) return null;
    // drive any remaining zero-level artificials out of the basis
    for (let i = 0; i < m; i++) if (isArt(basis[i])) { for (let j = 0; j < n + nSlack; j++) if (Math.abs(T[i][j]) > EPS) { const p = T[i][j]; for (let k = 0; k < W; k++) T[i][k] /= p; for (let r = 0; r < m; r++) if (r !== i) { const f = T[r][j]; for (let k = 0; k < W; k++) T[r][k] -= f * T[i][k]; } basis[i] = j; break; } }
  }
  const o2 = new Array(W - 1).fill(0); c.forEach((v, j) => (o2[j] = v));
  if (!run(o2, (j) => !isArt(j))) return null;
  const x = new Array(n).fill(0);
  for (let i = 0; i < m; i++) if (basis[i] < n) x[basis[i]] = T[i][W - 1];
  return x;
}

// cands: [{ id, dm, cp, tdn, ndf, price (Rs/kg as fed), forage, max (optional, kg DM) }]. Returns { id: kgAsFed } or null.
export function leastCost(cands, req, { maxShare = 0.3, forageMax = 0.6 } = {}) {
  const k = cands.filter((x) => x.dm > 0 && x.tdn > 0 && x.price > 0);
  if (!k.length) return null;
  const D = req.dmi;
  const rows = [
    { a: k.map(() => 1), op: "=", b: D },
    { a: k.map((x) => nel(x.tdn)), op: ">=", b: req.nelReq },
    { a: k.map((x) => x.cp / 100), op: ">=", b: req.cpKg },
    { a: k.map((x) => x.ndf / 100), op: ">=", b: req.ndfMin },
    { a: k.map((x) => (x.forage ? 1 : 0)), op: ">=", b: req.forageMin },
    { a: k.map((x) => (x.forage ? 1 : 0)), op: "<=", b: forageMax * D },
  ];
  k.forEach((x, i) => { const a = k.map(() => 0); a[i] = 1; rows.push({ a, op: "<=", b: (x.forage ? forageMax : maxShare) * D }); });
  const sol = simplex(k.map((x) => x.price / (x.dm / 100)), rows); // Rs per kg dry matter
  if (!sol) return null;
  const out = {};
  k.forEach((x, i) => { if (sol[i] > 1e-4) out[x.id] = Math.round((sol[i] / (x.dm / 100)) * 100) / 100; });
  return out;
}
