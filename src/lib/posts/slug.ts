import slugify from "slugify";

export function createSlug(title: string, date: Date) {
  const datePart = date.toISOString().slice(0, 10);
  const base = slugify(title, { lower: true, strict: true, locale: "es" });
  return `${datePart}-${base || "entrada"}`;
}

export async function createUniqueSlug(
  title: string,
  date: Date,
  exists: (slug: string) => Promise<boolean>
) {
  let slug = createSlug(title, date);
  let counter = 1;

  while (await exists(slug)) {
    counter += 1;
    slug = `${createSlug(title, date)}-${counter}`;
  }

  return slug;
}
