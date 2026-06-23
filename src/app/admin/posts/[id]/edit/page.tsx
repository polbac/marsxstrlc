import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { getPostById } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <AdminHeader />
      <h2 className="mb-6 font-heading text-xl">Editar entrada</h2>
      <PostForm post={post} />
    </main>
  );
}

export const metadata = {
  title: "Editar entrada — Bitácora Mars",
};
