# Nara Studio Portfolio

Full-stack portfolio website built with Astro, TypeScript, Drizzle ORM, and PostgreSQL.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

The frontend works without a database using local fallback project data. To enable persistence:

```bash
docker compose up -d
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The contact form posts to `POST /api/contact`. Project data is available at `GET /api/projects`. Profile and public GitHub data are available at `GET /api/profile`.

## Backend login

Open `/login` or click `Backend login` in the public navigation. Configure `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long random `AUTH_SECRET` in `.env`. After signing in, the profile settings dashboard is available at `/admin`. Changes made there are saved to PostgreSQL and shown on the public page.

For the default local setup, use username `elzio` / password `1ndonesi4`, then replace these values before deployment.

For a production server build use `npm run build` then `npm start`.

## Project structure

- `src/pages/index.astro` - responsive portfolio experience
- `src/pages/api` - server endpoints
- `src/db` - Drizzle schema and database client
- `db/seed.ts` - starter project records
- `docker-compose.yml` - local PostgreSQL service
