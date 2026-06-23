# marsxstrlc — Bitácora Mars

Blog/bitácora del proceso creativo de la obra sonora de Mars. Registro cronológico de sesiones, eventos y avances.

## Equipo editorial

| Nombre | Email |
|--------|-------|
| Mars | mrscassettes@gmail.com |
| Nix | nicosaga@gmail.com |
| pol | polbac@gmail.com |
| Fktr | suasnabarfacundo@gmail.com |

El acceso al backoffice es con **clave maestra compartida** (no login individual por email).

## Stack

- Next.js 16 (App Router)
- Neon Postgres + Drizzle ORM
- Vercel Blob (imágenes y clips cortos)
- Tiptap (editor con embeds)
- Auth con `iron-session`

## Desarrollo local

1. Linkeá el proyecto: `npx vercel link`
2. Bajá variables de entorno (incluye `DATABASE_URL` de Neon):
   ```bash
   npx vercel env pull .env.local --environment=development
   ```
3. Agregá auth local al final de `.env.local` (si no están en Vercel):
   ```
   SESSION_SECRET="un-string-aleatorio-de-32-caracteres-minimo"
   ADMIN_PASSWORD="tu-clave-maestra"
   ```
4. Creá las tablas: `npm run db:init`
5. Iniciá el servidor: `npm run dev`

> Si `DATABASE_URL` está vacía, reconectá Neon en Vercel:  
> `npx vercel integration resource disconnect bond-club-app-postgres marsxstrlc --yes`  
> `npx vercel integration resource connect bond-club-app-postgres marsxstrlc --yes`  
> Luego volvé a ejecutar `vercel env pull`.

### Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string de Neon |
| `ADMIN_PASSWORD` | Clave maestra en texto (desarrollo) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt (recomendado en producción) |
| `SESSION_SECRET` | String aleatorio de 32+ caracteres |
| `BLOB_READ_WRITE_TOKEN` | Token de Vercel Blob |

## Deploy en Vercel

1. Conectá el repo `polbac/marsxstrlc` en Vercel.
2. Agregá integraciones desde Marketplace:
   - **Neon** → provee `DATABASE_URL`
   - **Blob** → provee `BLOB_READ_WRITE_TOKEN`
3. Configurá variables manuales:
   - `SESSION_SECRET`
   - `ADMIN_PASSWORD` o `ADMIN_PASSWORD_HASH`
4. En el primer deploy, ejecutá migraciones: `npm run db:push` (local con `DATABASE_URL` de producción) o desde CI.
5. Visitá `/admin/login` para cargar entradas.

## Rutas

- `/` — Home con timeline y entradas
- `/bitacora/[slug]` — Entrada individual
- `/admin` — Backoffice (protegido)
- `/admin/login` — Login con clave maestra

## Medios

- **Imágenes**: hasta 10 MB (JPEG, PNG, WebP, GIF)
- **Clips cortos**: hasta 50 MB (MP4, WebM)
- **Embeds**: SoundCloud, Bandcamp, YouTube, Vimeo, Spotify
