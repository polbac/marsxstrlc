import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL no está configurada. En Vercel: Settings → Environment Variables, o ejecutá `npx vercel env pull .env.local --environment=preview`. Si está vacía, reconectá Neon desde Storage/Integrations y copiá el connection string desde el dashboard de Neon."
    );
  }
  return url;
}

const sql = neon(getDatabaseUrl());

export const db = drizzle(sql, { schema });
