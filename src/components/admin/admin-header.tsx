"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Backoffice</p>
        <h1 className="font-heading text-2xl">Bitácora Mars</h1>
      </div>
      <div className="flex gap-2">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Ver sitio
        </Link>
        <Button variant="ghost" onClick={() => void logout()}>
          Salir
        </Button>
      </div>
    </header>
  );
}
