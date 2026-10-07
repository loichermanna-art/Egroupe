import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-6">404</p>
      <h1 className="display-2 text-ivoire">Page introuvable · Page not found</h1>
      <p className="lead mt-6 max-w-xl">
        La page que vous cherchez n&apos;existe pas ou a été déplacée. / The page you are looking for does not exist.
      </p>
      <Link
        href="/fr"
        className="mt-10 inline-flex items-center gap-3 rounded-full border border-or/40 px-7 py-3 text-sm font-medium uppercase tracking-[0.2em] text-or transition hover:bg-or hover:text-noir"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
