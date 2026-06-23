import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

export const metadata = {
  title: "Login — Bitácora Mars",
};
