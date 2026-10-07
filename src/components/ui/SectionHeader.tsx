import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  lead?: string;
  /**
   * `stack` : titre puis chapeau, largeur de lecture limitée.
   * `split` : titre à gauche, chapeau (et contenu additionnel) à droite — pour varier le rythme des sections.
   */
  layout?: "stack" | "split";
  /** Variante sur fond bordeaux. */
  dark?: boolean;
  className?: string;
  as?: "h1" | "h2";
  /** Contenu additionnel sous le chapeau (note, liens). */
  children?: ReactNode;
};

export function SectionHeader({ title, lead, layout = "stack", dark = false, className, as: Tag = "h2", children }: Props) {
  const titleColor = dark ? "text-white" : "text-ink";
  const leadColor = dark ? "text-white/80" : undefined;

  if (layout === "split") {
    return (
      <header className={cn("grid gap-4 lg:grid-cols-12 lg:gap-10", className)}>
        <Tag className={cn("t-h2 lg:col-span-5", titleColor)}>{title}</Tag>
        {(lead || children) && (
          <div className="lg:col-span-6 lg:col-start-7">
            {lead && <p className={cn("t-lead", leadColor)}>{lead}</p>}
            {children}
          </div>
        )}
      </header>
    );
  }

  return (
    <header className={cn("max-w-2xl", className)}>
      <Tag className={cn("t-h2", titleColor)}>{title}</Tag>
      {lead && <p className={cn("t-lead mt-4", leadColor)}>{lead}</p>}
      {children}
    </header>
  );
}
