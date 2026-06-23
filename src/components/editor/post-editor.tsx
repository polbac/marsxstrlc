"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Music2,
  Quote,
  Video,
} from "lucide-react";
import { useCallback, useState } from "react";

import { EmbedBlock, VideoBlock } from "@/components/editor/extensions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { urlToEmbedHtml } from "@/lib/embeds/sanitize";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedInput, setEmbedInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-primary underline underline-offset-4" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg border border-border my-4 max-w-full" },
      }),
      Placeholder.configure({
        placeholder: "Escribí la bitácora de la sesión…",
      }),
      EmbedBlock,
      VideoBlock,
    ],
    content: value,
    onUpdate: ({ editor: current }) => {
      onChange(current.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = (await response.json()) as {
          url?: string;
          kind?: string;
          error?: string;
        };

        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Error al subir");
        }

        if (data.kind === "video") {
          editor?.chain().focus().setVideo({ src: data.url }).run();
        } else {
          editor?.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : "Error al subir");
      } finally {
        setUploading(false);
      }
    },
    [editor]
  );

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void uploadFile(file);
    };
    input.click();
  };

  const handleVideoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void uploadFile(file);
    };
    input.click();
  };

  const insertEmbed = () => {
    const html = urlToEmbedHtml(embedInput);
    if (!html) {
      alert("No se pudo generar el embed. Revisá la URL o pegá un iframe válido.");
      return;
    }
    editor?.chain().focus().setEmbed(html).run();
    setEmbedInput("");
    setEmbedOpen(false);
  };

  if (!editor) return null;

  const ToolButton = ({
    onClick,
    active,
    children,
    disabled,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <Button
      type="button"
      size="icon-sm"
      variant={active ? "secondary" : "ghost"}
      onClick={onClick}
      disabled={disabled}
      className={cn("shrink-0")}
    >
      {children}
    </Button>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-2">
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote className="size-4" />
        </ToolButton>
        <ToolButton onClick={handleImageUpload} disabled={uploading}>
          <ImageIcon className="size-4" />
        </ToolButton>
        <ToolButton onClick={handleVideoUpload} disabled={uploading}>
          <Video className="size-4" />
        </ToolButton>
        <ToolButton onClick={() => setEmbedOpen(true)}>
          <Music2 className="size-4" />
        </ToolButton>
        <ToolButton
          onClick={() => {
            const url = window.prompt("URL del enlace");
            if (!url) return;
            editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        >
          <Link2 className="size-4" />
        </ToolButton>
      </div>

      <EditorContent editor={editor} />

      <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insertar embed</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="embed-input">
              URL o código iframe (SoundCloud, Bandcamp, YouTube, Vimeo, Spotify)
            </Label>
            <Textarea
              id="embed-input"
              rows={4}
              value={embedInput}
              onChange={(event) => setEmbedInput(event.target.value)}
              placeholder="https://soundcloud.com/..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEmbedOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={insertEmbed}>
              Insertar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
