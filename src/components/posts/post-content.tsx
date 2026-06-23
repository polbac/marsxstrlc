import type { JSONContent } from "@tiptap/core";
import Image from "next/image";

import { sanitizeEmbedHtml } from "@/lib/embeds/sanitize";
import { cn } from "@/lib/utils";

interface PostContentProps {
  content: Record<string, unknown>;
  className?: string;
}

function renderMarks(text: string, marks?: JSONContent["marks"]) {
  if (!marks?.length) return text;

  return marks.reduce<React.ReactNode>((node, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{node}</strong>;
      case "italic":
        return <em>{node}</em>;
      case "link":
        return (
          <a
            href={(mark.attrs?.href as string) ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline underline-offset-4"
          >
            {node}
          </a>
        );
      default:
        return node;
    }
  }, text);
}

function renderNode(node: JSONContent, key: string): React.ReactNode {
  if (node.type === "text") {
    return <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>;
  }

  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`)
  );

  switch (node.type) {
    case "doc":
      return <div key={key}>{children}</div>;
    case "paragraph":
      return (
        <p key={key} className="mb-4 leading-relaxed text-foreground/90">
          {children}
        </p>
      );
    case "heading": {
      const level = node.attrs?.level === 3 ? 3 : 2;
      const Tag = level === 3 ? "h3" : "h2";
      return (
        <Tag key={key} className="mb-3 mt-8 font-heading text-xl font-medium">
          {children}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="mb-4 list-disc space-y-1 pl-5">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="mb-4 list-decimal space-y-1 pl-5">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-4 border-l-2 border-primary/40 pl-4 italic text-muted-foreground"
        >
          {children}
        </blockquote>
      );
    case "image":
      return (
        <div key={key} className="relative my-6 aspect-[16/10] overflow-hidden rounded-lg border border-border">
          <Image
            src={(node.attrs?.src as string) ?? ""}
            alt={(node.attrs?.alt as string) ?? ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      );
    case "embedBlock": {
      const html = (node.attrs?.html as string) ?? "";
      const safe = sanitizeEmbedHtml(html);
      if (!safe) return null;
      return (
        <div
          key={key}
          className="embed-block my-6 overflow-hidden rounded-lg"
          dangerouslySetInnerHTML={{ __html: safe }}
        />
      );
    }
    case "videoBlock": {
      const src = (node.attrs?.src as string) ?? "";
      if (!src) return null;
      return (
        <video
          key={key}
          src={src}
          controls
          playsInline
          className="my-6 w-full rounded-lg border border-border"
        />
      );
    }
    default:
      return children ? <div key={key}>{children}</div> : null;
  }
}

export function PostContent({ content, className }: PostContentProps) {
  const doc = content as JSONContent;
  return (
    <div className={cn("post-content", className)}>
      {renderNode(doc, "root")}
    </div>
  );
}
