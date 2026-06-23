import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

import { PostContent } from "@/components/posts/post-content";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/db/schema";
import { AUTHORS } from "@/lib/posts/authors";
import { cn } from "@/lib/utils";

interface PostEntryProps {
  post: Post;
  id?: string;
  className?: string;
}

export function PostEntry({ post, id, className }: PostEntryProps) {
  const author = AUTHORS[post.author];

  return (
    <article
      id={id}
      className={cn(
        "scroll-mt-[calc(var(--site-header-height)+1.5rem)] border-b border-border/60 pb-14 last:border-b-0",
        className
      )}
    >
      <div
        className={cn(
          "grid gap-8",
          post.coverImageUrl
            ? "lg:grid-cols-[minmax(0,1fr)_minmax(220px,34%)] lg:items-start lg:gap-12"
            : "max-w-3xl"
        )}
      >
        <div className="min-w-0 space-y-5">
          <time
            dateTime={post.eventDate.toISOString()}
            className="block text-sm uppercase tracking-[0.2em] text-[#46FF2E]"
          >
            {format(post.eventDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </time>

          <h2 className="font-heading text-3xl leading-tight md:text-4xl">{post.title}</h2>

          <p className="text-sm text-[#46FF2E]">{author.label}</p>

          <PostContent content={post.body} />
        </div>

        {post.coverImageUrl ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black lg:sticky lg:top-[calc(var(--site-header-height)+1.5rem)]">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function PostMeta({ post }: { post: Post }) {
  const author = AUTHORS[post.author];
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <Badge variant="secondary">{author.label}</Badge>
      <time dateTime={post.eventDate.toISOString()}>
        {format(post.eventDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
      </time>
    </div>
  );
}
