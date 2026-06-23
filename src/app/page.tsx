import Link from "next/link";

import { TimelineFeed } from "@/components/timeline/timeline-feed";
import { getPublishedPosts } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPublishedPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
      <header className="mb-12 border-b border-border pb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
          Proceso en curso
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl leading-none md:text-5xl">Bitácora Mars</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Registro de sesiones, eventos y avances de la obra sonora. Una línea de tiempo del
              viaje creativo.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            Admin
          </Link>
        </div>
      </header>

      <TimelineFeed posts={posts} />
    </main>
  );
}

export const metadata = {
  title: "Bitácora Mars",
  description: "Bitácora del proceso creativo de la obra sonora de Mars.",
};
