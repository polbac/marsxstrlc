import { format } from "date-fns";
import { es } from "date-fns/locale";

import type { Post } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

export interface TimelineMonth {
  key: string;
  label: string;
  year: number;
  month: number;
  postCount: number;
}

export function groupPostsByMonth(posts: Post[]) {
  const groups = new Map<string, { month: TimelineMonth; posts: Post[] }>();

  for (const post of posts) {
    const year = post.eventDate.getFullYear();
    const month = post.eventDate.getMonth();
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const label = format(post.eventDate, "MMM", { locale: es });

    if (!groups.has(key)) {
      groups.set(key, {
        month: { key, label, year, month, postCount: 0 },
        posts: [],
      });
    }

    const group = groups.get(key)!;
    group.posts.push(post);
    group.month.postCount += 1;
  }

  return Array.from(groups.values());
}

export function getMonthSectionId(key: string) {
  return `month-${key}`;
}

interface TimelineRulerProps {
  months: TimelineMonth[];
  activeMonth?: string;
  onMonthClick?: (key: string) => void;
  orientation?: "vertical" | "horizontal";
}

export function TimelineRuler({
  months,
  activeMonth,
  onMonthClick,
  orientation = "vertical",
}: TimelineRulerProps) {
  if (orientation === "horizontal") {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {months.map((month) => (
          <button
            key={month.key}
            type="button"
            onClick={() => onMonthClick?.(month.key)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition-colors",
              activeMonth === month.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground/30"
            )}
          >
            {month.label} {month.year}
          </button>
        ))}
      </div>
    );
  }

  return (
    <nav aria-label="Línea de tiempo" className="relative pl-2">
      <div className="absolute bottom-0 left-[18px] top-0 w-px bg-border" />
      <ol className="space-y-8">
        {months.map((month) => (
          <li key={month.key} className="relative">
            <button
              type="button"
              onClick={() => onMonthClick?.(month.key)}
              className="group flex w-full items-start gap-3 text-left"
            >
              <span
                className={cn(
                  "relative z-10 mt-1 size-2.5 rounded-full border transition-colors",
                  activeMonth === month.key
                    ? "border-primary bg-primary shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                    : "border-muted-foreground bg-background group-hover:border-foreground"
                )}
              />
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-xs uppercase tracking-[0.25em]",
                    activeMonth === month.key ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {month.label}
                </span>
                <span className="block text-[10px] text-muted-foreground/80">
                  {month.year}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
