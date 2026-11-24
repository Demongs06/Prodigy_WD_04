# Soham Gaikwad — Full-stack Portfolio

React + Vite portfolio with an Express API, MongoDB content store, private admin workspace, HttpOnly cookie authentication and optional Cloudinary uploads.

## Local setup
Requirements: Node.js 20+ and MongoDB.

1. Run `npm install`.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI`, a random `JWT_SECRET` (at least 32 characters), and a private `ADMIN_SETUP_KEY`.
3. Keep `CLIENT_ORIGIN=http://localhost:5173` and `NODE_ENV=development`.
4. Run `npm run dev`; open `http://localhost:5173`.

## Create the first administrator
Run once after starting the API. Use a password of at least 12 characters:

```bash
curl -X POST http://localhost:5000/api/auth/setup -H "Content-Type: application/json" -d '{"setupKey":"YOUR_ADMIN_SETUP_KEY","email":"you@example.com","password":"YOUR_LONG_PASSWORD"}'
```

The endpoint only works while no administrator exists. Keep the setup key private. Sign in at `/admin`.

## Admin and uploads
The admin workspace manages profile, skills, experience, projects, certificates and contact messages. Sign-in uses the configured administrator email and password (passwords are bcrypt-hashed). The API issues an 8-hour JWT in an HttpOnly, Secure-in-production cookie; it is never stored in localStorage. Every protected request verifies the token, administrator role and current administrator account. The frontend checks the session before opening the workspace. Contact messages can be marked read or deleted.

Uploads accept JPG, PNG, WEBP and PDF up to 8 MB. The API checks file signatures before sending files to Cloudinary. Cloudinary credentials are optional until uploads are needed.

## API
- `GET /api/health`
- `GET /api/public/portfolio`
- `POST /api/public/contact`
- `POST /api/auth/setup` (one time)
- `POST /api/auth/login` and `POST /api/auth/logout`\n- `GET /api/auth/session` (checks the current administrator session)
- `GET/PUT /api/admin/content/:section`
- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id/read`
- `DELETE /api/admin/messages/:id`
- `POST /api/admin/upload`

Admin routes require the session cookie and an allowed request Origin. Production cookies require HTTPS and are configured for cross-origin frontend/API requests.

## Render deployment
The committed `render.yaml` creates a separate Singapore-region web service and generates `JWT_SECRET` and `ADMIN_SETUP_KEY`. During the first Blueprint sync, provide:
- `MONGODB_URI`: the MongoDB Atlas connection string for the portfolio database.
- `CLIENT_ORIGIN`: the exact public frontend origin, without a trailing slash (for example, `https://your-site.netlify.app`).

After the first deploy, copy the generated `ADMIN_SETUP_KEY` from Render's service environment and use it once to create the admin account. Do not paste database credentials or setup secrets into source code or GitHub.

## Netlify frontend
Build command: `npm run build`; publish directory: `dist`. Set `VITE_API_URL` to the deployed Render API URL, then redeploy the frontend. Add the exact Netlify/custom-domain origin to Render's `CLIENT_ORIGIN`.

For reliable cookie authentication across browsers, use a custom domain arrangement that keeps the frontend and API on the same site if third-party cookies are blocked by the browser.
