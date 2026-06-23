import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <AdminHeader />
      <h2 className="mb-6 font-heading text-xl">Nueva entrada</h2>
      <PostForm />
    </main>
  );
}

export const metadata = {
  title: "Nueva entrada — Bitácora Mars",
};
