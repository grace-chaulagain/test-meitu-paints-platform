# Meitu Paints Production Deployment Notes

For Hostinger Business Web Hosting, use the repository-specific guide in
`HOSTINGER_DEPLOYMENT.md`. The recommended Hostinger shape is one managed
Node.js app from the repository root.

## Recommended Shape

The simplest production shape for this repository is:

1. Build the Vite app in `Frontend/meitupaints`.
2. Run the Express app in `Server`.
3. Set `SERVE_CLIENT=true` so Express serves the built frontend and handles React Router deep-link fallbacks.

This gives one public origin for the website and API, which simplifies cookies, CORS, email links, and dashboard deep routes.

## Build

```bash
cd Frontend/meitupaints
npm ci
npm run build

cd ../../Server
npm ci
NODE_ENV=production npm start
```

If your platform builds from `Server`, run:

```bash
npm run build:client
npm ci --omit=dev
npm run start:prod
```

## Required Production Environment

Use `Server/.env.example` and `Frontend/meitupaints/.env.example` as templates.

Minimum backend variables:

- `NODE_ENV=production`
- `PORT`
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `APP_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`

For same-origin hosting:

- `SERVE_CLIENT=true`
- `VITE_API_BASE_URL=` during frontend build
- `COOKIE_SAME_SITE=lax`
- `COOKIE_SECURE=true`

For split frontend/backend hosting:

- `SERVE_CLIENT=false`
- `APP_URL=https://frontend.example.com`
- `API_URL=https://api.example.com`
- `CORS_ORIGIN=https://frontend.example.com`
- `VITE_API_BASE_URL=https://api.example.com`
- use `COOKIE_SAME_SITE=none` and `COOKIE_SECURE=true` if refresh cookies must cross origins

## Routing

When `SERVE_CLIENT=true`, Express serves `Frontend/meitupaints/dist` and falls back to `index.html` for non-API GET requests. This supports direct refreshes for routes such as:

- `/admin/dashboard/orders`
- `/dispatcher/dashboard/orders`
- `/dealer/orders`
- `/notifications`
- `/set-password`
- `/reset-password`

## Security Notes

- Do not commit real `.env` files. Rotate any credentials that have been committed or shared.
- Keep JWT access and refresh secrets different.
- Keep `TRUST_PROXY=true` behind production proxies/load balancers so secure cookies work correctly.
- Set `APP_URL` to the real public website URL before sending emails.
- Run `/api/health` after deploy to confirm the API process is live.
