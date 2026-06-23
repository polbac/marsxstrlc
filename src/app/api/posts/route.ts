import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth/session";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  slugExists,
  updatePost,
} from "@/lib/db/queries";
import type { Author } from "@/lib/db/schema";
import { createUniqueSlug } from "@/lib/posts/slug";

function parsePostBody(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const eventDateRaw = typeof body.eventDate === "string" ? body.eventDate : "";
  const author = body.author as Author;
  const content = body.body as Record<string, unknown> | undefined;
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : null;
  const coverImageUrl =
    typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : null;
  const published = Boolean(body.published);

  if (!title || !eventDateRaw || !author || !content) {
    return { error: "Faltan campos obligatorios" } as const;
  }

  const eventDate = new Date(eventDateRaw);
  if (Number.isNaN(eventDate.getTime())) {
    return { error: "Fecha inválida" } as const;
  }

  return {
    data: {
      title,
      eventDate,
      author,
      body: content,
      excerpt,
      coverImageUrl,
      published,
    },
  } as const;
}

export async function GET() {
  try {
    await requireAdminSession();
    const posts = await getAllPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const json = (await request.json()) as Record<string, unknown>;
    const parsed = parsePostBody(json);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const slug = await createUniqueSlug(
      parsed.data.title,
      parsed.data.eventDate,
      slugExists
    );

    const post = await createPost({
      ...parsed.data,
      slug,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo crear la entrada" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const json = (await request.json()) as Record<string, unknown> & { id?: string };
    const id = json.id;

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const existing = await getPostById(id);
    if (!existing) {
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    }

    const parsed = parsePostBody(json);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    let slug = existing.slug;
    if (
      parsed.data.title !== existing.title ||
      parsed.data.eventDate.getTime() !== existing.eventDate.getTime()
    ) {
      slug = await createUniqueSlug(
        parsed.data.title,
        parsed.data.eventDate,
        (candidate) => slugExists(candidate, id)
      );
    }

    const post = await updatePost(id, {
      ...parsed.data,
      slug,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });
    }

    const post = await deletePost(id);
    if (!post) {
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
}
