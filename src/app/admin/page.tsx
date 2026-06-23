import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/db/queries";
import { AUTHORS } from "@/lib/posts/authors";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <AdminHeader />

      <div className="mb-6 flex justify-end">
        <Link href="/admin/posts/new" className={cn(buttonVariants())}>
          Nueva entrada
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Todavía no hay entradas. Creá la primera.
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Publicada" : "Borrador"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {AUTHORS[post.author].label}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {format(post.eventDate, "d MMM yyyy", { locale: es })}
                  </span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Editar
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}

export const metadata = {
  title: "Admin — Bitácora Mars",
};
