export function Marquee() {
  const items = [
    "Flame-grilled",
    "French Black Angus",
    "House brioche bun",
    "Delivery under 30 min",
    "House-made sauces",
    "Open 6:30 PM → 11:00 PM",
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
