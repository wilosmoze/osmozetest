"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, MapPin, ArrowSquareOut, Info } from "@phosphor-icons/react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";
import { StripePayment } from "./StripePayment";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  locationUrl: string;
  notes: string;
};

const empty: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  locationUrl: "",
  notes: "",
};

// Validation : doit ressembler à un lien Google Maps (court ou long)
const GMAPS_REGEX =
  /^https?:\/\/(?:[\w.-]+\.)?(?:google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i;

export function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [showHelp, setShowHelp] = useState(false);
  const {
    lines,
    subtotal,
    deliveryFee,
    total,
    deliveryZoneId,
    setDeliveryZone,
  } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-white/[0.06] bg-surface p-12 text-center">
        <h2 className="font-display text-2xl font-semibold">
          Your cart is empty
        </h2>
        <p className="mt-2 text-zinc-400">
          Add a few burgers before checking out.
        </p>
        <button onClick={() => router.push("/")} className="btn-ghost mt-6">
          Back to the menu
        </button>
      </div>
    );
  }

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.firstName) e.firstName = "First name required";
    if (!form.lastName) e.lastName = "Last name required";
    if (!/^[\d\s+()-]{8,}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.locationUrl.trim()) {
      e.locationUrl = "Google Maps link required";
    } else if (!GMAPS_REGEX.test(form.locationUrl.trim())) {
      e.locationUrl =
        "This doesn't look like a Google Maps URL. Check and paste again.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const locationOk =
    form.locationUrl.trim().length > 0 &&
    GMAPS_REGEX.test(form.locationUrl.trim());

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3"
      >
        <header className="mb-8">
          <span className="chip">Final step</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tighter md:text-5xl">
            Where are we delivering?
          </h1>
        </header>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          <Field label="First name" value={form.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
          <Field label="Last name" value={form.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
          <Field
            className="md:col-span-2"
            label="Phone"
            placeholder="+33 6 XX XX XX XX"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            inputMode="tel"
          />

          {/* ---------- BLOC LIEN GOOGLE MAPS ---------- */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500">
                <MapPin size={14} weight="duotone" />
                Google Maps link to your address
              </span>
              <button
                type="button"
                onClick={() => setShowHelp((v) => !v)}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-accent"
              >
                <Info size={13} weight="duotone" />
                {showHelp ? "Hide help" : "How does it work?"}
              </button>
            </div>

            {showHelp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400"
              >
                <p className="text-zinc-300 font-medium mb-2">
                  On mobile (the easiest way):
                </p>
                <ol className="space-y-1.5 list-decimal list-inside marker:text-accent">
                  <li>Open the Google Maps app</li>
                  <li>
                    Tap the <span className="text-zinc-300">"My location"</span>{" "}
                    icon (bottom right) or long-press your exact address
                  </li>
                  <li>
                    Tap <span className="text-zinc-300">Share</span>{" "}
                    → <span className="text-zinc-300">Copy link</span>
                  </li>
                  <li>Paste the link below</li>
                </ol>
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                >
                  Open Google Maps in a new tab
                  <ArrowSquareOut size={12} weight="bold" />
                </a>
              </motion.div>
            )}

            <div className="relative">
              <input
                value={form.locationUrl}
                onChange={(e) => update("locationUrl", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={`w-full rounded-2xl border bg-white/[0.02] px-4 py-3.5 pr-12 text-sm placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-accent/60 ${
                  errors.locationUrl
                    ? "border-red-500/60"
                    : locationOk
                      ? "border-emerald-500/40"
                      : "border-white/[0.08]"
                }`}
              />
              {locationOk && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400"
                >
                  <MapPin size={18} weight="fill" />
                </motion.div>
              )}
            </div>

            {errors.locationUrl && (
              <span className="text-xs text-red-400">{errors.locationUrl}</span>
            )}
            {locationOk && !errors.locationUrl && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                Valid Maps link — your courier will go to the exact spot.
              </span>
            )}

            {locationOk && (
              <a
                href={form.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-accent/40 hover:text-white"
              >
                Preview on Google Maps
                <ArrowSquareOut size={12} weight="bold" />
              </a>
            )}
          </div>
          {/* ---------- /GOOGLE MAPS LINK BLOCK ---------- */}

          <Field
            className="md:col-span-2"
            label="Delivery notes (door code, floor, instructions)"
            placeholder="Building B, 3rd floor left, code 4521A"
            value={form.notes}
            onChange={(v) => update("notes", v)}
            multiline
          />

          {/* ---------- ZONE TOGGLE ---------- */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Delivery zone
            </span>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1.5">
              {themeConfig.delivery.zones.map((zone) => {
                const active = deliveryZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setDeliveryZone(zone.id)}
                    className={`relative rounded-xl px-4 py-3 text-left transition-all ${
                      active
                        ? "bg-accent text-zinc-950"
                        : "text-zinc-400 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium">{zone.name}</span>
                      <span className="font-mono text-xs tabular-nums">
                        {zone.fee === 0 ? "Free" : `+${formatPrice(zone.fee)}`}
                      </span>
                    </div>
                    <div
                      className={`mt-0.5 text-[11px] ${
                        active ? "text-zinc-800" : "text-zinc-500"
                      }`}
                    >
                      {zone.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* ---------- /ZONE TOGGLE ---------- */}
        </form>

        <div className="mt-10 border-t border-white/[0.06] pt-8">
          <StripePayment
            customer={form}
            lines={lines.map((l) => ({
              itemId: l.item.id,
              name: l.item.name,
              price: l.item.price,
              quantity: l.quantity,
            }))}
            deliveryFee={deliveryFee()}
            amount={total()}
            onValidate={validate}
          />
        </div>
      </motion.section>

      <aside className="lg:col-span-2">
        <div className="sticky top-28 rounded-3xl border border-white/[0.06] bg-surface p-6">
          <div className="font-display text-lg font-semibold tracking-tight">
            Order summary
          </div>
          <ul className="mt-4 divide-y divide-white/[0.04]">
            {lines.map((l) => (
              <li key={l.item.id} className="flex gap-3 py-3">
                <img src={l.item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm">{l.item.name}</div>
                  <div className="font-mono text-xs text-zinc-500">× {l.quantity}</div>
                </div>
                <div className="font-mono text-sm tabular-nums">
                  {formatPrice(l.item.price * l.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="my-4 h-px bg-white/[0.06]" />
          <Row label="Subtotal" value={formatPrice(subtotal())} />
          <Row
            label="Delivery"
            value={deliveryFee() === 0 ? "Free" : formatPrice(deliveryFee())}
            highlight={deliveryFee() === 0}
          />
          <div className="my-3 h-px bg-white/[0.06]" />
          <div className="flex items-center justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span className="font-mono tabular-nums">{formatPrice(total())}</span>
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-zinc-400">
            <ShieldCheck size={18} weight="duotone" className="mt-0.5 text-emerald-400" />
            <div>
              <span className="text-white">Estimated delivery:</span>{" "}
              {themeConfig.delivery.estimatedMinutes.min}–
              {themeConfig.delivery.estimatedMinutes.max} min after confirmation.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
  multiline,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  inputMode?: "tel" | "numeric" | "text";
}) {
  const baseInput =
    "w-full rounded-2xl border bg-white/[0.02] px-4 py-3.5 text-sm placeholder:text-zinc-600 transition-colors focus:outline-none focus:border-accent/60";
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-wider text-zinc-500">{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInput} resize-none ${error ? "border-red-500/60" : "border-white/[0.08]"}`}
        />
      ) : (
        <input
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${baseInput} ${error ? "border-red-500/60" : "border-white/[0.08]"}`}
        />
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm text-zinc-400">
      <span>{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? "text-accent" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
