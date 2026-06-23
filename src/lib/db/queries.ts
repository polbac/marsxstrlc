import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "./index";
import { type Author, type NewPost, posts } from "./schema";

export async function getPublishedPosts() {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(asc(posts.eventDate));
}

export async function getAllPosts() {
  return db.select().from(posts).orderBy(desc(posts.eventDate));
}

export async function getPostBySlug(slug: string) {
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return post ?? null;
}

export async function getPublishedPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  return post ?? null;
}

export async function getPostById(id: string) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post ?? null;
}

export async function createPost(data: NewPost) {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function updatePost(id: string, data: Partial<NewPost>) {
  const [post] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return post ?? null;
}

export async function deletePost(id: string) {
  const [post] = await db.delete(posts).where(eq(posts.id, id)).returning();
  return post ?? null;
}

export async function slugExists(slug: string, excludeId?: string) {
  const existing = await getPostBySlug(slug);
  if (!existing) return false;
  if (excludeId && existing.id === excludeId) return false;
  return true;
}

export type { Author };
