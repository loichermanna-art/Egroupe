import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Variante sur fond bordeaux. */
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2";
};

/** En-tête de section : double filet or, intitulé, titre, chapeau. */
export function SectionHeader({ eyebrow, title, lead, dark = false, className, as: Tag = "h2" }: Props) {
  return (
    <header className={cn("max-w-2xl", className)}>
      <span className={dark ? "rule-gold-light" : "rule-gold"} aria-hidden />
      <p className={cn("t-eyebrow mt-4", dark && "text-gold-light")}>{eyebrow}</p>
      <Tag className={cn("t-h2 mt-3", dark ? "text-white" : "text-ink")}>{title}</Tag>
      {lead && <p className={cn("t-lead mt-5", dark && "text-white/80")}>{lead}</p>}
    </header>
  );
}
