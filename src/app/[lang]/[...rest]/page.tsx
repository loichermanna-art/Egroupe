import { notFound } from "next/navigation";

/** Toute route non reconnue sous /[lang] déclenche la page 404 localisée. */
export default function CatchAllPage() {
  notFound();
}
