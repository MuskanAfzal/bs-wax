# B’s Wax Auto Spa — GitHub + Vercel edition

A standard full-stack Next.js 16 application: website, booking API, protected admin studio, persistent PostgreSQL records and photo uploads. Designed for a GitHub repository imported into Vercel.

## Quick deployment

1. Extract this ZIP. Upload **the contents of this folder** to a new GitHub repository. `package.json` must be at the repository root.
2. Create a Supabase project. Keep its database password for step 4.
3. In Supabase **SQL Editor**, run `database/schema.sql`, then run `database/storage.sql`. This creates the application tables and the private `hive-portfolio` image bucket. No seed step is needed; editable default website content is supplied automatically.
4. In Supabase **Connect**, copy the **Transaction pooler** PostgreSQL URI (port 6543). Replace its password placeholder with your database password. URL-encode special characters in the password. Use this URI as `DATABASE_URL`.
5. In Vercel, select **Add New → Project**, import the GitHub repository, and select **Next.js**. Leave the root directory as the repository root and leave the output directory at its framework default. Build: `npm run build`. Install: `npm ci`. Node.js: **22.x**.
6. Before deploying, add the environment variables below. Add them to Production and to Preview if you want preview deployments to use the backend. Prefer a separate Supabase project for preview/test deployments if you need isolated data.
7. Deploy. Open `/admin/`, enter your configured `ADMIN_PASSWORD`, and send a test booking from the website. Confirm that the request appears in admin. Add a real photo pair, save, and check the published comparison.

Every subsequent push to the connected production branch deploys through Vercel automatically.

## Environment variables

| Name | Value | Required |
| --- | --- | --- |
| `DATABASE_URL` | Supabase transaction pooler PostgreSQL connection URI, including the encoded database password | Yes |
| `SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side service-role key, from project API settings | Yes |
| `ADMIN_PASSWORD` | A strong unique admin password of your choice | Yes |
| `SUPABASE_STORAGE_BUCKET` | `hive-portfolio` | Optional; this is the default |

These are **server-only** variables. Do not prefix them with `NEXT_PUBLIC_`. Do not upload `.env.local`, database passwords or service-role keys to GitHub. `.env.example` contains placeholders only. A new Vercel project does not inherit the password from the earlier private preview; set your own value.

If you add or change Vercel variables after deploying, redeploy to apply them. The frontend can build and display the default design without environment variables; booking, admin sign-in and uploads require all four required variables and the SQL setup.

## GitHub upload from PowerShell

Create an **empty** GitHub repository first, without a README or licence. Then run these commands inside the extracted project folder, replacing `YOUR_USERNAME` and `YOUR_REPOSITORY`:

```powershell
git init
git add .
git commit -m "Add Bs Wax Auto Spa website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

If you upload through GitHub’s web interface instead, include `.gitignore`, `.env.example` and `.github/workflows/ci.yml`. Never upload `node_modules`, `.next` or an actual environment file. The ZIP already excludes generated build folders and credentials.

## Run on your computer

Requires Node.js 22.x.

```bash
npm ci
```

Copy `.env.example` to `.env.local`, replace the placeholders, and run the two SQL files in your Supabase project. Then:

```bash
npm run dev
```

Open the URL printed by Next.js, normally `http://localhost:3000`. For a production build locally:

```bash
npm run build
npm start
```

Local and Vercel deployments share data when they use the same Supabase project. There is no local-filesystem database in the application.

## What changed

- Removed the static-export / embedded-Worker deployment approach.
- Added genuine Next.js Node route handlers at `/api/[...path]` and `/media/[...path]`.
- Converted persistence to PostgreSQL, with pooled serverless connections and disabled prepared statements for Supabase’s transaction pooler.
- Moved image storage to a private Supabase bucket. Only published transformation images or authenticated admin image previews are served by the website.
- Kept the existing server-side admin authorization, session cookies, rate limiting, booking validation, content editing and uploads.
- Reduced photo uploads to **3 MB per file**, leaving room below common serverless request limits. JPG, PNG and WebP only. Resize or compress larger photos before uploading.
- Replaced the filter-based comparison with a clean reference and a matching AI-edited before image containing actual visible litter, crumbs, mud and grime. This is labelled illustrative, not presented as completed customer work.
- Replaced the hotspot section with **Build My Reset**: vehicle + condition + priorities create a suggested detail, focus sequence and preparation checklist. The plan can be downloaded and carried into the booking form with the vehicle, concerns, suggested service and notes already filled.

