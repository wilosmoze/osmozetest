import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { themeConfig } from "@/config/theme.config";

export function SocialBlock({
  variant = "default",
}: {
  variant?: "default" | "post-purchase";
}) {
  const { instagram } = themeConfig.social;

  return (
    <section className="py-16 md:py-24">
      <div className="container-app">
        <a
          href={instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-surface via-surface to-zinc-950 p-8 md:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full opacity-40 transition-opacity group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(224,113,44,0.4), transparent 70%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <span className="chip">
                {variant === "post-purchase"
                  ? "En attendant votre livreur"
                  : "Communauté & SAV"}
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold leading-[0.95] tracking-tighter md:text-5xl">
                {instagram.ctaTitle}
              </h2>
              <p className="mt-5 max-w-[54ch] text-zinc-400">
                {instagram.ctaBody}
              </p>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/40 px-5 py-3 transition-colors group-hover:border-accent/40 group-hover:bg-accent/[0.08]">
                <InstagramLogo size={20} weight="duotone" />
                <span className="font-mono text-sm">{instagram.handle}</span>
                <span className="ml-2 text-zinc-500 transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  "ig-burger-1",
                  "ig-kitchen-2",
                  "ig-customer-3",
                  "ig-sauce-4",
                  "ig-team-5",
                  "ig-dessert-6",
                ].map((seed, i) => (
                  <div
                    key={seed}
                    className="aspect-square overflow-hidden rounded-xl"
                    style={{
                      transform: `translateY(${i % 2 === 0 ? "0" : "8px"})`,
                    }}
                  >
                    <img
                      src={`https://picsum.photos/seed/${seed}/300/300`}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}
