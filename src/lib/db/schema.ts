import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const authorEnum = pgEnum("author", ["mars", "nix", "pol", "fktr"]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    eventDate: timestamp("event_date", { mode: "date" }).notNull(),
    body: jsonb("body").notNull().$type<Record<string, unknown>>(),
    excerpt: text("excerpt"),
    coverImageUrl: text("cover_image_url"),
    author: authorEnum("author").notNull(),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("posts_event_date_idx").on(table.eventDate)]
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Author = (typeof authorEnum.enumValues)[number];
