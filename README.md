# Soham Gaikwad — Full-stack Portfolio

React + Vite portfolio with an Express API, MongoDB content store, private admin workspace, JWT authentication and Cloudinary file uploads.

## Local setup
Requirements: Node.js 20+ and MongoDB.

1. Run `npm install`.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI`, a random `JWT_SECRET` (at least 32 characters), and a private `ADMIN_SETUP_KEY`.
3. Keep `CLIENT_ORIGIN=http://localhost:5173`.
4. Run `npm run dev`; open `http://localhost:5173`.

Vite proxies `/api` to Express on port 5000.

## Create the first administrator
Run once after starting the API. Use a password of at least 12 characters:

```bash
curl -X POST http://localhost:5000/api/auth/setup -H "Content-Type: application/json" -d '{"setupKey":"YOUR_ADMIN_SETUP_KEY","email":"you@example.com","password":"YOUR_LONG_PASSWORD"}'
```

The endpoint only works while no administrator exists. Keep the setup key secret and remove/rotate it after initial setup. Sign in at `/admin`.

## Content & uploads
The admin JSON editor manages profile, skills, experience, projects and certificates. Profile is a JSON object; other sections are arrays. The public website loads content from MongoDB. File upload accepts JPG, PNG, WEBP and PDF up to 8 MB; configure all Cloudinary credentials to enable it.

## API
- `GET /api/health`
- `GET /api/public/portfolio`
- `POST /api/public/contact`
- `POST /api/auth/setup` (one time)
- `POST /api/auth/login`
- `GET/PUT /api/admin/content/:section`
- `GET /api/admin/messages`
- `PATCH /api/admin/messages/:id/read`
- `POST /api/admin/upload`

## Deployment
**Render backend:** deploy this repository as a web service with `npm install` and `npm start`. Configure MongoDB Atlas, JWT secret, setup key, Cloudinary credentials and `CLIENT_ORIGIN` as the exact Netlify site origin.

**Netlify frontend:** build command `npm run build`, publish directory `dist`. Set `VITE_API_URL` to the deployed Render API URL and redeploy. The API CORS allowlist must include your Netlify domain (comma-separated for custom domains).

Never commit real environment secrets. Admin passwords are bcrypt-hashed, protected routes require JWT, and auth/contact endpoints are rate-limited.
