/**
 * URL publique du site (canonical, Open Graph, sitemap, robots).
 * Priorité : NEXT_PUBLIC_SITE_URL (défini à la main) → domaine de production Vercel
 * (injecté automatiquement par Vercel) → domaine officiel par défaut.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "https://excellencegroup.ci";
}
