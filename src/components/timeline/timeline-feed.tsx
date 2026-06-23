"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { PostEntry } from "@/components/posts/post-card";
import {
  TimelineRuler,
  getMonthSectionId,
  groupPostsByMonth,
} from "@/components/timeline/timeline-ruler";
import type { Post } from "@/lib/db/schema";

interface TimelineFeedProps {
  posts: Post[];
}

export function TimelineFeed({ posts }: TimelineFeedProps) {
  const groups = useMemo(() => groupPostsByMonth(posts), [posts]);
  const months = groups.map((group) => group.month);
  const [activeMonth, setActiveMonth] = useState(months[0]?.key);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const elements = months
      .map((month) => sectionRefs.current[month.key])
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          const key = visible.target.id.replace("month-", "");
          setActiveMonth(key);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [months]);

  const scrollToMonth = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveMonth(key);
  };

  if (!posts.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        Aún no hay entradas publicadas en la bitácora.
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[110px_minmax(0,1fr)] lg:gap-16">
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--site-header-height)+1.5rem)]">
          <TimelineRuler
            months={months}
            activeMonth={activeMonth}
            onMonthClick={scrollToMonth}
          />
        </div>
      </div>

      <div className="min-w-0 space-y-10 lg:col-start-2">
        <div className="lg:hidden">
          <div className="sticky top-[var(--site-header-height)] z-20 -mx-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
            <TimelineRuler
              months={months}
              activeMonth={activeMonth}
              onMonthClick={scrollToMonth}
              orientation="horizontal"
            />
          </div>
        </div>

        <div className="space-y-16">
        {groups.map(({ month, posts: monthPosts }) => (
          <section
            key={month.key}
            id={getMonthSectionId(month.key)}
            ref={(element) => {
              sectionRefs.current[month.key] = element;
            }}
            className="scroll-mt-[calc(var(--site-header-height)+1.5rem)] space-y-14"
          >
            <div className="flex items-center gap-3 lg:hidden">
              <h2 className="font-heading text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {month.label} {month.year}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            {monthPosts.map((post) => (
              <PostEntry key={post.id} post={post} />
            ))}
          </section>
        ))}
        </div>
      </div>
    </div>
  );
}
