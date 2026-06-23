import type { Author } from "@/lib/db/schema";

export const AUTHORS: Record<
  Author,
  { label: string; email: string }
> = {
  mars: { label: "Mars", email: "mrscassettes@gmail.com" },
  nix: { label: "Nix", email: "nicosaga@gmail.com" },
  pol: { label: "pol", email: "polbac@gmail.com" },
  fktr: { label: "Fktr", email: "suasnabarfacundo@gmail.com" },
};

export const AUTHOR_OPTIONS = Object.entries(AUTHORS).map(([value, { label }]) => ({
  value: value as Author,
  label,
}));
