export function Marquee() {
  const items = [
    "Premium burgers",
    "Black Angus beef",
    "Closed-bun creations",
    "Sealed tight",
    "Home-made sauces",
    "Tue–Sun · Noon to 11 PM",
  ];
  return (
    <div className="border-y border-white/[0.05] bg-surface/40 py-4 overflow-hidden">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((s, i) => (
          <span
            key={i}
            className="font-display text-xl tracking-tight text-zinc-500"
          >
            {s}{" "}
            <span className="ml-12 inline-block h-1 w-1 rounded-full bg-accent align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}