## Admin studio

Visit `/admin/` and use `ADMIN_PASSWORD`.

- **Overview:** request and service counts.
- **Website content:** edit homepage headings, descriptions, button text, comparison caption and the three main photos. Select **Save changes** to publish.
- **Image gallery:** choose original photos or any previous upload for homepage photos and transformations. Replacing a photo never deletes it from private storage; unpublished photos are visible only to signed-in admins.
- **Booking requests:** search, filter, view details, contact by email/phone, change status, export CSV and delete with confirmation.
- **Services:** edit names, descriptions, starting prices, features, visibility and duration notes.
- **Transformations:** add real before/after pairs; upload photos up to 3 MB; edit captions and publish.
- **FAQs:** add, edit and remove questions.
- **Site settings:** introduction, business/contact details, service area, Instagram profile, footer notice, request availability, time preferences and unavailable dates.

Content edits need **Save changes**. Status changes save immediately. Sessions expire after eight hours. To revoke all existing sessions after a password rotation, run `DELETE FROM hive.sessions;` in Supabase SQL Editor.

## Booking and recommendation behaviour

A submission is a request, not an appointment reservation. The team confirms scope, price and time manually. There is no payment processing or email/SMS notification integration. Preferred times are Central Time (America/Chicago).

The Reset Builder suggests a starting point from active services. It is not an inspection or a guaranteed quote. Final condition, stain removability, service scope and price are assessed by the business. No invented ratings or completed-job statistics are included.

## Checks

```bash
npm test
npm run typecheck
npm run build
```

API integration tests run against an in-memory **PostgreSQL engine (PGlite)**, not a mocked database or a local SQLite substitute. They cover authentication, session revocation, booking CRUD, PostgreSQL upserts and transactions, content persistence, availability, uploads, image access and throttling. Additional tests cover plan recommendations and hidden services.

Builds and these tests do not need Supabase credentials. A real Supabase/Vercel smoke test is still required after you configure your project’s environment variables; credentials are not bundled with the code.

## Troubleshooting

Run `npm run check:backend` after configuring `.env.local` (or in an environment with your deployment variables). It checks variable formats, database connectivity and tables, and the private storage bucket without printing credentials or writing data. A successful build alone does not check the backend connection.

For Vercel, open **Project Settings → Environment Variables** and verify the four required variables are set for the environment serving the affected URL (Production or Preview), then **redeploy**. If the server logs report `BACKEND_NOT_CONFIGURED`, the updated log lists the missing or placeholder variable names. Run `database/schema.sql` and `database/storage.sql` in the same Supabase project used by those variables. Never put secret values in browser code or public logs.

- **Homepage works but admin says requests are not ready:** add all four required variables, run the SQL files, and redeploy.
- **Database errors:** use the pooler URI on port 6543; check the password, project reference and region; ensure `database/schema.sql` ran successfully.
- **Upload fails:** check the service-role key, `hive-portfolio` bucket, MIME type and 3 MB limit.
- **Old content appears after editing:** save in admin, then refresh the public page.
- **No admin notification email:** notifications are not connected; requests are stored in the admin panel.
- **Backend already contains data elsewhere:** this is a new database connection. Existing records and uploaded files from the earlier preview are not automatically migrated.

## References

- Next.js deployment: https://nextjs.org/docs/app/getting-started/deploying
- Vercel Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs
- Supabase PostgreSQL connections: https://supabase.com/docs/guides/database/connecting-to-postgres
- Supabase private storage: https://supabase.com/docs/guides/storage/buckets/fundamentals
- Clean reference photo: https://unsplash.com/photos/T9CSi3hKV7Q
- Business reference: https://www.instagram.com/bwax.autospa/

See `ASSETS.md` for the comparison-image editing note.
