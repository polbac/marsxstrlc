import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-start justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">404</p>
      <h1 className="mt-3 font-heading text-3xl">Entrada no encontrada</h1>
      <Link href="/" className="mt-6 text-primary underline underline-offset-4">
        Volver a la bitácora
      </Link>
    </main>
  );
}
