import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config({ path: ".env" });

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.log("DATABASE_URL no configurada — omitiendo init de base de datos.");
  process.exit(0);
}

const sql = neon(databaseUrl);

await sql`
  DO $$ BEGIN
    CREATE TYPE author AS ENUM ('mars', 'nix', 'pol', 'fktr');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
`;

await sql`
  CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    event_date timestamp NOT NULL,
    body jsonb NOT NULL,
    excerpt text,
    cover_image_url text,
    author author NOT NULL,
    published boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
  );
`;

await sql`
  CREATE INDEX IF NOT EXISTS posts_event_date_idx ON posts (event_date);
`;

console.log("Database ready.");
