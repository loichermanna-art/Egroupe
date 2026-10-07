import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[60vh] flex-col justify-center py-16">
      <p className="t-label">Erreur 404 · Error 404</p>
      <h1 className="t-h2 mt-3 text-ink">Page introuvable · Page not found</h1>
      <p className="t-lead mt-4 max-w-xl">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. / The page you are looking for does not exist or has
        been moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/fr"
          className="inline-flex h-11 items-center bg-red px-5 text-[0.9375rem] font-medium text-white hover:bg-red-dark"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/en"
          className="inline-flex h-11 items-center border border-ink/25 px-5 text-[0.9375rem] font-medium text-ink hover:border-ink"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
