# AB Traders

Dairy feed website for AB Traders (abtraders.pk). English, اردو and Roman Urdu.

- `/` home page with the product list (indexable, built for search)
- `/bill` Bill Maker, made for phones. Share the bill as a picture on WhatsApp, print it, or copy the text
- `/admin` password-protected: change Naqad and Udhaar rates, add items and pictures, set shop phone and address

No build step. Static pages in `public/`, small serverless functions in `api/`, data in Upstash Redis.

## Deploy on Vercel

1. Push this repo to GitHub, then **Add New > Project** in Vercel and import it. Leave all build settings empty.
2. In the project, open **Storage > Marketplace**, add **Upstash Redis**, and connect it to the project. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
3. In **Settings > Environment Variables** add `ADMIN_PASSWORD` (your admin password). Optionally add `ADMIN_SECRET` (any long random text).
4. **Redeploy** so the variables take effect.
5. Open `/admin`, log in, fill in the shop phone, address and today's rates.
6. **Settings > Domains**: add `abtraders.pk`. If the domain is at GoDaddy, set the DNS records Vercel shows (an A record for `@` and a CNAME for `www`).

Until Redis is connected the site still works with the built-in starter items. Admin changes need Redis.

## Run on your computer

```
npm run dev
```

Open http://localhost:3000. Admin password is `admin123`. Data is kept in memory and resets when you stop it.

## Notes

- The bill page keeps the current bill and the last 30 bills on the same phone only. Nothing about customers is stored on the server.
- Item pictures are resized in the browser to 480 px and stored with the item.
- `/bill` and `/admin` are marked `noindex` so search engines focus on the home page.
