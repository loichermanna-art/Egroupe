import { cn } from "@/lib/utils";
import { Reveal, SplitWords } from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
  titleClassName?: string;
};

/** En-tête de section : eyebrow doré, titre display animé mot à mot, chapeau. */
export function SectionHeader({ eyebrow, title, lead, align = "left", className, titleClassName }: Props) {
  return (
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal y={16} duration={0.8}>
        <p className={cn("eyebrow flex items-center gap-4", align === "center" && "justify-center")}>
          <span className="inline-block h-px w-10 bg-or/70" aria-hidden />
          {eyebrow}
        </p>
      </Reveal>
      <h2 className={cn("display-2 mt-6 text-ivoire", titleClassName)}>
        <SplitWords text={title} stagger={0.035} />
      </h2>
      {lead && (
        <Reveal delay={0.25} y={20}>
          <p className={cn("lead mt-6 max-w-2xl", align === "center" && "mx-auto")}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
