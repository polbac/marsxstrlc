"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PostEditor } from "@/components/editor/post-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Post } from "@/lib/db/schema";
import { AUTHOR_OPTIONS } from "@/lib/posts/authors";

const emptyDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

interface PostFormProps {
  post?: Post;
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [eventDate, setEventDate] = useState(
    post ? toDateInputValue(post.eventDate) : toDateInputValue(new Date())
  );
  const [author, setAuthor] = useState(post?.author ?? "mars");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [body, setBody] = useState<Record<string, unknown>>(
    (post?.body as Record<string, unknown>) ?? emptyDoc
  );
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCover = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !data.url) {
      throw new Error(data.error ?? "No se pudo subir la portada");
    }
    setCoverImageUrl(data.url);
  };

  const save = async (nextPublished: boolean) => {
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...(post ? { id: post.id } : {}),
        title,
        eventDate,
        author,
        excerpt: excerpt || null,
        coverImageUrl: coverImageUrl || null,
        body,
        published: nextPublished,
      };

      const response = await fetch("/api/posts", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo guardar");
      }

      router.push("/admin");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!post) return;
    if (!window.confirm("¿Eliminar esta entrada?")) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/posts?id=${post.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar");
      router.push("/admin");
      router.refresh();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save(published);
      }}
    >
      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventDate">Fecha del evento</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Autor</Label>
          <Select value={author} onValueChange={(value) => setAuthor(value as typeof author)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Elegir autor" />
            </SelectTrigger>
            <SelectContent>
              {AUTHOR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="excerpt">Resumen (opcional)</Label>
          <Textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="cover">Imagen de portada (opcional)</Label>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              id="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCover(file).catch((err) => setError(err.message));
              }}
            />
            {coverImageUrl ? (
              <span className="text-xs text-muted-foreground">Portada cargada</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Contenido</Label>
        <PostEditor value={body} onChange={setBody} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={saving} onClick={() => void save(false)}>
          Guardar borrador
        </Button>
        <Button type="button" disabled={saving} onClick={() => void save(true)}>
          Publicar
        </Button>
        {post ? (
          <Button type="button" variant="destructive" disabled={saving} onClick={() => void remove()}>
            Eliminar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
