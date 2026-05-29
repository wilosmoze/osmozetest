import { ProductCard } from "./ProductCard";
import type { MenuItem } from "@/data/menu";

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  items: MenuItem[];
  variant?: "hero" | "compact";
};

export function MenuSection({ id, eyebrow, title, items, variant = "hero" }: Props) {
  return (
    <section id={id} className="py-20 md:py-28">
      <div className="container-app">
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="chip">{eyebrow}</span>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[0.95] tracking-tighter md:text-6xl">
              {title}
            </h2>
          </div>
          <div className="hidden md:block">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              {items.length} créations
            </span>
          </div>
        </div>

        {variant === "hero" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} variant="hero" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {items.map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} variant="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
